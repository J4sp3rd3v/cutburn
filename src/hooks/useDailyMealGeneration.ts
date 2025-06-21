
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface MealEntry {
  id: string;
  mealType: 'colazione' | 'pranzo' | 'spuntino' | 'cena';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
  eaten: boolean;
  foods: string[];
}

interface DailyMealData {
  date: string;
  season: 'primavera' | 'estate' | 'autunno' | 'inverno';
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export const useDailyMealGeneration = (userProfile: any, nutritionData: any) => {
  const { user } = useAuth();
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const getCurrentSeason = (): 'primavera' | 'estate' | 'autunno' | 'inverno' => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'primavera';
    if (month >= 6 && month <= 8) return 'estate';
    if (month >= 9 && month <= 11) return 'autunno';
    return 'inverno';
  };

  const generateDailyMeals = async (): Promise<MealEntry[]> => {
    if (!userProfile || !nutritionData) return [];

    const season = getCurrentSeason();
    const today = new Date();
    const isWorkoutDay = [1, 3, 5].includes(today.getDay()); // Lun, Mer, Ven

    // Generate meals based on user profile and season
    const meals: Omit<MealEntry, 'id' | 'eaten'>[] = [
      {
        mealType: 'colazione',
        calories: Math.round(nutritionData.targetCalories * 0.20),
        protein: Math.round(nutritionData.proteinTarget * 0.25),
        carbs: isWorkoutDay ? 15 : 8,
        fat: Math.round(nutritionData.fatTarget * 0.15),
        timestamp: new Date(today.setHours(7, 30, 0, 0)).toISOString(),
        foods: ['Smoothie proteico', 'Mandorle', 'Tè verde matcha']
      },
      {
        mealType: 'pranzo',
        calories: Math.round(nutritionData.targetCalories * 0.35),
        protein: Math.round(nutritionData.proteinTarget * 0.40),
        carbs: isWorkoutDay ? Math.round(nutritionData.carbTarget * 0.4) : 10,
        fat: Math.round(nutritionData.fatTarget * 0.20),
        timestamp: new Date(today.setHours(12, 30, 0, 0)).toISOString(),
        foods: ['Proteina magra', 'Verdure stagionali', isWorkoutDay ? 'Riso integrale' : 'Cavolfiore']
      },
      {
        mealType: 'spuntino',
        calories: Math.round(nutritionData.targetCalories * 0.15),
        protein: Math.round(nutritionData.proteinTarget * 0.20),
        carbs: 12,
        fat: Math.round(nutritionData.fatTarget * 0.12),
        timestamp: new Date(today.setHours(15, 45, 0, 0)).toISOString(),
        foods: ['Shot pre-workout', 'Noci brasiliane']
      },
      {
        mealType: 'cena',
        calories: Math.round(nutritionData.targetCalories * 0.30),
        protein: Math.round(nutritionData.proteinTarget * 0.35),
        carbs: Math.round(nutritionData.carbTarget * 0.25),
        fat: Math.round(nutritionData.fatTarget * 0.25),
        timestamp: new Date(today.setHours(19, 30, 0, 0)).toISOString(),
        foods: ['Pesce/Carne bianca', 'Verdure al vapore', 'Patata dolce', 'Avocado']
      }
    ];

    return meals.map(meal => ({
      ...meal,
      id: `${meal.mealType}_${today.toISOString().split('T')[0]}`,
      eaten: false
    }));
  };

  const saveMealsToDatabase = async (meals: MealEntry[]) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      // Delete existing meals for today
      await supabase
        .from('meal_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('date', today);

      // Insert new meals
      const mealData = meals.map(meal => ({
        id: meal.id,
        user_id: user.id,
        date: today,
        meal_type: meal.mealType,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        timestamp: meal.timestamp,
        eaten: meal.eaten,
        foods: meal.foods
      }));

      const { error } = await supabase
        .from('meal_entries')
        .insert(mealData);

      if (error) {
        console.error('Error saving meals:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveMealsToDatabase:', error);
      return false;
    }
  };

  const loadTodayMeals = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('meal_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('timestamp', { ascending: true });

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading meals:', error);
        setLoading(false);
        return;
      }

      let meals: MealEntry[] = [];

      if (data && data.length > 0) {
        // Load existing meals
        meals = data.map(meal => ({
          id: meal.id,
          mealType: meal.meal_type,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          timestamp: meal.timestamp,
          eaten: meal.eaten,
          foods: meal.foods || []
        }));
      } else {
        // Generate new meals for today
        meals = await generateDailyMeals();
        if (meals.length > 0) {
          const saved = await saveMealsToDatabase(meals);
          if (saved) {
            toast({
              title: "Pasti generati! 🍽️",
              description: "Il tuo piano alimentare giornaliero è pronto",
            });
          }
        }
      }

      setTodayMeals(meals);
    } catch (error) {
      console.error('Error loading today meals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile && nutritionData) {
      loadTodayMeals();
    }
  }, [user, userProfile, nutritionData]);

  const markMealAsEaten = async (mealId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('meal_entries')
        .update({ eaten: true })
        .eq('id', mealId);

      if (error) {
        console.error('Error updating meal:', error);
        toast({
          title: "Errore",
          description: "Impossibile aggiornare il pasto",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setTodayMeals(prev => 
        prev.map(meal => 
          meal.id === mealId ? { ...meal, eaten: true } : meal
        )
      );

      const meal = todayMeals.find(m => m.id === mealId);
      if (meal) {
        toast({
          title: "Pasto registrato! 🍽️",
          description: `+${meal.calories}kcal aggiunte al tuo tracking`,
        });
      }
    } catch (error) {
      console.error('Error marking meal as eaten:', error);
    }
  };

  return {
    todayMeals,
    loading,
    markMealAsEaten,
    refreshMeals: loadTodayMeals
  };
};

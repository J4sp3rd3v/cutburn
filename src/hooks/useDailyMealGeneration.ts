
import { useState, useEffect } from 'react';
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

  const generateDailyMeals = (): MealEntry[] => {
    if (!userProfile || !nutritionData) return [];

    const season = getCurrentSeason();
    const today = new Date();
    const isWorkoutDay = [1, 3, 5].includes(today.getDay()); // Lun, Mer, Ven
    const dateString = today.toISOString().split('T')[0];

    // Generate meals based on user profile and season
    const meals: MealEntry[] = [
      {
        id: `colazione_${dateString}`,
        mealType: 'colazione',
        calories: Math.round(nutritionData.targetCalories * 0.20),
        protein: Math.round(nutritionData.proteinTarget * 0.25),
        carbs: isWorkoutDay ? 15 : 8,
        fat: Math.round(nutritionData.fatTarget * 0.15),
        timestamp: new Date(today.setHours(7, 30, 0, 0)).toISOString(),
        eaten: false,
        foods: ['Smoothie proteico', 'Mandorle', 'Tè verde matcha']
      },
      {
        id: `pranzo_${dateString}`,
        mealType: 'pranzo',
        calories: Math.round(nutritionData.targetCalories * 0.35),
        protein: Math.round(nutritionData.proteinTarget * 0.40),
        carbs: isWorkoutDay ? Math.round(nutritionData.carbTarget * 0.4) : 10,
        fat: Math.round(nutritionData.fatTarget * 0.20),
        timestamp: new Date(today.setHours(12, 30, 0, 0)).toISOString(),
        eaten: false,
        foods: ['Proteina magra', 'Verdure stagionali', isWorkoutDay ? 'Riso integrale' : 'Cavolfiore']
      },
      {
        id: `spuntino_${dateString}`,
        mealType: 'spuntino',
        calories: Math.round(nutritionData.targetCalories * 0.15),
        protein: Math.round(nutritionData.proteinTarget * 0.20),
        carbs: 12,
        fat: Math.round(nutritionData.fatTarget * 0.12),
        timestamp: new Date(today.setHours(15, 45, 0, 0)).toISOString(),
        eaten: false,
        foods: ['Shot pre-workout', 'Noci brasiliane']
      },
      {
        id: `cena_${dateString}`,
        mealType: 'cena',
        calories: Math.round(nutritionData.targetCalories * 0.30),
        protein: Math.round(nutritionData.proteinTarget * 0.35),
        carbs: Math.round(nutritionData.carbTarget * 0.25),
        fat: Math.round(nutritionData.fatTarget * 0.25),
        timestamp: new Date(today.setHours(19, 30, 0, 0)).toISOString(),
        eaten: false,
        foods: ['Pesce/Carne bianca', 'Verdure al vapore', 'Patata dolce', 'Avocado']
      }
    ];

    return meals;
  };

  const loadTodayMeals = () => {
    if (!user || !userProfile || !nutritionData) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const storageKey = `meals_${user.id}_${today}`;
    
    try {
      // Try to load from localStorage first
      const storedMeals = localStorage.getItem(storageKey);
      
      if (storedMeals) {
        const meals: MealEntry[] = JSON.parse(storedMeals);
        setTodayMeals(meals);
      } else {
        // Generate new meals for today
        const meals = generateDailyMeals();
        if (meals.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(meals));
          setTodayMeals(meals);
          
          toast({
            title: "Pasti generati! 🍽️",
            description: "Il tuo piano alimentare giornaliero è pronto",
          });
        }
      }
    } catch (error) {
      console.error('Error loading today meals:', error);
      // Fallback to generating meals
      const meals = generateDailyMeals();
      setTodayMeals(meals);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile && nutritionData) {
      loadTodayMeals();
    }
  }, [user, userProfile, nutritionData]);

  const markMealAsEaten = (mealId: string) => {
    if (!user) return;

    try {
      const updatedMeals = todayMeals.map(meal => 
        meal.id === mealId ? { ...meal, eaten: true } : meal
      );
      
      setTodayMeals(updatedMeals);
      
      // Save to localStorage
      const today = new Date().toISOString().split('T')[0];
      const storageKey = `meals_${user.id}_${today}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedMeals));

      const meal = todayMeals.find(m => m.id === mealId);
      if (meal) {
        toast({
          title: "Pasto registrato! 🍽️",
          description: `+${meal.calories}kcal aggiunte al tuo tracking`,
        });
      }
    } catch (error) {
      console.error('Error marking meal as eaten:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il pasto",
        variant: "destructive"
      });
    }
  };

  return {
    todayMeals,
    loading,
    markMealAsEaten,
    refreshMeals: loadTodayMeals
  };
};


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
}

interface AdvancedNutritionData {
  bmr: number;
  tdee: number;
  aggressiveDeficit: number;
  targetCalories: number;
  proteinTarget: number;
  fatTarget: number;
  carbTarget: number;
  expectedWeeklyLoss: number;
  pectoralFatLossRate: number;
}

export const useAdvancedNutritionTracking = (userProfile: any) => {
  const { user } = useAuth();
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);
  const [nutritionData, setNutritionData] = useState<AdvancedNutritionData | null>(null);
  const [loading, setLoading] = useState(true);

  // Calcoli metabolici avanzati basati su studi 2024-2025
  const calculateAdvancedNutrition = (): AdvancedNutritionData => {
    if (!userProfile) return null;

    // BMR con equazione Mifflin-St Jeor (più accurata)
    const bmr = (10 * userProfile.currentWeight) + (6.25 * userProfile.height) - (5 * userProfile.age) + 5;
    
    // TDEE con fattori di attività precisi
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const tdee = bmr * (activityMultipliers[userProfile.activityLevel] || 1.55);
    
    // Deficit aggressivo per grasso pettorale (25-30% più 200kcal extra)
    const baseDeficit = tdee * 0.30; // 30% deficit aggressivo
    const pectoralBonus = 200; // Extra deficit per grasso pettorale ostinato
    const aggressiveDeficit = baseDeficit + pectoralBonus;
    const targetCalories = Math.round(tdee - aggressiveDeficit);
    
    // Macro ottimizzate per preservazione massa + lipolisi pettorale
    const proteinTarget = Math.round(userProfile.currentWeight * 2.6); // 2.6g/kg per preservare massa
    const fatTarget = Math.round((targetCalories * 0.25) / 9); // 25% grassi per ormoni
    const carbTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);
    
    // Previsioni perdita peso scientifiche
    const expectedWeeklyLoss = aggressiveDeficit / 1100; // 7700kcal = 1kg grasso
    const pectoralFatLossRate = expectedWeeklyLoss * 0.65; // 65% dal grasso ostinato pettorale
    
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      aggressiveDeficit: Math.round(aggressiveDeficit),
      targetCalories,
      proteinTarget,
      fatTarget,
      carbTarget,
      expectedWeeklyLoss: Number(expectedWeeklyLoss.toFixed(2)),
      pectoralFatLossRate: Number(pectoralFatLossRate.toFixed(2))
    };
  };

  // Carica pasti di oggi
  useEffect(() => {
    const loadTodayMeals = async () => {
      if (!user) return;

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
          return;
        }

        if (data) {
          setTodayMeals(data.map(meal => ({
            id: meal.id,
            mealType: meal.meal_type,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            timestamp: meal.timestamp,
            eaten: meal.eaten
          })));
        }
      } catch (error) {
        console.error('Error loading today meals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTodayMeals();
    
    // Calcola dati nutrizionali
    if (userProfile) {
      setNutritionData(calculateAdvancedNutrition());
    }
  }, [user, userProfile]);

  // Marca pasto come consumato
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

      // Aggiorna stato locale
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

  // Calcola totali giornalieri
  const getDailyTotals = () => {
    const eatenMeals = todayMeals.filter(meal => meal.eaten);
    
    return {
      calories: eatenMeals.reduce((sum, meal) => sum + meal.calories, 0),
      protein: eatenMeals.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: eatenMeals.reduce((sum, meal) => sum + meal.carbs, 0),
      fat: eatenMeals.reduce((sum, meal) => sum + meal.fat, 0),
      remainingCalories: nutritionData ? nutritionData.targetCalories - eatenMeals.reduce((sum, meal) => sum + meal.calories, 0) : 0
    };
  };

  return {
    todayMeals,
    nutritionData,
    dailyTotals: getDailyTotals(),
    loading,
    markMealAsEaten
  };
};

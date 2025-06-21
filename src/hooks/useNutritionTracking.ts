import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
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

interface NutritionData {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  aggressiveDeficit: number;
  expectedWeeklyLoss: number;
}

export const useNutritionTracking = (userProfile: any) => {
  const today = new Date().toISOString().split('T')[0];
  const [todayMeals, setTodayMeals] = useLocalStorage<MealEntry[]>(`meals_${today}`, []);

  const calculateNutritionData = (): NutritionData => {
    if (!userProfile) {
      return {
        bmr: 1680,
        tdee: 2600,
        targetCalories: 1700,
        proteinTarget: 120,
        carbTarget: 85,
        fatTarget: 75,
        aggressiveDeficit: 900,
        expectedWeeklyLoss: 0.9
      };
    }

    // Calcolo BMR (Mifflin-St Jeor)
    const bmr = Math.round(10 * userProfile.currentWeight + 6.25 * userProfile.height - 5 * userProfile.age + 5);
    
    // Calcolo TDEE
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const tdee = Math.round(bmr * (activityMultipliers[userProfile.activityLevel as keyof typeof activityMultipliers] || 1.55));
    
    // Deficit aggressivo per fat loss
    const aggressiveDeficit = 900;
    const targetCalories = Math.max(1200, tdee - aggressiveDeficit);
    
    // Macro targets
    const proteinTarget = Math.round(userProfile.currentWeight * 1.8); // 1.8g per kg
    const fatTarget = Math.round((targetCalories * 0.25) / 9); // 25% delle calorie
    const carbTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);
    
    const expectedWeeklyLoss = Math.round((aggressiveDeficit * 7 / 7700) * 10) / 10;

    return {
      bmr,
      tdee,
      targetCalories,
      proteinTarget,
      carbTarget,
      fatTarget,
      aggressiveDeficit,
      expectedWeeklyLoss
    };
  };

  const [nutritionData] = useState<NutritionData>(() => calculateNutritionData());

  const generateDailyMeals = (): MealEntry[] => {
    if (!userProfile) return [];

    const isWorkoutDay = [1, 3, 5].includes(new Date().getDay());
    const dateString = today;

    return [
      {
        id: `colazione_${dateString}`,
        mealType: 'colazione',
        calories: Math.round(nutritionData.targetCalories * 0.20),
        protein: Math.round(nutritionData.proteinTarget * 0.25),
        carbs: isWorkoutDay ? 15 : 8,
        fat: Math.round(nutritionData.fatTarget * 0.15),
        timestamp: new Date().setHours(7, 30, 0, 0).toString(),
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
        timestamp: new Date().setHours(12, 30, 0, 0).toString(),
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
        timestamp: new Date().setHours(15, 45, 0, 0).toString(),
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
        timestamp: new Date().setHours(19, 30, 0, 0).toString(),
        eaten: false,
        foods: ['Pesce/Carne bianca', 'Verdure al vapore', 'Patata dolce', 'Avocado']
      }
    ];
  };

  useEffect(() => {
    if (userProfile && todayMeals.length === 0) {
      const meals = generateDailyMeals();
      setTodayMeals(meals);
      
      toast({
        title: "Pasti generati! 🍽️",
        description: "Il tuo piano alimentare giornaliero è pronto",
      });
    }
  }, [userProfile]);

  const markMealAsEaten = (mealId: string) => {
    const updatedMeals = todayMeals.map(meal => 
      meal.id === mealId ? { ...meal, eaten: true } : meal
    );
    
    setTodayMeals(updatedMeals);

    const meal = todayMeals.find(m => m.id === mealId);
    if (meal) {
      toast({
        title: "Pasto registrato! 🍽️",
        description: `+${meal.calories}kcal aggiunte al tuo tracking`,
      });
    }
  };

  const dailyTotals = todayMeals.reduce(
    (totals, meal) => {
      if (meal.eaten) {
        totals.calories += meal.calories;
        totals.protein += meal.protein;
        totals.carbs += meal.carbs;
        totals.fat += meal.fat;
      }
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, remainingCalories: nutritionData.targetCalories }
  );

  dailyTotals.remainingCalories = Math.max(0, nutritionData.targetCalories - dailyTotals.calories);

  return {
    todayMeals,
    nutritionData,
    dailyTotals,
    loading: false,
    markMealAsEaten
  };
};

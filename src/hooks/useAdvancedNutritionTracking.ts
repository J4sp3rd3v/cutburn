
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useDailyMealGeneration } from './useDailyMealGeneration';

interface AdvancedNutritionData {
  bmr: number;
  tdee: number;
  aggressiveDeficit: number;
  targetCalories: number;
  proteinTarget: number;
  fatTarget: number;
  carbTarget: number;
  expectedWeeklyLoss: number;
  fatLossRate: number;
}

export const useAdvancedNutritionTracking = (userProfile: any) => {
  const { user } = useAuth();
  const [nutritionData, setNutritionData] = useState<AdvancedNutritionData | null>(null);

  // Calcoli metabolici avanzati basati su studi 2024-2025
  const calculateAdvancedNutrition = (): AdvancedNutritionData | null => {
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
    
    // Deficit aggressivo per fat loss (25-30% più 200kcal extra)
    const aggressiveDeficitPercentage = 0.27; // 27% del TDEE
    const extraBonus = 200; // Extra deficit per fat loss accelerato
    const aggressiveDeficit = Math.round(tdee * aggressiveDeficitPercentage) + extraBonus;
    
    // Macro ottimizzate per preservazione massa + lipolisi ottimale
    const proteinTarget = Math.round(userProfile.currentWeight * 2.6); // 2.6g/kg per preservare massa
    const fatTarget = Math.round(userProfile.currentWeight * 0.6); // 0.6g/kg
    const targetCalories = Math.round(tdee - aggressiveDeficit);
    const carbTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);
    
    const expectedWeeklyLoss = Math.round((aggressiveDeficit * 7 / 7700) * 100) / 100; // kg/settimana
    const fatLossRate = expectedWeeklyLoss * 0.65; // 65% dal grasso ostinato
    
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      aggressiveDeficit: Math.round(aggressiveDeficit),
      targetCalories,
      proteinTarget,
      fatTarget,
      carbTarget,
      expectedWeeklyLoss: Number(expectedWeeklyLoss.toFixed(2)),
      fatLossRate: Number(fatLossRate.toFixed(2))
    };
  };

  // Calcola dati nutrizionali quando il profilo utente cambia
  useEffect(() => {
    if (userProfile) {
      setNutritionData(calculateAdvancedNutrition());
    }
  }, [userProfile]);

  // Use the new meal generation hook
  const {
    todayMeals,
    loading,
    markMealAsEaten,
    refreshMeals
  } = useDailyMealGeneration(userProfile, nutritionData);

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
    markMealAsEaten,
    refreshMeals
  };
};

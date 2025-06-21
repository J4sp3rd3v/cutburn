
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Utensils, Target, Zap } from 'lucide-react';

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

interface AdvancedMealTrackerProps {
  meals: MealEntry[];
  nutritionData: any;
  dailyTotals: any;
  onMarkMealAsEaten: (mealId: string) => void;
}

const AdvancedMealTracker = ({ 
  meals, 
  nutritionData, 
  dailyTotals, 
  onMarkMealAsEaten 
}: AdvancedMealTrackerProps) => {
  
  const getCurrentOptimalMeal = () => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour <= 9) return 'colazione';
    if (hour >= 12 && hour <= 14) return 'pranzo';
    if (hour >= 15 && hour <= 16) return 'spuntino';
    if (hour >= 19 && hour <= 21) return 'cena';
    return null;
  };

  const optimalMealTime = getCurrentOptimalMeal();

  return (
    <div className="space-y-4">
      {/* Pasti del giorno */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Utensils className="w-5 h-5 mr-2" />
            Pasti Oggi
          </h3>
          <Badge variant="outline">
            {meals.filter(m => m.eaten).length}/{meals.length}
          </Badge>
        </div>

        {meals.length === 0 ? (
          <Card className="p-4 text-center text-slate-500">
            <p>Nessun pasto programmato per oggi</p>
            <p className="text-sm">I pasti verranno generati automaticamente</p>
          </Card>
        ) : (
          meals.map((meal) => (
            <Card 
              key={meal.id}
              className={`p-4 transition-all duration-200 ${
                meal.eaten 
                  ? 'bg-green-50 border-green-200' 
                  : optimalMealTime === meal.mealType
                    ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-100'
                    : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-slate-800 capitalize">
                      {meal.mealType}
                    </h4>
                    {optimalMealTime === meal.mealType && !meal.eaten && (
                      <Badge variant="default" className="text-xs">
                        💫 Ora ottimale
                      </Badge>
                    )}
                    {meal.eaten && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>{meal.calories}kcal</span>
                    </div>
                    <div>P: {meal.protein}g</div>
                    <div>C: {meal.carbs}g</div>
                    <div>F: {meal.fat}g</div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(meal.timestamp).toLocaleTimeString('it-IT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant={meal.eaten ? "outline" : "default"}
                  onClick={() => onMarkMealAsEaten(meal.id)}
                  disabled={meal.eaten}
                  className="ml-3"
                >
                  {meal.eaten ? '✓ Consumato' : 'Ho mangiato'}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Timing Alert */}
      {optimalMealTime && (
        <Card className="p-3 bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-200">
          <div className="text-sm text-orange-800">
            <strong>💫 TIMING PERFETTO:</strong> È il momento ottimale per {optimalMealTime} secondo i tuoi ritmi circadiani per massima lipolisi!
          </div>
        </Card>
      )}

      {/* Macros Summary */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Totali Giornalieri</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center bg-orange-50 rounded-lg p-2">
            <div className="text-lg font-bold text-orange-600">
              {dailyTotals.calories}
            </div>
            <div className="text-xs text-slate-500">
              /{nutritionData?.targetCalories || 0} kcal
            </div>
            <Progress 
              value={nutritionData?.targetCalories ? (dailyTotals.calories / nutritionData.targetCalories) * 100 : 0} 
              className="h-1 mt-1"
            />
          </div>
          
          <div className="text-center bg-red-50 rounded-lg p-2">
            <div className="text-lg font-bold text-red-500">
              {Math.round(dailyTotals.protein)}g
            </div>
            <div className="text-xs text-slate-500">
              /{nutritionData?.proteinTarget || 0}g prot
            </div>
            <Progress 
              value={nutritionData?.proteinTarget ? (dailyTotals.protein / nutritionData.proteinTarget) * 100 : 0} 
              className="h-1 mt-1"
            />
          </div>
          
          <div className="text-center bg-blue-50 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-500">
              {Math.round(dailyTotals.carbs)}g
            </div>
            <div className="text-xs text-slate-500">
              /{nutritionData?.carbTarget || 0}g carbs
            </div>
            <Progress 
              value={nutritionData?.carbTarget ? (dailyTotals.carbs / nutritionData.carbTarget) * 100 : 0} 
              className="h-1 mt-1"
            />
          </div>
          
          <div className="text-center bg-green-50 rounded-lg p-2">
            <div className="text-lg font-bold text-green-500">
              {Math.round(dailyTotals.fat)}g
            </div>
            <div className="text-xs text-slate-500">
              /{nutritionData?.fatTarget || 0}g grassi
            </div>
            <Progress 
              value={nutritionData?.fatTarget ? (dailyTotals.fat / nutritionData.fatTarget) * 100 : 0} 
              className="h-1 mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMealTracker;

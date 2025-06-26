import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Calendar, 
  Target, 
  Dumbbell, 
  ShoppingCart,
  TrendingDown,
  Zap,
  ChefHat
} from 'lucide-react';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { useNutritionTracking } from '@/hooks/useNutritionTracking';
import DashboardCard from '@/components/DashboardCard';
import SupplementSection from '@/components/SupplementSection';
import WorkoutSection from '@/components/WorkoutSection';
import ShoppingList from '@/components/ShoppingList';
import UserProfile from '@/components/UserProfile';
import AdvancedMealTracker from '@/components/AdvancedMealTracker';
import RecipeSection from '@/components/RecipeSection';

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-slate-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-slate-600">Caricamento dati in corso...</p>
    </div>
  </div>
);

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const {
    dailyProgress,
    userProfile,
    loading: progressLoading,
    saveProgress,
  } = useProgressTracking();

  const {
    todayMeals,
    nutritionData,
    dailyTotals,
    loading: mealsLoading,
    markMealAsEaten
  } = useNutritionTracking(userProfile);
  
  if (progressLoading || !userProfile || !dailyProgress || mealsLoading) {
     return <LoadingScreen />;
  }

  const daysSinceStart = 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                CutBurn Pro
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("profile")}
              className="rounded-full p-2"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm text-xs">
              <TabsTrigger value="dashboard"><span><Target className="w-4 h-4" /></span></TabsTrigger>
              <TabsTrigger value="meals"><span><ChefHat className="w-4 h-4" /></span></TabsTrigger>
              <TabsTrigger value="diet"><span><Calendar className="w-4 h-4" /></span></TabsTrigger>
              <TabsTrigger value="supplements"><span><Zap className="w-4 h-4" /></span></TabsTrigger>
              <TabsTrigger value="workout"><span><Dumbbell className="w-4 h-4" /></span></TabsTrigger>
              <TabsTrigger value="shopping"><span><ShoppingCart className="w-4 h-4" /></span></TabsTrigger>
            </TabsList>
          </div>

          <div className="px-4 pb-4 mt-4 space-y-4">
            <TabsContent value="dashboard">
               <div className="text-center py-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Ciao {userProfile.name}! 🔥
                </h2>
                <p className="text-slate-600">
                  Giorno {daysSinceStart} - Benvenuto nel tuo percorso!
                </p>
              </div>

              <Card className="p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white">
                 <div className="flex items-center justify-between mb-3">
                   <h3 className="font-semibold">Deficit Calorico</h3>
                   <Badge variant="secondary" className="bg-white/20 text-white">
                     -{nutritionData.aggressiveDeficit} kcal/giorno
                   </Badge>
                 </div>
                 <div className="space-y-2">
                   <div className="flex justify-between items-center text-sm">
                     <span>Calorie rimanenti oggi</span>
                     <span className="font-bold">{dailyTotals.remainingCalories} kcal</span>
                   </div>
                   <Progress 
                     value={Math.max(0, (dailyTotals.calories / nutritionData.targetCalories) * 100)} 
                     className="bg-white/20 h-2"
                   />
                 </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                  <DashboardCard
                      icon={ChefHat}
                      title="Calorie Consumate"
                      value={`${dailyTotals.calories} / ${nutritionData.targetCalories}`}
                      unit="kcal"
                  />
                  <DashboardCard
                      icon={TrendingDown}
                      title="Peso Attuale"
                      value={String(userProfile.current_weight)}
                      unit="kg"
                  />
              </div>
            </TabsContent>
            
            <TabsContent value="profile"><UserProfile /></TabsContent>
            
            {/* Sezione Pasti (ora contiene le ricette del piano di 14 giorni) */}
            <TabsContent value="meals"><RecipeSection /></TabsContent>
            
            {/* Sezione Dieta (ora contiene il tracker dei pasti giornalieri) */}
            <TabsContent value="diet"><AdvancedMealTracker meals={todayMeals} onMarkMealAsEaten={markMealAsEaten} nutritionData={nutritionData} dailyTotals={dailyTotals} /></TabsContent>
            
            <TabsContent value="supplements"><SupplementSection /></TabsContent>
            <TabsContent value="workout"><WorkoutSection workoutCompleted={dailyProgress.workout_completed} onWorkoutToggle={() => saveProgress({ workout_completed: !dailyProgress.workout_completed })} /></TabsContent>
            <TabsContent value="shopping"><ShoppingList /></TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

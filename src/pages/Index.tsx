import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  ChefHat,
  ClipboardList,
  LineChart as LineChartIcon
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
import PersonalizedDietPlan from '@/components/PersonalizedDietPlan';
import WeightHistory from '@/components/WeightHistory';
import BodyFatHistory from '@/components/BodyFatHistory';
import ScientificDashboard from '@/components/ScientificDashboard';
import WeeklyShoppingList from '@/components/WeeklyShoppingList';

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
    addOrUpdateDailyProgress,
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
            <TabsList className="w-full bg-white/70 backdrop-blur-sm text-xs flex overflow-x-auto whitespace-nowrap p-1 h-auto">
              <TabsTrigger value="dashboard" className="flex-shrink-0" title="Dashboard Scientifica"><span><Target className="w-4 h-4" /></span></TabsTrigger>
              <TabsTrigger value="recipes" className="flex-shrink-0" title="Ricette"><span><ChefHat className="w-4 h-4" /></span></TabsTrigger>
              <TabsTrigger value="diet-plan" className="flex-shrink-0" title="Dieta Giornaliera"><span><Calendar className="w-4 h-4" /></span></TabsTrigger>
              <TabsTrigger value="supplements" className="flex-shrink-0" title="Supplementi"><span><Zap className="w-4 h-4" /></span></TabsTrigger>
              <TabsTrigger value="workout" className="flex-shrink-0" title="Allenamento"><span><Dumbbell className="w-4 h-4" /></span></TabsTrigger>
              <TabsTrigger value="shopping" className="flex-shrink-0" title="Lista Spesa"><span><ShoppingCart className="w-4 h-4" /></span></TabsTrigger>
            </TabsList>
          </div>

          <div className="px-4 pb-4 mt-4 space-y-4">
            <TabsContent value="dashboard">
              <ScientificDashboard />
            </TabsContent>
            
            <TabsContent value="profile"><UserProfile /></TabsContent>
            
            <TabsContent value="recipes"><RecipeSection /></TabsContent>
            
            <TabsContent value="diet-plan">
              <PersonalizedDietPlan />
            </TabsContent>
            
            <TabsContent value="supplements"><SupplementSection /></TabsContent>
            <TabsContent value="workout"><WorkoutSection workoutCompleted={dailyProgress.workout_completed} onWorkoutToggle={() => addOrUpdateDailyProgress({ workout_completed: !dailyProgress.workout_completed })} /></TabsContent>
            <TabsContent value="shopping"><WeeklyShoppingList /></TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

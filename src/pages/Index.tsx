
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Calendar, 
  Target, 
  Utensils, 
  Dumbbell, 
  ShoppingCart,
  TrendingDown,
  Clock,
  Zap,
  Droplets,
  Flame,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseProgressTracking } from '@/hooks/useSupabaseProgressTracking';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '@/components/DashboardCard';
import DietSection from '@/components/DietSection';
import RecipeSection from '@/components/RecipeSection';
import SupplementSection from '@/components/SupplementSection';
import WorkoutSection from '@/components/WorkoutSection';
import ShoppingList from '@/components/ShoppingList';
import UserProfile from '@/components/UserProfile';
import DailyShots from '@/components/DailyShots';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const {
    dailyProgress,
    userProfile,
    loading,
    addWater,
    addCalories,
    updateWeight,
    addShot,
    toggleWorkout,
    getWeeklyProgress
  } = useSupabaseProgressTracking();

  const [weeklyProgress, setWeeklyProgress] = useState<Array<{ date: string; weight: number }>>([]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadWeeklyProgress = async () => {
      const progress = await getWeeklyProgress();
      setWeeklyProgress(progress);
    };
    
    if (user) {
      loadWeeklyProgress();
    }
  }, [user, getWeeklyProgress]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-slate-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  const weightChange = weeklyProgress.length >= 2 
    ? (weeklyProgress[weeklyProgress.length - 1]?.weight || userProfile.currentWeight) - (weeklyProgress[0]?.weight || userProfile.startWeight)
    : 0;

  const startDate = new Date(userProfile.targetWeight ? '2024-01-01' : new Date().toISOString().split('T')[0]);
  const daysSinceStart = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                CutBurn
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("profile")}
                className="rounded-full"
              >
                <User className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm">
              <TabsTrigger value="dashboard" className="text-xs">
                <Target className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="diet" className="text-xs">
                <Utensils className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="recipes" className="text-xs">
              <Calendar className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="supplements" className="text-xs">
                <Zap className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="workout" className="text-xs">
                <Dumbbell className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="shopping" className="text-xs">
                <ShoppingCart className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="px-4 pb-4">
            <TabsContent value="dashboard" className="mt-4 space-y-4">
              <div className="text-center py-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Ciao {userProfile.name}! 👋
                </h2>
                <p className="text-slate-600">
                  Giorno {daysSinceStart} del tuo percorso CutBurn
                </p>
              </div>

              {/* Daily Overview */}
              <Card className="p-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Obiettivo Giornaliero</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)}kg questa settimana
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Calorie rimanenti</span>
                    <span className="font-bold">{userProfile.targetCalories - dailyProgress.calories} kcal</span>
                  </div>
                  <Progress 
                    value={(dailyProgress.calories / userProfile.targetCalories) * 100} 
                    className="bg-white/20"
                  />
                </div>
              </Card>

              {/* Interactive Progress Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className="p-4 bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 cursor-pointer active:scale-95"
                  onClick={addWater}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-slate-700">Acqua</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-slate-800">
                      {dailyProgress.water}/{userProfile.targetWater}ml
                    </div>
                    <div className="text-xs text-slate-500">Tocca per +500ml</div>
                    <Progress value={(dailyProgress.water / userProfile.targetWater) * 100} className="h-2" />
                  </div>
                </Card>

                <DashboardCard
                  title="Calorie"
                  value={`${dailyProgress.calories}/${userProfile.targetCalories}`}
                  unit="kcal consumate"
                  progress={(dailyProgress.calories / userProfile.targetCalories) * 100}
                  icon={<Flame className="w-5 h-5 text-orange-500" />}
                />
              </div>

              {/* Daily Shots */}
              <DailyShots 
                shotsConsumed={dailyProgress.shotsConsumed}
                onTakeShot={addShot}
              />

              {/* Today's Status */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-slate-600" />
                  Stato Giornaliero
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Workout</span>
                    <Button
                      variant={dailyProgress.workoutCompleted ? "default" : "outline"}
                      size="sm"
                      onClick={toggleWorkout}
                    >
                      {dailyProgress.workoutCompleted ? "✓ Completato" : "Da fare"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Peso attuale</span>
                    <Badge variant="outline">
                      {userProfile.currentWeight}kg
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Digiuno 16:8</span>
                    <Badge variant="outline">
                      Finestra: 12:00-20:00
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Weekly Progress Chart */}
              {weeklyProgress.length > 1 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">📊 Progressi Peso Settimanali</h3>
                  <div className="space-y-2">
                    {weeklyProgress.slice(-5).map((day, index) => (
                      <div key={day.date} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">
                          {new Date(day.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' })}
                        </span>
                        <span className="font-semibold">{day.weight}kg</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="diet" className="mt-4">
              <DietSection />
            </TabsContent>

            <TabsContent value="recipes" className="mt-4">
              <RecipeSection />
            </TabsContent>

            <TabsContent value="supplements" className="mt-4">
              <SupplementSection />
            </TabsContent>

            <TabsContent value="workout" className="mt-4">
              <WorkoutSection />
            </TabsContent>

            <TabsContent value="shopping" className="mt-4">
              <ShoppingList />
            </TabsContent>

            <TabsContent value="profile" className="mt-4">
              <UserProfile 
                userStats={{
                  targetWater: userProfile.targetWater,
                  targetCalories: userProfile.targetCalories,
                  currentWeight: userProfile.currentWeight,
                  startWeight: userProfile.startWeight,
                  startDate: '2024-01-01'
                }}
                onUpdateWeight={updateWeight}
                weeklyProgress={weeklyProgress}
              />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

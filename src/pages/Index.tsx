
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
  Utensils, 
  Dumbbell, 
  ShoppingCart,
  TrendingDown,
  Clock,
  Zap
} from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import DietSection from '@/components/DietSection';
import RecipeSection from '@/components/RecipeSection';
import SupplementSection from '@/components/SupplementSection';
import WorkoutSection from '@/components/WorkoutSection';
import ShoppingList from '@/components/ShoppingList';
import UserProfile from '@/components/UserProfile';

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dailyProgress, setDailyProgress] = useState({
    calories: { consumed: 1200, target: 1800 },
    water: { consumed: 6, target: 8 },
    workout: { completed: true },
    supplements: { taken: 3, total: 4 }
  });

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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("profile")}
              className="rounded-full"
            >
              <User className="w-5 h-5" />
            </Button>
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
                  Ciao Marco! 👋
                </h2>
                <p className="text-slate-600">
                  Giorno 12 del tuo percorso CutBurn
                </p>
              </div>

              {/* Daily Overview */}
              <Card className="p-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Obiettivo Giornaliero</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    -0.2kg questa settimana
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Calorie rimanenti</span>
                    <span className="font-bold">{dailyProgress.calories.target - dailyProgress.calories.consumed} kcal</span>
                  </div>
                  <Progress 
                    value={(dailyProgress.calories.consumed / dailyProgress.calories.target) * 100} 
                    className="bg-white/20"
                  />
                </div>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <DashboardCard
                  title="Acqua"
                  value={`${dailyProgress.water.consumed}/${dailyProgress.water.target}`}
                  unit="bicchieri"
                  progress={(dailyProgress.water.consumed / dailyProgress.water.target) * 100}
                  icon={<Target className="w-5 h-5 text-blue-500" />}
                />
                <DashboardCard
                  title="Integrazione"
                  value={`${dailyProgress.supplements.taken}/${dailyProgress.supplements.total}`}
                  unit="supplementi"
                  progress={(dailyProgress.supplements.taken / dailyProgress.supplements.total) * 100}
                  icon={<Zap className="w-5 h-5 text-orange-500" />}
                />
              </div>

              {/* Today's Status */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-slate-600" />
                  Stato Giornaliero
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Workout Pettorale</span>
                    <Badge variant={dailyProgress.workout.completed ? "default" : "secondary"}>
                      {dailyProgress.workout.completed ? "✓ Completato" : "Da fare"}
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
              <UserProfile />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

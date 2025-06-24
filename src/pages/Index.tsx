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
  ChefHat
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { useNutritionTracking } from '@/hooks/useNutritionTracking';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '@/components/DashboardCard';
import DietSection from '@/components/DietSection';
import SupplementSection from '@/components/SupplementSection';
import WorkoutSection from '@/components/WorkoutSection';
import ShoppingList from '@/components/ShoppingList';
import UserProfile from '@/components/UserProfile';
import DailyShots from '@/components/DailyShots';
import AdvancedMealTracker from '@/components/AdvancedMealTracker';
import RecipeSection from '@/components/RecipeSection';

const Index = () => {
  const { user, loading: authLoading, isNewUser, markProfileCompleted } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);

  // Redirect al login se non autenticato - con ritardo per permettere il recupero della sessione
  useEffect(() => {
    // Cancella timer precedente se esiste
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }

    if (!authLoading && !user) {
      // Attendi 3 secondi prima del redirect per dare tempo al recupero della sessione
      const timer = setTimeout(() => {
        console.log('❌ Utente non autenticato dopo timeout - redirect al login');
        navigate('/auth');
      }, 3000);
      
      setRedirectTimer(timer);
    } else if (user) {
      // Se l'utente è trovato, cancella il timer
      if (redirectTimer) {
        clearTimeout(redirectTimer);
        setRedirectTimer(null);
      }
    }

    // Cleanup
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [user, authLoading, navigate]);

  // Redirect automatico al profilo per nuovi utenti
  useEffect(() => {
    if (isNewUser && user) {
      console.log('🔄 Nuovo utente rilevato - redirect al profilo per setup iniziale');
      setActiveTab("profile");
    }
  }, [isNewUser, user]);

  // Gestione azioni PWA
  useEffect(() => {
    const pwaAction = sessionStorage.getItem('pwa-action');
    if (pwaAction && user) {
      console.log('🚀 Azione PWA rilevata:', pwaAction);
      
      switch (pwaAction) {
        case 'weight':
        case 'track-weight':
          setActiveTab("profile");
          // Trigger weight input focus after component mounts
          setTimeout(() => {
            const weightInput = document.querySelector('input[type="number"]') as HTMLInputElement;
            if (weightInput) weightInput.focus();
          }, 1000);
          break;
        case 'diet':
        case 'view-diet':
          setActiveTab("diet");
          break;
        case 'workout':
          setActiveTab("workout");
          break;
        case 'dashboard':
        default:
          setActiveTab("dashboard");
          break;
      }
      
      // Clear the action
      sessionStorage.removeItem('pwa-action');
    }
  }, [user]);
  
  const {
    dailyProgress,
    userProfile,
    loading,
    isOnline,
    pendingSync,
    addWater,
    addCalories,
    updateWeight,
    updateProfile,
    addShot,
    toggleWorkout,
    getWeeklyProgress,
    syncPendingData
  } = useProgressTracking();

  const {
    todayMeals,
    nutritionData,
    dailyTotals,
    loading: mealsLoading,
    markMealAsEaten
  } = useNutritionTracking(userProfile);

  const [weeklyProgress, setWeeklyProgress] = useState<Array<{ date: string; weight: number }>>([]);

  useEffect(() => {
    if (user) {
      const progress = getWeeklyProgress();
      setWeeklyProgress(progress);
    }
  }, [user, getWeeklyProgress]);

  // Mostra loading durante l'autenticazione o caricamento dati (con timeout di sicurezza)
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  useEffect(() => {
    if (authLoading || loading) {
      // Timeout di sicurezza AGGRESSIVO: se il loading dura più di 5 secondi, forza il caricamento
      const timeout = setTimeout(() => {
        console.warn('⚠️ Loading timeout raggiunto dopo 5 secondi - forzando caricamento');
        setLoadingTimeout(true);
      }, 5000); // Ridotto da 15s a 5s
      
      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [authLoading, loading]);

  // Mostra loading solo se non è scaduto il timeout
  if ((authLoading || loading) && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-slate-600 mb-2 font-medium">
            {authLoading ? "🔐 Ripristino sessione..." : "🚀 Avvio CutBurn Pro..."}
          </p>
          <p className="text-slate-500 text-sm">
            {authLoading ? "Verifica credenziali salvate" : "Configurazione scientifica personalizzata"}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            ⚡ Caricamento ultrarapido in corso
          </p>
          <div className="mt-4">
            <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se non c'è utente dopo il loading, il redirect è già gestito dall'useEffect
  if (!user) {
    return null;
  }

  // Se non c'è userProfile dopo il timeout, crea uno di default
  if (!userProfile && loadingTimeout) {
    console.warn('⚠️ UserProfile non trovato dopo timeout - creazione profilo di emergenza');
    const emergencyProfile = {
      id: user.id,
      name: user.name || user.email?.split('@')[0] || 'Utente',
      age: 0,
      height: 0,
      currentWeight: 0,
      startWeight: 0,
      targetWeight: 0,
      activityLevel: 'moderate',
      goal: 'fat-loss',
      intermittentFasting: false,
      lactoseIntolerant: false,
      targetCalories: 1800,
      targetWater: 2500,
      created_at: user.created_at
    };
    // Qui dovresti avere accesso al setter del userProfile, ma per ora continuiamo
  }

  if (!userProfile) {
    return null;
  }

  const weightChange = !isNewUser && weeklyProgress.length >= 2 
    ? (weeklyProgress[weeklyProgress.length - 1]?.weight || userProfile.currentWeight) - (weeklyProgress[0]?.weight || userProfile.startWeight)
    : 0;

  const registrationDate = new Date(userProfile.created_at || user.created_at);
  const today = new Date();
  const daysSinceStart = Math.max(1, Math.ceil((today.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
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
            <div className="flex items-center space-x-2">
              {/* Indicatore stato sincronizzazione */}
              {!isOnline && (
                <div className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Offline</span>
                </div>
              )}
              
              {isOnline && pendingSync > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={syncPendingData}
                  className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs hover:bg-blue-200"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>{pendingSync}</span>
                </Button>
              )}
              
              {isOnline && pendingSync === 0 && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sync</span>
                </div>
              )}
              
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm text-xs">
              <TabsTrigger value="dashboard" className="text-xs">
                <Target className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="meals" className="text-xs">
                <ChefHat className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="diet" className="text-xs">
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
                  Ciao {userProfile.name}! 🔥
                </h2>
                <p className="text-slate-600">
                  Giorno {daysSinceStart} - Protocollo Fat Loss
                </p>
              </div>

              {/* Enhanced Deficit Status */}
              <Card className="p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Deficit Calorico Aggressivo</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    -{nutritionData.aggressiveDeficit} kcal/giorno
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="text-center">
                    <div className="font-bold">{nutritionData.bmr}</div>
                    <div className="opacity-80">BMR</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{nutritionData.tdee}</div>
                    <div className="opacity-80">TDEE</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{nutritionData.targetCalories}</div>
                    <div className="opacity-80">Target</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Calorie rimanenti oggi</span>
                    <span className="font-bold">{dailyTotals.remainingCalories} kcal</span>
                  </div>
                  <Progress 
                    value={Math.max(0, (dailyTotals.calories / nutritionData.targetCalories) * 100)} 
                    className="bg-white/20"
                  />
                </div>
              </Card>

              {/* Quick Actions */}
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
                  value={`${dailyTotals.calories}/${nutritionData.targetCalories}`}
                  unit="kcal consumate"
                  progress={(dailyTotals.calories / nutritionData.targetCalories) * 100}
                  icon={<Flame className="w-5 h-5 text-orange-500" />}
                />
              </div>

              {/* Daily Shots */}
              <DailyShots 
                shotsConsumed={dailyProgress.shotsConsumed}
                onTakeShot={addShot}
                userWeight={userProfile.currentWeight}
              />

              {/* Status Section */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-slate-600" />
                  Stato Protocollo
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Workout Completato</span>
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
                    <span className="text-slate-600">Deficit giornaliero</span>
                    <Badge variant="default" className="bg-red-500">
                      -{nutritionData.aggressiveDeficit}kcal
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Perdita prevista</span>
                    <Badge variant="outline">
                      {nutritionData.expectedWeeklyLoss}kg/settimana
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Weekly Progress Chart - Solo per utenti con progressi reali */}
              {!isNewUser && weeklyProgress.length > 1 && (
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
              
              {/* Messaggio incoraggiamento per nuovi utenti */}
              {isNewUser && (
                <Card className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-semibold text-emerald-800 mb-2">Inizia il tuo percorso!</h3>
                    <p className="text-sm text-emerald-700">
                      Completa il tuo profilo e inizia a tracciare i progressi. 
                      I tuoi risultati appariranno qui man mano che procedi!
                    </p>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="meals" className="mt-4">
              <RecipeSection userProfile={userProfile} />
            </TabsContent>

            <TabsContent value="diet" className="mt-4">
              <DietSection userProfile={userProfile} />
            </TabsContent>

            <TabsContent value="supplements" className="mt-4">
              <SupplementSection userProfile={userProfile} />
            </TabsContent>

            <TabsContent value="workout" className="mt-4">
              <WorkoutSection userProfile={userProfile} />
            </TabsContent>

            <TabsContent value="shopping" className="mt-4">
              <ShoppingList userProfile={userProfile} />
            </TabsContent>

            <TabsContent value="profile" className="mt-4">
              <UserProfile 
                userStats={{
                  targetWater: userProfile.targetWater,
                  targetCalories: nutritionData.targetCalories,
                  currentWeight: userProfile.currentWeight,
                  startWeight: userProfile.startWeight,
                  startDate: userProfile.created_at || user.created_at
                }}
                onUpdateWeight={updateWeight}
                onUpdateProfile={updateProfile}
                weeklyProgress={weeklyProgress}
                currentProfile={userProfile}
              />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

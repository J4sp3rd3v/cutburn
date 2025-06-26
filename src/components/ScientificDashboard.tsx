import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Droplets, 
  TrendingDown, 
  TrendingUp,
  Activity,
  Brain,
  Flame,
  Scale,
  Calendar,
  Zap
} from 'lucide-react';
import { usePersonalizedDiet } from '@/hooks/usePersonalizedDiet';
import { useProgressTracking } from '@/hooks/useProgressTracking';

const ScientificDashboard: React.FC = () => {
  const { dietPlan, loading: dietLoading } = usePersonalizedDiet();
  const { userProfile, dailyProgress, progressHistory } = useProgressTracking();

  if (dietLoading || !userProfile || !dailyProgress) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Calcoli per i progressi
  const daysSinceStart = Math.max(1, Math.floor((new Date().getTime() - new Date(progressHistory[0]?.date || new Date()).getTime()) / (1000 * 60 * 60 * 24)));
  const weightProgress = userProfile.start_weight && userProfile.current_weight 
    ? userProfile.start_weight - userProfile.current_weight 
    : 0;
  const targetWeightProgress = userProfile.target_weight && userProfile.current_weight
    ? Math.abs(userProfile.target_weight - userProfile.current_weight)
    : 0;
  const progressPercentage = userProfile.start_weight && userProfile.target_weight && userProfile.current_weight
    ? Math.max(0, Math.min(100, ((userProfile.start_weight - userProfile.current_weight) / (userProfile.start_weight - userProfile.target_weight)) * 100))
    : 0;

  // Calcoli idratazione
  const waterIntakePercentage = dietPlan?.dailyWaterIntake 
    ? Math.min(100, (dailyProgress.water / (dietPlan.dailyWaterIntake * 1000)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header con saluto personalizzato */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Ciao {userProfile.name}! 🔥
        </h2>
        <p className="text-slate-600">
          Giorno {daysSinceStart} - {dietPlan?.scientificRationale || 'Il tuo percorso scientifico'}
        </p>
      </div>

      {/* Profilo Metabolico Avanzato */}
      {dietPlan?.metabolicProfile && (
        <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Profilo Metabolico Scientifico</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="text-sm font-medium">BMR</span>
                </div>
                <p className="text-lg font-bold">{dietPlan.metabolicProfile.bmr} kcal</p>
                <p className="text-xs text-blue-200">Metabolismo basale</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-4 h-4 text-green-300" />
                  <span className="text-sm font-medium">TDEE</span>
                </div>
                <p className="text-lg font-bold">{dietPlan.metabolicProfile.tdee} kcal</p>
                <p className="text-xs text-blue-200">Fabbisogno totale</p>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-red-300" />
                  <span className="text-sm font-medium">Deficit Calorico</span>
                </div>
                <Badge variant="secondary" className="bg-red-500/20 text-red-200">
                  -{dietPlan.metabolicProfile.deficitCalories} kcal/giorno
                </Badge>
              </div>
              <p className="text-xs text-blue-200">
                Perdita prevista: {dietPlan.metabolicProfile.expectedWeightLossPerWeek} kg/settimana
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Target Nutrizionali */}
      {dietPlan && (
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Target className="w-5 h-5" />
              <span>Target Nutrizionali Ottimizzati</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{dietPlan.targetCalories}</p>
                <p className="text-sm text-slate-600">kcal giornaliere</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">{dietPlan.targetMacros.fiber}g</p>
                <p className="text-sm text-slate-600">fibre (detox)</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="font-semibold text-blue-700">Proteine</p>
                <p className="font-bold text-lg">{dietPlan.targetMacros.protein}g</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <p className="font-semibold text-green-700">Carboidrati</p>
                <p className="font-bold text-lg">{dietPlan.targetMacros.carbs}g</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-2">
                <p className="font-semibold text-yellow-700">Grassi</p>
                <p className="font-bold text-lg">{dietPlan.targetMacros.fat}g</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Idratazione Scientifica */}
      {dietPlan?.dailyWaterIntake && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Droplets className="w-5 h-5" />
              <span>Idratazione Ottimale</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Assunzione Giornaliera</span>
              <Badge variant="outline" className="text-blue-700">
                {(dailyProgress.water / 1000).toFixed(1)} / {dietPlan.dailyWaterIntake} L
              </Badge>
            </div>
            <Progress 
              value={waterIntakePercentage} 
              className="h-3 mb-2"
            />
            <p className="text-xs text-slate-600">
              Calcolata su peso corporeo, attività fisica e stagione corrente
            </p>
          </CardContent>
        </Card>
      )}

      {/* Progressi Peso e Composizione Corporea */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Scale className="w-4 h-4" />
              <span>Peso Attuale</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-800">
              {userProfile.current_weight} kg
            </p>
            <div className="flex items-center space-x-1 text-xs">
              {weightProgress > 0 ? (
                <>
                  <TrendingDown className="w-3 h-3 text-green-500" />
                  <span className="text-green-600">-{weightProgress.toFixed(1)} kg</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3 text-blue-500" />
                  <span className="text-blue-600">Inizio percorso</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Target className="w-4 h-4" />
              <span>Obiettivo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-800">
              {userProfile.target_weight} kg
            </p>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-slate-600">
                Mancano {targetWeightProgress.toFixed(1)} kg
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra Progresso Generale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Progresso Complessivo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Verso l'obiettivo</span>
            <span className="text-sm text-slate-600">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <p className="text-xs text-slate-600">
            Basato su progressi scientificamente misurabili dal giorno 1
          </p>
        </CardContent>
      </Card>

      {/* Supplementi e Performance */}
      <Card className="border-2 border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <Zap className="w-5 h-5" />
            <span>Performance Oggi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-orange-700">
                {dailyProgress.supplements_taken}
              </p>
              <p className="text-xs text-slate-600">Supplementi assunti</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-700">
                {dailyProgress.workout_completed ? '✅' : '⏳'}
              </p>
              <p className="text-xs text-slate-600">Allenamento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScientificDashboard; 
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Target, Settings, Clock, TrendingDown, Scale, LogOut, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface UserProfileProps {
  userStats: {
    targetWater: number;
    targetCalories: number;
    currentWeight: number;
    startWeight: number;
    startDate: string;
  };
  onUpdateWeight: (weight: number) => void;
  weeklyProgress: Array<{ date: string; weight: number }>;
}

const UserProfile = ({ userStats, onUpdateWeight, weeklyProgress }: UserProfileProps) => {
  const { signOut, user, isNewUser, markProfileCompleted } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || 'Utente',
    age: 30,
    height: 173,
    currentWeight: 75,
    targetWeight: 70,
    activityLevel: 'moderate',
    intermittentFasting: true,
    lactoseIntolerant: false,
    goal: 'fat-loss',
    workoutDays: 3,
    experience: 'beginner'
  });

  const [isEditing, setIsEditing] = useState(isNewUser);
  const [newWeight, setNewWeight] = useState(userStats.currentWeight.toString());
  const [profileComplete, setProfileComplete] = useState(!isNewUser);

  // Aggiorna il profilo quando cambia l'utente
  useEffect(() => {
    if (user?.name) {
      setProfile(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, [user]);

  // Calcoli scientifici personalizzati
  const calculatePersonalizedMetrics = () => {
    // BMR Formula di Harris-Benedict rivista (2024)
    const bmr = (10 * profile.currentWeight) + (6.25 * profile.height) - (5 * profile.age) + 5;
    
    // TDEE con moltiplicatori aggiornati
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const tdee = bmr * (activityMultipliers[profile.activityLevel as keyof typeof activityMultipliers] || 1.55);
    
    // Deficit aggressivo personalizzato per obiettivo
    const deficitPercentage = {
      'fat-loss': 0.25,        // 25% deficit aggressivo
      'muscle-gain': -0.10,    // 10% surplus
      'maintenance': 0,        // Mantenimento
      'recomp': 0.15          // 15% deficit moderato
    }[profile.goal] || 0.25;
    
    const targetCalories = Math.round(tdee * (1 - deficitPercentage));
    
    // Proteine personalizzate per obiettivo e peso
    const proteinMultipliers = {
      'fat-loss': 2.8,         // 2.8g/kg per preservare massa
      'muscle-gain': 3.2,      // 3.2g/kg per crescita
      'maintenance': 2.0,      // 2.0g/kg mantenimento
      'recomp': 3.0           // 3.0g/kg ricomposizione
    };
    
    const proteinTarget = Math.round(profile.currentWeight * (proteinMultipliers[profile.goal as keyof typeof proteinMultipliers] || 2.8));
    
    // Grassi: 25-30% delle calorie per ormoni
    const fatTarget = Math.round((targetCalories * 0.28) / 9);
    
    // Carboidrati: resto delle calorie
    const carbTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);
    
    // Acqua personalizzata
    const waterTarget = Math.round((profile.currentWeight * 35) + (profile.workoutDays * 500));
    
    // Timing digiuno intermittente
    const fastingWindow = profile.intermittentFasting ? "16:8 (12:00-20:00)" : "Normale";
    
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories,
      proteinTarget,
      fatTarget,
      carbTarget,
      waterTarget,
      deficit: Math.round(tdee - targetCalories),
      fastingWindow,
      weightLossWeekly: Math.round((tdee - targetCalories) * 7 / 7700 * 100) / 100, // kg/settimana
      timeToGoal: Math.round((profile.currentWeight - profile.targetWeight) / (Math.abs(tdee - targetCalories) * 7 / 7700))
    };
  };

  const metrics = calculatePersonalizedMetrics();

  const handleSave = () => {
    // Validazione dati obbligatori
    if (!profile.age || profile.age < 16 || profile.age > 80) {
      alert('Inserisci un\'età valida (16-80 anni)');
      return;
    }
    
    if (!profile.height || profile.height < 140 || profile.height > 220) {
      alert('Inserisci un\'altezza valida (140-220 cm)');
      return;
    }
    
    if (!profile.currentWeight || profile.currentWeight < 40 || profile.currentWeight > 200) {
      alert('Inserisci un peso attuale valido (40-200 kg)');
      return;
    }
    
    if (!profile.targetWeight || profile.targetWeight < 40 || profile.targetWeight > 200) {
      alert('Inserisci un peso obiettivo valido (40-200 kg)');
      return;
    }

    setIsEditing(false);
    setProfileComplete(true);
    
    if (isNewUser) {
      markProfileCompleted();
      console.log('✅ Profilo nuovo utente completato:', profile);
      console.log('📊 Metriche calcolate:', metrics);
    }
    
    console.log('💾 Profilo salvato:', profile);
  };

  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    return (profile.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBodyFatEstimate = () => {
    const bmi = parseFloat(calculateBMI());
    const estimate = (1.39 * bmi) + (0.16 * profile.age) - 19.34;
    return Math.max(8, Math.min(25, estimate)).toFixed(1);
  };

  const getTotalWeightLoss = () => {
    return (userStats.startWeight - userStats.currentWeight).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: "Sottopeso", color: "text-blue-600" };
    if (bmi < 25) return { text: "Normale", color: "text-green-600" };
    if (bmi < 30) return { text: "Sovrappeso", color: "text-orange-600" };
    return { text: "Obeso", color: "text-red-600" };
  };

  const bmiCategory = getBMICategory(parseFloat(calculateBMI()));

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isNewUser ? '🎯 Setup Profilo Iniziale' : 'Profilo Utente'}
        </h2>
        <p className="text-slate-600">
          {isNewUser ? 'Configura i tuoi dati per personalizzazione scientifica' : 'Personalizzazione • Obiettivi • Progressi'}
        </p>
      </div>

      {/* Alert per nuovi utenti */}
      {isNewUser && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Setup obbligatorio:</strong> Inserisci i tuoi dati per calcoli scientifici personalizzati. 
            Dieta, allenamenti e supplementi si adatteranno automaticamente al tuo profilo.
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Overview */}
      <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{profile.name}</h3>
            <p className="text-sm opacity-90">{profile.age} anni • {profile.height}cm</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.currentWeight}</div>
            <div className="text-sm opacity-90">Peso attuale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.targetWeight}</div>
            <div className="text-sm opacity-90">Peso obiettivo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{calculateBMI()}</div>
            <div className="text-sm opacity-90">BMI</div>
          </div>
        </div>
      </Card>

      {/* Metriche Scientifiche Personalizzate */}
      {profileComplete && (
        <Card className="p-4 bg-emerald-50 border-emerald-200">
          <h3 className="font-semibold text-emerald-800 mb-3">🧬 Metriche Scientifiche Personalizzate</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-emerald-700">BMR (metabolismo base):</span>
                <span className="font-bold text-emerald-800">{metrics.bmr} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">TDEE (fabbisogno totale):</span>
                <span className="font-bold text-emerald-800">{metrics.tdee} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Target giornaliero:</span>
                <span className="font-bold text-emerald-800">{metrics.targetCalories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Deficit/Surplus:</span>
                <span className="font-bold text-emerald-800">{metrics.deficit > 0 ? '-' : '+'}{Math.abs(metrics.deficit)} kcal</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-emerald-700">Proteine:</span>
                <span className="font-bold text-emerald-800">{metrics.proteinTarget}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Grassi:</span>
                <span className="font-bold text-emerald-800">{metrics.fatTarget}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Carboidrati:</span>
                <span className="font-bold text-emerald-800">{metrics.carbTarget}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Acqua:</span>
                <span className="font-bold text-emerald-800">{metrics.waterTarget}ml</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="text-emerald-700 text-sm">Perdita peso prevista:</span>
              <Badge className="bg-emerald-600 hover:bg-emerald-700">
                {metrics.weightLossWeekly}kg/settimana
              </Badge>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-emerald-700 text-sm">Tempo per raggiungere obiettivo:</span>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                ~{metrics.timeToGoal} settimane
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Impostazioni Profilo */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <Settings className="w-4 h-4 mr-2 text-slate-600" />
            {isNewUser ? 'Configurazione Iniziale' : 'Impostazioni'}
          </h3>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={isNewUser ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-1" />
                {isNewUser ? 'Completa Setup' : 'Salva'}
              </>
            ) : 'Modifica'}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Dati Fisici */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 border-b pb-1">📊 Dati Fisici</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Età *</Label>
                <Input
                  id="age"
                  type="number"
                  min="16"
                  max="80"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                  disabled={!isEditing}
                  className={isNewUser && !profile.age ? "border-orange-300" : ""}
                />
              </div>
              <div>
                <Label htmlFor="height">Altezza (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  min="140"
                  max="220"
                  value={profile.height}
                  onChange={(e) => setProfile({...profile, height: parseInt(e.target.value) || 0})}
                  disabled={!isEditing}
                  className={isNewUser && !profile.height ? "border-orange-300" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentWeight">Peso attuale (kg) *</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  min="40"
                  max="200"
                  step="0.1"
                  value={profile.currentWeight}
                  onChange={(e) => setProfile({...profile, currentWeight: parseFloat(e.target.value) || 0})}
                  disabled={!isEditing}
                  className={isNewUser && !profile.currentWeight ? "border-orange-300" : ""}
                />
              </div>
              <div>
                <Label htmlFor="targetWeight">Peso obiettivo (kg) *</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  min="40"
                  max="200"
                  step="0.1"
                  value={profile.targetWeight}
                  onChange={(e) => setProfile({...profile, targetWeight: parseFloat(e.target.value) || 0})}
                  disabled={!isEditing}
                  className={isNewUser && !profile.targetWeight ? "border-orange-300" : ""}
                />
              </div>
            </div>
          </div>

          {/* Livello Attività */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 border-b pb-1">🏃‍♂️ Attività Fisica</h4>
            <div>
              <Label htmlFor="activity">Livello di attività *</Label>
              <Select
                value={profile.activityLevel}
                onValueChange={(value) => setProfile({...profile, activityLevel: value})}
                disabled={!isEditing}
              >
                <SelectTrigger className={isNewUser ? "border-orange-300" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentario (ufficio, nessun sport)</SelectItem>
                  <SelectItem value="light">Leggera (1-3 volte/settimana)</SelectItem>
                  <SelectItem value="moderate">Moderata (3-5 volte/settimana)</SelectItem>
                  <SelectItem value="active">Attiva (6-7 volte/settimana)</SelectItem>
                  <SelectItem value="very_active">Molto attiva (2 volte/giorno)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="workoutDays">Giorni allenamento/settimana</Label>
              <Input
                id="workoutDays"
                type="number"
                min="0"
                max="7"
                value={profile.workoutDays}
                onChange={(e) => setProfile({...profile, workoutDays: parseInt(e.target.value) || 0})}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Obiettivi */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 border-b pb-1">🎯 Obiettivi</h4>
            <div>
              <Label htmlFor="goal">Obiettivo principale *</Label>
              <Select
                value={profile.goal}
                onValueChange={(value) => setProfile({...profile, goal: value})}
                disabled={!isEditing}
              >
                <SelectTrigger className={isNewUser ? "border-orange-300" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fat-loss">Perdita di grasso (deficit 25%)</SelectItem>
                  <SelectItem value="muscle-gain">Aumento massa muscolare (surplus 10%)</SelectItem>
                  <SelectItem value="maintenance">Mantenimento peso</SelectItem>
                  <SelectItem value="recomp">Ricomposizione corporea (deficit 15%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experience">Esperienza allenamento</Label>
              <Select
                value={profile.experience}
                onValueChange={(value) => setProfile({...profile, experience: value})}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Principiante (&lt;1 anno)</SelectItem>
                  <SelectItem value="intermediate">Intermedio (1-3 anni)</SelectItem>
                  <SelectItem value="advanced">Avanzato (&gt;3 anni)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferenze Alimentari */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 border-b pb-1">🍽️ Preferenze Alimentari</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="intermittent-fasting" className="font-medium">Digiuno Intermittente 16:8</Label>
                  <p className="text-sm text-slate-500">Finestra alimentare: 12:00-20:00</p>
                </div>
                <Switch
                  id="intermittent-fasting"
                  checked={profile.intermittentFasting}
                  onCheckedChange={(checked) => setProfile({...profile, intermittentFasting: checked})}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="lactose-intolerant" className="font-medium">Intolleranza al Lattosio</Label>
                  <p className="text-sm text-slate-500">Esclude latticini dalle ricette</p>
                </div>
                <Switch
                  id="lactose-intolerant"
                  checked={profile.lactoseIntolerant}
                  onCheckedChange={(checked) => setProfile({...profile, lactoseIntolerant: checked})}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Composizione Corporea */}
      {profileComplete && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <TrendingDown className="w-4 h-4 mr-2 text-slate-600" />
            Composizione Corporea
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-slate-50 rounded-lg p-3">
              <div className={`text-lg font-bold ${bmiCategory.color}`}>{calculateBMI()}</div>
              <div className="text-sm text-slate-600">BMI - {bmiCategory.text}</div>
            </div>
            <div className="text-center bg-slate-50 rounded-lg p-3">
              <div className="text-lg font-bold text-orange-600">{getBodyFatEstimate()}%</div>
              <div className="text-sm text-slate-600">Grasso corporeo stimato</div>
            </div>
          </div>
        </Card>
      )}

      {/* Weight Update */}
      {profileComplete && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Scale className="w-4 h-4 mr-2 text-slate-600" />
            Aggiornamento Peso Giornaliero
          </h3>
          <div className="flex space-x-2">
            <Input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Inserisci peso (kg)"
              className="flex-1"
            />
            <Button onClick={() => {
              const weight = parseFloat(newWeight);
              if (weight > 0 && weight < 300) {
                onUpdateWeight(weight);
                setProfile({...profile, currentWeight: weight});
              }
            }}>
              Aggiorna
            </Button>
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </div>
        </Card>
      )}

      {/* Logout Section */}
      {profileComplete && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Disconnetti Account</h3>
              <p className="text-sm text-red-600">Uscire dall'applicazione</p>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={signOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;

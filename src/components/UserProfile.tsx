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
  onUpdateProfile: (profileData: Partial<any>) => void;
  weeklyProgress: Array<{ date: string; weight: number }>;
  currentProfile: any;
}

const UserProfile = ({ userStats, onUpdateWeight, onUpdateProfile, weeklyProgress, currentProfile }: UserProfileProps) => {
  const { signOut, user, isNewUser, markProfileCompleted } = useAuth();
  
  // Gestione sicura del profilo corrente e delle statistiche
  const safeCurrentProfile = currentProfile || {};
  const safeUserStats = userStats || {
    targetWater: 0, targetCalories: 0, currentWeight: 0, startWeight: 0, startDate: ''
  };

  const [profile, setProfile] = useState(() => {
    // Inizializza il profilo con i dati disponibili o con valori di fallback
    return {
      name: safeCurrentProfile.name || user?.email || 'Nuovo Utente',
      age: safeCurrentProfile.age || null,
      height: safeCurrentProfile.height || null,
      currentWeight: safeCurrentProfile.current_weight || safeUserStats.currentWeight || null,
      startWeight: safeCurrentProfile.start_weight || safeUserStats.startWeight || null,
      targetWeight: safeCurrentProfile.target_weight || null,
      activityLevel: safeCurrentProfile.activity_level || 'moderate',
      intermittentFasting: safeCurrentProfile.intermittent_fasting || false,
      lactoseIntolerant: safeCurrentProfile.lactose_intolerant || false,
      goal: safeCurrentProfile.goal || 'fat-loss',
      workoutDays: 3,
      experience: 'beginner'
    };
  });
  
  const [isEditing, setIsEditing] = useState(isNewUser);
  const [newWeight, setNewWeight] = useState(String(profile.currentWeight || ''));
  const [profileComplete, setProfileComplete] = useState(!isNewUser);

  // Forza la modalità di modifica se l'utente è nuovo
  useEffect(() => {
    if (isNewUser) {
      setIsEditing(true);
    }
  }, [isNewUser]);

  // Sincronizza lo stato del profilo quando i dati da `useAuth` cambiano
  useEffect(() => {
    if (currentProfile) {
      setProfile({
        name: currentProfile.name || user?.email || 'Nuovo Utente',
        age: currentProfile.age || null,
        height: currentProfile.height || null,
        currentWeight: currentProfile.current_weight || null,
        startWeight: currentProfile.start_weight || null,
        targetWeight: currentProfile.target_weight || null,
        activityLevel: currentProfile.activity_level || 'moderate',
        intermittentFasting: currentProfile.intermittent_fasting || false,
        lactoseIntolerant: currentProfile.lactose_intolerant || false,
        goal: currentProfile.goal || 'fat-loss',
        workoutDays: 3,
        experience: 'beginner'
      });
      setNewWeight(String(currentProfile.current_weight || ''));
    }
  }, [currentProfile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number | boolean = value;

    if (type === 'number') {
      finalValue = value === '' ? null : parseFloat(value);
    }
    
    if (e.target.type === 'checkbox') {
        finalValue = (e.target as HTMLInputElement).checked;
    }

    setProfile(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckedChange = (name: string, checked: boolean) => {
    setProfile(prev => ({ ...prev, [name]: checked }));
  };

  // Calcoli scientifici personalizzati
  const calculatePersonalizedMetrics = () => {
    // Utilizza 0 come fallback sicuro se i valori sono null o undefined
    const weight = profile.currentWeight || 0;
    const height = profile.height || 0;
    const age = profile.age || 0;
    const targetWeight = profile.targetWeight || 0;

    // Se i dati essenziali mancano, restituisci metriche vuote per evitare crash
    if (weight === 0 || height === 0 || age === 0) {
      return {
        bmr: 0,
        tdee: 0,
        targetCalories: 0,
        proteinTarget: 0,
        fatTarget: 0,
        carbTarget: 0,
        waterTarget: 0,
        deficit: 0,
        fastingWindow: "N/D",
        weightLossWeekly: 0,
        timeToGoal: "N/D"
      };
    }
    
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    
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
    
    const proteinTarget = Math.round(weight * (proteinMultipliers[profile.goal as keyof typeof proteinMultipliers] || 2.8));
    
    // Grassi: 25-30% delle calorie per ormoni
    const fatTarget = Math.round((targetCalories * 0.28) / 9);
    
    // Carboidrati: resto delle calorie
    const carbTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);
    
    // Acqua personalizzata
    const waterTarget = Math.round(weight * 35);
    
    // Timing digiuno intermittente
    const fastingWindow = profile.intermittentFasting ? "16/8" : "Normale";
    
    const weightToLose = weight - targetWeight;
    const deficit = Math.round(tdee - targetCalories);
    const weightLossWeekly = deficit > 0 ? (deficit * 7) / 7700 : 0;
    const timeToGoal = weightLossWeekly > 0 && weightToLose > 0 
      ? Math.ceil(weightToLose / weightLossWeekly) 
      : "N/D";

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories,
      proteinTarget,
      fatTarget,
      carbTarget,
      waterTarget,
      deficit,
      fastingWindow,
      weightLossWeekly: Number(weightLossWeekly.toFixed(1)),
      timeToGoal
    };
  };

  const metrics = calculatePersonalizedMetrics();

  const handleSave = () => {
    // Validazione dati obbligatori
    if (!profile.age || profile.age < 16 || profile.age > 80) {
      alert('❌ Età: Inserisci un valore valido tra 16 e 80 anni');
      return;
    }
    
    if (!profile.height || profile.height < 140 || profile.height > 220) {
      alert('❌ Altezza: Inserisci un valore valido tra 140 e 220 cm');
      return;
    }
    
    if (!profile.currentWeight || profile.currentWeight < 40 || profile.currentWeight > 200) {
      alert('❌ Peso attuale: Inserisci un valore valido tra 40 e 200 kg\n\nEsempio: 75.5 kg');
      return;
    }
    
    if (!profile.targetWeight || profile.targetWeight < 40 || profile.targetWeight > 200) {
      alert('❌ Peso obiettivo: Inserisci un valore valido tra 40 e 200 kg\n\nEsempio: 70.0 kg');
      return;
    }

    // Validazione logica pesi
    if (profile.goal === 'fat-loss' && profile.targetWeight >= profile.currentWeight) {
      alert('⚠️ Obiettivo Fat Loss: Il peso obiettivo deve essere inferiore al peso attuale');
      return;
    }
    
    if (profile.goal === 'muscle-gain' && profile.targetWeight <= profile.currentWeight) {
      alert('⚠️ Obiettivo Muscle Gain: Il peso obiettivo deve essere superiore al peso attuale');
      return;
    }

    setIsEditing(false);
    setProfileComplete(true);
    
    // Prepara i dati del profilo da salvare
    const profileToSave: any = {
      name: profile.name,
      age: profile.age,
      height: profile.height,
      currentWeight: profile.currentWeight,
      targetWeight: profile.targetWeight,
      activityLevel: profile.activityLevel,
      intermittentFasting: profile.intermittentFasting,
      lactoseIntolerant: profile.lactoseIntolerant,
      goal: profile.goal,
      targetCalories: metrics.targetCalories,
      targetWater: metrics.waterTarget,
      startWeight: profile.startWeight || profile.currentWeight, // Se non c'è, usa il peso attuale
      intermittent_fasting: profile.intermittentFasting,
      lactose_intolerant: profile.lactoseIntolerant,
      workoutDays: profile.workoutDays,
      experience: profile.experience
    };
    
    if (isNewUser) {
      // Per nuovi utenti, imposta startWeight = currentWeight (nessuna perdita iniziale)
      profileToSave.startWeight = profile.currentWeight;
      markProfileCompleted();
      console.log('✅ Profilo nuovo utente completato:', profileToSave);
    }
    
    // Salva il profilo usando la funzione passata dal parent
    console.log('🔄 Chiamata onUpdateProfile con dati:', profileToSave);
    onUpdateProfile(profileToSave);
    console.log('💾 Profilo salvato localmente:', profileToSave);
    console.log('📊 Metriche calcolate:', metrics);

    // Se il peso è stato aggiornato, chiama anche onUpdateWeight
    if (profile.currentWeight && profile.currentWeight !== (userStats?.currentWeight || 0)) {
      onUpdateWeight(profile.currentWeight);
    }
    
    if (markProfileCompleted) {
      markProfileCompleted();
    }
  };

  const calculateBMI = () => {
    if (!profile.height || !profile.currentWeight) return 0;
    const heightInMeters = profile.height / 100;
    return profile.currentWeight / (heightInMeters * heightInMeters);
  };

  const bmi = calculateBMI();

  const getBodyFatEstimate = () => {
    if (!profile.age || bmi === 0) return 0;
    // Formula semplificata per la stima del grasso corporeo (dipende dal sesso, qui usiamo una media)
    // Per una stima più accurata, sarebbero necessarie più misurazioni.
    // Uomo: (1.20 * BMI) + (0.23 * Età) - 16.2
    // Donna: (1.20 * BMI) + (0.23 * Età) - 5.4
    // Usiamo una versione media-semplificata, da considerare solo come stima grezza.
    return (1.20 * bmi) + (0.23 * profile.age) - 10.8;
  };

  const getTotalWeightLoss = () => {
    if (!profile.startWeight || !profile.currentWeight) return 0;
    return profile.startWeight - profile.currentWeight;
  };

  const hasRealProgress = () => {
    return weeklyProgress && weeklyProgress.length > 1;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: "Sottopeso", color: "text-blue-600" };
    if (bmi < 25) return { text: "Normale", color: "text-green-600" };
    if (bmi < 30) return { text: "Sovrappeso", color: "text-orange-600" };
    return { text: "Obeso", color: "text-red-600" };
  };

  const bmiCategory = getBMICategory(bmi);

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
            <div className="text-2xl font-bold">
              {profile.currentWeight ? profile.currentWeight : "---"}
            </div>
            <div className="text-sm opacity-90">Peso attuale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {profile.targetWeight ? profile.targetWeight : "---"}
            </div>
            <div className="text-sm opacity-90">Peso obiettivo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {profile.currentWeight && profile.height ? calculateBMI().toFixed(1) : "---"}
            </div>
            <div className="text-sm opacity-90">BMI</div>
          </div>
        </div>
      </Card>

      {/* Metriche Scientifiche Personalizzate */}
      {profileComplete && profile.currentWeight && profile.height && profile.age && (
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
                  value={profile.age === null || profile.age === 0 ? '' : profile.age}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isNewUser && !profile.age ? "border-orange-300" : ""}
                  placeholder="es. 25"
                />
              </div>
              <div>
                <Label htmlFor="height">Altezza (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  min="140"
                  max="220"
                  value={profile.height === null || profile.height === 0 ? '' : profile.height}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isNewUser && !profile.height ? "border-orange-300" : ""}
                  placeholder="es. 175"
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
                  value={profile.currentWeight === null || profile.currentWeight === 0 ? '' : profile.currentWeight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isNewUser && !profile.currentWeight ? "border-orange-300 bg-orange-50" : ""}
                  placeholder="es. 75.5"
                />
                {profile.currentWeight && (profile.currentWeight < 40 || profile.currentWeight > 200) && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Valore deve essere tra 40-200 kg</p>
                )}
              </div>
              <div>
                <Label htmlFor="targetWeight">Peso obiettivo (kg) *</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  min="40"
                  max="200"
                  step="0.1"
                  value={profile.targetWeight === null || profile.targetWeight === 0 ? '' : profile.targetWeight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isNewUser && !profile.targetWeight ? "border-orange-300 bg-orange-50" : ""}
                  placeholder="es. 70.0"
                />
                {profile.targetWeight && (profile.targetWeight < 40 || profile.targetWeight > 200) && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Valore deve essere tra 40-200 kg</p>
                )}
                {profile.currentWeight && profile.targetWeight && profile.goal === 'fat-loss' && profile.targetWeight >= profile.currentWeight && (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Per fat-loss deve essere inferiore al peso attuale</p>
                )}
                {profile.currentWeight && profile.targetWeight && profile.goal === 'muscle-gain' && profile.targetWeight <= profile.currentWeight && (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Per muscle-gain deve essere superiore al peso attuale</p>
                )}
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
                onValueChange={handleSelectChange.bind(null, 'activityLevel')}
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
                value={profile.workoutDays || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="es. 3"
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
                onValueChange={handleSelectChange.bind(null, 'goal')}
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
                onValueChange={handleSelectChange.bind(null, 'experience')}
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="intermittent-fasting"
                  checked={profile.intermittentFasting || false}
                  onCheckedChange={(checked) => handleCheckedChange('intermittentFasting', checked)}
                  disabled={!isEditing}
                />
                <Label htmlFor="intermittent-fasting">Digiuno Intermittente (16/8)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="lactose-intolerant"
                  checked={profile.lactoseIntolerant || false}
                  onCheckedChange={(checked) => handleCheckedChange('lactoseIntolerant', checked)}
                  disabled={!isEditing}
                />
                <Label htmlFor="lactose-intolerant">Intollerante al Lattosio</Label>
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
              <div className={`text-lg font-bold ${bmiCategory.color}`}>{bmi.toFixed(1)}</div>
              <div className="text-sm text-slate-600">BMI - {bmiCategory.text}</div>
            </div>
            <div className="text-center bg-slate-50 rounded-lg p-3">
              <div className="text-lg font-bold text-orange-600">{getBodyFatEstimate().toFixed(1)}%</div>
              <div className="text-sm text-slate-600">Grasso corporeo stimato</div>
            </div>
          </div>
          
          {/* Mostra statistiche progressi solo se ha dati reali */}
          {hasRealProgress() && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="font-medium text-slate-700 mb-3">📈 Progressi</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-green-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600">-{getTotalWeightLoss().toFixed(1)}kg</div>
                  <div className="text-sm text-slate-600">Peso perso</div>
                </div>
                <div className="text-center bg-blue-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-600">{weeklyProgress.length}</div>
                  <div className="text-sm text-slate-600">Giorni tracciati</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Messaggio per utenti nuovi */}
          {!hasRealProgress() && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="text-center bg-slate-50 rounded-lg p-4">
                <div className="text-slate-500 text-sm">
                  📊 Le statistiche di progresso appariranno quando inizierai a tracciare i tuoi cambiamenti di peso
                </div>
              </div>
            </div>
          )}
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

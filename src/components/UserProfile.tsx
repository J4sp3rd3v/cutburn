import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Target, Settings, Clock, TrendingDown, Scale, Save, AlertCircle } from 'lucide-react';
import { useProgressTracking, UserProfile as UserProfileType } from '@/hooks/useProgressTracking';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from './ui/use-toast';

const UserProfile = () => {
  const { userProfile, updateProfile, loading } = useProgressTracking();

  const [profile, setProfile] = useState<Partial<UserProfileType>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [userProfile]);
  
  if (loading || !userProfile || Object.keys(profile).length === 0) {
    return (
      <Card className="p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </Card>
    );
  }
  
  const handleInputChange = (fieldName: keyof UserProfileType, value: string) => {
    let finalValue: string | number | null = value;
    if (['age', 'height', 'current_weight', 'target_weight', 'workoutDays', 'body_fat_percentage'].includes(fieldName)) {
      finalValue = value === '' ? null : parseFloat(value);
      if (finalValue !== null && isNaN(finalValue)) {
        finalValue = profile[fieldName] as number | null;
      }
    }
    setProfile(prev => ({ ...prev, [fieldName]: finalValue }));
  };

  const handleSelectChange = (name: keyof UserProfileType, value: string) => {
    try {
      console.log(`🔄 Debug - Select cambiato: ${name} = ${value}`);
      
      // Gestione specifica per ogni tipo di campo
      if (name === 'gender') {
        setProfile(prev => ({ ...prev, gender: value as 'male' | 'female' }));
      } else if (name === 'activity_level') {
        setProfile(prev => ({ ...prev, activity_level: value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' }));
      } else if (name === 'goal') {
        setProfile(prev => ({ ...prev, goal: value as 'weight_loss' | 'muscle_gain' | 'maintenance' | 'targeted_fat_loss' }));
      } else {
        setProfile(prev => ({ ...prev, [name]: value }));
      }
      
      console.log(`✅ Debug - Select aggiornato con successo: ${name}`);
    } catch (error) {
      console.error(`❌ Errore nell'aggiornamento del Select ${name}:`, error);
      toast({ 
        title: 'Errore', 
        description: `Errore nell'aggiornamento del campo ${name}`, 
        variant: 'destructive' 
      });
    }
  };

  const handleCheckedChange = (name: keyof UserProfileType, checked: boolean) => {
    setProfile(prev => ({ ...prev, [name]: checked }));
  };

  const calculatePersonalizedMetrics = () => {
    const weight = profile.current_weight || 0;
    const height = profile.height || 0;
    const age = profile.age || 0;
    const targetWeight = profile.target_weight || 0;

    if (weight === 0 || height === 0 || age === 0) {
      return { bmr: 0, tdee: 0, targetCalories: 0, proteinTarget: 0, fatTarget: 0, carbTarget: 0, waterTarget: 0, deficit: 0, fastingWindow: "N/D", weightLossWeekly: 0, timeToGoal: "N/D" };
    }
    
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    const activityMultipliers: { [key: string]: number } = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = bmr * (activityMultipliers[profile.activity_level || 'moderate']);
    
    const deficitPercentage: { [key: string]: number } = { 'fat-loss': 0.25, 'muscle-gain': -0.10, 'maintenance': 0, 'recomp': 0.15 };
    const targetCalories = Math.round(tdee * (1 - (deficitPercentage[profile.goal || 'fat-loss'])));
    
    const proteinMultipliers: { [key: string]: number } = { 'fat-loss': 2.8, 'muscle-gain': 3.2, 'maintenance': 2.0, 'recomp': 3.0 };
    const proteinTarget = Math.round(weight * (proteinMultipliers[profile.goal || 'fat-loss']));
    
    const fatTarget = Math.round((targetCalories * 0.28) / 9);
    const carbTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);
    const waterTarget = Math.round(weight * 35);
    
    const weightToLose = weight - targetWeight;
    const deficit = Math.round(tdee - targetCalories);
    const weightLossWeekly = deficit > 0 ? (deficit * 7) / 7700 : 0;
    const timeToGoal = weightLossWeekly > 0 && weightToLose > 0 ? Math.ceil(weightToLose / weightLossWeekly) : "N/D";

    return { bmr: Math.round(bmr), tdee: Math.round(tdee), targetCalories, proteinTarget, fatTarget, carbTarget, waterTarget, deficit, timeToGoal, weightLossWeekly: Number(weightLossWeekly.toFixed(1)) };
  };

  const metrics = calculatePersonalizedMetrics();

  const handleSave = () => {
    console.log('🔍 Debug - Dati profilo prima del salvataggio:', profile);
    
    // Validazioni con messaggi più specifici
    if (!profile.age || profile.age < 16 || profile.age > 80) { 
      toast({ title: 'Errore', description: 'Età non valida (16-80 anni)', variant: 'destructive' }); 
      return; 
    }
    if (!profile.height || profile.height < 140 || profile.height > 220) { 
      toast({ title: 'Errore', description: 'Altezza non valida (140-220 cm)', variant: 'destructive' }); 
      return; 
    }
    if (!profile.current_weight || profile.current_weight < 40 || profile.current_weight > 200) { 
      toast({ title: 'Errore', description: 'Peso attuale non valido (40-200 kg)', variant: 'destructive' }); 
      return; 
    }
    if (!profile.target_weight || profile.target_weight < 40 || profile.target_weight > 200) { 
      toast({ title: 'Errore', description: 'Peso obiettivo non valido (40-200 kg)', variant: 'destructive' }); 
      return; 
    }
    if (!profile.gender) {
      toast({ title: 'Errore', description: 'Seleziona il sesso', variant: 'destructive' }); 
      return; 
    }
    if (!profile.activity_level) {
      toast({ title: 'Errore', description: 'Seleziona il livello di attività', variant: 'destructive' }); 
      return; 
    }
    if (!profile.goal) {
      toast({ title: 'Errore', description: 'Seleziona l\'obiettivo principale', variant: 'destructive' }); 
      return; 
    }

    const profileDataToSave: Partial<UserProfileType> = {
      ...profile,
      // Assicuriamoci che i campi Select siano inclusi esplicitamente
      gender: profile.gender,
      activity_level: profile.activity_level,
      goal: profile.goal,
      target_calories: metrics.targetCalories,
      target_protein: metrics.proteinTarget,
      target_carbs: metrics.carbTarget,
      target_fats: metrics.fatTarget,
      target_water: metrics.waterTarget,
      start_weight: userProfile.start_weight || profile.current_weight,
    };
    
    console.log('💾 Debug - Dati da salvare:', profileDataToSave);
    
    updateProfile(profileDataToSave);
    setIsEditing(false);
    toast({ title: 'Profilo Salvato', description: 'I tuoi dati sono stati aggiornati con successo!' });
  };

  const getTotalWeightLoss = () => {
    if (userProfile && userProfile.start_weight && userProfile.current_weight) {
      return (userProfile.start_weight - userProfile.current_weight).toFixed(1);
    }
    return '0.0';
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-white shadow-lg rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white">
                    <User size={32} />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{profile.name}</h1>
                    <p className="text-sm text-slate-500">{userProfile.email}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" /> Modifica
                    </Button>
                ) : (
                    <Button onClick={handleSave} size="sm">
                        <Save className="mr-2 h-4 w-4" /> Salva
                    </Button>
                )}
            </div>
        </div>

        {!isEditing ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-500 text-sm">Peso Attuale</h3>
                    <p className="text-2xl font-bold text-slate-800">{userProfile.current_weight} <span className="text-base font-normal">kg</span></p>
                </div>
                 <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-500 text-sm">Perdita Totale</h3>
                    <p className="text-2xl font-bold text-green-600">{getTotalWeightLoss()} <span className="text-base font-normal">kg</span></p>
                </div>
                 <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-500 text-sm">Calorie Target</h3>
                     <p className="text-2xl font-bold text-slate-800">{userProfile.target_calories || 0}</p>
                </div>
                 <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-500 text-sm">Acqua Target</h3>
                     <p className="text-2xl font-bold text-slate-800">{userProfile.target_water || 0} <span className="text-base font-normal">ml</span></p>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2 font-bold text-lg text-slate-700">Dati Personali</div>
                <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" value={profile.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="age">Età</Label>
                    <Input id="age" type="number" value={profile.age || ''} onChange={(e) => handleInputChange('age', e.target.value)} />
                </div>
                <div>
                    <Label>Sesso</Label>
                    <div className="flex space-x-2 mt-2">
                        <Button
                            type="button"
                            variant={profile.gender === 'male' ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => {
                                console.log('🔄 Debug - Gender button clicked: male');
                                setProfile(prev => ({ ...prev, gender: 'male' }));
                            }}
                        >
                            Maschio
                        </Button>
                        <Button
                            type="button"
                            variant={profile.gender === 'female' ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => {
                                console.log('🔄 Debug - Gender button clicked: female');
                                setProfile(prev => ({ ...prev, gender: 'female' }));
                            }}
                        >
                            Femmina
                        </Button>
                    </div>
                </div>
                <div>
                    <Label htmlFor="height">Altezza (cm)</Label>
                    <Input id="height" type="number" value={profile.height || ''} onChange={(e) => handleInputChange('height', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="current_weight">Peso Attuale (kg)</Label>
                    <Input id="current_weight" type="number" step="0.1" value={profile.current_weight || ''} onChange={(e) => handleInputChange('current_weight', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="body_fat_percentage">% Grasso Corporeo (opzionale)</Label>
                    <Input id="body_fat_percentage" type="number" step="0.1" placeholder="es. 15.5" value={profile.body_fat_percentage || ''} onChange={(e) => handleInputChange('body_fat_percentage', e.target.value)} />
                </div>
                
                <div className="md:col-span-2 font-bold text-lg text-slate-700 pt-4">Obiettivi e Stile di Vita</div>
                <div>
                    <Label htmlFor="target_weight">Peso Obiettivo (kg)</Label>
                    <Input id="target_weight" type="number" step="0.1" value={profile.target_weight || ''} onChange={(e) => handleInputChange('target_weight', e.target.value)} />
                </div>
                <div>
                    <Label>Obiettivo Principale</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                            { value: 'weight_loss', label: 'Perdita Peso' },
                            { value: 'targeted_fat_loss', label: 'Grasso Localizzato' },
                            { value: 'muscle_gain', label: 'Aumento Muscolare' },
                            { value: 'maintenance', label: 'Mantenimento' }
                        ].map((option) => (
                            <Button
                                key={option.value}
                                type="button"
                                variant={profile.goal === option.value ? 'default' : 'outline'}
                                className="text-sm"
                                onClick={() => {
                                    console.log(`🔄 Debug - Goal button clicked: ${option.value}`);
                                    setProfile(prev => ({ ...prev, goal: option.value as any }));
                                }}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                </div>
                <div>
                    <Label>Livello Attività Fisica</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        {[
                            { value: 'sedentary', label: 'Sedentario (ufficio)' },
                            { value: 'light', label: 'Leggero (1-2 gg/sett)' },
                            { value: 'moderate', label: 'Moderato (3-5 gg/sett)' },
                            { value: 'active', label: 'Attivo (6-7 gg/sett)' },
                            { value: 'very_active', label: 'Molto Attivo (lavoro fisico)' }
                        ].map((option) => (
                            <Button
                                key={option.value}
                                type="button"
                                variant={profile.activity_level === option.value ? 'default' : 'outline'}
                                className="justify-start text-sm"
                                onClick={() => {
                                    console.log(`🔄 Debug - Activity button clicked: ${option.value}`);
                                    setProfile(prev => ({ ...prev, activity_level: option.value as any }));
                                }}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                </div>
                 <div className="md:col-span-2 flex flex-col space-y-2 pt-4">
                     <div className="flex items-center space-x-2">
                        <Switch id="intermittent_fasting" checked={profile.intermittent_fasting || false} onCheckedChange={(c) => handleCheckedChange('intermittent_fasting', c)} />
                        <Label htmlFor="intermittent_fasting">Seguo il Digiuno Intermittente (16/8)</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="lactose_intolerant" checked={profile.lactose_intolerant || false} onCheckedChange={(c) => handleCheckedChange('lactose_intolerant', c)} />
                        <Label htmlFor="lactose_intolerant">Sono Intollerante al Lattosio</Label>
                    </div>
                </div>
            </div>
        )}
    </Card>
  );
};

export default UserProfile;

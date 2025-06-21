import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Target, Settings, Clock, TrendingDown, Scale, LogOut } from 'lucide-react';
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
  const { signOut, user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || 'Utente',
    age: 30,
    height: 173,
    activityLevel: 'moderate',
    intermittentFasting: true,
    lactoseIntolerant: true,
    goal: 'fat-loss'
  });

  // Aggiorna il profilo quando cambia l'utente
  useEffect(() => {
    if (user?.name) {
      setProfile(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [newWeight, setNewWeight] = useState(userStats.currentWeight.toString());

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profile);
  };

  const handleWeightUpdate = () => {
    const weight = parseFloat(newWeight);
    if (weight > 0 && weight < 300) {
      onUpdateWeight(weight);
    }
  };

  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    return (userStats.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBodyFatEstimate = () => {
    const bmi = parseFloat(calculateBMI());
    const estimate = (1.39 * bmi) + (0.16 * profile.age) - 19.34;
    return Math.max(8, Math.min(25, estimate)).toFixed(1);
  };

  const getTotalWeightLoss = () => {
    return (userStats.startWeight - userStats.currentWeight).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Profilo Utente
        </h2>
        <p className="text-slate-600">
          Personalizzazione • Obiettivi • Progressi
        </p>
      </div>

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
            <div className="text-2xl font-bold">{userStats.currentWeight}</div>
            <div className="text-sm opacity-90">Peso attuale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.startWeight}</div>
            <div className="text-sm opacity-90">Peso iniziale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{calculateBMI()}</div>
            <div className="text-sm opacity-90">BMI</div>
          </div>
        </div>
      </Card>

      {/* Weight Update */}
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
          <Button onClick={handleWeightUpdate}>
            Aggiorna
          </Button>
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
        </div>
      </Card>

      {/* Progress Summary */}
      <Card className="p-4 bg-emerald-50 border-emerald-200">
        <h3 className="font-semibold text-emerald-800 mb-3">🎯 Risultati Ottenuti</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              -{getTotalWeightLoss()}kg
            </div>
            <div className="text-sm text-emerald-700">Persi in totale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {Math.ceil((new Date().getTime() - new Date(userStats.startDate).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-emerald-700">Giorni di percorso</div>
          </div>
        </div>
      </Card>

      {/* Body Composition */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <TrendingDown className="w-4 h-4 mr-2 text-slate-600" />
          Composizione Corporea
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center bg-slate-50 rounded-lg p-3">
            <div className="text-lg font-bold text-orange-600">{getBodyFatEstimate()}%</div>
            <div className="text-sm text-slate-600">Grasso corporeo stimato</div>
          </div>
          <div className="text-center bg-slate-50 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">
              {(userStats.currentWeight * (1 - parseFloat(getBodyFatEstimate()) / 100)).toFixed(1)}kg
            </div>
            <div className="text-sm text-slate-600">Massa magra</div>
          </div>
        </div>
      </Card>

      {/* Weekly Progress Chart */}
      {weeklyProgress.length > 1 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">📈 Andamento Peso (Ultimi 7 giorni)</h3>
          <div className="space-y-2">
            {weeklyProgress.slice(-7).map((day, index) => (
              <div key={day.date} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  {new Date(day.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' })}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{day.weight}kg</span>
                  {index > 0 && (
                    <Badge 
                      variant={day.weight < weeklyProgress[weeklyProgress.length - index - 1]?.weight ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {day.weight < weeklyProgress[weeklyProgress.length - index - 1]?.weight ? '↓' : '↑'}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Settings */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <Settings className="w-4 h-4 mr-2 text-slate-600" />
            Impostazioni
          </h3>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Salva' : 'Modifica'}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Altezza (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({...profile, height: parseInt(e.target.value)})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="age">Età</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <Label htmlFor="activity">Livello di attività</Label>
            <Select
              value={profile.activityLevel}
              onValueChange={(value) => setProfile({...profile, activityLevel: value})}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentario (ufficio)</SelectItem>
                <SelectItem value="light">Leggera (1-3 volte/settimana)</SelectItem>
                <SelectItem value="moderate">Moderata (3-5 volte/settimana)</SelectItem>
                <SelectItem value="active">Attiva (6-7 volte/settimana)</SelectItem>
                <SelectItem value="very-active">Molto attiva (2 volte/giorno)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Goals */}
          <div>
            <Label htmlFor="goal">Obiettivo principale</Label>
            <Select
              value={profile.goal}
              onValueChange={(value) => setProfile({...profile, goal: value})}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fat-loss">Perdita di grasso</SelectItem>
                <SelectItem value="muscle-gain">Aumento massa muscolare</SelectItem>
                <SelectItem value="maintenance">Mantenimento</SelectItem>
                <SelectItem value="recomp">Ricomposizione corporea</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preferences */}
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
      </Card>

      {/* Progress Tracking */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2 text-slate-600" />
          Progressi Recenti
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Peso questa settimana</span>
            <Badge variant="outline" className="text-green-600">
              -0.2kg
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Allenamenti completati</span>
            <Badge variant="outline">
              4/5
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Giorni di dieta</span>
            <Badge variant="outline">
              12/14
            </Badge>
          </div>
        </div>
      </Card>

      {/* Scientific Approach */}
      <Card className="p-4 bg-emerald-50 border-emerald-200">
        <h3 className="font-semibold text-emerald-800 mb-2">🎯 Approccio Scientifico</h3>
        <div className="text-sm text-emerald-700 space-y-1">
          <p>• <strong>Deficit calorico:</strong> {userStats.targetCalories} kcal/giorno ottimale</p>
          <p>• <strong>Idratazione:</strong> {userStats.targetWater}ml per metabolismo ottimale</p>
          <p>• <strong>Tracking:</strong> Peso giornaliero per monitoraggio preciso</p>
          <p>• <strong>Shot timing:</strong> Basato su cronobiologia per massimi benefici</p>
        </div>
      </Card>

      {/* Logout Section */}
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
    </div>
  );
};

export default UserProfile;


import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Target, Settings, Clock, TrendingDown } from 'lucide-react';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Marco',
    age: 30,
    height: 173,
    currentWeight: 69,
    targetWeight: 65,
    activityLevel: 'moderate',
    intermittentFasting: true,
    lactoseIntolerant: true,
    goal: 'fat-loss'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend/storage
    console.log('Profile saved:', profile);
  };

  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    return (profile.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBodyFatEstimate = () => {
    // Simple estimation based on BMI and age for males
    const bmi = parseFloat(calculateBMI());
    const estimate = (1.39 * bmi) + (0.16 * profile.age) - 19.34;
    return Math.max(8, Math.min(25, estimate)).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Profilo Utente
        </h2>
        <p className="text-slate-600">
          Personalizzazione • Obiettivi • Preferenze
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
            <div className="text-2xl font-bold">{profile.currentWeight}</div>
            <div className="text-sm opacity-90">Peso attuale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.targetWeight}</div>
            <div className="text-sm opacity-90">Obiettivo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{calculateBMI()}</div>
            <div className="text-sm opacity-90">BMI</div>
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
              {(profile.currentWeight * (1 - parseFloat(getBodyFatEstimate()) / 100)).toFixed(1)}kg
            </div>
            <div className="text-sm text-slate-600">Massa magra</div>
          </div>
        </div>
      </Card>

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
              <Label htmlFor="weight">Peso attuale (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={profile.currentWeight}
                onChange={(e) => setProfile({...profile, currentWeight: parseInt(e.target.value)})}
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
          <p>• <strong>Deficit calorico:</strong> 500 kcal/giorno per -0.5kg/settimana</p>
          <p>• <strong>Proteine:</strong> 1.8g/kg (mantenimento massa magra)</p>
          <p>• <strong>Allenamento:</strong> 3-4x/settimana per stimolo anabolico</p>
          <p>• <strong>Idratazione:</strong> 35ml/kg peso corporeo</p>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;

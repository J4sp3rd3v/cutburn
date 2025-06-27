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
  const { userProfile, updateProfile } = useProgressTracking();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Il Tuo Profilo</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Dati Base */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={userProfile?.weight || ''}
                  onChange={(e) => updateProfile({ weight: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="height">Altezza (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={userProfile?.height || ''}
                  onChange={(e) => updateProfile({ height: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Età</Label>
                <Input
                  id="age"
                  type="number"
                  value={userProfile?.age || ''}
                  onChange={(e) => updateProfile({ age: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="gender">Genere</Label>
                <Select
                  value={userProfile?.gender || 'male'}
                  onValueChange={(value) => updateProfile({ gender: value as 'male' | 'female' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona genere" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Uomo</SelectItem>
                    <SelectItem value="female">Donna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="activityLevel">Livello di Attività</Label>
              <Select
                value={userProfile?.activityLevel || 'moderate'}
                onValueChange={(value) => updateProfile({ activityLevel: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona livello di attività" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentario</SelectItem>
                  <SelectItem value="light">Leggermente Attivo</SelectItem>
                  <SelectItem value="moderate">Moderatamente Attivo</SelectItem>
                  <SelectItem value="active">Molto Attivo</SelectItem>
                  <SelectItem value="very_active">Estremamente Attivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="goal">Obiettivo</Label>
              <Select
                value={userProfile?.goal || 'fat_loss'}
                onValueChange={(value) => updateProfile({ goal: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona obiettivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fat_loss">Perdita di Grasso</SelectItem>
                  <SelectItem value="muscle_gain">Aumento Massa Muscolare</SelectItem>
                  <SelectItem value="maintenance">Mantenimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Aree Problematiche */}
          <div className="space-y-4">
            <h3 className="font-semibold">Aree Problematiche</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chest"
                  checked={userProfile?.problemAreas?.chest}
                  onCheckedChange={(checked) => 
                    updateProfile({ 
                      problemAreas: { 
                        ...userProfile?.problemAreas, 
                        chest: checked as boolean 
                      } 
                    })
                  }
                />
                <Label htmlFor="chest">Petto (Ginecomastia)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="abdomen"
                  checked={userProfile?.problemAreas?.abdomen}
                  onCheckedChange={(checked) => 
                    updateProfile({ 
                      problemAreas: { 
                        ...userProfile?.problemAreas, 
                        abdomen: checked as boolean 
                      } 
                    })
                  }
                />
                <Label htmlFor="abdomen">Addome (Grasso Viscerale)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hips"
                  checked={userProfile?.problemAreas?.hips}
                  onCheckedChange={(checked) => 
                    updateProfile({ 
                      problemAreas: { 
                        ...userProfile?.problemAreas, 
                        hips: checked as boolean 
                      } 
                    })
                  }
                />
                <Label htmlFor="hips">Fianchi</Label>
              </div>
            </div>
          </div>

          {/* Preferenze Alimentari */}
          <div className="space-y-4">
            <h3 className="font-semibold">Preferenze Alimentari</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vegan"
                  checked={userProfile?.dietaryPreferences?.vegan}
                  onCheckedChange={(checked) => 
                    updateProfile({ 
                      dietaryPreferences: { 
                        ...userProfile?.dietaryPreferences, 
                        vegan: checked as boolean 
                      } 
                    })
                  }
                />
                <Label htmlFor="vegan">Vegano</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vegetarian"
                  checked={userProfile?.dietaryPreferences?.vegetarian}
                  onCheckedChange={(checked) => 
                    updateProfile({ 
                      dietaryPreferences: { 
                        ...userProfile?.dietaryPreferences, 
                        vegetarian: checked as boolean 
                      } 
                    })
                  }
                />
                <Label htmlFor="vegetarian">Vegetariano</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="keto"
                  checked={userProfile?.dietaryPreferences?.keto}
                  onCheckedChange={(checked) => 
                    updateProfile({ 
                      dietaryPreferences: { 
                        ...userProfile?.dietaryPreferences, 
                        keto: checked as boolean 
                      } 
                    })
                  }
                />
                <Label htmlFor="keto">Chetogenico</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mediterranean"
                  checked={userProfile?.dietaryPreferences?.mediterranean}
                  onCheckedChange={(checked) => 
                    updateProfile({ 
                      dietaryPreferences: { 
                        ...userProfile?.dietaryPreferences, 
                        mediterranean: checked as boolean 
                      } 
                    })
                  }
                />
                <Label htmlFor="mediterranean">Mediterraneo</Label>
              </div>
            </div>
          </div>

          {/* Profilo Metabolico */}
          <div className="space-y-4">
            <h3 className="font-semibold">Profilo Metabolico</h3>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insulinSensitive"
                  checked={userProfile?.metabolicProfile?.insulinSensitive}
                  onCheckedChange={(checked) => 
                    updateProfile({ 
                      metabolicProfile: { 
                        ...userProfile?.metabolicProfile, 
                        insulinSensitive: checked as boolean 
                      } 
                    })
                  }
                />
                <Label htmlFor="insulinSensitive">Sensibile all'Insulina</Label>
              </div>

              <div>
                <Label htmlFor="stressLevel">Livello di Stress</Label>
                <Select
                  value={userProfile?.metabolicProfile?.stressLevel || 'moderate'}
                  onValueChange={(value) => 
                    updateProfile({ 
                      metabolicProfile: { 
                        ...userProfile?.metabolicProfile, 
                        stressLevel: value as 'low' | 'moderate' | 'high' 
                      } 
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona livello di stress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basso</SelectItem>
                    <SelectItem value="moderate">Moderato</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sleepQuality">Qualità del Sonno</Label>
                <Select
                  value={userProfile?.metabolicProfile?.sleepQuality || 'moderate'}
                  onValueChange={(value) => 
                    updateProfile({ 
                      metabolicProfile: { 
                        ...userProfile?.metabolicProfile, 
                        sleepQuality: value as 'poor' | 'moderate' | 'good' 
                      } 
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona qualità del sonno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Scarsa</SelectItem>
                    <SelectItem value="moderate">Moderata</SelectItem>
                    <SelectItem value="good">Buona</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="digestion">Digestione</Label>
                <Select
                  value={userProfile?.metabolicProfile?.digestion || 'moderate'}
                  onValueChange={(value) => 
                    updateProfile({ 
                      metabolicProfile: { 
                        ...userProfile?.metabolicProfile, 
                        digestion: value as 'poor' | 'moderate' | 'good' 
                      } 
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona qualità della digestione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Scarsa</SelectItem>
                    <SelectItem value="moderate">Moderata</SelectItem>
                    <SelectItem value="good">Buona</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfile;

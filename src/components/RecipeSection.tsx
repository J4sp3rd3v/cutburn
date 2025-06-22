import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, Users, Flame, Timer, Dna, Brain, Activity, Leaf, Zap, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface UserProfile {
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  activityLevel: string;
  goal: string;
}

interface RecipeSectionProps {
  userProfile: UserProfile;
}

const RecipeSection: React.FC<RecipeSectionProps> = ({ userProfile }) => {
  const [selectedCycleDay, setSelectedCycleDay] = useState(0);

  const getCurrentCycleDay = () => {
    const startDate = new Date('2024-01-01');
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceStart % 14;
  };

  const currentCycleDay = getCurrentCycleDay();

  const getCycleDayProtocols = (day: number) => {
    const isLowCarbDay = [2, 4, 6, 9, 11, 13].includes(day);
    const isHighProteinDay = [0, 1, 7, 8].includes(day);
    const isKetogenicDay = [5, 12].includes(day);
    const isFastingDay = [3, 10].includes(day);
    
    return {
      isLowCarbDay,
      isHighProteinDay,
      isKetogenicDay,
      isFastingDay,
      theme: isFastingDay ? "OMAD Autofagia" : 
             isKetogenicDay ? "Ketosi Profonda" : 
             isLowCarbDay ? "Deplezione Carbs" : 
             isHighProteinDay ? "Anabolico Pro" : "Equilibrio"
    };
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          👨‍🍳 Ricettario Body Recomp Science
        </h2>
        <div className="flex items-center justify-center space-x-2 text-sm mb-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Dna className="w-3 h-3" />
            <span>Piano 14 Giorni</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <ChefHat className="w-3 h-3" />
            <span>Ricette Scientifiche</span>
          </Badge>
        </div>
      </div>

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCycleDay(selectedCycleDay === 0 ? 13 : selectedCycleDay - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Precedente</span>
          </Button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">
              Giorno {selectedCycleDay + 1}/14
            </h3>
            <Badge variant={selectedCycleDay === currentCycleDay ? "default" : "outline"} 
                   className={selectedCycleDay === currentCycleDay ? "bg-green-500" : ""}>
              {selectedCycleDay === currentCycleDay ? "OGGI" : `Giorno ${selectedCycleDay + 1}`}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCycleDay(selectedCycleDay === 13 ? 0 : selectedCycleDay + 1)}
          >
            <span>Successivo</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Piano Ricette Giorno {selectedCycleDay + 1}</h3>
        <p className="text-slate-600">
          🚧 Sezione in sviluppo - Ricette scientifiche complete in arrivo! 
          Il sistema di base è già funzionante nella sezione Dieta.
        </p>
      </Card>
    </div>
  );
};

export default RecipeSection;

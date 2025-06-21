
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, CheckCircle } from 'lucide-react';

interface Shot {
  id: string;
  name: string;
  time: string;
  benefits: string;
  ingredients: string;
  taken: boolean;
}

interface DailyShotsProps {
  shotsConsumed: string[];
  onTakeShot: (shotId: string) => void;
  userWeight: number;
}

const DailyShots = ({ shotsConsumed, onTakeShot, userWeight }: DailyShotsProps) => {
  // Calculate personalized dosages based on user weight
  const getPersonalizedIngredients = (baseIngredients: string, shotId: string) => {
    const gingerDose = Math.round(userWeight * 0.07); // 0.07g per kg
    const turmericDose = Math.round(userWeight * 0.05); // 0.05g per kg
    
    switch (shotId) {
      case 'morning-ginger':
        return `Zenzero fresco (${gingerDose}g) + Limone + Pepe nero`;
      case 'evening-turmeric':
        return `Curcuma fresca (${turmericDose}g) + Zenzero (${Math.round(gingerDose * 0.7)}g) + Pepe nero + Miele`;
      default:
        return baseIngredients;
    }
  };

  const shots: Shot[] = [
    {
      id: 'morning-ginger',
      name: 'Shot Zenzero Mattutino',
      time: '07:00-08:00',
      benefits: 'Attivazione metabolismo, termogenesi, digestione',
      ingredients: getPersonalizedIngredients('Zenzero fresco + Limone + Pepe nero', 'morning-ginger'),
      taken: shotsConsumed.includes('morning-ginger')
    },
    {
      id: 'pre-workout-green',
      name: 'Shot Verde Pre-Workout',
      time: '30 min prima allenamento',
      benefits: 'Energia naturale, ossidazione grassi',
      ingredients: 'Spirulina (3g) + Matcha (2g) + Lime + Zenzero (2g)',
      taken: shotsConsumed.includes('pre-workout-green')
    },
    {
      id: 'evening-turmeric',
      name: 'Shot Curcuma Serale',
      time: '19:00-20:00',
      benefits: 'Antinfiammatorio, recupero muscolare',
      ingredients: getPersonalizedIngredients('Curcuma fresca + Zenzero + Pepe nero + Miele', 'evening-turmeric'),
      taken: shotsConsumed.includes('evening-turmeric')
    }
  ];

  const getCurrentTimeShot = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour >= 7 && currentHour <= 8) return 'morning-ginger';
    if (currentHour >= 15 && currentHour <= 16) return 'pre-workout-green';
    if (currentHour >= 19 && currentHour <= 20) return 'evening-turmeric';
    return null;
  };

  const currentOptimalShot = getCurrentTimeShot();

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 mb-3">
        <Zap className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-slate-800">Shot Quotidiani</h3>
        <Badge variant="outline">
          {shotsConsumed.length}/3
        </Badge>
      </div>

      {shots.map((shot) => (
        <Card 
          key={shot.id}
          className={`p-3 transition-all duration-200 ${
            shot.taken 
              ? 'bg-green-50 border-green-200' 
              : currentOptimalShot === shot.id
                ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-100'
                : 'bg-white/70'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-slate-800">{shot.name}</h4>
                {currentOptimalShot === shot.id && !shot.taken && (
                  <Badge variant="default" className="text-xs">
                    💫 Momento ottimale
                  </Badge>
                )}
                {shot.taken && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-600">{shot.time}</span>
              </div>
              
              <p className="text-xs text-slate-600 mb-1">
                <strong>Benefici:</strong> {shot.benefits}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Ingredienti:</strong> {shot.ingredients}
              </p>
            </div>
            
            <Button
              size="sm"
              variant={shot.taken ? "outline" : "default"}
              onClick={() => onTakeShot(shot.id)}
              disabled={shot.taken}
              className="ml-3"
            >
              {shot.taken ? '✓ Preso' : 'Prendi'}
            </Button>
          </div>
        </Card>
      ))}

      {currentOptimalShot && (
        <Card className="p-3 bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-200">
          <div className="text-sm text-orange-800">
            <strong>💫 Timing Perfetto:</strong> Questo è il momento ottimale per il tuo shot basato su studi circadiani!
          </div>
        </Card>
      )}
    </div>
  );
};

export default DailyShots;

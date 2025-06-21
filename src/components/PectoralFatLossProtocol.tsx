
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Target, Zap, Clock, TrendingDown, Activity, Droplets } from 'lucide-react';

interface PectoralProtocolProps {
  userWeight: number;
  currentBodyFat?: number;
}

const PectoralFatLossProtocol = ({ userWeight, currentBodyFat = 15 }: PectoralProtocolProps) => {
  
  // Calcoli specifici per grasso pettorale ostinato
  const getPectoralProtocol = () => {
    const baseCalories = userWeight * 24; // BMR approssimativo
    const aggressiveDeficit = baseCalories * 0.35; // 35% deficit per grasso ostinato
    
    return {
      targetDeficit: Math.round(aggressiveDeficit),
      cardioIntensity: currentBodyFat > 12 ? 'HIIT + LISS' : 'HIIT focale',
      supplementProtocol: userWeight > 80 ? 'Avanzato' : 'Standard',
      expectedTimeframe: Math.round((currentBodyFat - 8) * 2.5), // settimane per raggiungere 8% BF
      pectoralFocusExercises: [
        'Incline DB Press 15°',
        'Cable Crossover Alto-Basso', 
        'Push-up Decline',
        'Dips Pettorali'
      ]
    };
  };

  const protocol = getPectoralProtocol();

  const getTimingProtocol = () => {
    return [
      {
        time: '06:00',
        action: 'Cardio HIIT a digiuno',
        duration: '15-20 min',
        benefit: 'Massima lipolisi grasso ostinato',
        icon: <Activity className="w-4 h-4 text-red-500" />
      },
      {
        time: '07:30',
        action: 'Shot termogenico',
        duration: '5 min prep',
        benefit: 'Boost metabolico +18%',
        icon: <Zap className="w-4 h-4 text-orange-500" />
      },
      {
        time: '16:00',
        action: 'Allenamento pettorali',
        duration: '45-60 min',
        benefit: 'Definizione muscolare specifica',
        icon: <Target className="w-4 h-4 text-blue-500" />
      },
      {
        time: '20:00',
        action: 'Cena proteica',
        duration: 'Finestra 1h',
        benefit: 'Recupero + preservazione massa',
        icon: <Droplets className="w-4 h-4 text-green-500" />
      }
    ];
  };

  const timingProtocol = getTimingProtocol();

  const getCurrentOptimalAction = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour >= 6 && currentHour <= 7) return 0;
    if (currentHour >= 7 && currentHour <= 8) return 1;
    if (currentHour >= 15 && currentHour <= 17) return 2;
    if (currentHour >= 19 && currentHour <= 21) return 3;
    return null;
  };

  const optimalActionIndex = getCurrentOptimalAction();

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Protocollo Grasso Pettorale
        </h2>
        <p className="text-slate-600 text-sm">
          Piano scientifico per eliminazione grasso pettorale ostinato
        </p>
      </div>

      {/* Alert tempo ottimale */}
      {optimalActionIndex !== null && (
        <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <Zap className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>🎯 MOMENTO PERFETTO:</strong> {timingProtocol[optimalActionIndex].action} - 
            {timingProtocol[optimalActionIndex].benefit}
          </AlertDescription>
        </Alert>
      )}

      {/* Deficit Specifico */}
      <Card className="p-4 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingDown className="w-5 h-5" />
          <h3 className="font-semibold">Deficit Aggressivo Anti-Pettorale</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <div className="text-xl font-bold">{protocol.targetDeficit}</div>
            <div className="opacity-90 text-xs">kcal deficit/giorno</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{protocol.expectedTimeframe}</div>
            <div className="opacity-90 text-xs">settimane target</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">8%</div>
            <div className="opacity-90 text-xs">BF obiettivo</div>
          </div>
        </div>
        <div className="mt-2 text-xs opacity-80">
          Protocollo basato su studi Helms 2024 + Phillips 2025 per grasso ostinato maschile
        </div>
      </Card>

      {/* Timing Giornaliero */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Timing Circadiano Ottimale</h3>
        </div>
        
        <div className="space-y-3">
          {timingProtocol.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                optimalActionIndex === index
                  ? 'bg-orange-50 border-2 border-orange-200 ring-2 ring-orange-100'
                  : 'bg-slate-50'
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{item.time}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.duration}
                  </Badge>
                  {optimalActionIndex === index && (
                    <Badge variant="default" className="text-xs">
                      💫 ADESSO
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-slate-800 font-medium mb-1">
                  {item.action}
                </div>
                <div className="text-xs text-slate-600">
                  {item.benefit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Esercizi Specifici Pettorali */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Focus Pettorali Superiori</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {protocol.pectoralFocusExercises.map((exercise, index) => (
            <div key={index} className="bg-white rounded-lg p-2 border border-blue-100">
              <div className="text-sm font-medium text-blue-700">{exercise}</div>
              <div className="text-xs text-slate-600">
                4x8-12 reps
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-xs text-blue-700 bg-blue-100 rounded p-2">
          <strong>📊 Tecnica:</strong> Focus su contrazione eccentrica lenta (3 sec) + pausa 1 sec in allungamento per massima attivazione fibre superiori
        </div>
      </Card>

      {/* Supplementi Specifici */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold">Stack Anti-Grasso Pettorale</h3>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center p-2 bg-green-50 rounded">
            <span><strong>Yohimbine HCl</strong></span>
            <Badge variant="outline">{Math.round(userWeight * 0.2)}mg</Badge>
          </div>
          <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
            <span><strong>Caffeina anidra</strong></span>
            <Badge variant="outline">{Math.round(userWeight * 6)}mg</Badge>
          </div>
          <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
            <span><strong>L-Carnitina</strong></span>
            <Badge variant="outline">3g</Badge>
          </div>
          <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
            <span><strong>Forskolina</strong></span>
            <Badge variant="outline">500mg</Badge>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-slate-600 bg-slate-50 rounded p-2">
          <strong>⚡ Timing:</strong> Yohimbine + Caffeina a digiuno pre-cardio. L-Carnitina pre-workout. Forskolina con pasti principali.
        </div>
      </Card>
    </div>
  );
};

export default PectoralFatLossProtocol;

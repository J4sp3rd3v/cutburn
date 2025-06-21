
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Zap, Check, AlertCircle } from 'lucide-react';

const SupplementSection = () => {
  const [completedSupplements, setCompletedSupplements] = useState<string[]>(['whey']);

  const supplements = [
    {
      id: 'whey',
      name: 'Proteine Whey Isolate',
      dosage: '25g',
      timing: '16:00 - Post Workout',
      benefits: 'Sintesi proteica muscolare, recupero post-allenamento',
      instructions: 'Sciogliere in 200ml di acqua fredda. Shaker vigorosamente per 30 secondi.',
      contraindications: 'Evitare in caso di intolleranza al lattosio severa',
      color: 'bg-blue-500',
      priority: 'Alta'
    },
    {
      id: 'creatine',
      name: 'Creatina Monoidrato',
      dosage: '5g',
      timing: '18:00 - Pre Cena',
      benefits: 'Forza muscolare, performance anaerobica, idratazione cellulare',
      instructions: 'Sciogliere in 250ml di acqua a temperatura ambiente. Non necessita ciclizzazione.',
      contraindications: 'Aumentare idratazione giornaliera (+500ml acqua)',
      color: 'bg-red-500',
      priority: 'Alta'
    },
    {
      id: 'magnesium',
      name: 'Magnesio Citrato',
      dosage: '350mg',
      timing: '21:30 - Prima di dormire',
      benefits: 'Rilassamento muscolare, qualità del sonno, metabolismo energetico',
      instructions: 'Assumere con un bicchiere d\'acqua 30 minuti prima di coricarsi.',
      contraindications: 'Può causare effetto lassativo se assunto in dosi eccessive',
      color: 'bg-green-500',
      priority: 'Media'
    },
    {
      id: 'thermogenic',
      name: 'Termogenico Naturale',
      dosage: '1 capsula',
      timing: '08:00 - A digiuno',
      benefits: 'Accelerazione metabolismo, ossidazione grassi, energia mentale',
      instructions: 'Assumere a stomaco vuoto con abbondante acqua. Non superare 1 dose giornaliera.',
      contraindications: 'Evitare se sensibili alla caffeina. Non assumere dopo le 14:00',
      color: 'bg-orange-500',
      priority: 'Media'
    }
  ];

  const toggleSupplement = (id: string) => {
    setCompletedSupplements(prev => 
      prev.includes(id) 
        ? prev.filter(suppId => suppId !== id)
        : [...prev, id]
    );
  };

  const completedCount = completedSupplements.length;
  const totalCount = supplements.length;

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Integrazione Mirata
        </h2>
        <p className="text-slate-600">
          Supporto scientifico • Timing ottimale • Dosaggi personalizzati
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Progresso Giornaliero
          </h3>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {completedCount}/{totalCount}
          </Badge>
        </div>
        <div className="text-sm opacity-90">
          Prossima assunzione: Creatina alle 18:00
        </div>
      </Card>

      {/* Timeline View */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-700 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Timeline Giornaliera
        </h3>
        
        {supplements.map((supplement, index) => (
          <Card 
            key={supplement.id} 
            className={`p-4 transition-all duration-200 ${
              completedSupplements.includes(supplement.id) 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white/70 backdrop-blur-sm hover:bg-white/80'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full ${supplement.color} mt-2 flex-shrink-0`}></div>
                <div>
                  <h4 className="font-semibold text-slate-800">{supplement.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">{supplement.timing}</span>
                    <Badge 
                      variant={supplement.priority === 'Alta' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {supplement.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant={completedSupplements.includes(supplement.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSupplement(supplement.id)}
                className="flex items-center space-x-1"
              >
                {completedSupplements.includes(supplement.id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Fatto</span>
                  </>
                ) : (
                  <span>Segna</span>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <h5 className="text-sm font-medium text-slate-700 mb-1">Dosaggio & Istruzioni:</h5>
                <p className="text-sm text-slate-600">
                  <strong>{supplement.dosage}</strong> - {supplement.instructions}
                </p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-slate-700 mb-1">Benefici:</h5>
                <p className="text-sm text-slate-600">{supplement.benefits}</p>
              </div>
              
              <div className="flex items-start space-x-2 bg-yellow-50 p-2 rounded">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-medium text-yellow-800">Attenzione:</h5>
                  <p className="text-xs text-yellow-700">{supplement.contraindications}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Scientific Note */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">📚 Base Scientifica</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>Proteine:</strong> 1.6-2.2g/kg peso corporeo per sintesi muscolare ottimale</p>
          <p>• <strong>Creatina:</strong> 5g/die, efficacia provata per forza e massa magra</p>
          <p>• <strong>Magnesio:</strong> Coinvolto in 300+ reazioni enzimatiche</p>
          <p>• <strong>Termogenici:</strong> Caffeina 3-6mg/kg per lipolisi</p>
        </div>
      </Card>
    </div>
  );
};

export default SupplementSection;

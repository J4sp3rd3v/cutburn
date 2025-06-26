import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Zap, Check, AlertCircle, Scale } from 'lucide-react';
import { useProgressTracking } from '@/hooks/useProgressTracking';

const SupplementSection: React.FC = () => {
  const { userProfile, dailyProgress, saveProgress } = useProgressTracking();

  if (!userProfile || !dailyProgress) {
    return <div>Caricamento...</div>; // O uno skeleton
  }

  // Calcoli dosaggi personalizzati basati su peso e obiettivi
  const getPersonalizedDosages = () => {
    const weight = userProfile.current_weight || 75; // Fallback a 75kg
    
    return {
      whey: Math.round(weight * 0.4), // 0.4g per kg
      creatine: weight > 75 ? 5 : 3, // Dosaggio basato su peso
      magnesium: Math.round(weight * 5), // 5mg per kg
      caffeine: Math.round(weight * 6), // 6mg per kg per lipolisi
      lCarnitine: Math.round(weight * 30), // 30mg per kg
      tyrosine: Math.round(weight * 20), // 20mg per kg per focus
    };
  };

  const dosages = getPersonalizedDosages();

  const supplements = [
    {
      id: 'whey',
      name: 'Whey Isolate Premium',
      dosage: `${dosages.whey}g`,
      timing: '16:00 - Post Workout',
      benefits: 'Sintesi proteica muscolare +40%, recupero accelerato, preservazione massa magra',
      instructions: `Sciogliere ${dosages.whey}g in 250ml acqua fredda. Shaker vigorosamente 45 secondi. Assumere entro 30min post-workout.`,
      contraindications: 'Aumentare acqua +300ml. Test intolleranza lattosio se necessario',
      color: 'bg-blue-500',
      priority: 'Critica',
      science: 'Leucina 2.5g per attivazione mTOR. Assorbimento completo in 90 minuti.'
    },
    {
      id: 'creatine',
      name: 'Creatina Monoidrato Micronizzata',
      dosage: `${dosages.creatine}g`,
      timing: '18:00 - Pre Cena',
      benefits: 'Forza +15%, potenza anaerobica +20%, volume muscolare, recupero tra serie',
      instructions: `${dosages.creatine}g in 300ml acqua temperatura ambiente. Mescolare fino dissoluzione completa. Non necessita carico.`,
      contraindications: `Aumentare idratazione +${Math.round(dosages.creatine * 100)}ml acqua giornalieri`,
      color: 'bg-red-500',
      priority: 'Critica',
      science: 'Saturazione muscolare 100% in 28 giorni. Effetto su fosfocreatina +20%.'
    },
    {
      id: 'magnesium',
      name: 'Magnesio Citrato + B6',
      dosage: `${dosages.magnesium}mg`,
      timing: '21:30 - Pre sonno',
      benefits: 'Rilassamento muscolare, sonno profondo +25%, testosterone notturno, 300+ enzimi',
      instructions: `${dosages.magnesium}mg con bicchiere acqua. 45min prima di coricarsi. Associato a B6 per assorbimento.`,
      contraindications: 'Iniziare con metà dose per 3 giorni. Possibile effetto lassativo iniziale',
      color: 'bg-green-500',
      priority: 'Alta',
      science: 'Riduce cortisolo notturno -30%. Migliora fase REM del sonno.'
    },
    {
      id: 'fat-burner',
      name: 'Termogenico Naturale Avanzato',
      dosage: '2 capsule',
      timing: '07:00 - A digiuno',
      benefits: `Termogenesi +22%, ossidazione grassi +35%, focus mentale, soppressione appetito`,
      instructions: `2 capsule con 400ml acqua a stomaco vuoto. Caffeina ${dosages.caffeine}mg + estratti naturali. Max 1 dose/giorno.`,
      contraindications: `Non assumere dopo 14:00. Evitare se pressione alta. Test sensibilità caffeina.`,
      color: 'bg-orange-500',
      priority: 'Alta',
      science: `Caffeina ${dosages.caffeine}mg + Tirosina + Tè verde. Effetto 4-6 ore.`
    },
    {
      id: 'l-carnitine',
      name: 'L-Carnitina Tartrato',
      dosage: `${dosages.lCarnitine}mg`,
      timing: '15:30 - Pre workout',
      benefits: 'Trasporto acidi grassi +40%, energia da grassi, riduzione fatica muscolare',
      instructions: `${dosages.lCarnitine}mg in 200ml acqua. 30-45min pre-allenamento. Meglio se associata a carboidrati minimi.`,
      contraindications: 'Possibile nausea a stomaco vuoto. Assumere con piccolo spuntino se necessario',
      color: 'bg-purple-500',
      priority: 'Media',
      science: 'Trasporto mitocondriale acidi grassi. Riduce accumulo lattato -15%.'
    },
    {
      id: 'omega3',
      name: 'Omega-3 EPA/DHA',
      dosage: '2g (EPA 1200mg + DHA 800mg)',
      timing: '12:00 - Con pranzo',
      benefits: 'Anti-infiammatorio, recupero muscolare, funzione cerebrale, salute cardiovascolare',
      instructions: '2 capsule da 1g con pasto contenente grassi. Qualità pharmaceutical grade. Controllo ossidazione.',
      contraindications: 'Possibile interazione con anticoagulanti. Conservare in frigo',
      color: 'bg-cyan-500',
      priority: 'Media',
      science: 'Riduce CRP e IL-6. Migliora sensibilità insulinica +12%.'
    }
  ];

  const supplementsTakenCount = dailyProgress.supplements_taken || 0;
  const totalCount = supplements.length;
  const criticalSupplements = supplements.filter(s => s.priority === 'Critica').length;

  const handleSupplementToggle = (isTaken: boolean) => {
    const currentCount = dailyProgress.supplements_taken || 0;
    const newCount = isTaken ? currentCount - 1 : currentCount + 1;
    saveProgress({ supplements_taken: Math.max(0, newCount) });
  };

  // NOTA: Con questo approccio semplificato, non tracciamo *quali* supplementi
  // sono stati presi, ma solo *quanti*. Questo semplifica enormemente lo stato.
  // La UI rifletterà il conteggio, non lo stato individuale.

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Integrazione Personalizzata
        </h2>
        <p className="text-slate-600">
          Dosaggi scientifici per {userProfile.current_weight}kg • Timing ottimale
        </p>
      </div>

      <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
         <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Stack Personalizzato
          </h3>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {supplementsTakenCount}/{totalCount}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold">{dosages.whey}g</div>
            <div className="opacity-90 text-xs">Proteine</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{dosages.caffeine}mg</div>
            <div className="opacity-90 text-xs">Caffeina</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{criticalSupplements}</div>
            <div className="opacity-90 text-xs">Critici</div>
          </div>
        </div>
      </Card>

      {/* Timeline View con supplementi personalizzati */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-700 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Timeline Personalizzata
        </h3>
        
        {supplements.map((supplement, index) => {
          const isTaken = index < supplementsTakenCount;
          return (
            <Card 
              key={supplement.id} 
              className={`p-4 transition-all duration-200 ${
                isTaken 
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
                        variant={supplement.priority === 'Critica' ? 'destructive' : supplement.priority === 'Alta' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {supplement.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant={isTaken ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSupplementToggle(isTaken)}
                  className="flex items-center space-x-1"
                >
                  {isTaken ? (
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
                  <h5 className="text-sm font-medium text-slate-700 mb-1">Dosaggio Personalizzato:</h5>
                  <p className="text-sm text-slate-600">
                    <strong>{supplement.dosage}</strong> - {supplement.instructions}
                  </p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-slate-700 mb-1">Benefici Scientifici:</h5>
                  <p className="text-sm text-slate-600">{supplement.benefits}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-2">
                  <h5 className="text-sm font-medium text-blue-800 mb-1">🧬 Meccanismo:</h5>
                  <p className="text-xs text-blue-700">{supplement.science}</p>
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
          )
        })}
      </div>

      {/* Scientific Note Personalizzato */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
          <Scale className="w-4 h-4 mr-1" />
          📚 Personalizzazione per {userProfile.current_weight}kg
        </h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>Proteine:</strong> {dosages.whey}g = {Math.round((dosages.whey / userProfile.current_weight) * 10) / 10}g/kg per sintesi ottimale</p>
          <p>• <strong>Creatina:</strong> {dosages.creatine}g/die, saturazione muscolare in 4 settimane</p>
          <p>• <strong>Caffeina:</strong> {dosages.caffeine}mg = 6mg/kg per lipolisi massima</p>
          <p>• <strong>Magnesio:</strong> {dosages.magnesium}mg per 300+ reazioni enzimatiche</p>
          <p>• <strong>L-Carnitina:</strong> {dosages.lCarnitine}mg per trasporto grassi mitocondriale</p>
        </div>
      </Card>
    </div>
  );
};

export default SupplementSection;

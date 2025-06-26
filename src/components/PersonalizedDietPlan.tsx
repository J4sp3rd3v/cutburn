import React, { useState, useEffect } from 'react';
import { usePersonalizedDiet } from '@/hooks/usePersonalizedDiet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target, Flame, Brain, Droplets, Utensils, ChevronsRight, Coffee, UtensilsCrossed, Moon, Clock, ChefHat } from 'lucide-react';

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
    <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
  </div>
);

const PersonalizedDietPlan: React.FC = () => {
  const { dietPlan, loading } = usePersonalizedDiet();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [suggestedMeal, setSuggestedMeal] = useState<string | null>(null);

  // Aggiornamento automatico dell'orario
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Aggiorna ogni minuto

    return () => clearInterval(timer);
  }, []);

  // Suggerimento automatico del pasto basato sull'orario
  useEffect(() => {
    const hour = currentTime.getHours();
    let suggested = null;

    if (hour >= 6 && hour < 10) {
      suggested = 'breakfast';
    } else if (hour >= 12 && hour < 15) {
      suggested = 'lunch';
    } else if (hour >= 16 && hour < 18) {
      suggested = 'snack';
    } else if (hour >= 19 && hour < 22) {
      suggested = 'dinner';
    }

    setSuggestedMeal(suggested);

    // Auto-seleziona il giorno corrente se non è già selezionato
    if (!selectedDay) {
      const today = new Date().getDay(); // 0 = Domenica, 1 = Lunedì, etc.
      const adjustedDay = today === 0 ? 7 : today; // Converti domenica a 7
      setSelectedDay(adjustedDay);
    }
  }, [currentTime, selectedDay]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!dietPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Completa il Tuo Profilo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Per generare un piano dietetico personalizzato, abbiamo bisogno di alcuni tuoi dati.</p>
          <p className="mt-2 text-sm text-slate-500">Assicurati di aver inserito età, altezza, peso e livello di attività nella sezione del tuo profilo.</p>
        </CardContent>
      </Card>
    );
  }

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="w-4 h-4" />;
      case 'lunch': return <UtensilsCrossed className="w-4 h-4" />;
      case 'dinner': return <Moon className="w-4 h-4" />;
      default: return <Utensils className="w-4 h-4" />;
    }
  };

  const getMealName = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Colazione';
      case 'lunch': return 'Pranzo';
      case 'dinner': return 'Cena';
      case 'snack': return 'Spuntino';
      default: return mealType;
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'lunch': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'dinner': return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'snack': return 'bg-green-50 border-green-200 hover:bg-green-100';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-900 to-slate-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>I Tuoi Target Nutrizionali</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-lg">
            <span className="font-medium">Target Calorico</span>
            <Badge variant="secondary" className="text-lg bg-white/20 text-white">
              {dietPlan.targetCalories} kcal
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-sm font-semibold text-blue-300">Proteine</p>
              <p className="font-bold">{dietPlan.targetMacros.protein}g</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-300">Carboidrati</p>
              <p className="font-bold">{dietPlan.targetMacros.carbs}g</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-300">Grassi</p>
              <p className="font-bold">{dietPlan.targetMacros.fat}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Il Tuo Piano Settimanale</h3>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
            {suggestedMeal && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ora di {getMealName(suggestedMeal)}
              </Badge>
            )}
          </div>
        </div>
        {dietPlan.weeklyPlan.length > 0 ? (
          <div className="space-y-4">
            {/* Selezione Giorno */}
            <div className="grid grid-cols-7 gap-2">
              {dietPlan.weeklyPlan.map((dailyPlan) => (
                <Button
                  key={dailyPlan.day}
                  variant={selectedDay === dailyPlan.day ? "default" : "outline"}
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => {
                    setSelectedDay(selectedDay === dailyPlan.day ? null : dailyPlan.day);
                    setSelectedMeal(null);
                  }}
                >
                  <span className="text-xs font-medium">Giorno</span>
                  <span className="text-lg font-bold">{dailyPlan.day}</span>
                  <span className="text-xs text-muted-foreground">{dailyPlan.totals.calories} kcal</span>
                </Button>
              ))}
            </div>

            {/* Visualizzazione Giorno Selezionato */}
            {selectedDay && (
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center justify-between">
                    <span>Giorno {selectedDay}</span>
                    <Badge variant="secondary">
                      {dietPlan.weeklyPlan.find(d => d.day === selectedDay)?.totals.calories} kcal totali
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Bottoni dei 3 Pasti Principali */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                      const dailyPlan = dietPlan.weeklyPlan.find(d => d.day === selectedDay);
                      const meal = dailyPlan?.meals[mealType];
                      
                      if (!meal) return null;
                      
                      return (
                        <Button
                          key={mealType}
                          variant={selectedMeal === mealType ? "default" : "outline"}
                          className={`h-20 flex flex-col items-center justify-center space-y-1 ${getMealColor(mealType)} ${
                            suggestedMeal === mealType ? 'ring-2 ring-green-400 ring-offset-2' : ''
                          }`}
                          onClick={() => setSelectedMeal(selectedMeal === mealType ? null : mealType)}
                        >
                          <div className="flex items-center space-x-1">
                            {getMealIcon(mealType)}
                            {suggestedMeal === mealType && <Badge variant="secondary" className="text-xs bg-green-500 text-white">ORA</Badge>}
                          </div>
                          <span className="font-semibold text-sm">{getMealName(mealType)}</span>
                          <span className="text-xs text-muted-foreground">{meal.calories} kcal</span>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Spuntino separato */}
                  {(() => {
                    const dailyPlan = dietPlan.weeklyPlan.find(d => d.day === selectedDay);
                    const snack = dailyPlan?.meals.snack;
                    
                    if (snack) {
                      return (
                        <div className="mb-6">
                          <Button
                            variant={selectedMeal === 'snack' ? "default" : "outline"}
                            className={`w-full h-16 flex items-center justify-between ${getMealColor('snack')}`}
                            onClick={() => setSelectedMeal(selectedMeal === 'snack' ? null : 'snack')}
                          >
                            <div className="flex items-center space-x-2">
                              {getMealIcon('snack')}
                              <span className="font-semibold">{getMealName('snack')}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{snack.calories} kcal</span>
                          </Button>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Dettagli Pasto Selezionato */}
                  {selectedMeal && (() => {
                    const dailyPlan = dietPlan.weeklyPlan.find(d => d.day === selectedDay);
                    const meal = dailyPlan?.meals[selectedMeal];
                    
                    if (!meal) return null;
                    
                    return (
                      <Card className="border-2 border-green-200 bg-green-50">
                        <CardHeader className="bg-green-100">
                          <CardTitle className="flex items-center justify-between text-green-800">
                            <div className="flex items-center space-x-2">
                              {getMealIcon(selectedMeal)}
                              <span>{meal.name}</span>
                            </div>
                            <Badge variant="secondary" className="bg-green-200 text-green-800">
                              {meal.calories} kcal
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                                                 <CardContent className="p-4">
                           <div className="space-y-4">
                             <div className="bg-white p-3 rounded-lg border">
                               <h4 className="font-semibold text-green-800 mb-2">Razionale Scientifico</h4>
                               <p className="text-sm text-slate-700 italic">"{meal.rationale}"</p>
                             </div>
                             
                             <div className="bg-white p-3 rounded-lg border">
                               <h4 className="font-semibold text-green-800 mb-2">Ingredienti</h4>
                               <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                                 {meal.ingredients.map((ing, index) => (
                                   <li key={index}>
                                     <span className="font-medium">{ing.amount}</span> {ing.item}
                                     {ing.notes && <span className="text-xs text-slate-500 ml-2">({ing.notes})</span>}
                                   </li>
                                 ))}
                               </ul>
                             </div>

                             {/* Preparazione Tradizionale */}
                             <div className="bg-white p-3 rounded-lg border">
                               <h4 className="font-semibold text-green-800 mb-2 flex items-center space-x-2">
                                 <Utensils className="w-4 h-4" />
                                 <span>Preparazione Tradizionale</span>
                               </h4>
                               <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
                                 {meal.preparation.traditional.map((step, index) => (
                                   <li key={index}>{step}</li>
                                 ))}
                               </ol>
                             </div>

                             {/* Preparazione Bimby TM5 */}
                             {meal.preparation.thermomix && meal.preparation.thermomix.length > 0 && (
                               <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg border-2 border-red-200">
                                 <h4 className="font-semibold text-red-800 mb-2 flex items-center space-x-2">
                                   <ChefHat className="w-4 h-4" />
                                   <span>Preparazione Bimby TM5</span>
                                   <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">OTTIMIZZATA</Badge>
                                 </h4>
                                 <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
                                   {meal.preparation.thermomix.map((step, index) => (
                                     <li key={index} className="font-medium">{step}</li>
                                   ))}
                                 </ol>
                                 <p className="text-xs text-red-600 mt-2 font-medium">
                                   ⚡ Preparazione veloce e precisa con il Bimby TM5
                                 </p>
                               </div>
                             )}

                             {/* Informazioni Nutrizionali Dettagliate */}
                             <div className="bg-slate-50 p-3 rounded-lg border">
                               <h4 className="font-semibold text-slate-800 mb-2">Valori Nutrizionali</h4>
                               <div className="grid grid-cols-2 gap-2 text-xs">
                                 <div className="flex justify-between">
                                   <span>Proteine:</span>
                                   <span className="font-medium">{meal.macros.protein}g</span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span>Carboidrati:</span>
                                   <span className="font-medium">{meal.macros.carbs}g</span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span>Grassi:</span>
                                   <span className="font-medium">{meal.macros.fat}g</span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span>Fibre:</span>
                                   <span className="font-medium">{meal.macros.fiber}g</span>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </CardContent>
                      </Card>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <p className="text-slate-600 bg-slate-100 p-4 rounded-lg">
            Non è stato possibile generare un piano settimanale completo con le ricette attuali. Stiamo lavorando per aggiungerne di nuove per la stagione in corso.
          </p>
        )}
      </div>
    </div>
  );
};

export default PersonalizedDietPlan; 
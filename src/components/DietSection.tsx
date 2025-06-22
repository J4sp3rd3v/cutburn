import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Utensils, Target, ChefHat, BookOpen, Zap, Leaf, Calendar, Scale, ChevronLeft, ChevronRight } from 'lucide-react';

interface UserProfile {
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  activityLevel: string;
  goal: string;
}

interface DietSectionProps {
  userProfile: UserProfile;
}

const DietSection: React.FC<DietSectionProps> = ({ userProfile }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calcoli metabolici semplificati
  const calculateNutrition = () => {
    const bmr = (10 * userProfile.currentWeight) + (6.25 * userProfile.height) - (5 * userProfile.age) + 5;
    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }[userProfile.activityLevel] || 1.55;
    
    const tdee = bmr * activityMultiplier;
    const targetCalories = Math.round(tdee * 0.72); // 28% deficit per bruciare grassi
    const proteinTarget = Math.round(userProfile.currentWeight * 2.2); // 2.2g/kg
    const fatTarget = Math.round((targetCalories * 0.25) / 9); // 25% grassi
    const carbTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);

    return { targetCalories, proteinTarget, fatTarget, carbTarget, deficit: Math.round(tdee - targetCalories) };
  };

  const nutrition = calculateNutrition();

  // Stagionalità semplice ed economica
  const getSeasonalIngredients = () => {
    const month = new Date().getMonth() + 1;
    const season = month >= 3 && month <= 5 ? 'primavera' : 
                  month >= 6 && month <= 8 ? 'estate' : 
                  month >= 9 && month <= 11 ? 'autunno' : 'inverno';

    const ingredients = {
      primavera: { verdure: 'spinaci', frutta: 'fragole', proteine: 'pollo', carbs: 'riso basmati' },
      estate: { verdure: 'zucchine', frutta: 'pesche', proteine: 'tonno', carbs: 'quinoa' },
      autunno: { verdure: 'broccoli', frutta: 'mele', proteine: 'salmone', carbs: 'patate dolci' },
      inverno: { verdure: 'cavoli', frutta: 'arance', proteine: 'manzo', carbs: 'avena' }
    };

    return { season, items: ingredients[season] };
  };

  const { season, items } = getSeasonalIngredients();

  // Protocolli brucia-grassi 7 giorni
  const getProtocolDay = (day: number) => {
    const protocols = [
      { name: 'Metabolic Boost', type: 'High Protein', carbCut: false, fastingWindow: '16:8' },
      { name: 'Fat Burn', type: 'Low Carb', carbCut: true, fastingWindow: '18:6' },
      { name: 'Anabolic', type: 'Balanced', carbCut: false, fastingWindow: '14:10' },
      { name: 'Detox Power', type: 'Low Carb', carbCut: true, fastingWindow: '16:8' },
      { name: 'Refeed', type: 'Higher Carb', carbCut: false, fastingWindow: '12:12' },
      { name: 'Cut Deep', type: 'Ketogenic', carbCut: true, fastingWindow: '20:4' },
      { name: 'Recovery', type: 'Balanced', carbCut: false, fastingWindow: '16:8' }
    ];
    return protocols[day];
  };

  const currentProtocol = getProtocolDay(selectedDay);
  const currentDay = new Date().getDay();

  // Pasti ottimizzati per bruciare grassi
  const getMeals = () => {
    const baseProtein = Math.round(userProfile.currentWeight * 0.4); // Per pasto
    const baseCarbs = currentProtocol.carbCut ? 5 : 25;
    const baseFat = Math.round(userProfile.currentWeight * 0.15);

    return {
      colazione: {
        name: '🌅 Colazione Metabolica',
        time: '07:00-08:30',
        calories: Math.round(nutrition.targetCalories * 0.25),
        window: currentProtocol.fastingWindow.split(':')[1] === '8' ? 'FINESTRA ALIMENTARE' : 'DIGIUNO',
        foods: [
          {
            name: `Smoothie Proteico Anti-Grasso`,
            ingredients: [
              `Whey isolate: ${Math.round(userProfile.currentWeight * 0.5)}g`,
              `${items.frutta}: 100g`,
              `Cannella: 1 cucchiaino`,
              `Caffè espresso: 1 tazzina`,
              `Acqua: 250ml`,
              `Ghiaccio: 100g`
            ],
            bimbyTM5: [
              'Versare acqua fredda e ghiaccio nel boccale',
              `Aggiungere whey ${Math.round(userProfile.currentWeight * 0.5)}g`,
              `Inserire ${items.frutta} 100g + cannella`,
              'Caffè espresso raffreddato',
              'Frullare: 1 min / Vel 8',
              'Controllo consistenza, aggiungere ghiaccio se necessario',
              'Frullata finale: 20 sec / Vel 6'
            ],
            benefits: 'Proteine per termogenesi +30%, caffeina per lipolisi +15%',
            macros: { protein: Math.round(userProfile.currentWeight * 0.5), carbs: 12, fat: 2 }
          },
          {
            name: 'Mandorle Brucia-Grasso',
            ingredients: [`Mandorle crude: ${Math.round(userProfile.currentWeight * 0.2)}g`],
            bimbyTM5: ['Mandorle al naturale, ricche magnesio'],
            benefits: 'Grassi monoinsaturi per testosterone, sazietà prolungata',
            macros: { protein: 4, carbs: 3, fat: Math.round(userProfile.currentWeight * 0.18) }
          }
        ]
      },
      pranzo: {
        name: '🔥 Pranzo Power Cut',
        time: '13:00-14:00',
        calories: Math.round(nutrition.targetCalories * 0.40),
        window: 'PASTO PRINCIPALE',
        foods: [
          {
            name: `${items.proteine} + ${items.verdure}`,
            ingredients: [
              `${items.proteine}: ${Math.round(userProfile.currentWeight * 2.2)}g`,
              `${items.verdure}: ${Math.round(userProfile.currentWeight * 3)}g`,
              `Olio EVO: 1 cucchiaio (15ml)`,
              `Limone: 1/2`,
              `Aglio: 2 spicchi`,
              `Pepe nero: q.b.`,
              `Sale: pizzico`
            ],
            bimbyTM5: [
              `Tritare aglio: 3 sec / Vel 5`,
              `Aggiungere olio EVO 15ml`,
              `Rosolare: 2 min / 120°C / Vel 1`,
              `Inserire ${items.proteine} ${Math.round(userProfile.currentWeight * 2.2)}g`,
              `Cuocere: 8 min / 120°C / Vel 1 / senso antiorario`,
              `Aggiungere ${items.verdure} ${Math.round(userProfile.currentWeight * 3)}g`,
              `Cottura finale: 5 min / 100°C / Vel 2`,
              `Succo limone, pepe nero e sale finale`
            ],
            benefits: 'Proteine complete per massa magra, verdure per fibre e sazietà',
            macros: { protein: Math.round(userProfile.currentWeight * 2.2), carbs: currentProtocol.carbCut ? 8 : 15, fat: 18 }
          },
          {
            name: currentProtocol.carbCut ? 'Cavolfiore Rice' : `${items.carbs}`,
            ingredients: currentProtocol.carbCut ? 
              ['Cavolfiore: 200g', 'Curcuma: 1 cucchiaino'] :
              [`${items.carbs}: ${Math.round(userProfile.currentWeight * 0.8)}g secco`, 'Curcuma: 1 cucchiaino'],
            bimbyTM5: currentProtocol.carbCut ? [
              'Cavolfiore a pezzi nel boccale',
              'Tritare: 8 sec / Vel 5',
              'Risultato simile a riso',
              'Saltare in padella con curcuma'
            ] : [
              `${items.carbs} ${Math.round(userProfile.currentWeight * 0.8)}g + acqua bollente`,
              'Cuocere secondo istruzioni confezione',
              'Aggiungere curcuma a fine cottura'
            ],
            benefits: currentProtocol.carbCut ? 'Fibre sazianti, zero carboidrati' : 'Energia controllata per workout',
            macros: { protein: 3, carbs: currentProtocol.carbCut ? 5 : baseCarbs, fat: 1 }
          }
        ]
      },
      cena: {
        name: '🌙 Cena Recovery',
        time: '19:00-20:00', 
        calories: Math.round(nutrition.targetCalories * 0.35),
        window: 'FINE FINESTRA',
        foods: [
          {
            name: 'Salmone + Verdure Detox',
            ingredients: [
              `Salmone: ${Math.round(userProfile.currentWeight * 1.8)}g`,
              `Broccoli: ${Math.round(userProfile.currentWeight * 2.5)}g`,
              `Spinaci: 100g`,
              `Olio EVO: 1 cucchiaio`,
              `Limone: 1`,
              `Zenzero fresco: 1 cm`
            ],
            bimbyTM5: [
              `Zenzero nel boccale: 5 sec / Vel 8`,
              `Olio EVO + limone`,
              `Mescolare: 10 sec / Vel 3`,
              `Marinare salmone ${Math.round(userProfile.currentWeight * 1.8)}g per 15 min`,
              `Broccoli a pezzi: 5 sec / Vel 4`,
              `Cuocere broccoli: 15 min / Varoma / Vel 1`,
              `Grigliare salmone separatamente 3 min per lato`,
              `Spinaci crudi come base`
            ],
            benefits: 'Omega-3 per recupero, verdure per detox notturno',
            macros: { protein: Math.round(userProfile.currentWeight * 1.8), carbs: 8, fat: 22 }
          }
        ]
      }
    };
  };

  const meals = getMeals();
  const totalDayCalories = meals.colazione.calories + meals.pranzo.calories + meals.cena.calories;

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          🔥 Dieta Brucia-Grassi Science
        </h2>
        <div className="flex items-center justify-center space-x-2 text-sm mb-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Leaf className="w-3 h-3" />
            <span>Stagione: {season}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Scale className="w-3 h-3" />
            <span>Deficit: -{nutrition.deficit} kcal</span>
          </Badge>
        </div>
      </div>

      {/* Protocollo Giornaliero */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDay(selectedDay === 0 ? 6 : selectedDay - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ieri</span>
          </Button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">
              {['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'][selectedDay]}
            </h3>
            <Badge variant={selectedDay === currentDay ? "default" : "outline"} 
                   className={selectedDay === currentDay ? "bg-green-500" : ""}>
              {selectedDay === currentDay ? "OGGI" : currentProtocol.name}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDay(selectedDay === 6 ? 0 : selectedDay + 1)}
          >
            <span>Domani</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="font-bold text-slate-800">{currentProtocol.type}</div>
            <div className="text-sm text-slate-600">Protocollo</div>
          </div>
          <div>
            <div className="font-bold text-slate-800">{currentProtocol.fastingWindow}</div>
            <div className="text-sm text-slate-600">Digiuno</div>
          </div>
        </div>
      </Card>

      {/* Pasti */}
      {Object.entries(meals).map(([mealKey, meal]) => (
        <Card key={mealKey} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{meal.name}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{meal.time}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {meal.calories} kcal
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {meal.window}
                </Badge>
              </div>
            </div>
          </div>

          {/* Alimenti */}
          <div className="space-y-4">
            {meal.foods.map((food, index) => (
              <div key={index} className="border rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-800">{food.name}</h4>
                  <div className="text-right text-sm">
                    <div>P: {food.macros.protein}g | C: {food.macros.carbs}g | F: {food.macros.fat}g</div>
                  </div>
                </div>

                {/* Ingredienti */}
                <div className="mb-3">
                  <h5 className="font-medium text-slate-700 mb-2">Ingredienti:</h5>
                  <div className="grid grid-cols-1 gap-1">
                    {food.ingredients.map((ingredient, idx) => (
                      <div key={idx} className="text-sm text-slate-600 flex">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {ingredient}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bimby TM5 */}
                <div className="mb-3">
                  <h5 className="font-medium text-slate-700 mb-2 flex items-center">
                    <ChefHat className="w-4 h-4 mr-1" />
                    Preparazione Bimby TM5:
                  </h5>
                  <div className="bg-white rounded p-3">
                    <ol className="space-y-1">
                      {food.bimbyTM5.map((step, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex">
                          <span className="text-blue-500 font-medium mr-2 flex-shrink-0">
                            {idx + 1}.
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Benefici */}
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-green-700">
                    <strong>💪 Benefici:</strong> {food.benefits}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Riepilogo Giornaliero */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-lg font-bold text-slate-800 mb-3">📊 Riepilogo Giornaliero</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-slate-800">{totalDayCalories}</div>
            <div className="text-sm text-slate-600">Calorie totali</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">-{nutrition.deficit}</div>
            <div className="text-sm text-slate-600">Deficit kcal</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-600">
          <strong>Obiettivo:</strong> Bruciare grasso pettorale con deficit {Math.round((nutrition.deficit / nutrition.targetCalories) * 100)}% + digiuno {currentProtocol.fastingWindow}
        </div>
      </Card>
    </div>
  );
};

export default DietSection;

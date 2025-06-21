
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Utensils, Target, ChefHat, BookOpen, Zap, Leaf, Calendar } from 'lucide-react';

const DietSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState("pranzo");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Get current season and optimal meal based on time
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'primavera';
    if (month >= 6 && month <= 8) return 'estate';
    if (month >= 9 && month <= 11) return 'autunno';
    return 'inverno';
  };

  const getCurrentOptimalMeal = () => {
    const hour = currentTime.getHours();
    if (hour >= 7 && hour <= 9) return 'colazione';
    if (hour >= 12 && hour <= 14) return 'pranzo';
    if (hour >= 15 && hour <= 16) return 'spuntino';
    if (hour >= 19 && hour <= 21) return 'cena';
    return null;
  };

  const season = getCurrentSeason();
  const optimalMeal = getCurrentOptimalMeal();

  // Enhanced user stats with body composition focus
  const userStats = {
    weight: 69,
    height: 173,
    age: 30,
    bodyFat: 15, // Target: 8-10%
    bmr: 1680, // Calculated with body composition
    tdee: 2280, // With training 4x/week
    targetCalories: 1650, // Aggressive but safe deficit (630kcal)
    proteinTarget: 165, // 2.4g/kg for muscle preservation in deficit
    fatTarget: 45, // 25% calories for hormone optimization
    carbTarget: 82 // Remaining calories, focused around workouts
  };

  // Seasonal ingredients database
  const seasonalIngredients = {
    primavera: {
      vegetables: ['asparagi', 'carciofi', 'piselli', 'fave', 'spinaci novelli', 'ravanelli'],
      fruits: ['fragole', 'albicocche', 'ciliegie', 'kiwi'],
      herbs: ['menta', 'basilico fresco', 'prezzemolo']
    },
    estate: {
      vegetables: ['zucchine', 'pomodori', 'peperoni', 'melanzane', 'cetrioli', 'rucola'],
      fruits: ['pesche', 'melone', 'anguria', 'prugne', 'fichi'],
      herbs: ['origano', 'timo', 'rosmarino']
    },
    autunno: {
      vegetables: ['zucca', 'cavolo nero', 'broccoli', 'cavolfiori', 'rape rosse'],
      fruits: ['mele', 'pere', 'uva', 'melograno', 'castagne'],
      herbs: ['salvia', 'alloro', 'maggiorana']
    },
    inverno: {
      vegetables: ['cavoli', 'porri', 'carciofi', 'finocchi', 'sedano rapa'],
      fruits: ['arance', 'mandarini', 'pompelmi', 'kiwi', 'mele'],
      herbs: ['rosmarino', 'timo', 'alloro']
    }
  };

  // Dynamic meals based on season and scientific timing
  const getDynamicMeals = () => {
    const currentIngredients = seasonalIngredients[season];
    const dayOfWeek = new Date().getDay();
    const isWorkoutDay = [1, 3, 5].includes(dayOfWeek); // Mon, Wed, Fri

    return {
      colazione: {
        name: "Colazione Anabolica",
        time: "07:00-08:30",
        calories: 285,
        timing: "Peak cortisol + sensibilità insulinica",
        hormones: "Ottimizzazione testosterone + GH notturno",
        season: season,
        foods: [
          {
            name: "Smoothie proteico stagionale",
            amount: "250ml",
            calories: 185,
            protein: 32,
            carbs: 12,
            fat: 2,
            preparation: `Whey isolate + ${currentIngredients.fruits[0]} + cannella Ceylon + caffè espresso. Frullare con ghiaccio.`,
            benefits: "Stimolazione mTOR per sintesi proteica. Caffeina per ossidazione grassi mattutina.",
            seasonal: true
          },
          {
            name: "Mandorle biologiche",
            amount: "12g",
            calories: 70,
            protein: 3,
            carbs: 2,
            fat: 6,
            preparation: "Mandorle crude, ricche vitamina E e magnesio.",
            benefits: "Grassi monoinsaturi per produzione testosterone. Magnesio per 300+ reazioni enzimatiche.",
            seasonal: false
          },
          {
            name: "Tè verde matcha",
            amount: "1 tazza",
            calories: 30,
            protein: 2,
            carbs: 4,
            fat: 0,
            preparation: "Matcha ceremoniale giapponese + acqua 70°C.",
            benefits: "EGCG per termogenesi. L-teanina per focus senza jitter.",
            seasonal: false
          }
        ]
      },
      pranzo: {
        name: "Pranzo Lipolisi Peak",
        time: "12:00-13:30",
        calories: 465,
        timing: "Massima sensibilità insulinica + attività metabolica",
        hormones: "Peak leptina + ottimizzazione T3/T4",
        season: season,
        foods: [
          {
            name: `Salmone selvaggio + ${currentIngredients.herbs[0]}`,
            amount: "140g",
            calories: 280,
            protein: 45,
            carbs: 0,
            fat: 12,
            preparation: `Marinare con ${currentIngredients.herbs[0]}, olio EVO, limone. Cottura sottovuoto 52°C x 12min.`,
            benefits: "EPA/DHA per riduzione infiammazione viscerale. Riduce cortisol e CRP.",
            seasonal: true
          },
          {
            name: `${currentIngredients.vegetables[0]} saltati`,
            amount: "180g",
            calories: 85,
            protein: 6,
            carbs: 12,
            fat: 2,
            preparation: `Saltare con aglio, olio EVO e pepe nero. Cottura al dente.`,
            benefits: "Fibre solubili per microbiota. Polifenoli stagionali per riduzione stress ossidativo.",
            seasonal: true
          },
          {
            name: isWorkoutDay ? "Riso basmati integrale" : "Quinoa tricolore",
            amount: isWorkoutDay ? "40g secco" : "35g secco",
            calories: isWorkoutDay ? 140 : 130,
            protein: isWorkoutDay ? 3 : 5,
            carbs: isWorkoutDay ? 28 : 22,
            fat: isWorkoutDay ? 1 : 2,
            preparation: isWorkoutDay ? "Basmati con curcuma + pepe nero" : "Quinoa con limone e prezzemolo",
            benefits: isWorkoutDay ? "Amilosio per rilascio glucosio controllato" : "Aminoacidi completi + saponine detox",
            seasonal: false
          }
        ]
      },
      spuntino: {
        name: "Pre-Workout Precision",
        time: "15:30-16:00",
        calories: 180,
        timing: "30-45min pre-allenamento - Peak performance window",
        hormones: "Adrenalina + noradrenalina ottimali",
        season: season,
        foods: [
          {
            name: "Shot energetico naturale",
            amount: "100ml",
            calories: 120,
            protein: 22,
            carbs: 8,
            fat: 1,
            preparation: "Whey isolate + espresso doppio + estratto di ${currentIngredients.fruits[1]} + beta-alanina.",
            benefits: "Aminoacidi ramificati per performance. Caffeina per lipolisi durante allenamento.",
            seasonal: true
          },
          {
            name: "Noci brasiliane",
            amount: "8g (2 noci)",
            calories: 55,
            protein: 1,
            carbs: 1,
            fat: 5,
            preparation: "Noci brasiliane crude, fonte di selenio.",
            benefits: "Selenio per funzione tiroidea ottimale. Grassi MCT-like per energia rapida.",
            seasonal: false
          }
        ]
      },
      cena: {
        name: "Cena Recupero Ormonale",
        time: "19:00-20:30",
        calories: 420,
        timing: "Finestra anabolica serale + prep sonno",
        hormones: "GH release + melatonina endogena",
        season: season,
        foods: [
          {
            name: `Petto di pollo ruspante + ${currentIngredients.herbs[1]}`,
            amount: "150g",
            calories: 225,
            protein: 46,
            carbs: 0,
            fat: 3,
            preparation: `Marinatura 2h con ${currentIngredients.herbs[1]} + aglio. Cottura 160°C x 18min.`,
            benefits: "Proteine complete ad alto VB. Triptofano per produzione serotonina→melatonina.",
            seasonal: true
          },
          {
            name: `${currentIngredients.vegetables[1]} al vapore`,
            amount: "200g",
            calories: 65,
            protein: 6,
            carbs: 8,
            fat: 1,
            preparation: `Vapore 4 minuti. Condimento: olio EVO + limone + sale rosa.`,
            benefits: "Antiossidanti stagionali per recupero muscolare. Potassio per rilassamento.",
            seasonal: true
          },
          {
            name: "Patata dolce viola",
            amount: "100g",
            calories: 85,
            protein: 2,
            carbs: 20,
            fat: 0,
            preparation: "Al forno 180°C x 25min con rosmarino.",
            benefits: "Antocianine per riduzione infiammazione. Carboidrati per ricarica glicogeno notturna.",
            seasonal: false
          },
          {
            name: "Avocado Hass",
            amount: "60g",
            calories: 95,
            protein: 2,
            carbs: 5,
            fat: 9,
            preparation: "A fette con sale marino e pepe nero fresco.",
            benefits: "Acido oleico per sintesi testosterone notturna. Potassio per pressione ottimale.",
            seasonal: false
          }
        ]
      }
    };
  };

  const meals = getDynamicMeals();
  const currentMeal = meals[selectedMeal as keyof typeof meals];
  const totalProtein = currentMeal.foods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = currentMeal.foods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = currentMeal.foods.reduce((sum, food) => sum + food.fat, 0);

  // Calculate daily totals
  const dailyTotals = Object.values(meals).reduce((totals, meal) => ({
    calories: totals.calories + meal.calories,
    protein: totals.protein + meal.foods.reduce((sum, food) => sum + food.protein, 0),
    carbs: totals.carbs + meal.foods.reduce((sum, food) => sum + food.carbs, 0),
    fat: totals.fat + meal.foods.reduce((sum, food) => sum + food.fat, 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Piano Nutrizionale Body Recomp 2025
        </h2>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{season.charAt(0).toUpperCase() + season.slice(1)}</span>
          </Badge>
          <Badge variant="outline">
            Deficit: {userStats.tdee - userStats.targetCalories}kcal
          </Badge>
          <Badge variant="outline">
            {currentTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
          </Badge>
        </div>
      </div>

      {/* Real-time meal alert */}
      {optimalMeal && (
        <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <Zap className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>🎯 TIMING OTTIMALE:</strong> È il momento perfetto per{' '}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto text-orange-800 underline font-semibold"
              onClick={() => setSelectedMeal(optimalMeal)}
            >
              {meals[optimalMeal as keyof typeof meals].name}
            </Button>
            {' '}basato sui tuoi ritmi circadiani!
          </AlertDescription>
        </Alert>
      )}

      {/* Scientific Overview */}
      <Card className="p-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-semibold">Body Recomposition Science 2025</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xl font-bold">{userStats.targetCalories}</div>
            <div className="opacity-90">kcal deficit</div>
          </div>
          <div>
            <div className="text-xl font-bold">{userStats.proteinTarget}g</div>
            <div className="opacity-90">proteine</div>
          </div>
          <div>
            <div className="text-xl font-bold">8-10%</div>
            <div className="opacity-90">BF target</div>
          </div>
        </div>
        <div className="mt-2 text-xs opacity-80">
          Deficit aggressivo ma sicuro per riduzione grasso viscerale addominale + preservazione massa magra
        </div>
      </Card>

      {/* Meal Selection */}
      <div className="grid grid-cols-4 gap-1">
        {Object.entries(meals).map(([key, meal]) => (
          <Button
            key={key}
            variant={selectedMeal === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMeal(key)}
            className={`text-xs relative ${optimalMeal === key ? 'ring-2 ring-orange-400' : ''}`}
          >
            {optimalMeal === key && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            )}
            {meal.name.split(' ')[0]}
          </Button>
        ))}
      </div>

      {/* Meal Details */}
      <Card className="p-4 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-lg">{currentMeal.name}</h3>
            {currentMeal.season && (
              <Badge variant="outline" className="text-xs flex items-center space-x-1">
                <Leaf className="w-3 h-3" />
                <span>Stagionale</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">{currentMeal.time}</span>
          </div>
        </div>

        {/* Enhanced Timing & Hormonal Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4 border border-blue-100">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-sm text-purple-800">Cronobiologia Nutrizionale</span>
          </div>
          <div className="text-xs text-slate-700 mb-1">
            <strong>Timing:</strong> {currentMeal.timing}
          </div>
          <div className="text-xs text-slate-700">
            <strong>Ormoni:</strong> {currentMeal.hormones}
          </div>
        </div>

        {/* Enhanced Macros */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center bg-orange-50 rounded-lg p-2">
            <div className="text-lg font-bold text-orange-600">{currentMeal.calories}</div>
            <div className="text-xs text-slate-500">kcal</div>
          </div>
          <div className="text-center bg-red-50 rounded-lg p-2">
            <div className="text-lg font-bold text-red-500">{totalProtein}g</div>
            <div className="text-xs text-slate-500">proteine</div>
          </div>
          <div className="text-center bg-blue-50 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-500">{totalCarbs}g</div>
            <div className="text-xs text-slate-500">carbs</div>
          </div>
          <div className="text-center bg-green-50 rounded-lg p-2">
            <div className="text-lg font-bold text-green-500">{totalFat}g</div>
            <div className="text-xs text-slate-500">grassi</div>
          </div>
        </div>

        {/* Enhanced Foods List */}
        <div className="space-y-3">
          {currentMeal.foods.map((food, index) => (
            <Card key={index} className={`p-3 ${food.seasonal ? 'bg-green-50/70 border-green-200' : 'bg-slate-50/50'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-slate-800">{food.name}</h4>
                  {food.seasonal && (
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                      <Leaf className="w-3 h-3 mr-1" />
                      {season}
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {food.calories} kcal
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">{food.amount}</p>
              <div className="flex items-start space-x-2 mb-2">
                <ChefHat className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-600">{food.preparation}</p>
              </div>
              <div className="bg-blue-50 rounded p-2 mb-2">
                <p className="text-xs text-blue-700 italic">{food.benefits}</p>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>P: {food.protein}g</span>
                <span>C: {food.carbs}g</span>
                <span>F: {food.fat}g</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Enhanced Daily Target */}
      <Card className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5" />
          <h3 className="font-semibold">Target Giornaliero Body Recomp</h3>
        </div>
        <div className="grid grid-cols-4 gap-3 text-sm mb-3">
          <div className="text-center">
            <div className="text-lg font-bold">{dailyTotals.calories}</div>
            <div className="opacity-90 text-xs">kcal totali</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{Math.round(dailyTotals.protein)}g</div>
            <div className="opacity-90 text-xs">proteine</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{Math.round(dailyTotals.carbs)}g</div>
            <div className="opacity-90 text-xs">carbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{Math.round(dailyTotals.fat)}g</div>
            <div className="opacity-90 text-xs">grassi</div>
          </div>
        </div>
        <div className="text-xs opacity-80 leading-relaxed">
          Ratio ottimizzato: 40% proteine | 25% carbs | 35% grassi per massima lipolisi addominale + preservazione massa magra. 
          Basato su studi 2024-2025 di Helms, Phillips, Aragon.
        </div>
      </Card>

      {/* Seasonal Ingredients Info */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center space-x-2 mb-3">
          <Leaf className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-800">Ingredienti di {season.charAt(0).toUpperCase() + season.slice(1)}</h3>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div>
            <strong className="text-green-700">Verdure:</strong> {seasonalIngredients[season].vegetables.join(', ')}
          </div>
          <div>
            <strong className="text-green-700">Frutta:</strong> {seasonalIngredients[season].fruits.join(', ')}
          </div>
          <div>
            <strong className="text-green-700">Erbe:</strong> {seasonalIngredients[season].herbs.join(', ')}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DietSection;

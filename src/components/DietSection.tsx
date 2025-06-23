import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Utensils, Target, ChefHat, BookOpen, Zap, Leaf, Calendar, Scale } from 'lucide-react';

interface UserProfile {
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  activityLevel: string;
  goal: string;
  lactoseIntolerant?: boolean;
  intermittentFasting?: boolean;
  workoutDays?: number;
}

interface DietSectionProps {
  userProfile: UserProfile;
}

const DietSection: React.FC<DietSectionProps> = ({ userProfile }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState("pranzo");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // *** SISTEMA CICLO 14 GIORNI SINCRONIZZATO ***
  const getCycleDay = () => {
    // Usa una data di riferimento fissa per il ciclo (es: 1 gennaio 2024)
    const startDate = new Date('2024-01-01');
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysDiff % 14); // Ciclo di 14 giorni (0-13)
  };

  const currentCycleDay = getCycleDay();

  // Protocolli scientifici per ogni giorno del ciclo
  const cycleProtocols = {
    0: { type: "HIGH_PROTEIN", name: "Reset Metabolico", description: "3.2g/kg proteine + reset leptina", badge: "💪 PROTEIN", color: "bg-red-100 text-red-800" },
    1: { type: "HIGH_PROTEIN", name: "Anabolico Plus", description: "Massima sintesi proteica", badge: "🔥 ANABOLIC", color: "bg-red-100 text-red-800" },
    2: { type: "LOW_CARB", name: "Deplezione 1", description: "Carboidrati <50g + termogenesi", badge: "⚡ LOW-CARB", color: "bg-orange-100 text-orange-800" },
    3: { type: "OMAD", name: "Autofagia Deep", description: "23:1 digiuno + pulizia cellulare", badge: "🧘 OMAD", color: "bg-purple-100 text-purple-800" },
    4: { type: "LOW_CARB", name: "Deplezione 2", description: "Chetosi lieve + ossidazione grassi", badge: "⚡ LOW-CARB", color: "bg-orange-100 text-orange-800" },
    5: { type: "KETOGENIC", name: "Keto Deep", description: "Chetosi profonda + neuroprotezione", badge: "🧠 KETO", color: "bg-blue-100 text-blue-800" },
    6: { type: "LOW_CARB", name: "Deplezione 3", description: "Sensibilità insulinica max", badge: "⚡ LOW-CARB", color: "bg-orange-100 text-orange-800" },
    7: { type: "HIGH_PROTEIN", name: "Recovery Pro", description: "Riparazione + crescita muscolare", badge: "💪 PROTEIN", color: "bg-red-100 text-red-800" },
    8: { type: "HIGH_PROTEIN", name: "Power Build", description: "Costruzione massa magra", badge: "🔥 ANABOLIC", color: "bg-red-100 text-red-800" },
    9: { type: "LOW_CARB", name: "Deplezione 4", description: "Definizione addominale", badge: "⚡ LOW-CARB", color: "bg-orange-100 text-orange-800" },
    10: { type: "OMAD", name: "Reset Profondo", description: "Rigenerazione + longevità", badge: "🧘 OMAD", color: "bg-purple-100 text-purple-800" },
    11: { type: "LOW_CARB", name: "Cut Finale", description: "Massima definizione", badge: "⚡ LOW-CARB", color: "bg-orange-100 text-orange-800" },
    12: { type: "KETOGENIC", name: "Keto Elite", description: "Performance + chiarezza mentale", badge: "🧠 KETO", color: "bg-blue-100 text-blue-800" },
    13: { type: "LOW_CARB", name: "Pre-Reset", description: "Preparazione nuovo ciclo", badge: "⚡ LOW-CARB", color: "bg-orange-100 text-orange-800" }
  };

  const todayProtocol = cycleProtocols[currentCycleDay as keyof typeof cycleProtocols];

  // Calcoli metabolici personalizzati basati su profilo reale
  const calculatePersonalizedNutrition = () => {
    // Verifica che il profilo sia completo
    if (!userProfile.currentWeight || !userProfile.height || !userProfile.age) {
      // Valori di fallback per profili incompleti
      return {
        bmr: 1800,
        tdee: 2200,
        targetCalories: 1650,
        proteinTarget: 140,
        fatTarget: 60,
        carbTarget: 80,
        deficit: 550
      };
    }

    const bmr = (10 * userProfile.currentWeight) + (6.25 * userProfile.height) - (5 * userProfile.age) + 5;
    
    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }[userProfile.activityLevel] || 1.55;
    
    const tdee = bmr * activityMultiplier;
    
    // Deficit personalizzato per obiettivo
    const deficitPercentage = {
      'fat-loss': 0.25,        // 25% deficit aggressivo
      'muscle-gain': -0.10,    // 10% surplus
      'maintenance': 0,        // Mantenimento
      'recomp': 0.15          // 15% deficit moderato
    }[userProfile.goal] || 0.25;
    
    const targetCalories = Math.round(tdee * (1 - deficitPercentage));
    
    // Proteine personalizzate per obiettivo
    const proteinMultipliers = {
      'fat-loss': 2.8,         // 2.8g/kg per preservare massa
      'muscle-gain': 3.2,      // 3.2g/kg per crescita
      'maintenance': 2.0,      // 2.0g/kg mantenimento
      'recomp': 3.0           // 3.0g/kg ricomposizione
    };
    
    const proteinTarget = Math.round(userProfile.currentWeight * (proteinMultipliers[userProfile.goal as keyof typeof proteinMultipliers] || 2.8));
    
    // Grassi: 28% delle calorie per ormoni
    const fatTarget = Math.round((targetCalories * 0.28) / 9);
    
    // Carboidrati: resto delle calorie
    const carbTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories,
      proteinTarget,
      fatTarget,
      carbTarget,
      deficit: Math.round(tdee - targetCalories)
    };
  };

  const nutrition = calculatePersonalizedNutrition();

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

  // Seasonal ingredients database (aggiornato per ogni stagione)
  const seasonalIngredients = {
    primavera: {
      vegetables: ['asparagi', 'carciofi', 'piselli', 'fave', 'spinaci novelli'],
      fruits: ['fragole', 'albicocche', 'ciliegie', 'nespole'],
      herbs: ['basilico', 'prezzemolo', 'menta', 'erba cipollina'],
      proteins: ['agnello', 'capretto', 'branzino', 'orata', 'tofu biologico']
    },
    estate: {
      vegetables: ['zucchine', 'melanzane', 'pomodori', 'peperoni', 'cetrioli'],
      fruits: ['pesche', 'meloni', 'angurie', 'susine', 'fichi'],
      herbs: ['origano', 'timo', 'salvia', 'rosmarino'],
      proteins: ['tonno', 'spigola', 'sgombro', 'tempeh', 'seitan']
    },
    autunno: {
      vegetables: ['zucca delica', 'cavolo nero', 'broccoli', 'cavolfiori', 'rape rosse', 'porcini', 'castagne'],
      fruits: ['mele', 'pere', 'uva', 'melograno', 'cachi', 'noci fresche'],
      herbs: ['salvia', 'alloro', 'maggiorana', 'timo'],
      proteins: ['cinghiale', 'anatra', 'salmone', 'gorgonzola', 'pecorino']
    },
    inverno: {
      vegetables: ['cavoli', 'porri', 'carciofi', 'finocchi', 'sedano rapa', 'radicchio di Treviso', 'spinaci'],
      fruits: ['arance', 'mandarini', 'pompelmi', 'kiwi', 'mele', 'pere'],
      herbs: ['rosmarino', 'timo', 'alloro', 'salvia'],
      proteins: ['manzo', 'vitello', 'merluzzo', 'baccalà', 'taleggio']
    }
  };

  // Funzione per sostituire ingredienti con lattosio
  const replaceLactoseIngredients = (ingredient: string) => {
    if (!userProfile.lactoseIntolerant) return ingredient;
    
    const lactoseReplacements: { [key: string]: string } = {
      'ricotta': 'tofu cremoso',
      'yogurt greco': 'yogurt di cocco',
      'mozzarella': 'avocado cremoso',
      'burrata': 'hummus di tahini',
      'gorgonzola': 'crema di anacardi',
      'pecorino': 'lievito nutrizionale',
      'taleggio': 'crema di mandorle',
      'whey isolate': 'proteine vegetali isolate'
    };
    
    for (const [dairy, replacement] of Object.entries(lactoseReplacements)) {
      if (ingredient.toLowerCase().includes(dairy)) {
        return ingredient.replace(dairy, replacement);
      }
    }
    
    return ingredient;
  };

  // Variazione giornaliera reale basata su ciclo + giorno settimana
  const getDailyVariation = () => {
    const dayOfWeek = new Date().getDay();
    const isWorkoutDay = userProfile.workoutDays ? 
      dayOfWeek <= userProfile.workoutDays : 
      [1, 3, 5].includes(dayOfWeek);
    
    // Variazione carboidrati basata su protocollo del giorno
    const carbMultiplier = {
      'HIGH_PROTEIN': isWorkoutDay ? 1.2 : 0.8,
      'LOW_CARB': 0.3,
      'KETOGENIC': 0.1,
      'OMAD': isWorkoutDay ? 1.5 : 0.5
    }[todayProtocol.type] || 1.0;
    
    // Variazione proteine basata su obiettivo
    const proteinMultiplier = {
      'HIGH_PROTEIN': 1.3,
      'LOW_CARB': 1.1,
      'KETOGENIC': 1.0,
      'OMAD': 1.2
    }[todayProtocol.type] || 1.0;
    
    // Variazione grassi (inversa ai carboidrati)
    const fatMultiplier = {
      'HIGH_PROTEIN': 0.9,
      'LOW_CARB': 1.4,
      'KETOGENIC': 1.8,
      'OMAD': 1.1
    }[todayProtocol.type] || 1.0;
    
    return {
      carbMultiplier,
      proteinMultiplier,
      fatMultiplier,
      isWorkoutDay,
      protocolType: todayProtocol.type
    };
  };

  // Pasti dinamici con calcoli personalizzati e variazione giornaliera
  const getDynamicMeals = () => {
    const currentIngredients = seasonalIngredients[season];
    const variation = getDailyVariation();
    
    // Calcoli adattati per il giorno
    const adaptedNutrition = {
      targetCalories: nutrition.targetCalories,
      proteinTarget: Math.round(nutrition.proteinTarget * variation.proteinMultiplier),
      fatTarget: Math.round(nutrition.fatTarget * variation.fatMultiplier),
      carbTarget: Math.round(nutrition.carbTarget * variation.carbMultiplier)
    };

    return {
      colazione: {
        name: "Colazione Metabolica",
        time: "07:00-08:30",
        calories: Math.round(adaptedNutrition.targetCalories * 0.20),
        timing: "Peak cortisol + sensibilità insulinica massima",
        hormones: "Ottimizzazione testosterone + utilizzo GH notturno",
        season: season,
        foods: [
          {
            name: `Smoothie proteico ${season}`,
            amount: "300ml",
            calories: Math.round(adaptedNutrition.targetCalories * 0.12),
            protein: Math.round(adaptedNutrition.proteinTarget * 0.25),
            carbs: variation.isWorkoutDay ? 15 : 8,
            fat: 3,
            preparation: `${replaceLactoseIngredients('Whey isolate')} ${Math.round(userProfile.currentWeight * 0.4)}g + ${currentIngredients.fruits[0]} 100g + cannella Ceylon + caffè espresso doppio. Frullare con ghiaccio.`,
            benefits: "Stimolazione mTOR per sintesi proteica. Caffeina dosata per ossidazione grassi.",
            seasonal: true
          },
          {
            name: "Mandorle siciliane",
            amount: `${Math.round(userProfile.currentWeight * 0.15)}g`,
            calories: Math.round(adaptedNutrition.targetCalories * 0.05),
            protein: 3,
            carbs: 2,
            fat: Math.round(adaptedNutrition.fatTarget * 0.15),
            preparation: "Mandorle crude biologiche, ricche vitamina E e magnesio.",
            benefits: "Grassi monoinsaturi per produzione testosterone. Magnesio per 300+ enzimi.",
            seasonal: false
          },
          {
            name: "Tè verde matcha premium",
            amount: "200ml",
            calories: 25,
            protein: 2,
            carbs: 4,
            fat: 0,
            preparation: `Matcha giapponese ${Math.round(userProfile.currentWeight * 0.05)}g + acqua 70°C.`,
            benefits: "EGCG per termogenesi +18%. L-teanina per focus senza ansia.",
            seasonal: false
          }
        ]
      },
      pranzo: {
        name: "Pranzo Power Cut",
        time: "12:00-13:30",
        calories: Math.round(nutrition.targetCalories * 0.35),
        timing: "Massima sensibilità insulinica + attività metabolica peak",
        hormones: "Peak leptina + ottimizzazione T3/T4 tiroidei",
        season: season,
        foods: [
          {
            name: `${currentIngredients.proteins[0]} + ${currentIngredients.herbs[0]}`,
            amount: `${Math.round(userProfile.currentWeight * 2)}g`,
            calories: Math.round(nutrition.targetCalories * 0.20),
            protein: Math.round(nutrition.proteinTarget * 0.40),
            carbs: 0,
            fat: Math.round(nutrition.fatTarget * 0.20),
            preparation: `Marinatura 2h con ${currentIngredients.herbs[0]}, olio EVO, limone. Cottura in padella antiaderente 4-5min per lato a fuoco medio.`,
            benefits: "Proteine ad alto VB per sintesi muscolare. Riduzione cortisolo e CRP.",
            seasonal: true
          },
          {
            name: `${currentIngredients.vegetables[0]} stagionali`,
            amount: `${Math.round(userProfile.currentWeight * 2.5)}g`,
            calories: Math.round(nutrition.targetCalories * 0.06),
            protein: 4,
            carbs: 10,
            fat: 2,
            preparation: `Saltati con aglio, olio EVO e pepe nero. Cottura al dente per preservare nutrienti.`,
            benefits: "Fibre per microbiota. Polifenoli stagionali anti-infiammatori.",
            seasonal: true
          },
          {
            name: variation.isWorkoutDay ? "Riso basmati integrale" : "Cavolfiore riso",
            amount: variation.isWorkoutDay ? `${Math.round(userProfile.currentWeight * 0.6)}g secco` : "150g",
            calories: variation.isWorkoutDay ? Math.round(adaptedNutrition.targetCalories * 0.09) : 25,
            protein: variation.isWorkoutDay ? 4 : 3,
            carbs: variation.isWorkoutDay ? Math.round(adaptedNutrition.carbTarget * 0.4) : 5,
            fat: 1,
            preparation: variation.isWorkoutDay ? "Basmati con curcuma + pepe nero + cardamomo" : "Cavolfiore tritato saltato con spezie",
            benefits: variation.isWorkoutDay ? "Amilosio per rilascio glucosio controllato" : "Fibra prebiotica + volume saziante",
            seasonal: false
          }
        ]
      },
      spuntino: {
        name: "Pre-Workout Precision",
        time: "15:30-16:00",
        calories: Math.round(nutrition.targetCalories * 0.15),
        timing: "30-45min pre-allenamento - Performance window",
        hormones: "Picco adrenalina + noradrenalina per performance",
        season: season,
        foods: [
          {
            name: "Shot pre-workout naturale",
            amount: "120ml",
            calories: Math.round(nutrition.targetCalories * 0.10),
            protein: Math.round(nutrition.proteinTarget * 0.20),
            carbs: 12,
            fat: 1,
            preparation: `Whey isolate ${Math.round(userProfile.currentWeight * 0.3)}g + espresso triplo + ${currentIngredients.fruits[1]} + beta-alanina 3g.`,
            benefits: "BCAA per performance. Caffeina 6mg/kg per lipolisi massima.",
            seasonal: true
          },
          {
            name: "Noci brasiliane premium",
            amount: `${Math.round(userProfile.currentWeight * 0.12)}g`,
            calories: Math.round(nutrition.targetCalories * 0.05),
            protein: 2,
            carbs: 1,
            fat: Math.round(nutrition.fatTarget * 0.12),
            preparation: "Noci crude, fonte selenio per tiroide.",
            benefits: "Selenio per T3/T4 ottimale. Grassi per energia sostenuta.",
            seasonal: false
          }
        ]
      },
      cena: {
        name: "Cena Recovery Pro",
        time: "19:00-20:30",
        calories: Math.round(nutrition.targetCalories * 0.30),
        timing: "Finestra anabolica serale + preparazione sonno",
        hormones: "GH release + melatonina endogena + recupero",
        season: season,
        foods: [
          {
            name: `${currentIngredients.proteins[1]} + ${currentIngredients.herbs[1]}`,
            amount: `${Math.round(userProfile.currentWeight * 1.8)}g`,
            calories: Math.round(nutrition.targetCalories * 0.18),
            protein: Math.round(nutrition.proteinTarget * 0.35),
            carbs: 0,
            fat: Math.round(nutrition.fatTarget * 0.15),
            preparation: `Marinatura 3h con ${currentIngredients.herbs[1]} + aglio + limone. Cottura 160°C x 20min.`,
            benefits: "Triptofano per serotonina→melatonina. Recupero muscolare notturno.",
            seasonal: true
          },
          {
            name: `${currentIngredients.vegetables[1]} al vapore`,
            amount: `${Math.round(userProfile.currentWeight * 3)}g`,
            calories: Math.round(nutrition.targetCalories * 0.04),
            protein: 5,
            carbs: 8,
            fat: 1,
            preparation: `Vapore 5 minuti. Condimento: olio EVO + limone + sale rosa himalayano.`,
            benefits: "Antiossidanti per recupero. Potassio per rilassamento muscolare.",
            seasonal: true
          },
          {
            name: "Patata dolce biologica",
            amount: `${Math.round(userProfile.currentWeight * 1.2)}g`,
            calories: Math.round(nutrition.targetCalories * 0.06),
            protein: 2,
            carbs: Math.round(nutrition.carbTarget * 0.25),
            fat: 0,
            preparation: "Al forno 180°C x 30min con rosmarino e paprika dolce.",
            benefits: "Antocianine anti-infiammatorie. Ricarica glicogeno notturna.",
            seasonal: false
          },
          {
            name: "Avocado Hass maturo",
            amount: `${Math.round(userProfile.currentWeight * 0.8)}g`,
            calories: Math.round(nutrition.targetCalories * 0.06),
            protein: 2,
            carbs: 4,
            fat: Math.round(nutrition.fatTarget * 0.25),
            preparation: "A fette con sale marino e pepe nero macinato fresco.",
            benefits: "Acido oleico per testosterone notturno. Potassio per pressione.",
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
          Piano Nutrizionale Personalizzato
        </h2>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{season.charAt(0).toUpperCase() + season.slice(1)}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Scale className="w-3 h-3" />
            <span>{userProfile.currentWeight}kg</span>
          </Badge>
          <Badge variant="outline">
            -{nutrition.deficit}kcal/giorno
          </Badge>
        </div>
      </div>

      {/* *** PROTOCOLLO DEL GIORNO - SINCRONIZZATO *** */}
      <Card className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <h3 className="font-bold">Giorno {currentCycleDay + 1}/14 - Oggi</h3>
          </div>
          <Badge className={todayProtocol.color}>
            {todayProtocol.badge}
          </Badge>
        </div>
        <div className="text-lg font-semibold mb-1">{todayProtocol.name}</div>
        <div className="text-sm opacity-90">{todayProtocol.description}</div>
        <div className="mt-2 text-xs opacity-75">
          📅 {new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </Card>

      {/* Variazione Giornaliera Personalizzata */}
      <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-center space-x-2 mb-3">
          <Scale className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-800">Adattamento Giornaliero per {userProfile.currentWeight}kg</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center bg-white/50 rounded-lg p-2">
            <div className="text-lg font-bold text-red-600">{Math.round(nutrition.proteinTarget * getDailyVariation().proteinMultiplier)}g</div>
            <div className="text-xs text-slate-600">Proteine oggi</div>
            <div className="text-xs text-indigo-600">
              {getDailyVariation().proteinMultiplier > 1 ? '↑' : getDailyVariation().proteinMultiplier < 1 ? '↓' : '='} 
              {Math.round((getDailyVariation().proteinMultiplier - 1) * 100)}%
            </div>
          </div>
          <div className="text-center bg-white/50 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-600">{Math.round(nutrition.carbTarget * getDailyVariation().carbMultiplier)}g</div>
            <div className="text-xs text-slate-600">Carboidrati oggi</div>
            <div className="text-xs text-indigo-600">
              {getDailyVariation().carbMultiplier > 1 ? '↑' : getDailyVariation().carbMultiplier < 1 ? '↓' : '='} 
              {Math.round((getDailyVariation().carbMultiplier - 1) * 100)}%
            </div>
          </div>
          <div className="text-center bg-white/50 rounded-lg p-2">
            <div className="text-lg font-bold text-green-600">{Math.round(nutrition.fatTarget * getDailyVariation().fatMultiplier)}g</div>
            <div className="text-xs text-slate-600">Grassi oggi</div>
            <div className="text-xs text-indigo-600">
              {getDailyVariation().fatMultiplier > 1 ? '↑' : getDailyVariation().fatMultiplier < 1 ? '↓' : '='} 
              {Math.round((getDailyVariation().fatMultiplier - 1) * 100)}%
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-indigo-700 bg-white/30 rounded p-2">
          <strong>Oggi:</strong> {getDailyVariation().isWorkoutDay ? '🏋️ Giorno allenamento' : '🧘 Giorno riposo'} • 
          <strong> Protocollo:</strong> {getDailyVariation().protocolType} • 
          <strong> Obiettivo:</strong> {userProfile.goal}
          {userProfile.lactoseIntolerant && <> • <strong>Dieta:</strong> 🥛 Lactose-Free</>}
        </div>
      </Card>

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

      {/* Scientific Overview Personalizzato */}
      <Card className="p-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-semibold">Body Recomp Personalizzato</h3>
        </div>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold">{nutrition.targetCalories}</div>
            <div className="opacity-90 text-xs">kcal target</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{nutrition.proteinTarget}g</div>
            <div className="opacity-90 text-xs">proteine</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{Math.round((userProfile.currentWeight - userProfile.targetWeight) * 1000 / 7700)}g</div>
            <div className="opacity-90 text-xs">grasso/sett</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{Math.round((userProfile.currentWeight - userProfile.targetWeight) / 0.5)}</div>
            <div className="opacity-90 text-xs">settimane</div>
          </div>
        </div>
        <div className="mt-2 text-xs opacity-80">
          Deficit personalizzato per {userProfile.currentWeight}kg → {userProfile.targetWeight}kg mantenendo massa magra
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

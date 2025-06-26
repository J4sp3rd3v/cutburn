import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Utensils, Target, ChefHat, BookOpen, Zap, Leaf, Calendar, Scale, Flame, Activity, TrendingUp, Star, Heart } from 'lucide-react';

interface UserProfile {
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  activityLevel: string;
  goal: string;
  targeted_fat_area?: string;
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

  // Protocolli scientifici ottimizzati per GINECOMASTIA + GRASSO VISCERALE
  const cycleProtocols = {
    0: { type: "ANTI_ESTROGEN", name: "Reset Anti-Estrogenico", description: "Crucifere + DIM + deficit 1000kcal", badge: "🚫 ANTI-E2", color: "bg-red-100 text-red-800" },
    1: { type: "OMAD_EXTREME", name: "Digiuno 23:1 + Lipolisi", description: "Autofagia + HGH + cortisolo ottimale", badge: "⚡ OMAD-X", color: "bg-purple-100 text-purple-800" },
    2: { type: "KETO_VISCERAL", name: "Keto Anti-Viscerale", description: "Chetosi + MCT + grasso addominale", badge: "🔥 KETO-V", color: "bg-blue-100 text-blue-800" },
    3: { type: "PSMF", name: "PSMF Extreme", description: "Protein Sparing Modified Fast", badge: "💪 PSMF", color: "bg-green-100 text-green-800" },
    4: { type: "ANTI_INFLAMMATORY", name: "Anti-Infiammatorio", description: "Omega-3 + curcuma + deficit massimo", badge: "🌿 ANTI-I", color: "bg-yellow-100 text-yellow-800" },
    5: { type: "OMAD_EXTREME", name: "Digiuno Prolungato", description: "22:2 + termogenesi + lipolisi", badge: "⚡ OMAD-X", color: "bg-purple-100 text-purple-800" },
    6: { type: "CARB_CYCLING", name: "Carb Cycling Estremo", description: "0g carbs + refeed strategico", badge: "🔄 CYCLE", color: "bg-orange-100 text-orange-800" },
    7: { type: "ANTI_ESTROGEN", name: "Detox Estrogenico", description: "Fegato + aromatasi + DIM", badge: "🚫 ANTI-E2", color: "bg-red-100 text-red-800" },
    8: { type: "PSMF", name: "Cut Aggressivo", description: "800kcal + 3.5g/kg proteine", badge: "💪 PSMF", color: "bg-green-100 text-green-800" },
    9: { type: "KETO_VISCERAL", name: "Keto Addominale", description: "Beta-idrossibutirrato + visceral fat", badge: "🔥 KETO-V", color: "bg-blue-100 text-blue-800" },
    10: { type: "OMAD_EXTREME", name: "Digiuno Terapeutico", description: "20:4 + autophagy + HGH release", badge: "⚡ OMAD-X", color: "bg-purple-100 text-purple-800" },
    11: { type: "ANTI_INFLAMMATORY", name: "Reset Sistemico", description: "EPA/DHA + polifenoli + deficit", badge: "🌿 ANTI-I", color: "bg-yellow-100 text-yellow-800" },
    12: { type: "CARB_CYCLING", name: "Deplezione Finale", description: "Glicogeno zero + lipolisi max", badge: "🔄 CYCLE", color: "bg-orange-100 text-orange-800" },
    13: { type: "ANTI_ESTROGEN", name: "Pre-Reset Ormonale", description: "Testosterone + anti-aromatasi", badge: "🚫 ANTI-E2", color: "bg-red-100 text-red-800" }
  };

  const todayProtocol = cycleProtocols[currentCycleDay as keyof typeof cycleProtocols];

  // Calcoli metabolici ESTREMI per GINECOMASTIA + GRASSO VISCERALE
  const calculatePersonalizedNutrition = () => {
    // Verifica che il profilo sia completo
    if (!userProfile.currentWeight || !userProfile.height || !userProfile.age) {
      // Valori di fallback per profili incompleti
      return {
        bmr: 1800,
        tdee: 2200,
        targetCalories: 1200,
        proteinTarget: 180,
        fatTarget: 40,
        carbTarget: 20,
        deficit: 1000,
        fastingWindow: "20:4"
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
    
    // DEFICIT MASSIMO per GINECOMASTIA (35-40% del TDEE)
    const extremeDeficitPercentage = 0.38; // 38% deficit estremo
    const bonusDeficit = 250; // Deficit extra per grasso viscerale
    const totalDeficit = Math.round(tdee * extremeDeficitPercentage) + bonusDeficit;
    
    // Calorie target MINIME ma sicure (non sotto BMR-200)
    const minSafeCalories = Math.max(bmr - 200, 1000);
    const targetCalories = Math.max(minSafeCalories, tdee - totalDeficit);
    
    // PROTEINE MASSIME per preservare massa magra (3.5g/kg)
    const proteinTarget = Math.round(userProfile.currentWeight * 3.5);
    
    // GRASSI MINIMI per ormoni (testosterone/estrogeni) - 0.8g/kg
    const fatTarget = Math.round(userProfile.currentWeight * 0.8);
    
    // CARBOIDRATI MINIMI (solo post-workout se presente)
    const protocolType = todayProtocol.type;
    let carbTarget = 0;
    
    if (protocolType === "CARB_CYCLING") {
      carbTarget = Math.round(userProfile.currentWeight * 0.5); // 0.5g/kg solo nei giorni refeed
    } else if (protocolType === "PSMF") {
      carbTarget = 10; // Praticamente zero
    } else {
      carbTarget = Math.max(10, Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4));
    }

    // Finestra di digiuno basata sul protocollo
    const fastingWindows = {
      "OMAD_EXTREME": "23:1",
      "PSMF": "20:4", 
      "KETO_VISCERAL": "18:6",
      "ANTI_ESTROGEN": "16:8",
      "ANTI_INFLAMMATORY": "16:8",
      "CARB_CYCLING": "18:6"
    };

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories,
      proteinTarget,
      fatTarget,
      carbTarget,
      deficit: Math.round(tdee - targetCalories),
      fastingWindow: fastingWindows[protocolType as keyof typeof fastingWindows] || "16:8"
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

  // Ingredienti SPECIFICI per GINECOMASTIA + GRASSO VISCERALE
  const seasonalIngredients = {
    primavera: {
      vegetables: ['broccoli', 'cavolfiori', 'cavolo nero', 'rucola', 'spinaci', 'asparagi'], // Crucifere anti-estrogeniche
      fruits: ['pompelmo rosa', 'limoni', 'mirtilli', 'fragole'], // Basso indice glicemico + antocianine
      herbs: ['curcuma', 'zenzero', 'prezzemolo', 'coriandolo'], // Anti-infiammatori
      proteins: ['salmone selvaggio', 'sgombro', 'sardine', 'petto di pollo', 'manzo grass-fed'], // Omega-3 + proteine magre
      antiEstrogen: ['DIM (crucifere)', 'tè verde matcha', 'semi di lino', 'melograno'] // Inibitori aromatasi
    },
    estate: {
      vegetables: ['cavolo cappuccio', 'broccoli', 'cetrioli', 'sedano', 'peperoni rossi', 'pomodori'],
      fruits: ['anguria', 'melone', 'mirtilli', 'lamponi'], // Idratanti + antiossidanti
      herbs: ['basilico', 'origano', 'menta', 'curcuma fresca'],
      proteins: ['tonno', 'spigola', 'orata', 'tacchino', 'uova bio'],
      antiEstrogen: ['semi di zucca', 'noci', 'tè bianco', 'pomodori (licopene)']
    },
    autunno: {
      vegetables: ['cavoletti di Bruxelles', 'cavolo rosso', 'zucca', 'rape', 'finocchi', 'carciofi'],
      fruits: ['mele', 'pere', 'melograno', 'mirtilli rossi'], // Quercetina + resveratrolo
      herbs: ['rosmarino', 'salvia', 'timo', 'curcuma'],
      proteins: ['salmone', 'merluzzo', 'manzo', 'agnello', 'uova'],
      antiEstrogen: ['melograno', 'noci', 'semi di sesamo', 'funghi shiitake']
    },
    inverno: {
      vegetables: ['cavoli', 'broccoli', 'cavolfiori', 'spinaci', 'bietole', 'porri'],
      fruits: ['arance', 'pompelmi', 'kiwi', 'mirtilli congelati'], // Vitamina C + antiossidanti
      herbs: ['zenzero', 'curcuma', 'cannella', 'pepe nero'],
      proteins: ['salmone', 'sgombro', 'manzo', 'pollo', 'uova'],
      antiEstrogen: ['tè verde', 'semi di lino', 'aglio', 'cipolle rosse']
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

  // Variazione ESTREMA per GINECOMASTIA + GRASSO VISCERALE
  const getDailyVariation = () => {
    const dayOfWeek = new Date().getDay();
    const isWorkoutDay = userProfile.workoutDays ? 
      dayOfWeek <= userProfile.workoutDays : 
      [1, 3, 5].includes(dayOfWeek);
    
    // Variazione carboidrati ESTREMA per protocolli anti-ginecomastia
    const carbMultiplier = {
      'ANTI_ESTROGEN': 0.1,      // Quasi zero carbs per ridurre insulina
      'OMAD_EXTREME': 0.05,      // Solo verdure fibrose
      'KETO_VISCERAL': 0.08,     // Chetosi profonda
      'PSMF': 0.03,              // Protein sparing - zero carbs
      'ANTI_INFLAMMATORY': 0.15, // Solo anti-infiammatori
      'CARB_CYCLING': isWorkoutDay ? 0.8 : 0.02 // Refeed solo workout
    }[todayProtocol.type] || 0.1;
    
    // Variazione proteine MASSIMA per preservare massa
    const proteinMultiplier = {
      'ANTI_ESTROGEN': 1.4,      // 3.5g/kg per detox
      'OMAD_EXTREME': 1.3,       // Concentrata in finestra
      'KETO_VISCERAL': 1.2,      // Mantenere chetosi
      'PSMF': 1.5,               // Massimo per PSMF
      'ANTI_INFLAMMATORY': 1.3,  // Riparazione tessuti
      'CARB_CYCLING': 1.4        // Compensare carbs bassi
    }[todayProtocol.type] || 1.3;
    
    // Variazione grassi per ORMONI e SAZIETÀ
    const fatMultiplier = {
      'ANTI_ESTROGEN': 1.1,      // Testosterone support
      'OMAD_EXTREME': 1.3,       // Sazietà prolungata
      'KETO_VISCERAL': 2.2,      // Chetosi + MCT
      'PSMF': 0.6,               // Minimi per PSMF
      'ANTI_INFLAMMATORY': 1.4,  // Omega-3 massimo
      'CARB_CYCLING': 1.2        // Bilanciare macro
    }[todayProtocol.type] || 1.0;
    
    return {
      carbMultiplier,
      proteinMultiplier,
      fatMultiplier,
      isWorkoutDay,
      protocolType: todayProtocol.type,
      fastingWindow: nutrition.fastingWindow
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
        name: todayProtocol.type === "OMAD_EXTREME" ? "Digiuno Prolungato" : "Colazione Anti-Ginecomastia",
        time: todayProtocol.type === "OMAD_EXTREME" ? "DIGIUNO fino 13:00" : "07:00-08:30",
        calories: todayProtocol.type === "OMAD_EXTREME" ? 0 : Math.round(adaptedNutrition.targetCalories * 0.15),
        timing: todayProtocol.type === "OMAD_EXTREME" ? "Autofagia + HGH release + lipolisi" : "Cortisol basso + anti-aromatasi",
        hormones: todayProtocol.type === "OMAD_EXTREME" ? "GH +300%, glucagone +200%, autofagia attiva" : "Testosterone boost + inibizione estrogeni",
        season: season,
        foods: todayProtocol.type === "OMAD_EXTREME" ? [
          {
            name: "Digiuno Terapeutico",
            amount: "0 calorie",
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            preparation: "Solo acqua, tè verde, caffè nero. Elettroliti se necessario.",
            benefits: "Autofagia massima, HGH +500%, lipolisi ottimale, sensibilità insulinica reset.",
            seasonal: false
          }
        ] : [
          {
            name: `Shot Anti-Ginecomastia ${season}`,
            amount: "250ml",
            calories: Math.round(adaptedNutrition.targetCalories * 0.08),
            protein: Math.round(adaptedNutrition.proteinTarget * 0.20),
            carbs: 3,
            fat: 2,
            preparation: `Proteine isolate ${Math.round(userProfile.currentWeight * 0.3)}g + ${currentIngredients.antiEstrogen[0]} + curcuma 2g + pepe nero + tè verde matcha concentrato.`,
            benefits: "DIM inibisce aromatasi, curcuma riduce infiammazione, matcha accelera lipolisi.",
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
        name: todayProtocol.type === "OMAD_EXTREME" ? "Pasto Unico OMAD" : "Pranzo Anti-Viscerale",
        time: todayProtocol.type === "OMAD_EXTREME" ? "13:00-14:00 (FINESTRA)" : "12:00-13:30",
        calories: todayProtocol.type === "OMAD_EXTREME" ? Math.round(nutrition.targetCalories * 0.85) : Math.round(nutrition.targetCalories * 0.45),
        timing: todayProtocol.type === "OMAD_EXTREME" ? "Finestra alimentare unica - massima concentrazione" : "Insulina controllata + termogenesi",
        hormones: todayProtocol.type === "OMAD_EXTREME" ? "Leptina reset, IGF-1 ottimale, testosterone peak" : "Anti-aromatasi + lipolisi viscerale",
        season: season,
        foods: [
          {
            name: `${currentIngredients.proteins[0]} Anti-Ginecomastia`,
            amount: `${Math.round(userProfile.currentWeight * (todayProtocol.type === "OMAD_EXTREME" ? 3.2 : 2.5))}g`,
            calories: Math.round(nutrition.targetCalories * (todayProtocol.type === "OMAD_EXTREME" ? 0.35 : 0.25)),
            protein: Math.round(nutrition.proteinTarget * (todayProtocol.type === "OMAD_EXTREME" ? 0.65 : 0.45)),
            carbs: 0,
            fat: Math.round(nutrition.fatTarget * (todayProtocol.type === "OMAD_EXTREME" ? 0.4 : 0.25)),
            preparation: `Marinatura con ${currentIngredients.herbs[0]}, aglio, zenzero fresco. Cottura a bassa temperatura per preservare omega-3.`,
            benefits: "Omega-3 EPA/DHA riducono infiammazione sistemica. Proteine preservano massa magra durante deficit estremo.",
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
    <div className="space-y-6">
      {/* Header Section con animazione */}
      <div className="text-center py-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-200">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-3">
          Piano Nutrizionale Personalizzato
        </h2>
        <div className="flex items-center justify-center space-x-6 text-sm flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{season.charAt(0).toUpperCase() + season.slice(1)}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5">
            <Scale className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{userProfile.currentWeight}kg</span>
          </Badge>
                     <Badge variant="outline" className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5">
             <TrendingUp className="w-4 h-4 text-red-600" />
             <span className="font-medium">-{nutrition.deficit}kcal/giorno</span>
           </Badge>
           <Badge variant="outline" className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5">
             <Clock className="w-4 h-4 text-purple-600" />
             <span className="font-medium">Digiuno {nutrition.fastingWindow}</span>
          </Badge>
        </div>
      </div>

      {/* Protocollo del Giorno - Card migliorata */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Calendar className="w-6 h-6" />
          </div>
              <div>
                <h3 className="font-bold text-xl">Giorno {currentCycleDay + 1}/14</h3>
                <p className="text-sm opacity-80">Ciclo Personalizzato</p>
              </div>
            </div>
            <Badge className={`${todayProtocol.color} px-4 py-2 text-sm font-semibold`}>
            {todayProtocol.badge}
          </Badge>
        </div>
                     <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
             <div className="text-2xl font-bold mb-2">{todayProtocol.name}</div>
             <div className="text-base opacity-90 mb-3">{todayProtocol.description}</div>
             <div className="bg-white/15 rounded-lg p-3 mb-3">
               <div className="text-sm font-semibold mb-2">🎯 Focus Anti-Ginecomastia:</div>
               <div className="text-xs opacity-90 space-y-1">
                 <div>• Deficit estremo: -{nutrition.deficit}kcal per lipolisi massima</div>
                 <div>• Digiuno {nutrition.fastingWindow}: HGH +400%, autofagia attiva</div>
                 <div>• Anti-aromatasi: DIM, crucifere, tè verde</div>
                 <div>• Anti-infiammatorio: curcuma, omega-3, polifenoli</div>
               </div>
             </div>
             <div className="flex items-center text-sm opacity-75">
               <Clock className="w-4 h-4 mr-2" />
               {new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </div>
           </div>
        </div>
      </Card>

      {/* Adattamento Giornaliero - Card ridisegnata */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Activity className="w-6 h-6 text-indigo-600" />
        </div>
            <div>
              <h3 className="font-bold text-xl text-indigo-900">Adattamento Giornaliero</h3>
              <p className="text-sm text-indigo-600">Personalizzato per {userProfile.currentWeight}kg</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-red-200 rounded-lg">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-700">{Math.round(nutrition.proteinTarget * getDailyVariation().proteinMultiplier)}g</div>
                  <div className="text-xs text-red-600 font-medium">Proteine oggi</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">Variazione</span>
                <Badge className={`${getDailyVariation().proteinMultiplier > 1 ? 'bg-green-100 text-green-700' : getDailyVariation().proteinMultiplier < 1 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
              {getDailyVariation().proteinMultiplier > 1 ? '↑' : getDailyVariation().proteinMultiplier < 1 ? '↓' : '='} 
              {Math.round((getDailyVariation().proteinMultiplier - 1) * 100)}%
                </Badge>
            </div>
          </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-700">{Math.round(nutrition.carbTarget * getDailyVariation().carbMultiplier)}g</div>
                  <div className="text-xs text-blue-600 font-medium">Carboidrati oggi</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600">Variazione</span>
                <Badge className={`${getDailyVariation().carbMultiplier > 1 ? 'bg-green-100 text-green-700' : getDailyVariation().carbMultiplier < 1 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
              {getDailyVariation().carbMultiplier > 1 ? '↑' : getDailyVariation().carbMultiplier < 1 ? '↓' : '='} 
              {Math.round((getDailyVariation().carbMultiplier - 1) * 100)}%
                </Badge>
            </div>
          </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-200 rounded-lg">
                  <Flame className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-700">{Math.round(nutrition.fatTarget * getDailyVariation().fatMultiplier)}g</div>
                  <div className="text-xs text-green-600 font-medium">Grassi oggi</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Variazione</span>
                <Badge className={`${getDailyVariation().fatMultiplier > 1 ? 'bg-green-100 text-green-700' : getDailyVariation().fatMultiplier < 1 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
              {getDailyVariation().fatMultiplier > 1 ? '↑' : getDailyVariation().fatMultiplier < 1 ? '↓' : '='} 
              {Math.round((getDailyVariation().fatMultiplier - 1) * 100)}%
                </Badge>
            </div>
          </div>
        </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-indigo-800">Status Giornaliero</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Badge className={getDailyVariation().isWorkoutDay ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                  {getDailyVariation().isWorkoutDay ? '🏋️ Allenamento' : '🧘 Riposo'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-700 font-medium">Protocollo:</span>
                <span className="text-indigo-600">{getDailyVariation().protocolType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-700 font-medium">Obiettivo:</span>
                <span className="text-indigo-600">{userProfile.goal}</span>
              </div>
            </div>
            {userProfile.lactoseIntolerant && (
              <div className="mt-2 flex items-center space-x-2">
                <Badge className="bg-yellow-100 text-yellow-700">🥛 Lactose-Free</Badge>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Real-time meal alert - migliorato */}
      {optimalMeal && (
        <Alert className="border-0 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-200 rounded-lg">
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <AlertDescription className="text-orange-800 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-lg">🎯 TIMING OTTIMALE</span>
                  <p className="text-sm mt-1">È il momento perfetto per il tuo pasto!</p>
                </div>
            <Button 
                  variant="default" 
              size="sm" 
                  className="bg-orange-600 hover:bg-orange-700 text-white shadow-md"
              onClick={() => setSelectedMeal(optimalMeal)}
            >
              {meals[optimalMeal as keyof typeof meals].name}
            </Button>
              </div>
          </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Scientific Overview - Card completamente ridisegnata */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 text-white relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BookOpen className="w-7 h-7" />
        </div>
            <div>
              <h3 className="font-bold text-2xl">Body Recomp Personalizzato</h3>
              <p className="opacity-90">Basato su ricerca scientifica 2024-2025</p>
          </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-1">{nutrition.targetCalories}</div>
              <div className="text-sm opacity-90">kcal target</div>
          </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-1">{nutrition.proteinTarget}g</div>
              <div className="text-sm opacity-90">proteine</div>
          </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-1">{Math.round((userProfile.currentWeight - userProfile.targetWeight) * 1000 / 7700)}g</div>
              <div className="text-sm opacity-90">grasso/sett</div>
        </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-1">{Math.round((userProfile.currentWeight - userProfile.targetWeight) / 0.5)}</div>
              <div className="text-sm opacity-90">settimane</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="text-sm opacity-90 leading-relaxed">
              Deficit personalizzato per <strong>{userProfile.currentWeight}kg → {userProfile.targetWeight}kg</strong> mantenendo massa magra.
              Protocollo ottimizzato per massima lipolisi addominale.
            </p>
          </div>
        </div>
      </Card>

      {/* Meal Selection - Migliorato */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
        <h4 className="font-semibold text-lg mb-4 text-slate-800 flex items-center space-x-2">
          <Utensils className="w-5 h-5 text-blue-500" />
          <span>Seleziona Pasto</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(meals).map(([key, meal]) => (
          <Button
            key={key}
            variant={selectedMeal === key ? "default" : "outline"}
              size="lg"
            onClick={() => setSelectedMeal(key)}
              className={`relative h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-105 ${
                selectedMeal === key 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'hover:bg-slate-50'
              } ${optimalMeal === key ? 'ring-2 ring-orange-400 ring-offset-2' : ''}`}
          >
            {optimalMeal === key && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
            )}
              <div className="text-lg font-semibold">{meal.name.split(' ')[0]}</div>
              <div className="text-xs opacity-75">{meal.time}</div>
          </Button>
        ))}
        </div>
      </div>

      {/* Meal Details - Card completamente ridisegnata */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Utensils className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-slate-800">{currentMeal.name}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{currentMeal.time}</span>
                  </div>
            {currentMeal.season && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Leaf className="w-3 h-3 mr-1" />
                      Stagionale
              </Badge>
            )}
          </div>
              </div>
          </div>
        </div>

          {/* Cronobiologia Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 mb-6 border border-purple-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-200 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
          </div>
              <h4 className="font-bold text-lg text-purple-800">Cronobiologia Nutrizionale</h4>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/70 rounded-xl p-4">
                <div className="font-semibold text-sm text-purple-700 mb-2">⏰ Timing Ottimale</div>
                <p className="text-sm text-slate-700">{currentMeal.timing}</p>
              </div>
              <div className="bg-white/70 rounded-xl p-4">
                <div className="font-semibold text-sm text-purple-700 mb-2">🧬 Ottimizzazione Ormonale</div>
                <p className="text-sm text-slate-700">{currentMeal.hormones}</p>
              </div>
          </div>
        </div>

          {/* Enhanced Macros - Ridisegnato */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200">
              <div className="p-2 bg-orange-200 rounded-lg w-fit mx-auto mb-2">
                <Flame className="w-5 h-5 text-orange-600" />
          </div>
              <div className="text-2xl font-bold text-orange-700 mb-1">{currentMeal.calories}</div>
              <div className="text-xs text-orange-600 font-medium">kcal</div>
          </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center border border-red-200">
              <div className="p-2 bg-red-200 rounded-lg w-fit mx-auto mb-2">
                <Heart className="w-5 h-5 text-red-600" />
          </div>
              <div className="text-2xl font-bold text-red-700 mb-1">{totalProtein}g</div>
              <div className="text-xs text-red-600 font-medium">proteine</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
              <div className="p-2 bg-blue-200 rounded-lg w-fit mx-auto mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700 mb-1">{totalCarbs}g</div>
              <div className="text-xs text-blue-600 font-medium">carbs</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
              <div className="p-2 bg-green-200 rounded-lg w-fit mx-auto mb-2">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700 mb-1">{totalFat}g</div>
              <div className="text-xs text-green-600 font-medium">grassi</div>
          </div>
        </div>

          {/* Enhanced Foods List - Completamente ridisegnato */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-slate-800 flex items-center space-x-2">
              <ChefHat className="w-5 h-5 text-slate-600" />
              <span>Ingredienti e Preparazione</span>
            </h4>
          {currentMeal.foods.map((food, index) => (
              <Card key={index} className={`overflow-hidden border-0 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                food.seasonal 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' 
                  : 'bg-gradient-to-br from-slate-50 to-white border border-slate-200'
              }`}>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${food.seasonal ? 'bg-green-200' : 'bg-slate-200'}`}>
                        <Utensils className={`w-5 h-5 ${food.seasonal ? 'text-green-600' : 'text-slate-600'}`} />
                      </div>
                      <div>
                        <h5 className="font-bold text-lg text-slate-800">{food.name}</h5>
                        <p className="text-sm text-slate-600 font-medium">{food.amount}</p>
                      </div>
                    </div>
                <div className="flex items-center space-x-2">
                  {food.seasonal && (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                      <Leaf className="w-3 h-3 mr-1" />
                      {season}
                    </Badge>
                  )}
                      <Badge variant="outline" className="bg-white/80 font-semibold">
                  {food.calories} kcal
                </Badge>
              </div>
              </div>

                  <div className="bg-white/70 rounded-xl p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 bg-slate-200 rounded-lg">
                        <ChefHat className="w-4 h-4 text-slate-600" />
              </div>
                      <div>
                        <h6 className="font-semibold text-sm text-slate-700 mb-1">Preparazione</h6>
                        <p className="text-sm text-slate-600 leading-relaxed">{food.preparation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 bg-blue-200 rounded-lg">
                        <Star className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h6 className="font-semibold text-sm text-blue-700 mb-1">Benefici Scientifici</h6>
                        <p className="text-sm text-blue-600 leading-relaxed italic">{food.benefits}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                      <div className="text-lg font-bold text-red-600">{food.protein}g</div>
                      <div className="text-xs text-red-500 font-medium">Proteine</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                      <div className="text-lg font-bold text-blue-600">{food.carbs}g</div>
                      <div className="text-xs text-blue-500 font-medium">Carboidrati</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                      <div className="text-lg font-bold text-green-600">{food.fat}g</div>
                      <div className="text-xs text-green-500 font-medium">Grassi</div>
                    </div>
                  </div>
              </div>
            </Card>
          ))}
          </div>
        </div>
      </Card>

      {/* Enhanced Daily Target - Completamente ridisegnato */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Target className="w-7 h-7" />
        </div>
            <div>
              <h3 className="font-bold text-2xl">Target Giornaliero Body Recomp</h3>
              <p className="opacity-90">Totali calcolati per oggi</p>
          </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-1">{dailyTotals.calories}</div>
              <div className="text-sm opacity-90">kcal totali</div>
          </div>
            <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-1">{Math.round(dailyTotals.protein)}g</div>
              <div className="text-sm opacity-90">proteine</div>
          </div>
            <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-1">{Math.round(dailyTotals.carbs)}g</div>
              <div className="text-sm opacity-90">carbs</div>
        </div>
            <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-1">{Math.round(dailyTotals.fat)}g</div>
              <div className="text-sm opacity-90">grassi</div>
            </div>
          </div>
          
          <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90 leading-relaxed">
              <strong>Ratio ottimizzato:</strong> 40% proteine | 25% carbs | 35% grassi per massima lipolisi addominale + preservazione massa magra. 
          Basato su studi 2024-2025 di Helms, Phillips, Aragon.
            </p>
          </div>
        </div>
      </Card>

      {/* Seasonal Ingredients - Card migliorata */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-200 rounded-xl">
              <Leaf className="w-7 h-7 text-green-600" />
        </div>
          <div>
               <h3 className="font-bold text-2xl text-green-800">Arsenal Anti-Ginecomastia {season.charAt(0).toUpperCase() + season.slice(1)}</h3>
               <p className="text-green-600">Ingredienti scientificamente selezionati</p>
          </div>
          </div>
          
                     <div className="space-y-4">
             <div className="bg-white/70 rounded-xl p-4 border border-green-200">
               <div className="flex items-center space-x-2 mb-2">
                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                 <span className="font-bold text-green-800">Crucifere Anti-Estrogeniche</span>
               </div>
               <p className="text-sm text-green-700">{seasonalIngredients[season].vegetables.join(', ')}</p>
               <p className="text-xs text-green-600 mt-1 italic">DIM e sulforafano inibiscono l'aromatasi</p>
             </div>
             <div className="bg-white/70 rounded-xl p-4 border border-green-200">
               <div className="flex items-center space-x-2 mb-2">
                 <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                 <span className="font-bold text-green-800">Frutta Antiossidante</span>
               </div>
               <p className="text-sm text-green-700">{seasonalIngredients[season].fruits.join(', ')}</p>
               <p className="text-xs text-green-600 mt-1 italic">Basso indice glicemico + antocianine</p>
             </div>
             <div className="bg-white/70 rounded-xl p-4 border border-green-200">
               <div className="flex items-center space-x-2 mb-2">
                 <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                 <span className="font-bold text-green-800">Anti-Infiammatori</span>
               </div>
               <p className="text-sm text-green-700">{seasonalIngredients[season].herbs.join(', ')}</p>
               <p className="text-xs text-green-600 mt-1 italic">Curcumina e gingeroli riducono CRP</p>
             </div>
             <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
               <div className="flex items-center space-x-2 mb-2">
                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                 <span className="font-bold text-red-800">Inibitori Aromatasi</span>
               </div>
               <p className="text-sm text-red-700">{seasonalIngredients[season].antiEstrogen.join(', ')}</p>
               <p className="text-xs text-red-600 mt-1 italic">Bloccano conversione testosterone → estrogeni</p>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DietSection;

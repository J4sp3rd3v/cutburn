import { useState, useEffect } from 'react';
import { useProgressTracking } from './useProgressTracking';

// Interfacce per la struttura dei dati
interface UserProfile {
  name: string;
  age: number;
  height: number;
  current_weight: number;
  target_weight: number;
  gender: 'male' | 'female';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'targeted_fat_loss';
  body_fat_percentage?: number;
}

interface Meal {
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: { item: string; amount: string; notes?: string }[];
  preparation: {
    traditional: string[];
    thermomix: string[];
  };
  rationale: string;
  season: ('spring' | 'summer' | 'autumn' | 'winter')[];
  antiInflammatory: boolean;
  metabolicBoost: boolean;
}

interface DailyPlan {
  day: number;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    snack: Meal;
    dinner: Meal;
  };
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  waterIntake: number; // Litri di acqua raccomandati
  supplementTiming: string[];
}

interface PersonalizedDiet {
  weeklyPlan: DailyPlan[];
  targetCalories: number;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  dailyWaterIntake: number;
  metabolicProfile: {
    bmr: number;
    tdee: number;
    deficitCalories: number;
    expectedWeightLossPerWeek: number;
  };
  scientificRationale: string;
}

// --- DATABASE DELLE RICETTE SCIENTIFICAMENTE OTTIMIZZATE ---
const mealDatabase: Meal[] = [
  // --- COLAZIONI ANTI-INFIAMMATORIE ---
  {
    name: "Skyr Proteico con Frutti Rossi e Omega-3",
    calories: 380,
    macros: { protein: 35, carbs: 32, fat: 12, fiber: 8 },
    ingredients: [
      { item: "Skyr o Yogurt Greco 0%", amount: "200g" },
      { item: "Frutti di bosco misti", amount: "120g", notes: "ricchi di antocianine" },
      { item: "Fiocchi d'avena integrali", amount: "35g" },
      { item: "Semi di chia", amount: "12g", notes: "fonte di Omega-3" },
      { item: "Cannella", amount: "1 cucchiaino", notes: "controllo glicemico" },
      { item: "Stevia", amount: "q.b." }
    ],
    preparation: {
      traditional: [
        "Mescolare lo skyr con la cannella e la stevia",
        "Aggiungere i fiocchi d'avena e i semi di chia",
        "Lasciare riposare 5 minuti per l'idratazione dei semi",
        "Completare con i frutti di bosco"
      ],
      thermomix: [
        "Inserire skyr, cannella e stevia nel boccale: 10 sec / vel 3",
        "Aggiungere avena e semi di chia: 5 sec / vel 2",
        "Versare in una ciotola e aggiungere i frutti di bosco"
      ]
    },
    rationale: "Formula scientifica per massimizzare la sintesi proteica mattutina e ridurre l'infiammazione sistemica. Le antocianine dei frutti rossi attivano la lipolisi mentre gli Omega-3 dei semi di chia contrastano l'infiammazione del tessuto adiposo.",
    season: ['spring', 'summer', 'autumn', 'winter'],
    antiInflammatory: true,
    metabolicBoost: true
  },
  {
    name: "Omelette Proteica con Spinaci e Avocado",
    calories: 420,
    macros: { protein: 28, carbs: 18, fat: 25, fiber: 12 },
    ingredients: [
      { item: "Uova intere", amount: "2" },
      { item: "Albumi", amount: "2" },
      { item: "Spinaci freschi", amount: "100g", notes: "ricchi di nitrati" },
      { item: "Avocado", amount: "80g", notes: "grassi monoinsaturi" },
      { item: "Olio EVO", amount: "8g" },
      { item: "Curcuma", amount: "1/2 cucchiaino", notes: "anti-infiammatoria" },
      { item: "Pepe nero", amount: "pizzico", notes: "aumenta biodisponibilità curcuma" }
    ],
    preparation: {
      traditional: [
        "Sbattere uova e albumi con curcuma e pepe",
        "Cuocere gli spinaci in padella antiaderente",
        "Versare le uova sugli spinaci e cuocere l'omelette",
        "Servire con fette di avocado condite con olio EVO"
      ],
      thermomix: [
        "Sbattere uova, albumi, curcuma e pepe: 20 sec / vel 4",
        "Cuocere gli spinaci in padella tradizionale",
        "Procedere con la cottura dell'omelette",
        "Completare con avocado e olio"
      ]
    },
    rationale: "Combinazione ottimale per la produzione di testosterone e controllo del cortisolo. I nitrati degli spinaci migliorano il flusso sanguigno, mentre curcuma e avocado riducono l'infiammazione del tessuto adiposo viscerale.",
    season: ['spring', 'summer', 'autumn', 'winter'],
    antiInflammatory: true,
    metabolicBoost: true
  },

  // --- PRANZI METABOLICAMENTE ATTIVI ---
  {
    name: "Salmone Selvaggio con Quinoa e Broccoli",
    calories: 520,
    macros: { protein: 42, carbs: 35, fat: 22, fiber: 8 },
    ingredients: [
      { item: "Salmone selvaggio", amount: "180g", notes: "ricco di Omega-3 EPA/DHA" },
      { item: "Quinoa tricolore", amount: "60g peso secco" },
      { item: "Broccoli", amount: "200g", notes: "fonte di sulforafano" },
      { item: "Olio EVO", amount: "12g" },
      { item: "Limone", amount: "1/2", notes: "vitamina C per assorbimento ferro" },
      { item: "Zenzero fresco", amount: "5g", notes: "termogenico naturale" },
      { item: "Aglio", amount: "2 spicchi", notes: "supporto cardiovascolare" }
    ],
    preparation: {
      traditional: [
        "Cuocere la quinoa in brodo vegetale per 15 minuti",
        "Cuocere i broccoli al vapore per 8 minuti",
        "Marinare il salmone con limone, zenzero e aglio per 10 minuti",
        "Cuocere il salmone in padella per 4 minuti per lato",
        "Comporre il piatto e condire con olio EVO"
      ],
      thermomix: [
        "Tritare aglio e zenzero: 3 sec / vel 7",
        "Cuocere quinoa nel Varoma: 15 min / 100°C / vel soft",
        "Cuocere broccoli nel cestello Varoma: 8 min / Varoma / vel 1",
        "Marinare e cuocere il salmone in padella tradizionale",
        "Assemblare e condire"
      ]
    },
    rationale: "Pasto progettato per massimizzare l'ossidazione dei grassi e ridurre l'infiammazione sistemica. Gli Omega-3 del salmone attivano i geni della lipolisi, mentre il sulforafano dei broccoli supporta la detossificazione epatica.",
    season: ['spring', 'summer', 'autumn', 'winter'],
    antiInflammatory: true,
    metabolicBoost: true
  },

  // --- CENE ANTI-CATABOLICHE ---
  {
    name: "Zuppa Proteica di Lenticchie Rosse e Verdure",
    calories: 380,
    macros: { protein: 24, carbs: 45, fat: 8, fiber: 15 },
    ingredients: [
      { item: "Lenticchie rosse", amount: "80g peso secco" },
      { item: "Sedano", amount: "100g" },
      { item: "Carote", amount: "100g" },
      { item: "Cipolla rossa", amount: "80g", notes: "ricca di quercetina" },
      { item: "Passata di pomodoro", amount: "200g" },
      { item: "Brodo vegetale", amount: "500ml" },
      { item: "Curcuma", amount: "1 cucchiaino" },
      { item: "Pepe nero", amount: "pizzico" },
      { item: "Olio EVO", amount: "10g" }
    ],
    preparation: {
      traditional: [
        "Soffriggere cipolla, sedano e carote con olio EVO",
        "Aggiungere le lenticchie e tostare per 2 minuti",
        "Versare passata di pomodoro e brodo",
        "Aggiungere curcuma e pepe nero",
        "Cuocere per 25 minuti a fuoco medio",
        "Frullare parzialmente per ottenere consistenza cremosa"
      ],
      thermomix: [
        "Tritare cipolla, sedano, carote: 5 sec / vel 4",
        "Soffriggere con olio: 3 min / 120°C / vel 1",
        "Aggiungere lenticchie, passata, brodo, spezie",
        "Cuocere: 25 min / 100°C / vel soft antiorario",
        "Frullare parzialmente: 10 sec / vel 4"
      ]
    },
    rationale: "Ricetta formulata per fornire proteine vegetali complete e fibre prebiotiche che supportano il microbiota intestinale. La curcuma e la quercetina della cipolla rossa riducono l'infiammazione cronica associata all'accumulo di grasso viscerale.",
    season: ['autumn', 'winter'],
    antiInflammatory: true,
    metabolicBoost: false
  },

  // --- PRANZI AGGIUNTIVI ---
  {
    name: "Pollo alla Griglia con Verdure Miste",
    calories: 480,
    macros: { protein: 38, carbs: 25, fat: 18, fiber: 8 },
    ingredients: [
      { item: "Petto di pollo", amount: "180g" },
      { item: "Zucchine", amount: "150g" },
      { item: "Peperoni", amount: "100g" },
      { item: "Pomodorini", amount: "100g" },
      { item: "Olio EVO", amount: "15g" },
      { item: "Rosmarino", amount: "1 rametto" },
      { item: "Aglio", amount: "2 spicchi" }
    ],
    preparation: {
      traditional: [
        "Marinare il pollo con olio, aglio e rosmarino per 30 minuti",
        "Grigliare il pollo per 6-8 minuti per lato",
        "Grigliare le verdure tagliate a fette spesse",
        "Servire insieme con un filo d'olio a crudo"
      ],
      thermomix: [
        "Tritare aglio e rosmarino: 3 sec / vel 6",
        "Mescolare con olio per marinata: 10 sec / vel 2",
        "Marinare il pollo e grigliare in padella tradizionale",
        "Grigliare le verdure separatamente"
      ]
    },
    rationale: "Fonte di proteine complete ad alto valore biologico. Le verdure grigliate mantengono nutrienti e antiossidanti essenziali per il supporto metabolico.",
    season: ['spring', 'summer', 'autumn', 'winter'],
    antiInflammatory: true,
    metabolicBoost: true
  },

  // --- CENE AGGIUNTIVE ---
  {
    name: "Zuppa di Verdure e Legumi Misti",
    calories: 350,
    macros: { protein: 18, carbs: 48, fat: 6, fiber: 16 },
    ingredients: [
      { item: "Fagioli cannellini", amount: "60g peso secco" },
      { item: "Ceci", amount: "40g peso secco" },
      { item: "Spinaci", amount: "150g" },
      { item: "Pomodori pelati", amount: "200g" },
      { item: "Brodo vegetale", amount: "600ml" },
      { item: "Aglio", amount: "2 spicchi" },
      { item: "Salvia", amount: "6 foglie" },
      { item: "Olio EVO", amount: "8g" }
    ],
    preparation: {
      traditional: [
        "Ammollare legumi la sera prima",
        "Cuocere legumi separatamente fino a tenerezza",
        "Soffriggere aglio e salvia con olio",
        "Aggiungere pomodori e legumi cotti",
        "Versare brodo e cuocere 15 minuti",
        "Aggiungere spinaci negli ultimi 3 minuti"
      ],
      thermomix: [
        "Cuocere legumi ammollati: 45 min / 100°C / vel soft",
        "Tritare aglio e salvia: 3 sec / vel 6",
        "Soffriggere: 2 min / 120°C / vel 1",
        "Aggiungere resto ingredienti: 15 min / 100°C / vel soft",
        "Aggiungere spinaci: 3 min / 100°C / vel 1"
      ]
    },
    rationale: "Combinazione di legumi per proteine complete vegetali. Ricca di fibre solubili che favoriscono la sazietà e il controllo glicemico.",
    season: ['autumn', 'winter', 'spring'],
    antiInflammatory: true,
    metabolicBoost: false
  }
];

// --- ALGORITMI SCIENTIFICI AVANZATI ---

// Formula di Mifflin-St Jeor ottimizzata con correzioni per composizione corporea
const calculateAdvancedBMR = (weight: number, height: number, age: number, gender: 'male' | 'female', bodyFat?: number): number => {
  let bmr = 0;
  
  if (bodyFat && bodyFat > 0) {
    // Calcolo più preciso usando la massa magra (Katch-McArdle)
    const leanMass = weight * (1 - bodyFat / 100);
    bmr = 370 + (21.6 * leanMass);
  } else {
    // Formula standard Mifflin-St Jeor
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }
  
  return bmr;
};

// Calcolo dell'idratazione ottimale basato su peso, attività e clima
const calculateDailyWaterIntake = (weight: number, activityLevel: string, season: string): number => {
  let baseWater = weight * 0.035; // 35ml per kg di peso corporeo
  
  // Correzioni per attività fisica
  const activityMultipliers = {
    sedentary: 1.0,
    light: 1.2,
    moderate: 1.4,
    active: 1.6,
    very_active: 1.8
  };
  
  baseWater *= activityMultipliers[activityLevel] || 1.2;
  
  // Correzioni stagionali
  if (season === 'summer') baseWater *= 1.2;
  if (season === 'winter') baseWater *= 0.9;
  
  return Math.round(baseWater * 10) / 10; // Arrotonda a 1 decimale
};

// Algoritmo per deficit calorico ottimale basato su obiettivi specifici
const calculateOptimalDeficit = (goal: string, currentWeight: number, targetWeight: number, bodyFat?: number): number => {
  switch (goal) {
    case 'targeted_fat_loss':
      // Deficit moderato per preservare massa muscolare
      return 0.15; // 15%
    case 'weight_loss':
      // Deficit standard
      return 0.20; // 20%
    case 'muscle_gain':
      // Surplus calorico
      return -0.10; // +10%
    case 'maintenance':
      return 0; // 0%
    default:
      return 0.20;
  }
};

// Distribuzione macronutrienti ottimizzata per obiettivo
const calculateOptimalMacros = (goal: string, totalCalories: number, weight: number): { protein: number; carbs: number; fat: number; fiber: number } => {
  let proteinRatio, carbRatio, fatRatio;
  
  switch (goal) {
    case 'targeted_fat_loss':
      proteinRatio = 0.45; // 45% proteine per preservare massa muscolare
      carbRatio = 0.25;    // 25% carboidrati per controllo insulinico
      fatRatio = 0.30;     // 30% grassi per produzione ormonale
      break;
    case 'muscle_gain':
      proteinRatio = 0.35; // 35% proteine
      carbRatio = 0.40;    // 40% carboidrati per energia
      fatRatio = 0.25;     // 25% grassi
      break;
    case 'weight_loss':
      proteinRatio = 0.40; // 40% proteine
      carbRatio = 0.30;    // 30% carboidrati
      fatRatio = 0.30;     // 30% grassi
      break;
    default:
      proteinRatio = 0.35;
      carbRatio = 0.35;
      fatRatio = 0.30;
  }
  
  return {
    protein: Math.round((totalCalories * proteinRatio) / 4),
    carbs: Math.round((totalCalories * carbRatio) / 4),
    fat: Math.round((totalCalories * fatRatio) / 9),
    fiber: Math.round(weight * 0.5) // 0.5g per kg di peso corporeo
  };
};

// Fattori di attività avanzati con correzioni metaboliche
const advancedActivityFactors = {
  sedentary: 1.15,      // Ridotto per stile di vita moderno
  light: 1.35,          // Esercizio leggero
  moderate: 1.50,       // Esercizio moderato
  active: 1.70,         // Esercizio intenso
  very_active: 1.85,    // Atleti
};

// Funzione per ottenere la stagione corrente
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
const getCurrentSeason = (date: Date): Season => {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

export const usePersonalizedDiet = () => {
  const { userProfile } = useProgressTracking();
  const [dietPlan, setDietPlan] = useState<PersonalizedDiet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile) {
      setLoading(false);
      return;
    }

    const generateAdvancedPlan = () => {
      setLoading(true);

      // --- 1. VALIDAZIONE DATI UTENTE ---
      const { current_weight, height, age, gender, activity_level, goal, body_fat_percentage } = userProfile;
      
      if (!current_weight || !height || !age || !gender || !activity_level) {
        setDietPlan(null); 
        setLoading(false);
        return;
      }
      
      // --- 2. CALCOLI METABOLICI AVANZATI ---
      const bmr = calculateAdvancedBMR(current_weight, height, age, gender, body_fat_percentage);
      const tdee = bmr * (advancedActivityFactors[activity_level] || 1.50);
      
      // --- 3. DEFICIT/SURPLUS PERSONALIZZATO ---
      const deficitRatio = calculateOptimalDeficit(goal || 'weight_loss', current_weight, userProfile.target_weight, body_fat_percentage);
      const targetCalories = tdee + (tdee * deficitRatio);
      
      // --- 4. MACRONUTRIENTI OTTIMIZZATI ---
      const targetMacros = calculateOptimalMacros(goal || 'weight_loss', targetCalories, current_weight);
      
      // --- 5. IDRATAZIONE PERSONALIZZATA ---
      const currentSeason = getCurrentSeason(new Date());
      const dailyWater = calculateDailyWaterIntake(current_weight, activity_level, currentSeason);
      
      // --- 6. SELEZIONE RICETTE STAGIONALI E FUNZIONALI ---
      const seasonalMeals = mealDatabase.filter(meal => meal.season.includes(currentSeason));
      
      // Filtri specifici per obiettivo (più permissivo)
      let functionalMeals = seasonalMeals;
      if (goal === 'targeted_fat_loss') {
        // Usa ricette anti-infiammatorie O metabolicamente attive (non entrambe)
        functionalMeals = seasonalMeals.filter(meal => meal.antiInflammatory || meal.metabolicBoost);
      }
      
      // Se non ci sono abbastanza ricette stagionali, usa tutte le ricette
      if (functionalMeals.length < 3) {
        functionalMeals = mealDatabase;
      }
      
      let breakfasts = functionalMeals.filter(m => m.name.toLowerCase().includes('skyr') || m.name.toLowerCase().includes('omelette'));
      let lunches = functionalMeals.filter(m => m.name.toLowerCase().includes('salmone') || m.name.toLowerCase().includes('pollo'));
      let dinners = functionalMeals.filter(m => m.name.toLowerCase().includes('zuppa') || m.name.toLowerCase().includes('lenticchie'));
      

      
      // --- 7. CONTROLLO DISPONIBILITÀ RICETTE CON FALLBACK ROBUSTO ---
      if (breakfasts.length === 0) {
        breakfasts = mealDatabase.filter(m => m.name.toLowerCase().includes('skyr') || m.name.toLowerCase().includes('omelette'));
      }
      if (lunches.length === 0) {
        lunches = mealDatabase.filter(m => m.name.toLowerCase().includes('salmone') || m.name.toLowerCase().includes('pollo'));
      }
      if (dinners.length === 0) {
        dinners = mealDatabase.filter(m => m.name.toLowerCase().includes('zuppa') || m.name.toLowerCase().includes('lenticchie'));
      }
      
      // Se ancora non ci sono ricette, crea un piano vuoto con solo i target
      if (breakfasts.length === 0 || lunches.length === 0 || dinners.length === 0) {
        setDietPlan({
          weeklyPlan: [],
          targetCalories: Math.round(targetCalories),
          targetMacros,
          dailyWaterIntake: dailyWater,
          metabolicProfile: {
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            deficitCalories: Math.round(tdee - targetCalories),
            expectedWeightLossPerWeek: Math.round((tdee - targetCalories) * 7 / 7700 * 10) / 10
          },
          scientificRationale: `Piano basato su algoritmi scientifici per ${goal || 'perdita peso'} con deficit del ${Math.round(deficitRatio * 100)}%`
        });
        setLoading(false);
        return;
      }
      
      // --- 8. GENERAZIONE PIANO SETTIMANALE ---
      const weeklyPlan: DailyPlan[] = [];
      
      for (let i = 1; i <= 7; i++) {
        const breakfast = breakfasts[Math.floor(Math.random() * breakfasts.length)];
        const lunch = lunches[Math.floor(Math.random() * lunches.length)];
        const dinner = dinners[Math.floor(Math.random() * dinners.length)];
        
        // Spuntino ottimizzato per obiettivo
        const snack: Meal = {
          name: "Mix Proteico Anti-Infiammatorio",
          calories: 280,
          macros: { protein: 12, carbs: 18, fat: 16, fiber: 6 },
          ingredients: [
            {item: "Mandorle non salate", amount: "25g", notes: "ricche di vitamina E"},
            {item: "Mirtilli freschi", amount: "80g", notes: "antocianine antiossidanti"},
            {item: "Tè verde", amount: "1 tazza", notes: "EGCG termogenico"}
          ],
          preparation: {
            traditional: ["Consumare mandorle e mirtilli insieme", "Accompagnare con tè verde caldo"],
            thermomix: ["Non necessaria preparazione speciale"]
          },
          rationale: "Spuntino formulato per sostenere il metabolismo dei grassi e ridurre l'infiammazione sistemica tra i pasti principali.",
          season: ['spring', 'summer', 'autumn', 'winter'],
          antiInflammatory: true,
          metabolicBoost: true
        };

        const dailyMeals = { breakfast, lunch, snack, dinner };
        const dailyTotals = Object.values(dailyMeals).reduce((acc, meal) => {
          acc.calories += meal.calories;
          acc.protein += meal.macros.protein;
          acc.carbs += meal.macros.carbs;
          acc.fat += meal.macros.fat;
          acc.fiber += meal.macros.fiber;
          return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

        weeklyPlan.push({
          day: i,
          meals: dailyMeals,
          totals: dailyTotals,
          waterIntake: dailyWater,
          supplementTiming: [
            "Omega-3: con pranzo",
            "Vitamina D3: con colazione",
            "Magnesio: prima di dormire"
          ]
        });
      }

      // --- 9. PIANO FINALE CON PROFILO METABOLICO ---
      const finalPlan: PersonalizedDiet = {
        weeklyPlan,
        targetCalories: Math.round(targetCalories),
        targetMacros,
        dailyWaterIntake: dailyWater,
        metabolicProfile: {
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
          deficitCalories: Math.round(tdee - targetCalories),
          expectedWeightLossPerWeek: Math.round((tdee - targetCalories) * 7 / 7700 * 10) / 10
        },
        scientificRationale: goal === 'targeted_fat_loss' 
          ? "Piano ottimizzato per la riduzione del grasso localizzato attraverso alimenti anti-infiammatori e modulatori metabolici"
          : `Piano scientificamente calibrato per ${goal || 'perdita peso'} con approccio metabolico personalizzato`
      };
      
      setDietPlan(finalPlan);
      setLoading(false);
    };

    generateAdvancedPlan();

  }, [userProfile]);

  return { dietPlan, loading };
}; 
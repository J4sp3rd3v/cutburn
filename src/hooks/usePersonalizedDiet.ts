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
  targeted_fat_area?: 'abdominal' | 'gynecomastia' | 'love_handles' | 'thighs' | 'back_fat' | 'overall';
  body_fat_percentage?: number;
  // Nuovi campi per personalizzazione avanzata
  body_type?: 'ectomorph' | 'mesomorph' | 'endomorph';
  metabolic_rate?: 'slow' | 'normal' | 'fast';
  insulin_sensitivity?: 'low' | 'normal' | 'high';
  stress_level?: 'low' | 'moderate' | 'high';
  sleep_quality?: 'poor' | 'fair' | 'good' | 'excellent';
  dietary_preferences?: {
    vegan?: boolean;
    vegetarian?: boolean;
    keto?: boolean;
    mediterranean?: boolean;
  };
  food_intolerances?: string[];
  hormonal_issues?: string[];
  health_conditions?: string[];
  supplement_stack?: string[];
  training_style?: 'hiit' | 'liss' | 'strength' | 'mixed';
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

  // --- PASTI ANTI-GINECOMASTIA ---
  {
    name: "Bowl Anti-Aromatasi con Crucifere e DIM",
    calories: 450,
    macros: { protein: 40, carbs: 35, fat: 15, fiber: 12 },
    ingredients: [
      { item: "Broccoli al vapore", amount: "200g", notes: "ricchi di DIM" },
      { item: "Petto di pollo grigliato", amount: "150g" },
      { item: "Cavolo riccio", amount: "100g", notes: "anti-estrogeni" },
      { item: "Semi di lino macinati", amount: "15g", notes: "lignani" },
      { item: "Tè verde matcha", amount: "1 cucchiaino", notes: "EGCG" },
      { item: "Olio EVO", amount: "10g" },
      { item: "Zenzero fresco", amount: "5g", notes: "termogenico" }
    ],
    preparation: {
      traditional: [
        "Cuocere i broccoli al vapore per 8 minuti",
        "Grigliare il petto di pollo con zenzero",
        "Preparare il tè matcha",
        "Assemblare la bowl con tutti gli ingredienti",
        "Condire con olio EVO"
      ],
      thermomix: [
        "Cuocere broccoli nel Varoma: 8 min / Varoma / vel 1",
        "Grigliare il pollo in padella tradizionale",
        "Assemblare la bowl"
      ]
    },
    rationale: "Pasto formulato per ridurre l'aromatizzazione del testosterone in estrogeni attraverso l'azione del DIM (Diindolilmetano) presente nelle crucifere. Il tè verde e lo zenzero aumentano il metabolismo e la termogenesi.",
    season: ['spring', 'summer', 'autumn', 'winter'],
    antiInflammatory: true,
    metabolicBoost: true
  },

  // --- PASTI ANTI-GRASSO ADDOMINALE ---
  {
    name: "Zuppa Anti-Cortisolo con Curcuma e Zenzero",
    calories: 320,
    macros: { protein: 25, carbs: 30, fat: 12, fiber: 10 },
    ingredients: [
      { item: "Lenticchie rosse", amount: "70g", notes: "proteine vegetali" },
      { item: "Curcuma fresca", amount: "15g", notes: "anti-infiammatoria" },
      { item: "Zenzero fresco", amount: "10g", notes: "riduce cortisolo" },
      { item: "Pepe nero", amount: "q.b.", notes: "aumenta biodisponibilità" },
      { item: "Spinaci freschi", amount: "150g", notes: "magnesio" },
      { item: "Brodo vegetale", amount: "500ml" },
      { item: "Olio di cocco", amount: "10g", notes: "MCT" }
    ],
    preparation: {
      traditional: [
        "Soffriggere zenzero e curcuma in olio di cocco",
        "Aggiungere lenticchie e brodo",
        "Cuocere per 20 minuti",
        "Aggiungere spinaci negli ultimi 2 minuti"
      ],
      thermomix: [
        "Tritare zenzero e curcuma: 10 sec / vel 7",
        "Aggiungere olio: 3 min / 100°C / vel 1",
        "Aggiungere lenticchie e brodo: 20 min / 100°C / vel soft",
        "Aggiungere spinaci: 2 min / 100°C / vel soft"
      ]
    },
    rationale: "Pasto studiato per ridurre i livelli di cortisolo e l'infiammazione addominale. La combinazione di curcuma e pepe nero massimizza l'effetto anti-infiammatorio, mentre lo zenzero aiuta a gestire lo stress ossidativo.",
    season: ['autumn', 'winter'],
    antiInflammatory: true,
    metabolicBoost: true
  },

  // --- PASTI ANTI-GRASSO FIANCHI ---
  {
    name: "Insalata Drenante con Salmone e Finocchi",
    calories: 380,
    macros: { protein: 32, carbs: 25, fat: 18, fiber: 8 },
    ingredients: [
      { item: "Salmone selvaggio", amount: "150g", notes: "Omega-3" },
      { item: "Finocchi", amount: "200g", notes: "drenante" },
      { item: "Avocado", amount: "50g", notes: "grassi sani" },
      { item: "Rucola", amount: "80g", notes: "anti-estrogeni" },
      { item: "Semi di pompelmo", amount: "5g", notes: "brucia grassi" },
      { item: "Limone", amount: "1", notes: "detox" },
      { item: "Olio EVO", amount: "10g" }
    ],
    preparation: {
      traditional: [
        "Grigliare il salmone con limone",
        "Affettare finemente i finocchi",
        "Tagliare l'avocado a cubetti",
        "Assemblare l'insalata",
        "Condire con olio e limone"
      ],
      thermomix: [
        "Affettare i finocchi: 3 sec / vel 5",
        "Grigliare il salmone in padella tradizionale",
        "Assemblare l'insalata"
      ]
    },
    rationale: "Pasto formulato per attivare il drenaggio linfatico e ridurre la ritenzione idrica nei fianchi. I finocchi e il pompelmo hanno proprietà drenanti, mentre gli Omega-3 del salmone riducono l'infiammazione localizzata.",
    season: ['spring', 'summer'],
    antiInflammatory: true,
    metabolicBoost: true
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
const calculateOptimalDeficit = (goal: string, targetedFatArea: string | undefined, currentWeight: number, targetWeight: number, bodyFat?: number): number => {
  switch (goal) {
    case 'targeted_fat_loss':
      // Deficit specifico per tipo di grasso localizzato
      switch (targetedFatArea) {
        case 'abdominal':
          return 0.25; // 25% - grasso viscerale richiede deficit maggiore
        case 'gynecomastia':
          return 0.22; // 22% - approccio anti-aromatasi
        case 'love_handles':
          return 0.20; // 20% - grasso ostinato
        case 'thighs':
          return 0.18; // 18% - approccio femminile più conservativo
        case 'back_fat':
          return 0.20; // 20% - grasso inter-scapolare
        case 'overall':
          return 0.18; // 18% - approccio sistemico
        default:
          return 0.20; // 20% - default per grasso localizzato
      }
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
const calculateOptimalMacros = (goal: string, targetedFatArea: string | undefined, totalCalories: number, weight: number): { protein: number; carbs: number; fat: number; fiber: number } => {
  let proteinRatio, carbRatio, fatRatio;
  
  switch (goal) {
    case 'targeted_fat_loss':
      // Macronutrienti specifici per tipo di grasso localizzato
      switch (targetedFatArea) {
        case 'abdominal':
          proteinRatio = 0.50; // 50% proteine - controllo insulinico
          carbRatio = 0.20;    // 20% carboidrati - riduzione grasso viscerale
          fatRatio = 0.30;     // 30% grassi - ormoni
          break;
        case 'gynecomastia':
          proteinRatio = 0.48; // 48% proteine - anti-aromatasi
          carbRatio = 0.22;    // 22% carboidrati - controllo estrogeni
          fatRatio = 0.30;     // 30% grassi - testosterone
          break;
        case 'love_handles':
          proteinRatio = 0.45; // 45% proteine - preservazione massa
          carbRatio = 0.25;    // 25% carboidrati - energia per allenamento
          fatRatio = 0.30;     // 30% grassi - sazietà
          break;
        case 'thighs':
          proteinRatio = 0.42; // 42% proteine - approccio femminile
          carbRatio = 0.28;    // 28% carboidrati - energia
          fatRatio = 0.30;     // 30% grassi - ormoni femminili
          break;
        case 'back_fat':
          proteinRatio = 0.46; // 46% proteine - riparazione tessuti
          carbRatio = 0.24;    // 24% carboidrati - controllo infiammazione
          fatRatio = 0.30;     // 30% grassi - anti-infiammatori
          break;
        case 'overall':
          proteinRatio = 0.44; // 44% proteine - bilanciato
          carbRatio = 0.26;    // 26% carboidrati - sostenibile
          fatRatio = 0.30;     // 30% grassi - equilibrio ormonale
          break;
        default:
          proteinRatio = 0.45; // 45% proteine - default
          carbRatio = 0.25;    // 25% carboidrati
          fatRatio = 0.30;     // 30% grassi
      }
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

const generateDietPlan = (profile: UserProfile): PersonalizedDiet => {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activity_level);
  const targetCalories = getTargetCalories(tdee, profile.goal, profile.body_type);

  const targetMacros = {
    protein: (targetCalories * 0.3) / 4, // 30% delle calorie
    carbs: (targetCalories * 0.4) / 4,   // 40% delle calorie
    fat: (targetCalories * 0.3) / 9,     // 30% delle calorie
    fiber: 30, // Valore standard
  };

  const weeklyPlan: DailyPlan[] = [];

  for (let i = 1; i <= 7; i++) {
    const dayMeals: { breakfast: Meal; lunch: Meal; snack: Meal; dinner: Meal; } = {} as any;
    let dailyCalories = 0;
    const selectedMeals: Meal[] = [];

    const mealSlots: ('breakfast' | 'lunch' | 'snack' | 'dinner')[] = ['breakfast', 'lunch', 'snack', 'dinner'];

    mealSlots.forEach(slot => {
      const meal = selectMealForSlot(slot, targetCalories, profile, selectedMeals);
      dayMeals[slot] = meal;
      selectedMeals.push(meal);
      dailyCalories += meal.calories;
    });

    const totals = selectedMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.macros.protein,
      carbs: acc.carbs + meal.macros.carbs,
      fat: acc.fat + meal.macros.fat,
      fiber: acc.fiber + meal.macros.fiber,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    weeklyPlan.push({
      day: i,
      meals: dayMeals,
      totals,
      waterIntake: profile.gender === 'male' ? 3.7 : 2.7, // Raccomandazione generale
      supplementTiming: [], // Da implementare
    });
  }

  return {
    weeklyPlan,
    targetCalories,
    targetMacros,
    dailyWaterIntake: profile.gender === 'male' ? 3.7 : 2.7,
    metabolicProfile: {
      bmr,
      tdee,
      deficitCalories: tdee - targetCalories,
      expectedWeightLossPerWeek: (tdee - targetCalories) * 7 / 7700, // 7700 kcal per kg di grasso
    },
    scientificRationale: 'Piano generato dinamicamente basato su BMR, TDEE, obiettivi e profilo utente.',
  };
};

export const usePersonalizedDiet = () => {
  const { userProfile } = useProgressTracking();
  const [dietPlan, setDietPlan] = useState<PersonalizedDiet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      const today = new Date().toISOString().split('T')[0];
      const lastGeneratedDate = localStorage.getItem('dietLastGeneratedDate');

      if (lastGeneratedDate !== today || !localStorage.getItem('dietPlan')) {
        console.log('Generating new diet plan for today...');
        const newPlan = generateDietPlan(userProfile);
        setDietPlan(newPlan);
        localStorage.setItem('dietPlan', JSON.stringify(newPlan));
        localStorage.setItem('dietLastGeneratedDate', today);
      } else {
        console.log('Loading diet plan from cache...');
        const cachedPlan = localStorage.getItem('dietPlan');
        if (cachedPlan) {
          setDietPlan(JSON.parse(cachedPlan));
        }
      }
      setLoading(false);
    }
  }, [userProfile]);

  return { dietPlan, loading };
};

// --- LOGICA DI CALCOLO E GENERAZIONE --- 

const calculateBMR = (profile: UserProfile): number => {
  const { current_weight, height, age, gender, body_fat_percentage, metabolic_rate } = profile;

  let bmr;
  // Katch-McArdle se il grasso corporeo è noto (più accurato)
  if (body_fat_percentage && body_fat_percentage > 0) {
    const leanBodyMass = current_weight * (1 - body_fat_percentage / 100);
    bmr = 370 + (21.6 * leanBodyMass);
  } else {
    // Mifflin-St Jeor altrimenti
    if (gender === 'male') {
      bmr = 10 * current_weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * current_weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Aggiustamento basato sul metabolismo percepito
  switch (metabolic_rate) {
    case 'slow':
      return bmr * 0.9; // Riduci del 10%
    case 'fast':
      return bmr * 1.1; // Aumenta del 10%
    default:
      return bmr;
  }
};

const calculateTDEE = (bmr: number, activity_level: UserProfile['activity_level']): number => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return bmr * activityMultipliers[activity_level];
};

const getTargetCalories = (tdee: number, goal: UserProfile['goal'], body_type?: UserProfile['body_type']): number => {
  let adjustment = 0;
  switch (goal) {
    case 'weight_loss':
    case 'targeted_fat_loss':
      adjustment = -500; // Deficit calorico standard
      if (body_type === 'endomorph') adjustment -= 150; // Endomorfi richiedono un deficit maggiore
      if (body_type === 'ectomorph') adjustment += 150; // Ectomorfi un deficit minore
      break;
    case 'muscle_gain':
      adjustment = 300; // Surplus calorico standard
      if (body_type === 'ectomorph') adjustment += 150; // Ectomorfi richiedono un surplus maggiore
      if (body_type === 'endomorph') adjustment -= 100; // Endomorfi un surplus minore
      break;
    case 'maintenance':
    default:
      return tdee;
  }
  return tdee + adjustment;
};

const selectMealForSlot = (
  slot: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  targetCalories: number,
  profile: UserProfile,
  existingMeals: Meal[]
): Meal => {
  const { goal, targeted_fat_area, stress_level, dietary_preferences } = profile;

  let filteredMeals = mealDatabase.filter(meal => !existingMeals.some(existing => existing.name === meal.name));

  // Filtra per preferenze dietetiche
  if (dietary_preferences?.vegan) {
    // Logica per vegano
  }
  if (dietary_preferences?.vegetarian) {
    // Logica per vegetariano
  }

  // Filtra per obiettivo specifico
  if (goal === 'targeted_fat_loss') {
    filteredMeals = filteredMeals.filter(m => m.antiInflammatory);
    if (targeted_fat_area === 'abdominal' || stress_level === 'high') {
      // Privilegia cibi che aiutano a gestire il cortisolo
    }
  } else if (goal === 'muscle_gain') {
    // Privilegia cibi ad alto contenuto proteico
  }

  // Scegli un pasto casuale tra quelli filtrati
  const randomMeal = filteredMeals[Math.floor(Math.random() * filteredMeals.length)];
  return randomMeal || mealDatabase[0]; // Fallback
};

interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
  problemAreas: {
    chest: boolean;  // ginecomastia
    abdomen: boolean;  // grasso viscerale
    hips: boolean;  // accumulo fianchi
  };
  dietaryPreferences: {
    vegan: boolean;
    vegetarian: boolean;
    keto: boolean;
    mediterranean: boolean;
  };
  metabolicProfile: {
    insulinSensitive: boolean;
    stressLevel: 'low' | 'moderate' | 'high';
    sleepQuality: 'poor' | 'moderate' | 'good';
    digestion: 'poor' | 'moderate' | 'good';
  };
}

const generateDietPlan = (profile: UserProfile): DailyPlan[] => {
  // Calcolo BMR usando l'equazione di Mifflin-St Jeor
  const bmr = profile.gender === 'male'
    ? (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    : (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;

  // Moltiplicatori per livello di attività
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  // Calcolo TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[profile.activityLevel];

  // Aggiustamento calorie in base all'obiettivo
  let targetCalories = tdee;
  switch(profile.goal) {
    case 'fat_loss':
      targetCalories *= 0.8; // Deficit del 20%
      break;
    case 'muscle_gain':
      targetCalories *= 1.1; // Surplus del 10%
      break;
    // maintenance rimane uguale a tdee
  }

  // Selezione pasti in base alle aree problematiche
  const selectMealsForProblemAreas = (meals: Meal[]): Meal[] => {
    let selectedMeals = [...meals];
    
    if (profile.problemAreas.chest) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('anti-aromatasi') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('dim') || 
          ing.notes?.toLowerCase().includes('anti-estrogeni')
        )
      );
    }

    if (profile.problemAreas.abdomen) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('anti-cortisolo') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('termogenico') || 
          ing.notes?.toLowerCase().includes('anti-infiammatoria')
        )
      );
    }

    if (profile.problemAreas.hips) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('drenante') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('drenante') || 
          ing.notes?.toLowerCase().includes('detox')
        )
      );
    }

    return selectedMeals;
  };

  // Aggiustamento pasti in base al profilo metabolico
  const adjustMealsForMetabolicProfile = (meals: Meal[]): Meal[] => {
    let adjustedMeals = [...meals];

    if (!profile.metabolicProfile.insulinSensitive) {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('controllo glicemico')
        )
      );
    }

    if (profile.metabolicProfile.stressLevel === 'high') {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('riduce cortisolo') || 
          ing.notes?.toLowerCase().includes('anti-stress')
        )
      );
    }

    if (profile.metabolicProfile.sleepQuality === 'poor') {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('magnesio') || 
          ing.notes?.toLowerCase().includes('rilassante')
        )
      );
    }

    return adjustedMeals;
  };

  // Generazione piano settimanale
  const weeklyPlan: DailyPlan[] = Array.from({ length: 7 }, (_, dayIndex) => {
    // Filtraggio pasti in base a tutti i criteri
    let availableMeals = mealDatabase;
    availableMeals = selectMealsForProblemAreas(availableMeals);
    availableMeals = adjustMealsForMetabolicProfile(availableMeals);

    // Selezione casuale dei pasti per il giorno
    const dailyMeals = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availableMeals.length);
      dailyMeals.push(availableMeals[randomIndex]);
    }

    return {
      date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000),
      meals: dailyMeals,
      totalCalories: dailyMeals.reduce((sum, meal) => sum + meal.calories, 0),
      totalMacros: {
        protein: dailyMeals.reduce((sum, meal) => sum + meal.macros.protein, 0),
        carbs: dailyMeals.reduce((sum, meal) => sum + meal.macros.carbs, 0),
        fat: dailyMeals.reduce((sum, meal) => sum + meal.macros.fat, 0),
        fiber: dailyMeals.reduce((sum, meal) => sum + meal.macros.fiber, 0)
      }
    };
  });

  return weeklyPlan;
};

export const usePersonalizedDiet = () => {
  const { userProfile } = useProgressTracking();
  const [dietPlan, setDietPlan] = useState<PersonalizedDiet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      const today = new Date().toISOString().split('T')[0];
      const lastGeneratedDate = localStorage.getItem('dietLastGeneratedDate');

      if (lastGeneratedDate !== today || !localStorage.getItem('dietPlan')) {
        console.log('Generating new diet plan for today...');
        const newPlan = generateDietPlan(userProfile);
        setDietPlan(newPlan);
        localStorage.setItem('dietPlan', JSON.stringify(newPlan));
        localStorage.setItem('dietLastGeneratedDate', today);
      } else {
        console.log('Loading diet plan from cache...');
        const cachedPlan = localStorage.getItem('dietPlan');
        if (cachedPlan) {
          setDietPlan(JSON.parse(cachedPlan));
        }
      }
      setLoading(false);
    }
  }, [userProfile]);

  return { dietPlan, loading };
};

const calculateBMR = (profile: UserProfile): number => {
  const { current_weight, height, age, gender, body_fat_percentage, metabolic_rate } = profile;

  let bmr;
  // Katch-McArdle se il grasso corporeo è noto (più accurato)
  if (body_fat_percentage && body_fat_percentage > 0) {
    const leanBodyMass = current_weight * (1 - body_fat_percentage / 100);
    bmr = 370 + (21.6 * leanBodyMass);
  } else {
    // Mifflin-St Jeor altrimenti
    if (gender === 'male') {
      bmr = 10 * current_weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * current_weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Aggiustamento basato sul metabolismo percepito
  switch (metabolic_rate) {
    case 'slow':
      return bmr * 0.9; // Riduci del 10%
    case 'fast':
      return bmr * 1.1; // Aumenta del 10%
    default:
      return bmr;
  }
};

const calculateTDEE = (bmr: number, activity_level: UserProfile['activity_level']): number => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return bmr * activityMultipliers[activity_level];
};

const getTargetCalories = (tdee: number, goal: UserProfile['goal'], body_type?: UserProfile['body_type']): number => {
  let adjustment = 0;
  switch (goal) {
    case 'weight_loss':
    case 'targeted_fat_loss':
      adjustment = -500; // Deficit calorico standard
      if (body_type === 'endomorph') adjustment -= 150; // Endomorfi richiedono un deficit maggiore
      if (body_type === 'ectomorph') adjustment += 150; // Ectomorfi un deficit minore
      break;
    case 'muscle_gain':
      adjustment = 300; // Surplus calorico standard
      if (body_type === 'ectomorph') adjustment += 150; // Ectomorfi richiedono un surplus maggiore
      if (body_type === 'endomorph') adjustment -= 100; // Endomorfi un surplus minore
      break;
    case 'maintenance':
    default:
      return tdee;
  }
  return tdee + adjustment;
};

const selectMealForSlot = (
  slot: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  targetCalories: number,
  profile: UserProfile,
  existingMeals: Meal[]
): Meal => {
  const { goal, targeted_fat_area, stress_level, dietary_preferences } = profile;

  let filteredMeals = mealDatabase.filter(meal => !existingMeals.some(existing => existing.name === meal.name));

  // Filtra per preferenze dietetiche
  if (dietary_preferences?.vegan) {
    // Logica per vegano
  }
  if (dietary_preferences?.vegetarian) {
    // Logica per vegetariano
  }

  // Filtra per obiettivo specifico
  if (goal === 'targeted_fat_loss') {
    filteredMeals = filteredMeals.filter(m => m.antiInflammatory);
    if (targeted_fat_area === 'abdominal' || stress_level === 'high') {
      // Privilegia cibi che aiutano a gestire il cortisolo
    }
  } else if (goal === 'muscle_gain') {
    // Privilegia cibi ad alto contenuto proteico
  }

  // Scegli un pasto casuale tra quelli filtrati
  const randomMeal = filteredMeals[Math.floor(Math.random() * filteredMeals.length)];
  return randomMeal || mealDatabase[0]; // Fallback
};

interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
  problemAreas: {
    chest: boolean;  // ginecomastia
    abdomen: boolean;  // grasso viscerale
    hips: boolean;  // accumulo fianchi
  };
  dietaryPreferences: {
    vegan: boolean;
    vegetarian: boolean;
    keto: boolean;
    mediterranean: boolean;
  };
  metabolicProfile: {
    insulinSensitive: boolean;
    stressLevel: 'low' | 'moderate' | 'high';
    sleepQuality: 'poor' | 'moderate' | 'good';
    digestion: 'poor' | 'moderate' | 'good';
  };
}

const generateDietPlan = (profile: UserProfile): DailyPlan[] => {
  // Calcolo BMR usando l'equazione di Mifflin-St Jeor
  const bmr = profile.gender === 'male'
    ? (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    : (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;

  // Moltiplicatori per livello di attività
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  // Calcolo TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[profile.activityLevel];

  // Aggiustamento calorie in base all'obiettivo
  let targetCalories = tdee;
  switch(profile.goal) {
    case 'fat_loss':
      targetCalories *= 0.8; // Deficit del 20%
      break;
    case 'muscle_gain':
      targetCalories *= 1.1; // Surplus del 10%
      break;
    // maintenance rimane uguale a tdee
  }

  // Selezione pasti in base alle aree problematiche
  const selectMealsForProblemAreas = (meals: Meal[]): Meal[] => {
    let selectedMeals = [...meals];
    
    if (profile.problemAreas.chest) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('anti-aromatasi') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('dim') || 
          ing.notes?.toLowerCase().includes('anti-estrogeni')
        )
      );
    }

    if (profile.problemAreas.abdomen) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('anti-cortisolo') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('termogenico') || 
          ing.notes?.toLowerCase().includes('anti-infiammatoria')
        )
      );
    }

    if (profile.problemAreas.hips) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('drenante') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('drenante') || 
          ing.notes?.toLowerCase().includes('detox')
        )
      );
    }

    return selectedMeals;
  };

  // Aggiustamento pasti in base al profilo metabolico
  const adjustMealsForMetabolicProfile = (meals: Meal[]): Meal[] => {
    let adjustedMeals = [...meals];

    if (!profile.metabolicProfile.insulinSensitive) {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('controllo glicemico')
        )
      );
    }

    if (profile.metabolicProfile.stressLevel === 'high') {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('riduce cortisolo') || 
          ing.notes?.toLowerCase().includes('anti-stress')
        )
      );
    }

    if (profile.metabolicProfile.sleepQuality === 'poor') {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('magnesio') || 
          ing.notes?.toLowerCase().includes('rilassante')
        )
      );
    }

    return adjustedMeals;
  };

  // Generazione piano settimanale
  const weeklyPlan: DailyPlan[] = Array.from({ length: 7 }, (_, dayIndex) => {
    // Filtraggio pasti in base a tutti i criteri
    let availableMeals = mealDatabase;
    availableMeals = selectMealsForProblemAreas(availableMeals);
    availableMeals = adjustMealsForMetabolicProfile(availableMeals);

    // Selezione casuale dei pasti per il giorno
    const dailyMeals = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availableMeals.length);
      dailyMeals.push(availableMeals[randomIndex]);
    }

    return {
      date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000),
      meals: dailyMeals,
      totalCalories: dailyMeals.reduce((sum, meal) => sum + meal.calories, 0),
      totalMacros: {
        protein: dailyMeals.reduce((sum, meal) => sum + meal.macros.protein, 0),
        carbs: dailyMeals.reduce((sum, meal) => sum + meal.macros.carbs, 0),
        fat: dailyMeals.reduce((sum, meal) => sum + meal.macros.fat, 0),
        fiber: dailyMeals.reduce((sum, meal) => sum + meal.macros.fiber, 0)
      }
    };
  });

  return weeklyPlan;
};

export const usePersonalizedDiet = () => {
  const { userProfile } = useProgressTracking();
  const [dietPlan, setDietPlan] = useState<PersonalizedDiet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      const today = new Date().toISOString().split('T')[0];
      const lastGeneratedDate = localStorage.getItem('dietLastGeneratedDate');

      if (lastGeneratedDate !== today || !localStorage.getItem('dietPlan')) {
        console.log('Generating new diet plan for today...');
        const newPlan = generateDietPlan(userProfile);
        setDietPlan(newPlan);
        localStorage.setItem('dietPlan', JSON.stringify(newPlan));
        localStorage.setItem('dietLastGeneratedDate', today);
      } else {
        console.log('Loading diet plan from cache...');
        const cachedPlan = localStorage.getItem('dietPlan');
        if (cachedPlan) {
          setDietPlan(JSON.parse(cachedPlan));
        }
      }
      setLoading(false);
    }
  }, [userProfile]);

  return { dietPlan, loading };
};

const calculateBMR = (profile: UserProfile): number => {
  const { current_weight, height, age, gender, body_fat_percentage, metabolic_rate } = profile;

  let bmr;
  // Katch-McArdle se il grasso corporeo è noto (più accurato)
  if (body_fat_percentage && body_fat_percentage > 0) {
    const leanBodyMass = current_weight * (1 - body_fat_percentage / 100);
    bmr = 370 + (21.6 * leanBodyMass);
  } else {
    // Mifflin-St Jeor altrimenti
    if (gender === 'male') {
      bmr = 10 * current_weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * current_weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Aggiustamento basato sul metabolismo percepito
  switch (metabolic_rate) {
    case 'slow':
      return bmr * 0.9; // Riduci del 10%
    case 'fast':
      return bmr * 1.1; // Aumenta del 10%
    default:
      return bmr;
  }
};

const calculateTDEE = (bmr: number, activity_level: UserProfile['activity_level']): number => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return bmr * activityMultipliers[activity_level];
};

const getTargetCalories = (tdee: number, goal: UserProfile['goal'], body_type?: UserProfile['body_type']): number => {
  let adjustment = 0;
  switch (goal) {
    case 'weight_loss':
    case 'targeted_fat_loss':
      adjustment = -500; // Deficit calorico standard
      if (body_type === 'endomorph') adjustment -= 150; // Endomorfi richiedono un deficit maggiore
      if (body_type === 'ectomorph') adjustment += 150; // Ectomorfi un deficit minore
      break;
    case 'muscle_gain':
      adjustment = 300; // Surplus calorico standard
      if (body_type === 'ectomorph') adjustment += 150; // Ectomorfi richiedono un surplus maggiore
      if (body_type === 'endomorph') adjustment -= 100; // Endomorfi un surplus minore
      break;
    case 'maintenance':
    default:
      return tdee;
  }
  return tdee + adjustment;
};

const selectMealForSlot = (
  slot: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  targetCalories: number,
  profile: UserProfile,
  existingMeals: Meal[]
): Meal => {
  const { goal, targeted_fat_area, stress_level, dietary_preferences } = profile;

  let filteredMeals = mealDatabase.filter(meal => !existingMeals.some(existing => existing.name === meal.name));

  // Filtra per preferenze dietetiche
  if (dietary_preferences?.vegan) {
    // Logica per vegano
  }
  if (dietary_preferences?.vegetarian) {
    // Logica per vegetariano
  }

  // Filtra per obiettivo specifico
  if (goal === 'targeted_fat_loss') {
    filteredMeals = filteredMeals.filter(m => m.antiInflammatory);
    if (targeted_fat_area === 'abdominal' || stress_level === 'high') {
      // Privilegia cibi che aiutano a gestire il cortisolo
    }
  } else if (goal === 'muscle_gain') {
    // Privilegia cibi ad alto contenuto proteico
  }

  // Scegli un pasto casuale tra quelli filtrati
  const randomMeal = filteredMeals[Math.floor(Math.random() * filteredMeals.length)];
  return randomMeal || mealDatabase[0]; // Fallback
};

interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
  problemAreas: {
    chest: boolean;  // ginecomastia
    abdomen: boolean;  // grasso viscerale
    hips: boolean;  // accumulo fianchi
  };
  dietaryPreferences: {
    vegan: boolean;
    vegetarian: boolean;
    keto: boolean;
    mediterranean: boolean;
  };
  metabolicProfile: {
    insulinSensitive: boolean;
    stressLevel: 'low' | 'moderate' | 'high';
    sleepQuality: 'poor' | 'moderate' | 'good';
    digestion: 'poor' | 'moderate' | 'good';
  };
}

const generateDietPlan = (profile: UserProfile): DailyPlan[] => {
  // Calcolo BMR usando l'equazione di Mifflin-St Jeor
  const bmr = profile.gender === 'male'
    ? (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    : (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;

  // Moltiplicatori per livello di attività
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  // Calcolo TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[profile.activityLevel];

  // Aggiustamento calorie in base all'obiettivo
  let targetCalories = tdee;
  switch(profile.goal) {
    case 'fat_loss':
      targetCalories *= 0.8; // Deficit del 20%
      break;
    case 'muscle_gain':
      targetCalories *= 1.1; // Surplus del 10%
      break;
    // maintenance rimane uguale a tdee
  }

  // Selezione pasti in base alle aree problematiche
  const selectMealsForProblemAreas = (meals: Meal[]): Meal[] => {
    let selectedMeals = [...meals];
    
    if (profile.problemAreas.chest) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('anti-aromatasi') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('dim') || 
          ing.notes?.toLowerCase().includes('anti-estrogeni')
        )
      );
    }

    if (profile.problemAreas.abdomen) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('anti-cortisolo') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('termogenico') || 
          ing.notes?.toLowerCase().includes('anti-infiammatoria')
        )
      );
    }

    if (profile.problemAreas.hips) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('drenante') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('drenante') || 
          ing.notes?.toLowerCase().includes('detox')
        )
      );
    }

    return selectedMeals;
  };

  // Aggiustamento pasti in base al profilo metabolico
  const adjustMealsForMetabolicProfile = (meals: Meal[]): Meal[] => {
    let adjustedMeals = [...meals];

    if (!profile.metabolicProfile.insulinSensitive) {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('controllo glicemico')
        )
      );
    }

    if (profile.metabolicProfile.stressLevel === 'high') {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('riduce cortisolo') || 
          ing.notes?.toLowerCase().includes('anti-stress')
        )
      );
    }

    if (profile.metabolicProfile.sleepQuality === 'poor') {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('magnesio') || 
          ing.notes?.toLowerCase().includes('rilassante')
        )
      );
    }

    return adjustedMeals;
  };

  // Generazione piano settimanale
  const weeklyPlan: DailyPlan[] = Array.from({ length: 7 }, (_, dayIndex) => {
    // Filtraggio pasti in base a tutti i criteri
    let availableMeals = mealDatabase;
    availableMeals = selectMealsForProblemAreas(availableMeals);
    availableMeals = adjustMealsForMetabolicProfile(availableMeals);

    // Selezione casuale dei pasti per il giorno
    const dailyMeals = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availableMeals.length);
      dailyMeals.push(availableMeals[randomIndex]);
    }

    return {
      date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000),
      meals: dailyMeals,
      totalCalories: dailyMeals.reduce((sum, meal) => sum + meal.calories, 0),
      totalMacros: {
        protein: dailyMeals.reduce((sum, meal) => sum + meal.macros.protein, 0),
        carbs: dailyMeals.reduce((sum, meal) => sum + meal.macros.carbs, 0),
        fat: dailyMeals.reduce((sum, meal) => sum + meal.macros.fat, 0),
        fiber: dailyMeals.reduce((sum, meal) => sum + meal.macros.fiber, 0)
      }
    };
  });

  return weeklyPlan;
};

export const usePersonalizedDiet = () => {
  const { userProfile } = useProgressTracking();
  const [dietPlan, setDietPlan] = useState<PersonalizedDiet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      const today = new Date().toISOString().split('T')[0];
      const lastGeneratedDate = localStorage.getItem('dietLastGeneratedDate');

      if (lastGeneratedDate !== today || !localStorage.getItem('dietPlan')) {
        console.log('Generating new diet plan for today...');
        const newPlan = generateDietPlan(userProfile);
        setDietPlan(newPlan);
        localStorage.setItem('dietPlan', JSON.stringify(newPlan));
        localStorage.setItem('dietLastGeneratedDate', today);
      } else {
        console.log('Loading diet plan from cache...');
        const cachedPlan = localStorage.getItem('dietPlan');
        if (cachedPlan) {
          setDietPlan(JSON.parse(cachedPlan));
        }
      }
      setLoading(false);
    }
  }, [userProfile]);

  return { dietPlan, loading };
};

const calculateBMR = (profile: UserProfile): number => {
  const { current_weight, height, age, gender, body_fat_percentage, metabolic_rate } = profile;

  let bmr;
  // Katch-McArdle se il grasso corporeo è noto (più accurate)
  if (body_fat_percentage && body_fat_percentage > 0) {
    const leanBodyMass = current_weight * (1 - body_fat_percentage / 100);
    bmr = 370 + (21.6 * leanBodyMass);
  } else {
    // Mifflin-St Jeor altrimenti
    if (gender === 'male') {
      bmr = 10 * current_weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * current_weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Aggiustamento basato sul metabolismo percepito
  switch (metabolic_rate) {
    case 'slow':
      return bmr * 0.9; // Riduci del 10%
    case 'fast':
      return bmr * 1.1; // Aumenta del 10%
    default:
      return bmr;
  }
};

const calculateTDEE = (bmr: number, activity_level: UserProfile['activity_level']): number => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return bmr * activityMultipliers[activity_level];
};

const getTargetCalories = (tdee: number, goal: UserProfile['goal'], body_type?: UserProfile['body_type']): number => {
  let adjustment = 0;
  switch (goal) {
    case 'weight_loss':
    case 'targeted_fat_loss':
      adjustment = -500; // Deficit calorico standard
      if (body_type === 'endomorph') adjustment -= 150; // Endomorfi richiedono un deficit maggiore
      if (body_type === 'ectomorph') adjustment += 150; // Ectomorfi un deficit minore
      break;
    case 'muscle_gain':
      adjustment = 300; // Surplus calorico standard
      if (body_type === 'ectomorph') adjustment += 150; // Ectomorfi richiedono un surplus maggiore
      if (body_type === 'endomorph') adjustment -= 100; // Endomorfi un surplus minore
      break;
    case 'maintenance':
    default:
      return tdee;
  }
  return tdee + adjustment;
};

const selectMealForSlot = (
  slot: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  targetCalories: number,
  profile: UserProfile,
  existingMeals: Meal[]
): Meal => {
  const { goal, targeted_fat_area, stress_level, dietary_preferences } = profile;

  let filteredMeals = mealDatabase.filter(meal => !existingMeals.some(existing => existing.name === meal.name));

  // Filtra per preferenze dietetiche
  if (dietary_preferences?.vegan) {
    // Logica per vegano
  }
  if (dietary_preferences?.vegetarian) {
    // Logica per vegetariano
  }

  // Filtra per obiettivo specifico
  if (goal === 'targeted_fat_loss') {
    filteredMeals = filteredMeals.filter(m => m.antiInflammatory);
    if (targeted_fat_area === 'abdominal' || stress_level === 'high') {
      // Privilegia cibi che aiutano a gestire il cortisolo
    }
  } else if (goal === 'muscle_gain') {
    // Privilegia cibi ad alto contenuto proteico
  }

  // Scegli un pasto casuale tra quelli filtrati
  const randomMeal = filteredMeals[Math.floor(Math.random() * filteredMeals.length)];
  return randomMeal || mealDatabase[0]; // Fallback
};

interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
  problemAreas: {
    chest: boolean;  // ginecomastia
    abdomen: boolean;  // grasso viscerale
    hips: boolean;  // accumulo fianchi
  };
  dietaryPreferences: {
    vegan: boolean;
    vegetarian: boolean;
    keto: boolean;
    mediterranean: boolean;
  };
  metabolicProfile: {
    insulinSensitive: boolean;
    stressLevel: 'low' | 'moderate' | 'high';
    sleepQuality: 'poor' | 'moderate' | 'good';
    digestion: 'poor' | 'moderate' | 'good';
  };
}

const generateDietPlan = (profile: UserProfile): DailyPlan[] => {
  // Calcolo BMR usando l'equazione di Mifflin-St Jeor
  const bmr = profile.gender === 'male'
    ? (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    : (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;

  // Moltiplicatori per livello di attività
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  // Calcolo TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[profile.activityLevel];

  // Aggiustamento calorie in base all'obiettivo
  let targetCalories = tdee;
  switch(profile.goal) {
    case 'fat_loss':
      targetCalories *= 0.8; // Deficit del 20%
      break;
    case 'muscle_gain':
      targetCalories *= 1.1; // Surplus del 10%
      break;
    // maintenance rimane uguale a tdee
  }

  // Selezione pasti in base alle aree problematiche
  const selectMealsForProblemAreas = (meals: Meal[]): Meal[] => {
    let selectedMeals = [...meals];
    
    if (profile.problemAreas.chest) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('anti-aromatasi') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('dim') || 
          ing.notes?.toLowerCase().includes('anti-estrogeni')
        )
      );
    }

    if (profile.problemAreas.abdomen) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('anti-cortisolo') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('termogenico') || 
          ing.notes?.toLowerCase().includes('anti-infiammatoria')
        )
      );
    }

    if (profile.problemAreas.hips) {
      selectedMeals = selectedMeals.filter(meal => 
        meal.name.toLowerCase().includes('drenante') || 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('drenante') || 
          ing.notes?.toLowerCase().includes('detox')
        )
      );
    }

    return selectedMeals;
  };

  // Aggiustamento pasti in base al profilo metabolico
  const adjustMealsForMetabolicProfile = (meals: Meal[]): Meal[] => {
    let adjustedMeals = [...meals];

    if (!profile.metabolicProfile.insulinSensitive) {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('controllo glicemico')
        )
      );
    }

    if (profile.metabolicProfile.stressLevel === 'high') {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('riduce cortisolo') || 
          ing.notes?.toLowerCase().includes('anti-stress')
        )
      );
    }

    if (profile.metabolicProfile.sleepQuality === 'poor') {
      adjustedMeals = adjustedMeals.filter(meal => 
        meal.ingredients.some(ing => 
          ing.notes?.toLowerCase().includes('magnesio') || 
          ing.notes?.toLowerCase().includes('rilassante')
        )
      );
    }

    return adjustedMeals;
  };

  // Generazione piano settimanale
  const weeklyPlan: DailyPlan[] = Array.from({ length: 7 }, (_, dayIndex) => {
    // Filtraggio pasti in base a tutti i criteri
    let availableMeals = mealDatabase;
    availableMeals = selectMealsForProblemAreas(availableMeals);
    availableMeals = adjustMealsForMetabolicProfile(availableMeals);

    // Selezione casuale dei pasti per il giorno
    const dailyMeals = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availableMeals.length);
      dailyMeals.push(availableMeals[randomIndex]);
    }

    return {
      date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000),
      meals: dailyMeals,
      totalCalories: dailyMeals.reduce((sum, meal) => sum + meal.calories, 0),
      totalMacros: {
        protein: dailyMeals.reduce((sum, meal) => sum + meal.macros.protein, 0),
        carbs: dailyMeals.reduce((sum, meal) => sum + meal.macros.carbs, 0),
        fat: dailyMeals.reduce((sum, meal) => sum + meal.macros.fat, 0),
        fiber: dailyMeals.reduce((sum, meal) => sum + meal.macros.fiber, 0)
      }
    };
  });

  return weeklyPlan;
};

export const usePersonalizedDiet = () => {
  const { userProfile } = useProgressTracking();
  const [dietPlan, setDietPlan] = useState<PersonalizedDiet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      const today = new Date().toISOString().split('T')[0];
      const lastGeneratedDate = localStorage.getItem('dietLastGeneratedDate');

      if (lastGeneratedDate !== today || !localStorage.getItem('dietPlan')) {
        console.log('Generating new diet plan for today...');
        const newPlan = generateDietPlan(userProfile);
        setDietPlan(newPlan);
        localStorage.setItem('dietPlan', JSON.stringify(newPlan));
        localStorage.setItem('dietLastGeneratedDate', today);
      } else {
        console.log('Loading diet plan from cache...');
        const cachedPlan = localStorage.getItem('dietPlan');
        if (cachedPlan) {
          setDietPlan(JSON.parse(cachedPlan));
        }
      }
      setLoading(false);
    }
  }, [userProfile]);

  return { dietPlan, loading };
};

// --- LOGICA DI CALCOLO E GENERAZIONE --- 

const calculateBMR = (profile: UserProfile): number => {
  const { current_weight, height, age, gender, body_fat_percentage, metabolic_rate } = profile;

  let bmr;
  // Katch-McArdle se il grasso corporeo è noto (più accurate)
  if (body_fat_percentage && body_fat_percentage > 0) {
    const leanBodyMass = current_weight * (1 - body_fat_percentage / 100);
    bmr = 370 + (21.6 * leanBodyMass);
  } else {
    // Mifflin-St Jeor altrimenti
    if (gender === 'male') {
      bmr = 10 * current_weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * current_weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Aggiustamento basato sul metabolismo percepito
  switch (metabolic_rate) {
    case 'slow':
      return bmr * 0.9; // Riduci del 10%
    case 'fast':
      return bmr * 1.1; // Aumenta del 10%
    default:
      return bmr;
  }
};

const calculateTDEE = (bmr: number, activity_level: UserProfile['activity_level']): number => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return bmr * activityMultipliers[activity_level];
};

const getTargetCalories = (tdee: number, goal: UserProfile['goal'], body_type?: UserProfile['body_type']): number => {
  let adjustment = 0;
  switch (goal) {
    case 'weight_loss':
    case 'targeted_fat_loss':
      adjustment = -500; // Deficit calorico standard
      if (body_type === 'endomorph') adjustment -= 150; // Endomorfi rich
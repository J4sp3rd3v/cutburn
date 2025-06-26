import { useState, useEffect } from 'react';
import { useProgressTracking } from './useProgressTracking';

// Interfacce per la struttura dei dati
interface Meal {
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: { item: string; amount: string; notes?: string }[];
  preparation: {
    traditional: string[];
    thermomix?: string[];
  };
  rationale: string;
  season: ('spring' | 'summer' | 'autumn' | 'winter')[];
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
  };
}

interface PersonalizedDiet {
  weeklyPlan: DailyPlan[];
  targetCalories: number;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

// --- DATABASE DELLE RICETTE ---
// Un database di pasti scientificamente formulati, stagionali e con alternative.
const mealDatabase: Meal[] = [
  // --- COLAZIONI ---
  {
    name: "Skyr Proteico e Frutti Rossi",
    calories: 350,
    macros: { protein: 30, carbs: 35, fat: 10 },
    ingredients: [
      { item: "Skyr o Yogurt Greco 0%", amount: "200g" },
      { item: "Frutti di bosco misti", amount: "100g", notes: "freschi o surgelati" },
      { item: "Fiocchi d'avena", amount: "30g" },
      { item: "Semi di chia", amount: "10g" },
      { item: "Miele (opzionale)", amount: "5g" }
    ],
    preparation: {
      traditional: ["Unire tutti gli ingredienti in una ciotola e mescolare bene."],
      thermomix: ["Inserire tutti gli ingredienti nel boccale: 15 sec / vel 4 antiorario."]
    },
    rationale: "Alto contenuto proteico per la sazietà e la sintesi proteica. Fibre e antiossidanti per la salute intestinale e la riduzione dello stress ossidativo.",
    season: ['spring', 'summer', 'autumn', 'winter']
  },
  {
    name: "Uova Strapazzate e Avocado Toast",
    calories: 400,
    macros: { protein: 25, carbs: 25, fat: 20 },
    ingredients: [
      { item: "Uova intere", amount: "3" },
      { item: "Pane integrale", amount: "1 fetta (circa 50g)" },
      { item: "Avocado", amount: "1/2" },
      { item: "Olio EVO", amount: "5g" },
      { item: "Sale e pepe", amount: "q.b." }
    ],
    preparation: {
      traditional: ["Tostare il pane. Schiacciare l'avocado sulla fetta. Cuocere le uova in una padella con l'olio. Adagiare le uova sul toast."]
    },
    rationale: "Fonte completa di proteine e grassi monoinsaturi sani, fondamentali per la produzione ormonale (incluso il testosterone) e il controllo della glicemia.",
    season: ['spring', 'summer', 'autumn', 'winter']
  },
  // --- PRANZI ---
  {
    name: "Insalatona di Pollo e Quinoa",
    calories: 500,
    macros: { protein: 40, carbs: 40, fat: 20 },
    ingredients: [
      { item: "Petto di pollo alla griglia", amount: "150g" },
      { item: "Quinoa tricolore cotta", amount: "80g" },
      { item: "Verdure miste di stagione", amount: "200g", notes: "es. lattuga, pomodorini, cetrioli" },
      { item: "Olio EVO", amount: "15g" },
      { item: "Succo di limone", amount: "1 cucchiaio" }
    ],
    preparation: {
      traditional: ["Tagliare il pollo a cubetti. Unire tutti gli ingredienti in una ciotola capiente e condire a piacere."]
    },
    rationale: "Pasto bilanciato con proteine magre per la massa muscolare, carboidrati complessi per energia sostenuta e fibre per la sazietà e la salute digestiva.",
    season: ['spring', 'summer']
  },
  {
    name: "Salmone al Forno con Asparagi",
    calories: 450,
    macros: { protein: 35, carbs: 10, fat: 30 },
    ingredients: [
      { item: "Filetto di salmone", amount: "180g" },
      { item: "Asparagi", amount: "250g" },
      { item: "Olio EVO", amount: "10g" },
      { item: "Aglio e prezzemolo", amount: "q.b." }
    ],
    preparation: {
      traditional: ["Disporre salmone e asparagi su una teglia. Condire con olio, aglio e prezzemolo. Cuocere in forno a 180°C per 20 minuti."]
    },
    rationale: "Ricco di Omega-3, acidi grassi essenziali con potenti proprietà anti-infiammatorie, utili per contrastare l'infiammazione cronica associata all'accumulo di grasso viscerale.",
    season: ['spring']
  },
  // --- CENE ---
  {
    name: "Zuppa di Lenticchie e Verdure",
    calories: 400,
    macros: { protein: 20, carbs: 60, fat: 8 },
    ingredients: [
        { item: "Lenticchie secche", amount: "80g" },
        { item: "Misto per soffritto", amount: "100g", notes: "sedano, carote, cipolla" },
        { item: "Passata di pomodoro", amount: "200g" },
        { item: "Brodo vegetale", amount: "400ml" },
        { item: "Alloro", amount: "1 foglia" }
    ],
    preparation: {
        traditional: ["Soffriggere le verdure. Aggiungere le lenticchie, la passata e il brodo. Cuocere per 40 minuti."],
        thermomix: ["Soffritto: 3 min / 120°C / vel 1. Aggiungere il resto e cuocere: 40 min / 100°C / vel soft antiorario."]
    },
    rationale: "Fonte eccellente di fibre vegetali e proteine. Le fibre aiutano a regolare i livelli di zucchero nel sangue e a promuovere un sano equilibrio ormonale.",
    season: ['autumn', 'winter']
  },
  // Aggiungere qui molte altre ricette per coprire tutte le stagioni e i pasti...
];

// Formula di Mifflin-St Jeor per il BMR
const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female'): number => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Fattori di attività per il calcolo del TDEE
const activityFactors = {
  sedentary: 1.2,       // Sedentario (poco o nessun esercizio)
  light: 1.375,         // Esercizio leggero (1-3 giorni/settimana)
  moderate: 1.55,       // Esercizio moderato (3-5 giorni/settimana)
  active: 1.725,        // Esercizio pesante (6-7 giorni/settimana)
  very_active: 1.9,     // Esercizio molto pesante (lavoro fisico + allenamento)
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

    const generatePlan = () => {
      setLoading(true);
      
      // 1. Calcolo del TDEE
      const bmr = calculateBMR(
        userProfile.current_weight, 
        userProfile.height, 
        userProfile.age, 
        userProfile.gender || 'male'
      );
      const tdee = bmr * (activityFactors[userProfile.activity_level] || 1.55);

      // 2. Impostazione del deficit calorico (es. 20% in meno per perdita di peso)
      const targetCalories = tdee - (tdee * 0.20);

      // 3. Definizione dei Macronutrienti (es. 40% P, 30% C, 30% F)
      const targetProtein = (targetCalories * 0.40) / 4; // 4 kcal per grammo di proteine
      const targetCarbs = (targetCalories * 0.30) / 4;   // 4 kcal per grammo di carboidrati
      const targetFat = (targetCalories * 0.30) / 9;     // 9 kcal per grammo di grassi

      // --- LOGICA DI COMPOSIZIONE DEL PIANO ---
      // Qui verrà implementata la logica per:
      // - Scegliere la stagione corrente
      // - Filtrare il database di ricette per la stagione
      // - Comporre 7 giorni di pasti che si avvicinino il più possibile
      //   ai target calorici e di macronutrienti calcolati.
      //
      // Per ora, useremo dati placeholder.

      const placeholderPlan: PersonalizedDiet = {
        weeklyPlan: [], // Verrà popolato dinamicamente
        targetCalories: Math.round(targetCalories),
        targetMacros: {
          protein: Math.round(targetProtein),
          carbs: Math.round(targetCarbs),
          fat: Math.round(targetFat),
        },
      };
      
      setDietPlan(placeholderPlan);
      setLoading(false);
    };

    generatePlan();

  }, [userProfile]);

  return { dietPlan, loading };
}; 

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Zap, Droplets, Flame } from 'lucide-react';

const RecipeSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("detox");

  const recipes = {
    detox: [
      {
        name: "THE BOOSTER - Cetriolo Detox",
        time: "3 min",
        servings: 1,
        calories: 45,
        type: "Succo Detox",
        category: "Mattina - Digiuno",
        ingredients: [
          "Cetriolo: 100g (1/2 cetriolo medio)",
          "Sedano: 50g (1-2 gambi)",
          "Mela verde: 100g (1 mela piccola)",
          "Lime: 1/4 (succo)"
        ],
        preparation: [
          "Lavare e tagliare cetriolo, sedano e mela verde",
          "Inserire tutti gli ingredienti nel boccale Bimby",
          "Frullare Velocità 10, 1-2 minuti fino a consistenza omogenea",
          "Aggiungere acqua se necessario per consistenza liquida",
          "Filtrare con colino a maglie fini per succo liscio"
        ],
        bimbySteps: [
          "Verdure tagliate nel boccale TM6",
          "Velocità 10, 90 secondi",
          "Controllo consistenza, aggiunta acqua se necessario"
        ],
        benefits: "Diuretico naturale, riduce ritenzione idrica. Potassio per drenaggio tessuti.",
        timing: "A stomaco vuoto, 30 min prima colazione",
        fatBurning: "Accelera metabolismo basale +8% per 2 ore"
      },
      {
        name: "THE HEAVY METAL DETOX",
        time: "4 min",
        servings: 1,  
        calories: 180,
        type: "Smoothie Detox",
        category: "Post-workout",
        ingredients: [
          "Mirtilli: 100g",
          "Spirulina: 1 cucchiaino (3-5g)",
          "Coriandolo: 20g (ciuffo)",
          "Banana: 1/2 media (50g)",
          "Arancia: 100g (1/2 arancia grande)"
        ],
        preparation: [
          "Sbucciare arancia e banana, lavare mirtilli e coriandolo",
          "Tutti gli ingredienti nel boccale Bimby",
          "Frullare Velocità 10, 1-2 minuti per composto liscio",
          "Aggiungere acqua per consistenza desiderata",
          "Servire immediatamente per preservare antiossidanti"
        ],
        bimbySteps: [
          "Frutta e verdure nel boccale TM6",
          "Velocità 10, 2 minuti",
          "Controllo e eventuale aggiunta liquidi"
        ],
        benefits: "Chelazione metalli pesanti, antiossidanti potenti. Spirulina per energia muscolare.",
        timing: "Post-workout entro 30 min",
        fatBurning: "Antocianine attivano enzimi lipolisi +15%"
      },
      {
        name: "THE GLOW - Avocado Power",
        time: "3 min",
        servings: 1,
        calories: 220,
        type: "Smoothie Cremoso",
        category: "Spuntino pomeridiano",
        ingredients: [
          "Avocado: 1/4 medio (40-50g)",
          "Ananas: 100g (1 fetta)",
          "Spinaci: 30g (manciata)",
          "Lime: 1/4 (succo)",
          "Miele: 1 cucchiaino"
        ],
        preparation: [
          "Sbucciare avocado e ananas, lavare spinaci",
          "Ingredienti nel boccale con lime e miele",
          "Frullare Velocità 10, 1-2 minuti per consistenza cremosa",
          "Aggiungere ghiaccio per effetto rinfrescante",
          "Servire in bicchiere alto con cannuccia"
        ],
        bimbySteps: [
          "Tutti ingredienti nel boccale TM6",
          "Velocità 10, 90 secondi",
          "Aggiunta ghiaccio, Velocità 6, 30 secondi"
        ],
        benefits: "Grassi monoinsaturi per testosterone. Enzimi digestivi ananas.",
        timing: "Spuntino 15:00-16:00, pre-allenamento",
        fatBurning: "Bromelina ananas migliora digestione proteine"
      },
      {
        name: "THE ENERGISER - Anguria Boost",
        time: "2 min",
        servings: 1,
        calories: 95,
        type: "Succo Energetico",
        category: "Pre-workout",
        ingredients: [
          "Anguria: 200g (1-2 fette)",
          "Menta: 10g (ciuffo)",
          "Ananas: 100g (1 fetta)",
          "Lime: 1/4 (succo)"
        ],
        preparation: [
          "Tagliare anguria e ananas a pezzi, lavare menta",
          "Tutti gli ingredienti nel boccale Bimby",
          "Frullare Velocità 10, 1-2 minuti per composto liquido",
          "Non filtrare per mantenere fibre",
          "Servire con ghiaccio tritato"
        ],
        bimbySteps: [
          "Frutta e menta nel boccale TM6",
          "Velocità 10, 90 secondi",
          "Ghiaccio tritato Velocità 7, 15 secondi"
        ],
        benefits: "Citrullina per pump muscolare. Idratazione pre-workout ottimale.",
        timing: "45 min pre-allenamento",
        fatBurning: "Citrullina migliora flusso sangue tessuto adiposo"
      }
    ],
    proteiche: [
      {
        name: "Hummus Proteico Avanzato",
        time: "8 min",
        servings: 4,
        calories: 160,
        type: "Crema Proteica",
        category: "Snack anytime",
        ingredients: [
          "Ceci cotti: 200g",
          "Tahina: 2 cucchiai (30g)",
          "Proteine neutre: 1 misurino (25g)",
          "Limone: 1 intero (succo)",
          "Aglio: 1 spicchio",
          "Olio EVO: 2 cucchiai",
          "Curcuma: 1 cucchiaino",
          "Paprika: 1/2 cucchiaino"
        ],
        preparation: [
          "Sciacquare ceci cotti e rimuovere eccesso acqua",
          "Aglio e limone nel boccale, tritare Velocità 7, 10 secondi",
          "Aggiungere ceci, tahina, proteine, spezie",
          "Frullare Velocità 8, 45 secondi",
          "Aggiungere olio a filo con boccale in movimento",
          "Controllare consistenza, aggiungere acqua se troppo denso",
          "Frullare altri 30 secondi per cremosità perfetta"
        ],
        bimbySteps: [
          "Aglio + limone: Velocità 7, 10 secondi",
          "Ceci + tahina + proteine: Velocità 8, 45 secondi", 
          "Olio a filo: Velocità 4, 30 secondi",
          "Rifinitura: Velocità 6, 30 secondi"
        ],
        benefits: "33g proteine per porzione. Fibre per sazietà prolungata. Grassi sani per ormoni.",
        timing: "Spuntino 10:00 o 16:00. Post-workout con verdure crude.",
        fatBurning: "Proteine aumentano termogenesi +25% per 3 ore"
      },
      {
        name: "Yogurt Bowl Proteico",
        time: "5 min",
        servings: 1,
        calories: 280,
        type: "Bowl Completo",
        category: "Colazione/Spuntino",
        ingredients: [
          "Yogurt greco 0%: 200g",
          "Proteine vaniglia: 1 misurino (25g)",
          "Burro di mandorle: 1 cucchiaio (15g)",
          "Semi di chia: 1 cucchiaino (5g)",
          "Mirtilli: 50g",
          "Cannella: 1 pizzico",
          "Stevia: a piacere"
        ],
        preparation: [
          "Yogurt e proteine nel boccale Bimby",
          "Mescolare Velocità 4, 30 secondi per amalgamare",
          "Aggiungere burro mandorle e cannella",
          "Velocità 3, 20 secondi per incorporare",
          "Versare in bowl, aggiungere semi chia",
          "Decorare con mirtilli freschi",
          "Lasciare riposare 5 min per chia gel"
        ],
        bimbySteps: [
          "Yogurt + proteine: Velocità 4, 30 secondi",
          "Burro mandorle: Velocità 3, 20 secondi",
          "Mantecatura finale: Velocità 2, 15 secondi"
        ],
        benefits: "45g proteine slow/fast release. Omega-3 per antinfiammazione.",
        timing: "Colazione 7:00-8:00 o post-workout",
        fatBurning: "Caseina mantiene metabolismo attivo 4-6 ore"
      },
      {
        name: "Smoothie WARRIOR FUEL",
        time: "3 min",
        servings: 1,
        calories: 320,
        type: "Pre-Workout Power",
        category: "45 min pre-allenamento",
        ingredients: [
          "Banana: 1 media (100g)",
          "Datteri: 1-2 denocciolati (15g)",
          "Espresso: 1 tazzina (50ml)",
          "Olio cocco: 1 cucchiaino (5ml)",
          "Semi chia: 1 cucchiaino (5g)",
          "Latte cocco: 150ml",
          "Proteine vaniglia: 1/2 misurino (12g)"
        ],
        preparation: [
          "Banana e datteri nel boccale Bimby",
          "Frullare Velocità 8, 30 secondi per sminuzzare",
          "Aggiungere espresso freddo, olio cocco, proteine",
          "Velocità 10, 45 secondi per amalgamare",
          "Latte cocco e semi chia: Velocità 6, 30 secondi",
          "Controllo consistenza cremosa",
          "Servire immediatamente con ghiaccio"
        ],
        bimbySteps: [
          "Banana + datteri: Velocità 8, 30 secondi",
          "Liquidi + proteine: Velocità 10, 45 secondi",
          "Semi chia: Velocità 6, 30 secondi"
        ],
        benefits: "Caffeina + L-teanina per focus. Carboidrati a rilascio immediato e graduale.",
        timing: "45 min pre-workout per energia sostenuta",
        fatBurning: "Caffeina mobilizza acidi grassi liberi +30%"
      }
    ],
    superfood: [
      {
        name: "GREEN GURU Supreme",
        time: "4 min",
        servings: 1,
        calories: 185,
        type: "Superfood Smoothie",
        category: "Morning power",
        ingredients: [
          "Banana: 1 media (100g)",
          "Spirulina: 1 cucchiaino (5g)",
          "Spinaci baby: 50g",
          "Mango: 50g",
          "Latte cocco: 150ml",
          "Semi canapa: 1 cucchiaio (10g)",
          "Matcha: 1/2 cucchiaino (1g)"
        ],
        preparation: [
          "Banana e mango nel boccale, spinaci lavati",
          "Frullare Velocità 8, 30 secondi per base cremosa",
          "Aggiungere spirulina, matcha, semi canapa",
          "Velocità 10, 60 secondi per dispersione uniforme",
          "Latte cocco a filo: Velocità 4, 30 secondi",
          "Controllo colore verde intenso",
          "Servire immediatamente per preservare nutrienti"
        ],
        bimbySteps: [
          "Frutta + spinaci: Velocità 8, 30 secondi",
          "Superfood: Velocità 10, 60 secondi",
          "Latte cocco: Velocità 4, 30 secondi"
        ],
        benefits: "Clorofilla detox, aminoacidi completi canapa. L-teanina matcha per focus.",
        timing: "Colazione o mid-morning per energia pulita",
        fatBurning: "EGCG matcha attiva enzimi ossidazione grassi +17%"
      },
      {
        name: "BLUE HORIZON Antioxidant",
        time: "4 min",
        servings: 1,
        calories: 240,
        type: "Recovery Smoothie",
        category: "Post-workout",
        ingredients: [
          "Spirulina blu: 1 cucchiaino (5g)",
          "Açaí polpa: 50g (congelata)",
          "Banana: 1/2 media (50g)",
          "Avocado: 1/4 medio (40g)",
          "Ananas: 50g",
          "Proteine vaniglia: 1 misurino (25g)",
          "Acqua cocco: 200ml"
        ],
        preparation: [
          "Açaí congelato spezzato, banana e avocado",
          "Frullare Velocità 7, 45 secondi per rompere ghiaccio",
          "Ananas e spirulina: Velocità 9, 45 secondi",
          "Proteine e acqua cocco: Velocità 10, 60 secondi",
          "Controllo consistenza blu intenso",
          "Aggiungere ghiaccio per texture frappé",
          "Servire in bowl con toppings opzionali"
        ],
        bimbySteps: [
          "Açaí + frutta: Velocità 7, 45 secondi",
          "Spirulina + ananas: Velocità 9, 45 secondi",
          "Proteine + liquidi: Velocità 10, 60 secondi"
        ],
        benefits: "Antocianine açaí per recupero muscolare. Ficocianina spirulina antinfiammatoria.",
        timing: "Entro 30 min post-workout",
        fatBurning: "Antocianine migliorano utilizzo grassi durante recupero"
      }
    ]
  };

  const categories = [
    { key: "detox", label: "Detox Juices", icon: <Droplets className="w-4 h-4" /> },
    { key: "proteiche", label: "Prep Proteiche", icon: <Zap className="w-4 h-4" /> },
    { key: "superfood", label: "Superfood", icon: <Flame className="w-4 h-4" /> }
  ];

  const currentRecipes = recipes[selectedCategory as keyof typeof recipes];

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Ricette Avanzate 2025
        </h2>
        <p className="text-slate-600">
          Science-based • Bimby TM6 • Timing ottimale • Fat burning
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex space-x-2">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.key)}
            className="flex-1 flex items-center space-x-1"
          >
            {category.icon}
            <span className="text-xs">{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Recipes List */}
      <div className="space-y-4">
        {currentRecipes.map((recipe, index) => (
          <Card key={index} className="p-4 bg-white/70 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-slate-800">{recipe.name}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1">
                  {recipe.calories} kcal
                </Badge>
                <div className="text-xs text-slate-500">{recipe.type}</div>
              </div>
            </div>

            {/* Category & Timing */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary" className="text-xs">
                  {recipe.category}
                </Badge>
                <span className="text-xs text-slate-600 font-medium">{recipe.timing}</span>
              </div>
              <div className="text-xs text-slate-700">
                <strong>Fat Burning:</strong> {recipe.fatBurning}
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-700 mb-2">Ingredienti:</h4>
              <div className="grid grid-cols-1 gap-1">
                {recipe.ingredients.map((ingredient, idx) => (
                  <div key={idx} className="text-sm text-slate-600 flex">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-700 mb-2">Preparazione:</h4>
              <ol className="space-y-1">
                {recipe.preparation.map((step, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex">
                    <span className="text-blue-500 font-medium mr-2 flex-shrink-0">
                      {idx + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Bimby Steps */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                <ChefHat className="w-4 h-4 mr-1" />
                Bimby TM6:
              </h4>
              <div className="bg-slate-50 rounded-lg p-3">
                {recipe.bimbySteps.map((step, idx) => (
                  <div key={idx} className="text-sm text-slate-700 mb-1">
                    • {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="border-t pt-3">
              <h4 className="font-medium text-slate-700 mb-1 text-sm">Benefici Scientifici:</h4>
              <p className="text-xs text-slate-600 italic mb-2">{recipe.benefits}</p>
              <div className="bg-green-50 rounded p-2">
                <p className="text-xs text-green-700">
                  <strong>Timing Ottimale:</strong> {recipe.timing}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecipeSection;

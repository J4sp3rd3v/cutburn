
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Zap, Droplets, Flame, Sparkles } from 'lucide-react';

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
    bowls: [
      {
        name: "CHIA + GRANOLA JAR",
        time: "15 min",
        servings: 1,
        calories: 420,
        type: "Layered Bowl",
        category: "Colazione energizzante",
        ingredients: [
          "Semi di chia: 25g",
          "Bevanda al cocco: 150ml",
          "Polpa di mango: 80g",
          "Mandorle tostate: 20g",
          "Semi sesamo tostati: 10g",
          "Granola croccante: 3-4 cucchiai",
          "Yogurt di cocco: 2 cucchiai",
          "Burro di mandorle: 1 cucchiaio"
        ],
        preparation: [
          "Budino chia: mescola chia + latte cocco, riposa 2h in frigo",
          "Dukkah dolce: trita mandorle, sesamo, zucchero cocco, cannella - Vel 7, 5 sec",
          "Composta mango: cuoci mango + limone + zucchero - 5 min/90°C/Vel 2",
          "Assemblaggio a strati: budino chia, composta mango, yogurt, granola",
          "Termina con burro mandorle e dukkah dolce"
        ],
        bimbySteps: [
          "Dukkah: mandorle + sesamo + spezie - Vel 7, 5 sec",
          "Composta: mango + limone - 5 min/90°C/Vel 2",
          "Assemblaggio manuale a strati"
        ],
        benefits: "Omega-3 da chia. Fibre per sazietà. Antiossidanti da mango.",
        timing: "Colazione 7:00-9:00 per energia sostenuta",
        fatBurning: "Chia aumenta metabolismo basale +8% per 4 ore"
      },
      {
        name: "OAT SO GOOD",
        time: "10 min",
        servings: 1,
        calories: 380,
        type: "Overnight Bowl",
        category: "Colazione veloce",
        ingredients: [
          "Fiocchi d'avena: 40g",
          "Semi di chia: 10g", 
          "Bevanda al cocco: 180ml",
          "Datteri Medjoul: 3 denocciolati",
          "Banana: 1/2 a fette",
          "Noci pecan: 1 cucchiaio",
          "Semi misti: 1 cucchiaio"
        ],
        preparation: [
          "Overnight oat: mescola avena + chia + latte cocco - 15 sec/Vel 3 Antiorario",
          "Riposa tutta la notte in frigo",
          "Salsa datteri: datteri + acqua calda - 30 sec/Vel 8",
          "Guarnisci con banana, noci, semi",
          "Irrora con salsa di datteri"
        ],
        bimbySteps: [
          "Overnight mix: avena + chia + latte - 15 sec/Vel 3 Antiorario",
          "Salsa datteri: datteri + acqua - 30 sec/Vel 8",
          "Assemblaggio con topping"
        ],
        benefits: "Beta-glucani per colesterolo. Energia lenta da avena.",
        timing: "Colazione 6:30-8:00 per energia prolungata",
        fatBurning: "Avena stabilizza glicemia, ottimizza fat burning"
      },
      {
        name: "GRANOLA BABY",
        time: "20 min",
        servings: 1,
        calories: 350,
        type: "Panna Cotta Bowl",
        category: "Dessert salutare",
        ingredients: [
          "Latte di cocco denso: 200ml",
          "Sciroppo d'acero: 1 cucchiaio",
          "Estratto vaniglia: 1/2 cucchiaino",
          "Agar agar: 1.5g",
          "Granola: 4-5 cucchiai",
          "Frutta fresca: 80g (mango/fragole/banana)",
          "Latte vegetale: per guarnire"
        ],
        preparation: [
          "Panna cotta: latte cocco + sciroppo + vaniglia + agar agar",
          "Cuoci 6 min/90°C/Vel 3",
          "Versa in ciotola, raffredda 4h in frigo",
          "Sforma delicatamente",
          "Guarnisci con granola e frutta fresca",
          "Filo di latte vegetale attorno"
        ],
        bimbySteps: [
          "Panna cotta: tutti ingredienti - 6 min/90°C/Vel 3",
          "Raffreddamento 4h in frigo",
          "Assemblaggio con topping"
        ],
        benefits: "Grassi MCT da cocco. Probiotici naturali. Digestione facilitata.",
        timing: "Merenda 15:00-17:00 o dessert dopo cena",
        fatBurning: "MCT cocco aumentano termogenesi +15%"
      },
      {
        name: "SALTED CARAMEL BOWL",
        time: "5 min",
        servings: 1,
        calories: 340,
        type: "Protein Bowl",
        category: "Post-workout",
        ingredients: [
          "Banana grande congelata: 1 a rondelle",
          "Burro di anacardi: 1 cucchiaio",
          "Proteine caramello: 1 misurino",
          "Semi lino macinati: 1 cucchiaino",
          "Semi di chia: 1 cucchiaino",
          "Maca in polvere: 1/2 cucchiaino",
          "Cannella: pizzico",
          "Sale marino: pizzico",
          "Latte mandorla: 80ml",
          "Acqua di cocco: 40ml"
        ],
        preparation: [
          "Tutti ingredienti nel boccale: banana, burro anacardi, proteine",
          "Aggiungi semi, maca, cannella, sale, liquidi",
          "Frulla 1 min/Vel 9 aiutandoti con spatola",
          "Consistenza densa e cremosa",
          "Guarnisci con banana fresca e cannella"
        ],
        bimbySteps: [
          "Tutti ingredienti insieme - 1 min/Vel 9",
          "Spatolare durante frullatura",
          "Servire immediatamente"
        ],
        benefits: "25g proteine per recupero. Maca per energia. Elettroliti da cocco.",
        timing: "Entro 30 min post-workout",
        fatBurning: "Proteine + maca aumentano metabolismo +20%"
      },
      {
        name: "FILL ME UP PROTEIN",
        time: "4 min",
        servings: 1,
        calories: 390,
        type: "Superfood Bowl",
        category: "Power breakfast",
        ingredients: [
          "Polpa açaí surgelata: 100g",
          "Banana congelata: 1/2 a rondelle",
          "Mango surgelato: 50g",
          "Proteine frutti bosco: 20g",
          "Fiocchi d'avena: 1 cucchiaio",
          "Bevanda al cocco: 50ml",
          "Frutti bosco freschi: per guarnire",
          "Scaglie cocco: per guarnire",
          "Bacche goji: 1 cucchiaino",
          "Mandorle tritate: 1 cucchiaino",
          "Polline d'api: pizzico"
        ],
        preparation: [
          "Açaí, banana, mango surgelati nel boccale",
          "Aggiungi proteine, avena, latte cocco",
          "Frulla 1 min/Vel 9 usando spatola",
          "Crema viola intenso e densa",
          "Guarnisci decorativamente con topping",
          "Disponi frutti, cocco, goji, mandorle, polline"
        ],
        bimbySteps: [
          "Frutta surgelata + proteine + avena - 1 min/Vel 9",
          "Spatolare per amalgamare",
          "Decorazione artistica topping"
        ],
        benefits: "Antocianine açaí. 25g proteine complete. Antiossidanti potenti.",
        timing: "Colazione 7:00-9:00 per energia esplosiva",
        fatBurning: "Açaí + proteine attivano lipolisi +25%"
      },
      {
        name: "NOURISH GREENBOWL",
        time: "4 min",
        servings: 1,
        calories: 310,
        type: "Detox Bowl",
        category: "Wellness verde",
        ingredients: [
          "Banana grande congelata: 1 a rondelle",
          "Spinacini freschi: 1 manciata grande",
          "Supergreens polvere: 1 cucchiaino",
          "Burro di mandorle: 1 cucchiaio",
          "Semi lino macinati: 1 cucchiaino",
          "Semi di chia: 1 cucchiaino",
          "Maca in polvere: 1/2 cucchiaino",
          "Acqua di cocco: 120ml",
          "Scaglie cocco tostate: per guarnire"
        ],
        preparation: [
          "Banana congelata, spinacini, supergreens nel boccale",
          "Aggiungi burro mandorle, semi, maca, acqua cocco",
          "Frulla 1 min/Vel 9 per composto liscio",
          "Colore verde brillante caratteristico",
          "Guarnisci con scaglie cocco, chia, banana"
        ],
        bimbySteps: [
          "Tutti ingredienti base - 1 min/Vel 9",
          "Controllo consistenza verde brillante",
          "Topping finale"
        ],
        benefits: "Clorofilla detox. Ferro da spinaci. Grassi sani mandorle.",
        timing: "Colazione 7:30-9:00 per detox mattutino",
        fatBurning: "Clorofilla aumenta ossigenazione tessuti +18%"
      },
      {
        name: "MONKEY BUSINESS",
        time: "4 min",
        servings: 1,
        calories: 380,
        type: "Chocolate Bowl",
        category: "Indulgence salutare",
        ingredients: [
          "Banana grande congelata: 1 a rondelle",
          "Burro arachidi 100%: 1 cucchiaio abbondante",
          "Cacao amaro crudo: 1 cucchiaio",
          "Latte mandorla: 100ml",
          "Granola: 3-4 cucchiai",
          "Fragole fresche: 3-4 a fette",
          "Miele: 1 cucchiaino",
          "Scaglie cocco: per guarnire",
          "Semi chia: 1 cucchiaino"
        ],
        preparation: [
          "Banana congelata, burro arachidi, cacao nel boccale",
          "Aggiungi latte mandorla gradualmente",
          "Frulla 1 min/Vel 9 per crema cioccolatosa",
          "Consistenza densa simile gelato",
          "Guarnisci a strisce: granola, fragole, cocco, chia",
          "Completa con filo di miele"
        ],
        bimbySteps: [
          "Banana + burro + cacao - 1 min/Vel 9",
          "Latte graduale per consistenza",
          "Decorazione artistica finale"
        ],
        benefits: "Cacao crudo antiossidante. Grassi sani arachidi. Potassio banana.",
        timing: "Merenda 15:00-17:00 o post-workout goloso",
        fatBurning: "Cacao crudo aumenta endorfine e metabolismo +12%"
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
      }
    ],
    stellati: [
      {
        name: "EMERALD GLOW Supreme",
        time: "6 min",
        servings: 1,
        calories: 180,
        type: "Detox Reale",
        category: "Luxury wellness",
        ingredients: [
          "Cetriolo: 80g (1/2 piccolo pelato)",
          "Spinaci freschi: 50g",
          "Mela verde: 80g (1/2 senza torsolo)",
          "Pompelmo rosa: 50g (2 spicchi a vivo)",
          "Acqua cocco: 150ml",
          "Lime: 1 cucchiaio succo",
          "Spirulina: 1 cucchiaino (5g)",
          "Menta fresca: 6 foglie"
        ],
        preparation: [
          "Cetriolo, mela, spinaci e menta nel boccale",
          "Tritare grossolanamente: Velocità 7, 5 secondi",
          "Aggiungere pompelmo, acqua cocco, lime, spirulina",
          "Frullare Velocità 10, 90 secondi per consistenza liscia",
          "Regolare acqua cocco per fluidità desiderata",
          "Filtrare opzionale per succo liscio"
        ],
        bimbySteps: [
          "Verdure + menta: Velocità 7, 5 secondi",
          "Tutti ingredienti: Velocità 10, 90 secondi",
          "Controllo fluidità, aggiunta liquidi"
        ],
        benefits: "Pompelmo rosa per metabolismo lipidi. Clorofilla detox epatico.",
        timing: "Mid-morning per detox profondo",
        fatBurning: "Naringina pompelmo attiva lipasi +20%"
      },
      {
        name: "MATCHA ZEN GARDEN",
        time: "5 min",
        servings: 1,
        calories: 310,
        type: "Focus & Calma",
        category: "Concentrazione",
        ingredients: [
          "Banana congelata: 100g (1 media)",
          "Latte d'avena: 150ml",
          "Matcha cerimoniale: 1 cucchiaino (3g)",
          "Burro mandorle: 15g",
          "Spirulina: 1/2 cucchiaino (3g)",
          "Miele/agave: 1 cucchiaino"
        ],
        preparation: [
          "Banana congelata nel boccale con latte d'avena",
          "Matcha, burro mandorle, spirulina, miele",
          "Frullare Velocità 10, 75 secondi spatolando",
          "Consistenza densa e omogenea",
          "Colore verde intenso caratteristico",
          "Servire in bicchiere alto con cannuccia"
        ],
        bimbySteps: [
          "Banana + latte: Velocità 8, 30 secondi",
          "Matcha + grassi: Velocità 10, 45 secondi",
          "Mantecatura finale: Velocità 6, 15 secondi"
        ],
        benefits: "L-teanina + caffeina per focus. EGCG antiossidante potente.",
        timing: "Mid-morning per concentrazione sostenuta",
        fatBurning: "EGCG matcha attiva termogenesi +22%"
      },
      {
        name: "VELVET BERRY DREAM",
        time: "7 min",
        servings: 1,
        calories: 340,
        type: "Beauty Luxury",
        category: "Bellezza & Benessere",
        ingredients: [
          "Frutti bosco misti: 120g (congelati)",
          "Latte mandorla premium: 120ml",
          "Anacardi ammollati: 15g (10-12 pezzi)",
          "Datteri Medjool: 1-2 denocciolati",
          "Semi chia: 1 cucchiaino",
          "Estratto vaniglia: 1/4 cucchiaino",
          "Collagen powder: 10g (opzionale)"
        ],
        preparation: [
          "Anacardi ammollati 30 min, sciacquati",
          "Tutti ingredienti nel boccale insieme",
          "Frullare Velocità 10, 90 secondi spatolando",
          "Consistenza vellutata senza grumi",
          "Collagen per effetto beauty (opzionale)",
          "Cremosità incredibile dagli anacardi"
        ],
        bimbySteps: [
          "Tutti ingredienti: Velocità 10, 90 secondi",
          "Controllo cremosità, spatolare",
          "Rifinitura vellutata: Velocità 8, 30 secondi"
        ],
        benefits: "Anacardi per grassi sani. Antiossidanti anti-aging intensi.",
        timing: "Afternoon snack per energia e bellezza",
        fatBurning: "Grassi monoinsaturi ottimizzano ormoni brucia-grassi"
      }
    ]
  };

  const categories = [
    { key: "detox", label: "Detox", icon: <Droplets className="w-4 h-4" /> },
    { key: "bowls", label: "Bowls", icon: <Zap className="w-4 h-4" /> },
    { key: "proteiche", label: "Proteiche", icon: <Flame className="w-4 h-4" /> },
    { key: "stellati", label: "Stellati", icon: <Sparkles className="w-4 h-4" /> }
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
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.key)}
            className="flex items-center space-x-2 justify-center"
          >
            {category.icon}
            <span className="text-sm">{category.label}</span>
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

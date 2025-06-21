
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
        name: "FORESTA VERDE Bowl",
        time: "5 min",
        servings: 1,
        calories: 280,
        type: "Smoothie Bowl",
        category: "Colazione energizzante",
        ingredients: [
          "Spinaci freschi: 80g (2 manciate)",
          "Banana congelata: 100g (1 media)",
          "Mango congelato: 100g",
          "Latte mandorla: 100ml",
          "Spirulina: 1 cucchiaino (5g)",
          "Semi chia: 1 cucchiaio"
        ],
        preparation: [
          "Banana e mango congelati nel boccale con spinaci",
          "Aggiungere spirulina e semi di chia",
          "100ml latte di mandorla per iniziare",
          "Frullare Velocità 10, 1 minuto spatolando",
          "Regolare latte per consistenza densa",
          "Versare in bowl, decorare con topping"
        ],
        bimbySteps: [
          "Frutta congelata + spinaci: Velocità 10, 60 secondi",
          "Controllo consistenza, aggiunta latte graduale",
          "Mantecatura finale: Velocità 6, 15 secondi"
        ],
        benefits: "Clorofilla detox, energia prolungata. Magnesio per funzione muscolare.",
        timing: "Colazione 7:00-8:30 per energia mattutina",
        fatBurning: "Spirulina aumenta ossidazione grassi +12%"
      },
      {
        name: "ANTIOSSIDANTE Berry Bowl",
        time: "4 min",
        servings: 1,
        calories: 320,
        type: "Recovery Bowl",
        category: "Post-workout",
        ingredients: [
          "Frutti bosco misti: 150g (congelati)",
          "Banana congelata: 50g (1/2 media)",
          "Yogurt greco 0%: 50g",
          "Latte cocco: 80ml",
          "Açaí polvere: 1 cucchiaino (5g)",
          "Semi lino: 1 cucchiaino"
        ],
        preparation: [
          "Frutti di bosco e banana congelati nel boccale",
          "Aggiungere yogurt, latte cocco, açaí, semi lino",
          "Frullare Velocità 10, 1 minuto spatolando frequentemente",
          "Consistenza molto densa e cremosa",
          "Versare in bowl e decorare con topping freschi",
          "Servire immediatamente"
        ],
        bimbySteps: [
          "Frutta congelata: Velocità 10, 45 secondi",
          "Yogurt + liquidi: Velocità 8, 30 secondi",
          "Rifinitura cremosa: Velocità 6, 15 secondi"
        ],
        benefits: "Antocianine per recupero muscolare. Proteine per sintesi proteica.",
        timing: "Entro 30 min post-workout",
        fatBurning: "Açaí attiva metabolismo grassi +18%"
      },
      {
        name: "GOLDEN ELIXIR Bowl",
        time: "4 min",
        servings: 1,
        calories: 290,
        type: "Antinfiammatorio",
        category: "Wellness mattutino",
        ingredients: [
          "Ananas fresco: 100g",
          "Latte cocco denso: 80ml",
          "Curcuma fresca: 1 cm (5g)",
          "Zenzero fresco: 1 cm (5g)",
          "Miele: 1 cucchiaino",
          "Cardamomo: 2-3 semi",
          "Pepe nero: pizzico"
        ],
        preparation: [
          "Tritare curcuma e zenzero: Velocità 8, 5 secondi",
          "Aggiungere ananas, latte cocco, miele, cardamomo",
          "Pepe nero per attivare curcuma",
          "Frullare Velocità 10, 1 minuto per consistenza liscia",
          "Ghiaccio se ananas non congelato",
          "Consistenza cremosa e aromatica"
        ],
        bimbySteps: [
          "Spezie fresche: Velocità 8, 5 secondi",
          "Ananas + liquidi: Velocità 10, 60 secondi",
          "Ghiaccio opzionale: Velocità 7, 15 secondi"
        ],
        benefits: "Curcumina antinfiammatoria. Ananas enzimi digestivi.",
        timing: "Mid-morning per digestione e energia",
        fatBurning: "Curcuma + pepe nero aumentano termogenesi +15%"
      },
      {
        name: "CHIA + GRANOLA JAR",
        time: "15 min",
        servings: 1,
        calories: 380,
        type: "Layered Bowl",
        category: "Colazione stratificata",
        ingredients: [
          "Semi chia: 25g",
          "Bevanda cocco: 150ml",
          "Sciroppo acero: 1 cucchiaino",
          "Mango maturo: 80g",
          "Succo limone: 1 cucchiaino",
          "Zucchero canna: 1 cucchiaino",
          "Mandorle tostate: 20g",
          "Semi sesamo tostati: 10g",
          "Zucchero cocco: 1 cucchiaino",
          "Cannella: pizzico",
          "Granola croccante: 3-4 cucchiai",
          "Yogurt cocco: 2 cucchiai",
          "Burro mandorle: 1 cucchiaio"
        ],
        preparation: [
          "Sera prima: mescolare chia + bevanda cocco + sciroppo, riposare in frigo",
          "Dukkah dolce: mandorle, sesamo, zucchero, cannella nel boccale",
          "Tritare 5 sec / Vel 7, mettere da parte",
          "Composta mango: mango + limone + zucchero nel boccale",
          "Cuocere 5 min / 90°C / Vel 2, lasciare raffreddare",
          "Assemblaggio a strati: budino chia, composta, yogurt, granola",
          "Terminare con burro mandorle e dukkah dolce"
        ],
        bimbySteps: [
          "Dukkah: mandorle + spezie, Velocità 7, 5 secondi",
          "Composta: mango + limone, 5 min / 90°C / Vel 2",
          "Assemblaggio stratificato finale"
        ],
        benefits: "Omega-3 da chia. Fibre per sazietà prolungata. Grassi sani.",
        timing: "Colazione 7:00-9:00 per energia sostenuta",
        fatBurning: "Chia rallenta assorbimento zuccheri, stabilizza glicemia"
      },
      {
        name: "OAT SO GOOD",
        time: "10 min",
        servings: 1,
        calories: 340,
        type: "Overnight Oats",
        category: "Prep ahead breakfast",
        ingredients: [
          "Fiocchi avena: 40g",
          "Semi chia: 10g",
          "Bevanda cocco: 180ml",
          "Datteri Medjoul: 3 denocciolati",
          "Acqua calda: 30ml",
          "Banana: 1/2 a fette",
          "Noci pecan: 1 cucchiaio tritato",
          "Semi misti: 1 cucchiaio"
        ],
        preparation: [
          "Sera prima: avena + chia + bevanda cocco nel boccale",
          "Mescolare 15 sec / Vel 3 Antiorario",
          "Versare in vasetto, riposare in frigo tutta notte",
          "Salsa datteri: datteri + acqua calda nel boccale pulito",
          "Frullare 30 sec / Vel 8, spatolando se necessario",
          "Assemblaggio: avena dal frigo + banana + noci + semi",
          "Irrorare generosamente con salsa datteri"
        ],
        bimbySteps: [
          "Overnight oats: 15 sec / Vel 3 Antiorario",
          "Salsa datteri: 30 sec / Vel 8",
          "Assemblaggio finale con topping"
        ],
        benefits: "Beta-glucani avena per controllo colesterolo. Energia a rilascio lento.",
        timing: "Colazione 6:30-8:00 per energia mattutina costante",
        fatBurning: "Avena aumenta sazietà, riduce picchi insulinici"
      },
      {
        name: "GRANOLA BABY",
        time: "20 min",
        servings: 1,
        calories: 420,
        type: "Panna Cotta Bowl",
        category: "Dessert breakfast",
        ingredients: [
          "Latte cocco lattina: 200ml (parte grassa)",
          "Sciroppo acero: 1 cucchiaio",
          "Estratto vaniglia: 1/2 cucchiaino",
          "Agar agar: 1.5g",
          "Granola: 4-5 cucchiai",
          "Frutta fresca: 80g (mango/fragole/banana)",
          "Latte mandorla: per versare"
        ],
        preparation: [
          "Sera prima: latte cocco + sciroppo + vaniglia + agar nel boccale",
          "Cuocere 6 min / 90°C / Vel 3",
          "Versare in ciotola, raffreddare poi frigo 4 ore minimo",
          "Assemblaggio: sformare panna cotta delicatamente",
          "Ricoprire con granola e frutta fresca a pezzi",
          "Versare filo di latte mandorla attorno se gradito"
        ],
        bimbySteps: [
          "Panna cotta: 6 min / 90°C / Vel 3",
          "Raffreddamento e solidificazione in frigo",
          "Assemblaggio con topping freschi"
        ],
        benefits: "Grassi MCT cocco per energia immediata. Probiotici per microbioma.",
        timing: "Colazione weekend 8:00-10:00 o merenda pomeridiana",
        fatBurning: "MCT cocco bypass digestione, energia diretta"
      },
      {
        name: "SALTED CARAMEL BOWL",
        time: "5 min",
        servings: 1,
        calories: 350,
        type: "Protein Smoothie Bowl",
        category: "Post-workout indulgence",
        ingredients: [
          "Banana congelata: 1 grande a rondelle",
          "Burro anacardi: 1 cucchiaio",
          "Proteine caramello salato: 1 misurino",
          "Semi lino macinati: 1 cucchiaino",
          "Semi chia: 1 cucchiaino",
          "Maca polvere: 1/2 cucchiaino",
          "Cannella: pizzico",
          "Sale marino: pizzico",
          "Bevanda mandorla: 80ml",
          "Acqua cocco: 40ml"
        ],
        preparation: [
          "Tutti ingredienti nel boccale: banana congelata, burro anacardi",
          "Aggiungere proteine, semi lino, chia, maca, cannella, sale",
          "Versare bevanda mandorla e acqua cocco",
          "Frullare 1 min / Vel 9, spatolando se necessario",
          "Ottenere crema densa e omogenea",
          "Versare in ciotola, guarnire con banana e cannella"
        ],
        bimbySteps: [
          "Tutti ingredienti: 1 min / Vel 9",
          "Spatolature frequenti per consistenza",
          "Guarnizione immediata"
        ],
        benefits: "25g proteine per recupero muscolare. Maca per energia e resistenza.",
        timing: "Entro 30 min post-workout per finestra anabolica",
        fatBurning: "Proteine + maca aumentano metabolismo basale +15%"
      },
      {
        name: "FILL ME UP PROTEIN",
        time: "4 min",
        servings: 1,
        calories: 390,
        type: "Superfood Bowl",
        category: "Ultimate nutrition",
        ingredients: [
          "Açaí surgelato: 100g",
          "Banana congelata: 1/2 a rondelle",
          "Mango surgelato: 50g",
          "Proteine frutti bosco: 1 misurino (20g)",
          "Fiocchi avena: 1 cucchiaio",
          "Bevanda cocco: 50ml",
          "Frutti bosco freschi: manciata",
          "Scaglie cocco: per guarnire",
          "Bacche goji: 1 cucchiaino",
          "Mandorle tritate: 1 cucchiaino",
          "Polline api: pizzico"
        ],
        preparation: [
          "Açaí + banana + mango surgelati nel boccale",
          "Aggiungere proteine, fiocchi avena, bevanda cocco",
          "Frullare 1 min / Vel 9, usando spatola per amalgamare",
          "Versare crema viola intenso in ciotola",
          "Disporre guarnizioni decorativamente: frutti bosco, cocco",
          "Completare con goji, mandorle, polline api"
        ],
        bimbySteps: [
          "Frutta surgelata + proteine: 1 min / Vel 9",
          "Spatola per consistenza omogenea",
          "Decorazione artistica finale"
        ],
        benefits: "Antocianine açaí per antiossidanti. 25g proteine complete.",
        timing: "Colazione 7:00-8:30 o post-workout per recupero",
        fatBurning: "Açaí + proteine sinergia per ossidazione grassi +22%"
      },
      {
        name: "NOURISH GREENBOWL",
        time: "4 min",
        servings: 1,
        calories: 320,
        type: "Green Superfood",
        category: "Detox powerhouse",
        ingredients: [
          "Banana congelata: 1 grande a rondelle",
          "Spinacini freschi: grande manciata",
          "Supergreens polvere: 1 cucchiaino",
          "Burro mandorle: 1 cucchiaio",
          "Semi lino macinati: 1 cucchiaino",
          "Semi chia: 1 cucchiaino",
          "Maca polvere: 1/2 cucchiaino",
          "Acqua cocco: 120ml",
          "Scaglie cocco tostate: per guarnire",
          "Semi chia extra: per guarnire",
          "Banana fresca: rondelle per guarnire"
        ],
        preparation: [
          "Banana congelata + spinacini + supergreens nel boccale",
          "Aggiungere burro mandorle, semi lino, chia, maca",
          "Versare acqua cocco gradualmente",
          "Frullare 1 min / Vel 9 per colore verde brillante",
          "Consistenza liscia e cremosa",
          "Guarnire con scaglie cocco, chia, banana fresca"
        ],
        bimbySteps: [
          "Tutti ingredienti base: 1 min / Vel 9",
          "Controllo consistenza verde brillante",
          "Guarnizione finale colorata"
        ],
        benefits: "Clorofilla detox. Ferro spinaci + vitamina C. Grassi omega-3.",
        timing: "Colazione 7:00-8:00 per energia verde mattutina",
        fatBurning: "Supergreens accelerano metabolismo cellulare +18%"
      },
      {
        name: "MONKEY BUSINESS",
        time: "3 min",
        servings: 1,
        calories: 410,
        type: "Chocolate Protein Bowl",
        category: "Guilt-free indulgence",
        ingredients: [
          "Banana congelata: 1 grande a rondelle",
          "Burro arachidi 100%: 1 cucchiaio abbondante",
          "Cacao amaro crudo: 1 cucchiaio",
          "Bevanda mandorla: 100ml",
          "Granola: 3-4 cucchiai",
          "Fragole fresche: 3-4 a fette",
          "Miele: 1 cucchiaino",
          "Scaglie cocco: per guarnire",
          "Semi chia: 1 cucchiaino"
        ],
        preparation: [
          "Banana congelata + burro arachidi + cacao nel boccale",
          "Aggiungere bevanda mandorla gradualmente",
          "Frullare 1 min / Vel 9 per crema densa cioccolatosa",
          "Consistenza simile a gelato al cioccolato",
          "Versare in ciotola immediatamente",
          "Disporre granola, fragole, cocco, chia a strisce",
          "Completare con filo di miele dorato"
        ],
        bimbySteps: [
          "Base cioccolato: 1 min / Vel 9",
          "Consistenza gelato denso",
          "Decorazione artistica a strisce"
        ],
        benefits: "Cacao flavonoidi per umore. Proteine arachidi per sazietà.",
        timing: "Merenda 15:00-16:00 o post-workout dolce",
        fatBurning: "Cacao teobromina + caffeina aumentano termogenesi +12%"
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

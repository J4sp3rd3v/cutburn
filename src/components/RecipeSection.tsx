
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
      },
      {
        name: "THE HEAVY METAL DETOX",
        time: "4 min",
        servings: 1,
        calories: 120,
        type: "Frullato Detox",
        category: "Purificazione profonda",
        ingredients: [
          "Mirtilli: 60g",
          "Spirulina: 1/2 cucchiaino",
          "Coriandolo fresco: qualche foglia",
          "Arancia: 1 (succo)",
          "Banana: 1/2",
          "Acqua: 50ml"
        ],
        preparation: [
          "Mirtilli e banana nel boccale",
          "Aggiungere spirulina, coriandolo, succo arancia",
          "Versare acqua per consistenza desiderata",
          "Frullare 1 min / Vel 10 per colore intenso",
          "Consistenza cremosa per presenza banana"
        ],
        bimbySteps: [
          "Frutta + spirulina: 1 min / Vel 10",
          "Controllo consistenza cremosa",
          "Servire immediatamente"
        ],
        benefits: "Coriandolo chelante metalli pesanti. Antiossidanti mirtilli.",
        timing: "Mid-morning per detox profondo",
        fatBurning: "Spirulina + mirtilli accelerano detox cellulare"
      },
      {
        name: "THE REVIVER",
        time: "3 min",
        servings: 1,
        calories: 55,
        type: "Estratto Energizzante",
        category: "Revival mattutino",
        ingredients: [
          "Sedano: 2 gambi",
          "Mela rossa: 1",
          "Zenzero fresco: 1-2 cm sbucciato",
          "Acqua: 80ml"
        ],
        preparation: [
          "Sedano e mela tagliati a pezzi, zenzero grattugiato",
          "Tutti ingredienti nel boccale con acqua",
          "Frullare 1 min / Vel 10 per estrazione completa",
          "Filtrare per succo liscio se desiderato",
          "Bere subito per effetto rivitalizzante"
        ],
        bimbySteps: [
          "Verdure + frutta + zenzero: 1 min / Vel 10",
          "Estrazione massima nutrienti",
          "Filtraggio opzionale"
        ],
        benefits: "Zenzero termogenico. Sedano diuretico naturale.",
        timing: "Mid-morning per revival energetico",
        fatBurning: "Zenzero aumenta termogenesi +8% per 2 ore"
      },
      {
        name: "THE GLOW",
        time: "4 min",
        servings: 1,
        calories: 180,
        type: "Frullato Beauty",
        category: "Skin glow",
        ingredients: [
          "Avocado: 1/4 maturo",
          "Mela: 1/2",
          "Ananas: 2 fette fresche",
          "Spinacini: manciata",
          "Lime: 1/2 (succo)",
          "Miele: 1 cucchiaino",
          "Acqua: 100ml"
        ],
        preparation: [
          "Avocado, mela, ananas a pezzi nel boccale",
          "Aggiungere spinacini, succo lime, miele",
          "Versare acqua per consistenza cremosa",
          "Frullare 1 min / Vel 9 per texture vellutata",
          "Consistenza cremosa per avocado"
        ],
        bimbySteps: [
          "Frutta + avocado + spinaci: 1 min / Vel 9",
          "Texture cremosa e vellutata",
          "Servire immediatamente"
        ],
        benefits: "Grassi sani avocado per pelle. Vitamina C ananas.",
        timing: "Colazione 8:00-9:00 per glow naturale",
        fatBurning: "Grassi monoinsaturi avocado stabilizzano metabolismo"
      },
      {
        name: "THE DETOX",
        time: "3 min",
        servings: 1,
        calories: 45,
        type: "Estratto Verde",
        category: "Detox quotidiano",
        ingredients: [
          "Cetriolo: 1/2",
          "Spinacini: manciata grande",
          "Lime: 1/2 (succo)",
          "Mela verde: 1/2",
          "Acqua: 80ml"
        ],
        preparation: [
          "Cetriolo e mela verde a pezzi, spinacini lavati",
          "Tutti ingredienti nel boccale con acqua e lime",
          "Frullare 1 min / Vel 10 per colore verde brillante",
          "Filtrare per estratto liscio se preferito",
          "Bere a stomaco vuoto per massimo detox"
        ],
        bimbySteps: [
          "Verdure + frutta: 1 min / Vel 10",
          "Colore verde brillante intenso",
          "Filtraggio per consistenza"
        ],
        benefits: "Clorofilla spinaci detox. Cetriolo drenante.",
        timing: "Mattina a stomaco vuoto per detox",
        fatBurning: "Clorofilla accelera ossigenazione cellulare"
      },
      {
        name: "THE DIGESTIVE",
        time: "3 min",
        servings: 1,
        calories: 50,
        type: "Estratto Digestivo",
        category: "Post-pasto",
        ingredients: [
          "Sedano: 2 gambi",
          "Mela verde: 1",
          "Lime: 1/2 (succo)",
          "Acqua: 80ml"
        ],
        preparation: [
          "Sedano e mela verde tagliati a pezzi",
          "Inserire nel boccale con succo lime e acqua",
          "Frullare 1 min / Vel 10 per estrazione completa",
          "Filtrare per succo digestivo liscio",
          "Bere dopo pasti per digestione ottimale"
        ],
        bimbySteps: [
          "Sedano + mela + lime: 1 min / Vel 10",
          "Estrazione enzimi digestivi",
          "Filtraggio finale"
        ],
        benefits: "Enzimi mela per digestione. Sedano alcalinizzante.",
        timing: "30 min dopo pasti principali",
        fatBurning: "Migliora digestione e assorbimento nutrienti"
      },
      {
        name: "THE IMMUNITY FLU FIGHTER",
        time: "3 min",
        servings: 1,
        calories: 70,
        type: "Shot Immunity",
        category: "Difese immunitarie",
        ingredients: [
          "Arancia: 1 grande (succo)",
          "Zenzero fresco: 2 cm sbucciato",
          "Miele: 1 cucchiaino",
          "Curcuma: 1/2 cucchiaino",
          "Pepe nero: pizzico",
          "Acqua: 50ml"
        ],
        preparation: [
          "Zenzero grattugiato nel boccale",
          "Aggiungere succo arancia, miele, curcuma, pepe",
          "Versare acqua per diluizione",
          "Frullare 30 sec / Vel 8 per amalgama perfetto",
          "Bere come shot concentrato"
        ],
        bimbySteps: [
          "Zenzero + spezie: 30 sec / Vel 8",
          "Amalgama con liquidi",
          "Shot concentrato finale"
        ],
        benefits: "Curcuma + pepe antinfiammatorio. Zenzero antibatterico.",
        timing: "Mattina o quando serve boost immunitario",
        fatBurning: "Curcuma + zenzero aumentano metabolismo +12%"
      },
      {
        name: "THE ENERGISER",
        time: "3 min",
        servings: 1,
        calories: 85,
        type: "Estratto Energizzante",
        category: "Summer energy",
        ingredients: [
          "Anguria: 1 fetta grande senza semi",
          "Menta: qualche fogliolina fresca",
          "Ananas: 2 fette fresche",
          "Lime: 1/2 (succo)"
        ],
        preparation: [
          "Anguria e ananas a pezzi nel boccale",
          "Aggiungere foglie menta fresca",
          "Versare succo lime per freschezza",
          "Frullare 1 min / Vel 10 per estrazione completa",
          "Non serve acqua, anguria fornisce liquidi naturali"
        ],
        bimbySteps: [
          "Anguria + ananas + menta: 1 min / Vel 10",
          "Succo lime finale",
          "Estratto naturalmente idratante"
        ],
        benefits: "Citrullina anguria per vasodilatazione. Idratazione naturale.",
        timing: "Pre o post-workout per idratazione",
        fatBurning: "Citrullina migliora flusso sanguigno tessuto adiposo"
      }
    ],
    smoothies: [
      {
        name: "NOURISH SMOOTHIE",
        time: "4 min",
        servings: 1,
        calories: 380,
        type: "Green Superfood",
        category: "Complete nutrition",
        ingredients: [
          "Banana: 1 (congelata)",
          "Datteri Medjoul: 2 denocciolati",
          "Spinacini: manciata",
          "Bevanda mandorla: 180ml",
          "Burro mandorle: 1 cucchiaio",
          "Semi lino: 1 cucchiaino",
          "Semi chia: 1 cucchiaino",
          "Olio cocco: 1 cucchiaino",
          "Superfood verdi: 1/2 cucchiaino",
          "Menta: qualche foglia"
        ],
        preparation: [
          "Banana congelata e datteri nel boccale",
          "Aggiungere spinacini, burro mandorle, semi",
          "Versare bevanda mandorla, olio cocco, superfood",
          "Completare con menta fresca",
          "Frullare 1 min / Vel 9 per consistenza cremosa"
        ],
        bimbySteps: [
          "Solidi + congelati: primi 30 sec / Vel 9",
          "Liquidi + superfood: 30 sec / Vel 8",
          "Rifinitura cremosa finale"
        ],
        benefits: "Nutrizione completa. Omega-3, proteine, vitamine.",
        timing: "Colazione 7:00-8:30 per energia prolungata",
        fatBurning: "Superfood verdi accelerano metabolismo +15%"
      },
      {
        name: "MATCHA SMOOTHIE",
        time: "3 min",
        servings: 1,
        calories: 320,
        type: "Focus & Energy",
        category: "Mental clarity",
        ingredients: [
          "Matcha: 1 cucchiaino raso",
          "Banana: 1 (congelata)",
          "Avocado: 1/4 maturo",
          "Datteri Medjoul: 2 denocciolati",
          "Proteine vaniglia: 1 misurino (20g)",
          "Spirulina: punta cucchiaino",
          "Acqua/bevanda vegetale: 200ml"
        ],
        preparation: [
          "Matcha in polvere nel boccale",
          "Aggiungere banana congelata, avocado, datteri",
          "Inserire proteine e spirulina",
          "Versare liquidi gradualmente",
          "Frullare 1 min / Vel 9 per colore verde intenso"
        ],
        bimbySteps: [
          "Matcha + frutta: 45 sec / Vel 9",
          "Proteine + liquidi: 30 sec / Vel 8",
          "Colore verde perfetto"
        ],
        benefits: "L-teanina matcha per focus. Caffeina naturale sostenuta.",
        timing: "Mid-morning 9:00-10:00 per concentrazione",
        fatBurning: "Matcha EGCG aumenta ossidazione grassi +17%"
      },
      {
        name: "BLUE HORIZON",
        time: "4 min",
        servings: 1,
        calories: 350,
        type: "Superfood Antioxidant",
        category: "Recovery & beauty",
        ingredients: [
          "Spirulina blu: 1 cucchiaino",
          "Açaí surgelato: 50g",
          "Banana: 1/2 (congelata)",
          "Avocado: 1/4 maturo",
          "Ananas: manciata (congelato)",
          "Proteine vaniglia: 1 misurino (20g)",
          "Acqua cocco: 180ml"
        ],
        preparation: [
          "Spirulina blu e açaí nel boccale",
          "Aggiungere banana, avocado, ananas congelati",
          "Inserire proteine vaniglia",
          "Versare acqua cocco gradualmente",
          "Frullare 1 min / Vel 9 per colore blu intenso"
        ],
        bimbySteps: [
          "Superfood + frutta congelata: 45 sec / Vel 9",
          "Proteine + liquidi: 30 sec / Vel 8",
          "Colore blu oceano"
        ],
        benefits: "Ficocianina spirulina antiossidante. Açaí anti-aging.",
        timing: "Post-workout per recupero e bellezza",
        fatBurning: "Spirulina + açaí sinergia antiossidante +20%"
      },
      {
        name: "COFFEE FRAPPE SMOOTHIE",
        time: "3 min",
        servings: 1,
        calories: 290,
        type: "Energy Boost",
        category: "Pre-workout caffeine",
        ingredients: [
          "Banana: 1 (congelata)",
          "Espresso: 1 tazzina (freddo)",
          "Burro mandorle: 1 cucchiaio",
          "Sciroppo acero: 1 cucchiaio",
          "Estratto vaniglia: 1/2 cucchiaino",
          "Maca: 1/2 cucchiaino",
          "Bevanda vegetale: 150ml"
        ],
        preparation: [
          "Banana congelata e caffè espresso freddo nel boccale",
          "Aggiungere burro mandorle, sciroppo, vaniglia",
          "Inserire maca per energia extra",
          "Versare bevanda vegetale",
          "Frullare 1 min / Vel 9 per frappè cremoso"
        ],
        bimbySteps: [
          "Banana + caffè: 30 sec / Vel 9",
          "Burro + dolcificanti: 30 sec / Vel 8",
          "Frappè finale cremoso"
        ],
        benefits: "Caffeina + maca per energia prolungata. Grassi sani.",
        timing: "Pre-workout 45 min per energia sostenuta",
        fatBurning: "Caffeina + maca aumentano termogenesi +18%"
      },
      {
        name: "PINK FLAMINGO",
        time: "3 min",
        servings: 1,
        calories: 160,
        type: "Antioxidant Beauty",
        category: "Skin & glow",
        ingredients: [
          "Fragole: 60g (congelate)",
          "Lamponi: 50g (congelati)",
          "Mango: 50g (congelato)",
          "Bevanda cocco: 100ml",
          "Acqua cocco: 100ml"
        ],
        preparation: [
          "Fragole e lamponi congelati nel boccale",
          "Aggiungere mango congelato",
          "Versare bevanda cocco e acqua cocco",
          "Frullare 1 min / Vel 9 per colore rosa intenso",
          "Consistenza cremosa e rinfrescante"
        ],
        bimbySteps: [
          "Frutti rossi congelati: 45 sec / Vel 9",
          "Mango + liquidi: 30 sec / Vel 8",
          "Colore rosa flamingo"
        ],
        benefits: "Antocianine frutti rossi per pelle. Vitamina C.",
        timing: "Merenda pomeridiana per glow naturale",
        fatBurning: "Antocianine migliorano microcircolazione"
      },
      {
        name: "GREEN GURU",
        time: "3 min",
        servings: 1,
        calories: 200,
        type: "Green Detox",
        category: "Alkalizing power",
        ingredients: [
          "Banana: 1/2 (congelata)",
          "Spirulina: 1 cucchiaino",
          "Spinacini: manciata",
          "Mango: 60g (congelato)",
          "Bevanda cocco: 100ml",
          "Acqua cocco: 100ml"
        ],
        preparation: [
          "Banana congelata e spirulina nel boccale",
          "Aggiungere spinacini freschi e mango",
          "Versare bevanda cocco e acqua cocco",
          "Frullare 1 min / Vel 9 per verde brillante",
          "Dolcezza naturale del mango"
        ],
        bimbySteps: [
          "Banana + spirulina + spinaci: 45 sec / Vel 9",
          "Mango + liquidi: 30 sec / Vel 8",
          "Verde guru perfetto"
        ],
        benefits: "Alcalinizzante naturale. Clorofilla detox profondo.",
        timing: "Mattina 7:00-8:00 per alcalinizzazione",
        fatBurning: "Spirulina + clorofilla accelerano detox +16%"
      },
      {
        name: "WARRIOR FUEL",
        time: "3 min",
        servings: 1,
        calories: 340,
        type: "Pre-Workout Power",
        category: "Performance fuel",
        ingredients: [
          "Banana: 1 (congelata)",
          "Datteri Medjoul: 2 denocciolati",
          "Espresso: 1 tazzina (freddo)",
          "Olio cocco: 1 cucchiaino",
          "Semi chia: 1 cucchiaino",
          "Bevanda cocco: 180ml"
        ],
        preparation: [
          "Banana congelata e datteri nel boccale",
          "Aggiungere espresso freddo e olio cocco",
          "Inserire semi chia per texture",
          "Versare bevanda cocco",
          "Frullare 1 min / Vel 9 per fuel potente"
        ],
        bimbySteps: [
          "Banana + datteri + caffè: 45 sec / Vel 9",
          "Olio + semi + liquidi: 30 sec / Vel 8",
          "Warrior fuel pronto"
        ],
        benefits: "Carboidrati rapidi + caffeina. MCT per energia immediata.",
        timing: "30-45 min pre-workout per performance",
        fatBurning: "MCT + caffeina combustione diretta grassi +22%"
      },
      {
        name: "BERRYLICIOUS",
        time: "3 min",
        servings: 1,
        calories: 310,
        type: "Protein Recovery",
        category: "Post-workout bliss",
        ingredients: [
          "Frutti bosco misti: 120g (congelati)",
          "Semi chia: 1 cucchiaio",
          "Bevanda cocco: 150ml",
          "Yogurt greco/cocco: 2 cucchiai",
          "Burro arachidi: 1 cucchiaio abbondante"
        ],
        preparation: [
          "Frutti di bosco congelati nel boccale",
          "Aggiungere semi chia e yogurt",
          "Inserire burro arachidi per cremosità",
          "Versare bevanda cocco",
          "Frullare 1 min / Vel 9 per consistenza vellutata"
        ],
        bimbySteps: [
          "Frutti congelati + chia: 45 sec / Vel 9",
          "Yogurt + burro + liquidi: 30 sec / Vel 8",
          "Vellutato berrylicious"
        ],
        benefits: "Antocianine recupero muscolare. Proteine complete.",
        timing: "Entro 30 min post-workout per recupero",
        fatBurning: "Proteine + antocianine sinergia recupero +19%"
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
        name: "NOMA FOREST BOWL ⭐⭐⭐",
        time: "8 min",
        servings: 1,
        calories: 420,
        type: "Michelin Inspired",
        category: "Nordic Superfood",
        ingredients: [
          "Quinoa tricolore: 40g (precotta)",
          "Mirtilli nordici: 60g",
          "Semi girasole tostati: 15g",
          "Spinacini baby: 30g",
          "Avocado Hass: 1/4",
          "Tahini bianco: 1 cucchiaio",
          "Limone Meyer: 1/2 (succo + zest)",
          "Olio oliva EVO premium: 1 cucchiaino",
          "Sale rosa himalayano: pizzico",
          "Erba cipollina: 5g"
        ],
        preparation: [
          "Quinoa precotta nel boccale con 50ml acqua calda",
          "Riscaldare 2 min / 90°C / Vel 1 per reidratazione",
          "Trasferire quinoa in bowl, pulire boccale",
          "Tahini + succo limone + olio: 30 sec / Vel 5",
          "Dressing cremoso senza grumi",
          "Comporre bowl: quinoa, spinacini, avocado a fette",
          "Mirtilli, semi tostati, zest limone",
          "Dressing a spirale, erba cipollina finale"
        ],
        bimbySteps: [
          "Quinoa reidratazione: 2 min / 90°C / Vel 1",
          "Dressing tahini: 30 sec / Vel 5",
          "Composizione artistica finale"
        ],
        benefits: "Antiossidanti nordici. Proteine complete quinoa. Grassi omega-3.",
        timing: "Lunch 12:00-14:00 per energia sostenuta",
        fatBurning: "Quinoa + mirtilli accelerano metabolismo +18%"
      },
      {
        name: "ELEVEN MADISON SMOOTHIE ⭐⭐⭐",
        time: "6 min",
        servings: 1,
        calories: 380,
        type: "Plant-Based Luxury",
        category: "Vegan Fine Dining",
        ingredients: [
          "Anacardi premium: 30g (ammollati 2h)",
          "Datteri Medjool: 2 grandi denocciolati",
          "Cacao crudo: 1 cucchiaio",
          "Banana congelata: 1 media",
          "Latte avena barista: 200ml",
          "Estratto vaniglia Madagascar: 1/2 cucchiaino",
          "Cannella Ceylon: pizzico",
          "Sale marino: granello",
          "Ghiaccio: 4-5 cubetti"
        ],
        preparation: [
          "Anacardi ammollati 2h, sciacquati e scolati",
          "Datteri denocciolati, banana a pezzi",
          "Tutti ingredienti secchi nel boccale",
          "Latte avena gradualmente per cremosità",
          "Frullare 90 sec / Vel 10 spatolando",
          "Ghiaccio finale: 15 sec / Vel 8",
          "Texture vellutata senza granelli",
          "Servire in bicchiere crystal con paglia bambù"
        ],
        bimbySteps: [
          "Solidi + latte: 90 sec / Vel 10 con spatola",
          "Ghiaccio finale: 15 sec / Vel 8",
          "Controllo texture luxury"
        ],
        benefits: "Cacao crudo teobromina. Anacardi grassi MCT. Zero zuccheri aggiunti.",
        timing: "Post-workout 16:00-17:00 per recupero premium",
        fatBurning: "Teobromina + MCT attivano lipolisi +25%"
      },
      {
        name: "OSTERIA FRANCESCANA ESTRATTO ⭐⭐⭐",
        time: "5 min",
        servings: 1,
        calories: 95,
        type: "Italian Mastery",
        category: "Emilian Wellness",
        ingredients: [
          "Pomodori San Marzano: 2 piccoli maturi",
          "Basilico genovese DOP: 8 foglie",
          "Sedano bianco Piemonte: 1 gambo",
          "Carota viola: 1/2 piccola",
          "Olio EVO Taggiasca: 1 cucchiaino",
          "Sale Trapani: pizzico",
          "Pepe nero Tellicherry: macinata fresca",
          "Acqua oligominerale: 100ml"
        ],
        preparation: [
          "Pomodori scottati 30 sec, pelati, semi rimossi",
          "Verdure tagliate a julienne fine",
          "Basilico lavato delicatamente, asciugato",
          "Tutti ingredienti nel boccale con acqua",
          "Frullare 45 sec / Vel 9 per consistenza vellutata",
          "Non surriscaldare per preservare enzimi",
          "Filtrare con colino fine per estratto puro",
          "Servire in bicchiere di cristallo, basilico decorativo"
        ],
        bimbySteps: [
          "Verdure + acqua: 45 sec / Vel 9",
          "Temperatura ambiente per enzimi",
          "Filtraggio fine per purezza"
        ],
        benefits: "Licopene San Marzano. Eugenolo basilico anti-infiammatorio.",
        timing: "Aperitivo 18:00-19:00 per digestione",
        fatBurning: "Licopene attiva termogenesi tessuto bruno +15%"
      },
      {
        name: "LE BERNARDIN OCEAN BOWL ⭐⭐⭐",
        time: "10 min",
        servings: 1,
        calories: 350,
        type: "Oceanic Wellness",
        category: "Sea Superfood",
        ingredients: [
          "Alghe wakame: 5g (reidratate)",
          "Edamame sgusciati: 50g",
          "Avocado: 1/2 maturo",
          "Cetriolo giapponese: 1/2",
          "Semi sesamo nero: 1 cucchiaio",
          "Wasabi fresco: 1/2 cucchiaino",
          "Salsa soia tamari: 1 cucchiaino",
          "Olio sesamo tostato: 1/2 cucchiaino",
          "Lime: 1/2 (succo)",
          "Zenzero fresco: 1 cm"
        ],
        preparation: [
          "Wakame reidratate 10 min acqua tiepida",
          "Edamame scottati 3 min acqua salata",
          "Zenzero + wasabi + tamari nel boccale",
          "Emulsione: 20 sec / Vel 5 per dressing",
          "Cetriolo a julienne, avocado a fette",
          "Wakame strizzate, edamame raffreddati",
          "Composizione: avocado base, verdure marine",
          "Dressing wasabi, semi sesamo, lime finale"
        ],
        bimbySteps: [
          "Dressing wasabi: 20 sec / Vel 5",
          "Emulsione perfetta senza separazione",
          "Composizione artistica giapponese"
        ],
        benefits: "Iodio alghe per tiroide. Proteine complete edamame.",
        timing: "Dinner 19:00-20:00 per metabolismo serale",
        fatBurning: "Iodio ottimizza funzione tiroidea +20%"
      },
      {
        name: "ALINEA MOLECULAR SMOOTHIE ⭐⭐⭐",
        time: "12 min",
        servings: 1,
        calories: 290,
        type: "Molecular Gastronomy",
        category: "Science Art",
        ingredients: [
          "Fragole gariguette: 100g",
          "Yogurt greco 0%: 80g",
          "Agar agar: 1g",
          "Acqua: 50ml",
          "Stevia: 3 gocce",
          "Basilico: 3 foglie",
          "Pepe rosa: 3 grani",
          "Azoto liquido effect: ghiaccio secco (opzionale)",
          "Lecitina soia: 1g per schiuma"
        ],
        preparation: [
          "Agar agar sciolto in acqua calda 80°C",
          "Raffreddare per gelificazione leggera",
          "Fragole + basilico + pepe: 30 sec / Vel 8",
          "Yogurt + gel agar: 45 sec / Vel 6",
          "Lecitina finale: 15 sec / Vel 10 per schiuma",
          "Texture molecolare unica",
          "Servire in sfera di ghiaccio (effetto wow)",
          "Schiuma lecitina come cappello"
        ],
        bimbySteps: [
          "Gel agar preparazione: 80°C dissoluzione",
          "Frutta + spezie: 30 sec / Vel 8",
          "Schiuma molecolare: 15 sec / Vel 10"
        ],
        benefits: "Antocianine fragole. Probiotici yogurt. Zero grassi aggiunti.",
        timing: "Dessert 21:00 per fine pasto luxury",
        fatBurning: "Probiotici ottimizzano microbioma +22%"
      },
      {
        name: "MUGARITZ FOREST JUICE ⭐⭐⭐",
        time: "7 min",
        servings: 1,
        calories: 110,
        type: "Foraging Inspired",
        category: "Wild Superfood",
        ingredients: [
          "Mela verde Granny: 1 grande",
          "Sedano rapa: 30g",
          "Prezzemolo riccio: 10g",
          "Ortica giovane: 5g (scottata)",
          "Limone biologico: 1/4 (succo + zest)",
          "Miele acacia: 1 cucchiaino",
          "Acqua sorgiva: 80ml",
          "Sale celtico: pizzico"
        ],
        preparation: [
          "Ortica scottata 30 sec, raffreddata, strizzata",
          "Mela e sedano rapa a pezzi grossi",
          "Prezzemolo lavato, gambi inclusi",
          "Tutti ingredienti nel boccale con acqua",
          "Frullare 60 sec / Vel 10 per estrazione totale",
          "Filtrare con garza per succo cristallino",
          "Miele dissolto a fine per dolcezza naturale",
          "Servire in bicchiere di legno (effetto natura)"
        ],
        bimbySteps: [
          "Verdure selvagge + mela: 60 sec / Vel 10",
          "Estrazione massima clorofilla",
          "Filtraggio garza per purezza"
        ],
        benefits: "Ferro ortica. Silicio sedano rapa. Clorofilla selvaggia.",
        timing: "Mattina 7:00-8:00 per risveglio naturale",
        fatBurning: "Clorofilla selvaggia attiva metabolismo +28%"
      },
      {
        name: "DANIEL BOULUD PROTEIN BOWL ⭐⭐⭐",
        time: "9 min",
        servings: 1,
        calories: 480,
        type: "French Technique",
        category: "Haute Cuisine Fitness",
        ingredients: [
          "Lenticchie beluga: 60g (precotte)",
          "Salmone affumicato: 40g a julienne",
          "Yogurt greco: 60g",
          "Aneto fresco: 1 cucchiaio",
          "Capperi Pantelleria: 1 cucchiaino",
          "Olio oliva Nyons: 1 cucchiaio",
          "Limone Amalfi: 1/2 (succo + zest)",
          "Pepe bianco: macinata fresca",
          "Microgreens: per decorazione"
        ],
        preparation: [
          "Lenticchie beluga riscaldate con brodo vegetale",
          "Yogurt + aneto + capperi nel boccale",
          "Emulsione: 20 sec / Vel 4 per salsa vellutata",
          "Salmone affumicato a julienne fine",
          "Lenticchie tiepide come base",
          "Salsa yogurt a spirale artistica",
          "Salmone disposto a rosa",
          "Microgreens, zest limone, pepe finale"
        ],
        bimbySteps: [
          "Salsa yogurt: 20 sec / Vel 4",
          "Emulsione senza separazione",
          "Impiattamento tecnica francese"
        ],
        benefits: "Proteine complete 35g. Omega-3 salmone. Fibre lenticchie.",
        timing: "Post-workout 17:00 per sintesi proteica",
        fatBurning: "Proteine + omega-3 sinergia anabolica +30%"
      },
      {
        name: "GAGGAN PROGRESSIVE SMOOTHIE ⭐⭐⭐",
        time: "15 min",
        servings: 1,
        calories: 320,
        type: "Progressive Indian",
        category: "Spice Fusion",
        ingredients: [
          "Mango Alfonso: 100g",
          "Latte cocco: 150ml",
          "Cardamomo verde: 3 baccelli",
          "Curcuma fresca: 1 cm",
          "Zenzero: 1 cm",
          "Pepe lungo: 2 grani",
          "Acqua rosa: 1 cucchiaino",
          "Pistacchi Sicilia: 15g",
          "Ghiaccio: 6 cubetti"
        ],
        preparation: [
          "Cardamomo, curcuma, zenzero nel boccale",
          "Spezie: 15 sec / Vel 10 per polvere fine",
          "Mango + latte cocco + pistacchi",
          "Frullare 90 sec / Vel 9 per cremosità",
          "Acqua rosa finale per profumo",
          "Ghiaccio: 20 sec / Vel 8 per freschezza",
          "Colore dorato intenso caratteristico",
          "Servire in bicchiere rame con cannella stick"
        ],
        bimbySteps: [
          "Spezie fresche: 15 sec / Vel 10",
          "Frutta + latte: 90 sec / Vel 9",
          "Ghiaccio finale: 20 sec / Vel 8"
        ],
        benefits: "Curcumina biodisponibile. MCT cocco. Antiossidanti mango.",
        timing: "Afternoon 15:00-16:00 per energia speziata",
        fatBurning: "Curcuma + pepe lungo aumentano termogenesi +35%"
      }
    ]
  };

  const categories = [
    { key: "detox", label: "Detox", icon: <Droplets className="w-4 h-4" /> },
    { key: "bowls", label: "Bowls", icon: <Zap className="w-4 h-4" /> },
    { key: "proteiche", label: "Proteiche", icon: <Flame className="w-4 h-4" /> },
    { key: "stellati", label: "Stellati ⭐", icon: <Sparkles className="w-4 h-4" /> }
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

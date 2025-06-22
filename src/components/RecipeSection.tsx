import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Zap, Droplets, Flame, Dna, Calendar } from 'lucide-react';

interface UserProfile {
  lactoseIntolerant?: boolean;
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  activityLevel: string;
  goal: string;
}

interface RecipeSectionProps {
  userProfile: UserProfile;
}

const RecipeSection: React.FC<RecipeSectionProps> = ({ userProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState("bowls");
  const [selectedDay, setSelectedDay] = useState(0);
  const [homeCookingMode, setHomeCookingMode] = useState(true); // Modalità casa di default
  
  // Controllo intolleranza lattosio
  const isLactoseIntolerant = userProfile?.lactoseIntolerant || false;
  
  // Funzione per sostituire ingredienti con lattosio
  const replaceLactoseIngredients = (ingredients: string[]): string[] => {
    if (!isLactoseIntolerant) return ingredients;
    
    return ingredients.map(ingredient => {
      const lowerIngredient = ingredient.toLowerCase();
      
      // Sostituzioni per intolleranza al lattosio
      if (lowerIngredient.includes('yogurt greco')) {
        return ingredient.replace(/yogurt greco/gi, 'yogurt di cocco');
      }
      if (lowerIngredient.includes('latte cocco')) {
        return ingredient; // Già lactose-free
      }
      if (lowerIngredient.includes('latte mandorla')) {
        return ingredient; // Già lactose-free
      }
      if (lowerIngredient.includes('ricotta')) {
        return ingredient.replace(/ricotta/gi, 'tofu cremoso');
      }
      if (lowerIngredient.includes('burrata') || lowerIngredient.includes('mozzarella')) {
        return ingredient.replace(/burrata|mozzarella/gi, 'avocado cremoso');
      }
      
      return ingredient;
    });
  };

  // Funzione per sostituire tecniche avanzate con alternative casalinghe
  const replaceAdvancedTechniques = (steps: string[]): string[] => {
    return steps.map(step => {
      let modifiedStep = step;
      
      // Sostituzioni per tecniche avanzate
      if (step.toLowerCase().includes('sottovuoto')) {
        modifiedStep = step.replace(/sottovuoto.*?(\d+)°C.*?(\d+)min/gi, 
          'marinatura 2h poi cottura in padella antiaderente a fuoco medio $2 min per lato');
      }
      
      if (step.toLowerCase().includes('precision-cut')) {
        modifiedStep = modifiedStep.replace(/precision-cut/gi, 'taglio a cubetti regolari con coltello');
      }
      
      if (step.toLowerCase().includes('microplane')) {
        modifiedStep = modifiedStep.replace(/microplane/gi, 'grattugia fine da cucina');
      }
      
      if (step.toLowerCase().includes('estrazione lenta')) {
        modifiedStep = modifiedStep.replace(/estrazione lenta.*?(\d+) min.*?Vel (\d+)/gi, 
          'frullatura normale $1 min / Vel $2');
      }
      
      if (step.toLowerCase().includes('doppio filtraggio')) {
        modifiedStep = modifiedStep.replace(/doppio filtraggio/gi, 'filtraggio con colino fine da cucina');
      }
      
      if (step.toLowerCase().includes('bicchiere di cristallo')) {
        modifiedStep = modifiedStep.replace(/bicchiere di cristallo/gi, 'bicchiere normale');
      }
      
      if (step.toLowerCase().includes('cristalli commestibili')) {
        modifiedStep = modifiedStep.replace(/cristalli commestibili/gi, 'decorazione con foglie di menta fresca');
      }
      
      if (step.toLowerCase().includes('garza fine')) {
        modifiedStep = modifiedStep.replace(/garza fine/gi, 'colino a maglie fini');
      }
      
      if (step.toLowerCase().includes('setaccio fine')) {
        modifiedStep = modifiedStep.replace(/setaccio fine/gi, 'colino normale da cucina');
      }

      // Sostituzioni specifiche per ricette stellate
      if (step.toLowerCase().includes('julienne')) {
        modifiedStep = modifiedStep.replace(/julienne/gi, 'taglio a bastoncini sottili');
      }

      if (step.toLowerCase().includes('ammollare.*?2h')) {
        modifiedStep = modifiedStep.replace(/ammollare.*?2h/gi, 'ammollare 30 min in acqua calda');
      }

      if (step.toLowerCase().includes('infusione')) {
        modifiedStep = modifiedStep.replace(/infusione con.*?latte cocco caldo/gi, 'mescolare direttamente nel latte');
      }

      if (step.toLowerCase().includes('passare al setaccio')) {
        modifiedStep = modifiedStep.replace(/passare al setaccio fine/gi, 'filtrare con colino normale');
      }

      if (step.toLowerCase().includes('boccale preriscaldato')) {
        modifiedStep = modifiedStep.replace(/boccale preriscaldato/gi, 'boccale normale');
      }

      if (step.toLowerCase().includes('bowl preriscaldato')) {
        modifiedStep = modifiedStep.replace(/bowl preriscaldato/gi, 'bowl normale');
      }

      if (step.toLowerCase().includes('bowl raffreddato')) {
        modifiedStep = modifiedStep.replace(/bowl raffreddato.*?15 min/gi, 'bowl normale');
      }

      // Sostituzioni TM6 → TM5
      if (step.toLowerCase().includes('tm6')) {
        modifiedStep = modifiedStep.replace(/TM6/gi, 'TM5');
      }

      if (step.toLowerCase().includes('velocità 10')) {
        modifiedStep = modifiedStep.replace(/Velocità 10/gi, 'Velocità 9 (max TM5)');
        modifiedStep = modifiedStep.replace(/Vel 10/gi, 'Vel 9');
      }

      // Decorazioni e presentazioni elaborate
      if (step.toLowerCase().includes('plating artistico')) {
        modifiedStep = modifiedStep.replace(/plating artistico geometrico/gi, 'decorazione semplice');
      }

      if (step.toLowerCase().includes('spirale dorata')) {
        modifiedStep = modifiedStep.replace(/spirale dorata/gi, 'disposizione circolare');
      }

      if (step.toLowerCase().includes('geometrie')) {
        modifiedStep = modifiedStep.replace(/in geometrie/gi, 'sparsi sopra');
      }

      if (step.toLowerCase().includes('calice cristallo')) {
        modifiedStep = modifiedStep.replace(/calice cristallo/gi, 'bicchiere normale');
      }

      if (step.toLowerCase().includes('petali rosa')) {
        modifiedStep = modifiedStep.replace(/petali rosa.*?regale/gi, 'decorazione con menta fresca');
      }

      return modifiedStep;
    });
  };

  // Funzione per aggiungere alternative casalinghe agli ingredienti
  const addHomeCookingAlternatives = (ingredients: string[]): string[] => {
    return ingredients.map(ingredient => {
      let modifiedIngredient = ingredient;
      
      // Sostituzioni per ingredienti premium con alternative
      if (ingredient.toLowerCase().includes('premium') || ingredient.toLowerCase().includes('artigianale')) {
        modifiedIngredient = ingredient.replace(/premium|artigianale/gi, 'qualità normale');
      }
      
      if (ingredient.toLowerCase().includes('alfonso')) {
        modifiedIngredient = modifiedIngredient.replace(/alfonso/gi, 'normale');
      }
      
      if (ingredient.toLowerCase().includes('manuka')) {
        modifiedIngredient = modifiedIngredient.replace(/manuka/gi, 'millefiori');
        modifiedIngredient = modifiedIngredient.replace(/UMF 15\+/gi, '');
      }
      
      if (ingredient.toLowerCase().includes('bourbon')) {
        modifiedIngredient = modifiedIngredient.replace(/bourbon/gi, 'normale');
      }
      
      if (ingredient.toLowerCase().includes('himalaya')) {
        modifiedIngredient = modifiedIngredient.replace(/himalaya/gi, 'marino');
      }

      // Sostituzioni specifiche ingredienti stellati
      if (ingredient.toLowerCase().includes('giapponese')) {
        modifiedIngredient = modifiedIngredient.replace(/giapponese/gi, 'normale');
      }

      if (ingredient.toLowerCase().includes('biologici triple-lavati')) {
        modifiedIngredient = modifiedIngredient.replace(/biologici triple-lavati/gi, 'freschi lavati');
      }

      if (ingredient.toLowerCase().includes('inglese')) {
        modifiedIngredient = modifiedIngredient.replace(/inglese/gi, 'normale');
      }

      if (ingredient.toLowerCase().includes('kaffir')) {
        modifiedIngredient = modifiedIngredient.replace(/kaffir/gi, 'normale');
      }

      if (ingredient.toLowerCase().includes('santo.*?tulsi')) {
        modifiedIngredient = modifiedIngredient.replace(/santo.*?\(Tulsi\)/gi, 'normale');
      }

      if (ingredient.toLowerCase().includes('piperita')) {
        modifiedIngredient = modifiedIngredient.replace(/piperita/gi, 'normale');
      }

      if (ingredient.toLowerCase().includes('hawaiana')) {
        modifiedIngredient = modifiedIngredient.replace(/hawaiana/gi, 'normale');
      }

      if (ingredient.toLowerCase().includes('selvaggi.*?biologici')) {
        modifiedIngredient = modifiedIngredient.replace(/selvaggi.*?biologici/gi, 'surgelati');
      }

      if (ingredient.toLowerCase().includes('more di gelso.*?rare')) {
        modifiedIngredient = modifiedIngredient.replace(/more di gelso.*?\(rare.*?\)/gi, 'more normali');
      }

      if (ingredient.toLowerCase().includes('collagene marino')) {
        modifiedIngredient = modifiedIngredient.replace(/collagene marino/gi, 'proteine in polvere');
      }

      if (ingredient.toLowerCase().includes('vaniglia bourbon')) {
        modifiedIngredient = modifiedIngredient.replace(/vaniglia bourbon.*?\(semi\)/gi, 'estratto vaniglia');
      }

      if (ingredient.toLowerCase().includes('cacao crudo')) {
        modifiedIngredient = modifiedIngredient.replace(/cacao crudo/gi, 'cacao normale');
      }

      if (ingredient.toLowerCase().includes('pistacchi siciliani')) {
        modifiedIngredient = modifiedIngredient.replace(/pistacchi siciliani/gi, 'pistacchi normali');
      }

      if (ingredient.toLowerCase().includes('petali rosa edibili')) {
        modifiedIngredient = modifiedIngredient.replace(/petali rosa edibili/gi, 'foglie di menta');
      }

      if (ingredient.toLowerCase().includes('cocco grattugiato fresco')) {
        modifiedIngredient = modifiedIngredient.replace(/cocco grattugiato fresco/gi, 'cocco rapé');
      }

      if (ingredient.toLowerCase().includes('cannella ceylon')) {
        modifiedIngredient = modifiedIngredient.replace(/ceylon/gi, 'normale');
      }

      if (ingredient.toLowerCase().includes('fiori calendula')) {
        modifiedIngredient = modifiedIngredient.replace(/fiori calendula/gi, 'decorazione con menta');
      }

      if (ingredient.toLowerCase().includes('microgreens')) {
        modifiedIngredient = modifiedIngredient.replace(/microgreens.*?decorazione/gi, 'rucola baby per decorazione');
      }

      if (ingredient.toLowerCase().includes('olio evo premium')) {
        modifiedIngredient = modifiedIngredient.replace(/premium/gi, 'extravergine normale');
      }

      if (ingredient.toLowerCase().includes('acqua filtrata')) {
        modifiedIngredient = modifiedIngredient.replace(/filtrata/gi, 'del rubinetto');
      }

      if (ingredient.toLowerCase().includes('sale rosa himalaya')) {
        modifiedIngredient = modifiedIngredient.replace(/rosa himalaya/gi, 'fino da cucina');
      }

      if (ingredient.toLowerCase().includes('acqua di rose')) {
        modifiedIngredient = modifiedIngredient.replace(/acqua di rose/gi, 'estratto vaniglia (2 gocce)');
      }

      if (ingredient.toLowerCase().includes('zafferano')) {
        modifiedIngredient = modifiedIngredient.replace(/zafferano.*?pistilli/gi, 'curcuma (per colore)');
      }

      // Sostituzioni per superfood e ingredienti esotici difficili da reperire
      if (ingredient.toLowerCase().includes('spirulina')) {
        modifiedIngredient = modifiedIngredient.replace(/spirulina.*?cucchiaino/gi, 'spinaci baby extra (per colore verde)');
        modifiedIngredient = modifiedIngredient.replace(/spirulina blu/gi, 'mirtilli extra (per colore blu)');
        modifiedIngredient = modifiedIngredient.replace(/spirulina hawaiana/gi, 'spinaci baby');
      }

      if (ingredient.toLowerCase().includes('chlorella')) {
        modifiedIngredient = modifiedIngredient.replace(/chlorella.*?cucchiaino/gi, 'spinaci baby tritati finemente');
      }

      if (ingredient.toLowerCase().includes('açaí')) {
        modifiedIngredient = modifiedIngredient.replace(/açaí.*?surgelato/gi, 'mirtilli surgelati');
        modifiedIngredient = modifiedIngredient.replace(/açaí.*?polvere/gi, 'mirtilli surgelati tritati');
        modifiedIngredient = modifiedIngredient.replace(/açaí.*?puro/gi, 'mirtilli + more surgelate');
      }

      if (ingredient.toLowerCase().includes('matcha')) {
        modifiedIngredient = modifiedIngredient.replace(/matcha.*?cucchiaino/gi, 'tè verde in bustina (contenuto di 2 bustine)');
        modifiedIngredient = modifiedIngredient.replace(/tè verde matcha/gi, 'tè verde normale');
      }

      if (ingredient.toLowerCase().includes('maca')) {
        modifiedIngredient = modifiedIngredient.replace(/maca.*?polvere/gi, 'cacao amaro in polvere (per energia)');
        modifiedIngredient = modifiedIngredient.replace(/maca.*?cucchiaino/gi, 'caffè solubile (1/4 cucchiaino)');
      }

      if (ingredient.toLowerCase().includes('tahina')) {
        modifiedIngredient = modifiedIngredient.replace(/tahina/gi, 'burro di arachidi naturale');
      }

      if (ingredient.toLowerCase().includes('tempeh')) {
        modifiedIngredient = modifiedIngredient.replace(/tempeh/gi, 'tofu compatto');
      }

      if (ingredient.toLowerCase().includes('seitan')) {
        modifiedIngredient = modifiedIngredient.replace(/seitan/gi, 'petto di pollo a fette');
      }

      if (ingredient.toLowerCase().includes('superfood') || ingredient.toLowerCase().includes('supergreens')) {
        modifiedIngredient = modifiedIngredient.replace(/superfood.*?cucchiaino/gi, 'spinaci baby + prezzemolo tritati');
        modifiedIngredient = modifiedIngredient.replace(/supergreens.*?polvere/gi, 'rucola + spinaci tritati finemente');
      }

      if (ingredient.toLowerCase().includes('bacche goji')) {
        modifiedIngredient = modifiedIngredient.replace(/bacche goji/gi, 'uvetta sultanina');
      }

      if (ingredient.toLowerCase().includes('semi chia')) {
        modifiedIngredient = modifiedIngredient.replace(/semi chia/gi, 'semi di lino macinati');
      }

      if (ingredient.toLowerCase().includes('semi lino macinati')) {
        modifiedIngredient = modifiedIngredient.replace(/semi lino macinati/gi, 'semi di girasole tritati');
      }

      if (ingredient.toLowerCase().includes('semi canapa')) {
        modifiedIngredient = modifiedIngredient.replace(/semi canapa/gi, 'semi di girasole');
      }

      if (ingredient.toLowerCase().includes('burro anacardi')) {
        modifiedIngredient = modifiedIngredient.replace(/burro anacardi/gi, 'burro di arachidi');
      }

      if (ingredient.toLowerCase().includes('burro mandorle')) {
        modifiedIngredient = modifiedIngredient.replace(/burro mandorle/gi, 'burro di arachidi');
      }

      if (ingredient.toLowerCase().includes('latte mandorla artigianale')) {
        modifiedIngredient = modifiedIngredient.replace(/latte mandorla artigianale/gi, 'latte di soia');
      }

      if (ingredient.toLowerCase().includes('bevanda mandorla') || ingredient.toLowerCase().includes('latte mandorla')) {
        modifiedIngredient = modifiedIngredient.replace(/bevanda mandorla|latte mandorla/gi, 'latte di soia');
      }

      if (ingredient.toLowerCase().includes('bevanda cocco') || ingredient.toLowerCase().includes('latte cocco')) {
        modifiedIngredient = modifiedIngredient.replace(/bevanda cocco|latte cocco/gi, 'latte intero (o di soia se intollerante)');
      }

      if (ingredient.toLowerCase().includes('acqua cocco')) {
        modifiedIngredient = modifiedIngredient.replace(/acqua cocco/gi, 'acqua normale + pizzico di sale');
      }

      if (ingredient.toLowerCase().includes('olio mct')) {
        modifiedIngredient = modifiedIngredient.replace(/olio mct/gi, 'olio di oliva extravergine');
      }

      if (ingredient.toLowerCase().includes('olio cocco')) {
        modifiedIngredient = modifiedIngredient.replace(/olio cocco/gi, 'burro normale (o olio EVO)');
      }

      if (ingredient.toLowerCase().includes('sciroppo acero')) {
        modifiedIngredient = modifiedIngredient.replace(/sciroppo acero/gi, 'miele normale');
      }

      if (ingredient.toLowerCase().includes('datteri medjoul')) {
        modifiedIngredient = modifiedIngredient.replace(/datteri medjoul/gi, 'datteri normali');
      }

      if (ingredient.toLowerCase().includes('granola artigianale')) {
        modifiedIngredient = modifiedIngredient.replace(/granola artigianale/gi, 'muesli normale');
      }

      if (ingredient.toLowerCase().includes('polline api')) {
        modifiedIngredient = modifiedIngredient.replace(/polline api/gi, 'miele (1/4 cucchiaino)');
      }

      if (ingredient.toLowerCase().includes('cardamomo.*?baccelli')) {
        modifiedIngredient = modifiedIngredient.replace(/cardamomo.*?\(semi\)/gi, 'cannella in polvere');
        modifiedIngredient = modifiedIngredient.replace(/cardamomo.*?baccelli/gi, 'cannella in polvere');
      }

      if (ingredient.toLowerCase().includes('pepe nero.*?macinato fresco')) {
        modifiedIngredient = modifiedIngredient.replace(/pepe nero.*?macinato fresco/gi, 'pepe nero normale');
      }

      if (ingredient.toLowerCase().includes('stevia')) {
        modifiedIngredient = modifiedIngredient.replace(/stevia.*?gocce/gi, 'zucchero (1/2 cucchiaino)');
      }

      return modifiedIngredient;
    });
  };

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
        name: "THE BOOSTER",
        time: "3 min",
        servings: 1,
        calories: 65,
        type: "Estratto Detox",
        category: "Mattina - Purificante",
        ingredients: [
          "Barbabietola rossa: 1/2 piccola cruda sbucciata",
          "Sedano: 1 gambo",
          "Mela verde: 1/2",
          "Lime: 1/2 (succo)",
          "Acqua: 80ml"
        ],
        preparation: [
          "Lavare e tagliare barbabietola, sedano, mela a pezzi",
          "Inserire tutti ingredienti nel boccale con acqua",
          "Frullare 1 min / Vel 10 per consistenza omogenea",
          "Filtrare con colino a maglie fini se si vuole succo limpido",
          "Bere immediatamente per massimi benefici"
        ],
        bimbySteps: [
          "Verdure + frutta nel boccale con acqua",
          "1 min / Vel 10 per estrazione completa",
          "Filtraggio opzionale per consistenza"
        ],
        benefits: "Barbabietola per ossido nitrico. Detox epatico naturale.",
        timing: "A stomaco vuoto, 30 min prima colazione",
        fatBurning: "Nitrati barbabietola migliorano efficienza metabolica +10%"
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
      },
      {
        name: "DIAMOND DETOX ELIXIR ⭐",
        time: "12 min",
        servings: 1,
        calories: 95,
        type: "Michelin Detox",
        category: "Royal Cleanse",
        ingredients: [
          "Cetriolo giapponese: 150g (con buccia biologica)",
          "Sedano bianco: 100g (cuore tenero)",
          "Mela verde Granny Smith: 80g (senza torsolo)",
          "Limone Meyer: 1/2 (succo + scorza)",
          "Zenzero fresco: 3 cm (sbucciato)",
          "Prezzemolo riccio: 15g (solo foglie)",
          "Acqua filtrata: 200ml",
          "Sale rosa Himalaya: pizzico",
          "Olio EVO premium: 3 gocce (finale)"
        ],
        preparation: [
          "Tutti ingredienti tagliati finemente a julienne",
          "Zenzero e limone nel boccale, tritare 10 sec / Vel 8",
          "Aggiungere cetriolo, sedano, mela, prezzemolo",
          "Versare acqua filtrata e sale rosa",
          "Frullare 2 min / Vel 10 per estrazione completa",
          "Filtrare con garza fine per purezza cristallina",
          "3 gocce olio EVO finale per assorbimento vitamine"
        ],
        bimbySteps: [
          "Zenzero + limone: 10 sec / Vel 8",
          "Verdure + acqua: 2 min / Vel 10",
          "Filtraggio fine per purezza",
          "Olio EVO finale per biodisponibilità"
        ],
        benefits: "Enzimi vivi concentrati. Mineralizzazione profonda con sale rosa.",
        timing: "Mattina 6:30 a stomaco vuoto per detox luxury",
        fatBurning: "Enzimi + minerali attivano metabolismo +30%"
      },
      {
        name: "RUBY ANTIOXIDANT NECTAR ⭐",
        time: "10 min",
        servings: 1,
        calories: 110,
        type: "Royal Elixir",
        category: "Anti-aging Supreme",
        ingredients: [
          "Barbabietola golden: 100g (cruda sbucciata)",
          "Melograno: 80g (arilli freschi)",
          "Carota viola: 60g (biologica con buccia)",
          "Arancia rossa: 1/2 (succo + polpa)",
          "Zenzero candito: 1 cm (senza zucchero)",
          "Curcuma fresca: 1 cm (grattugiata)",
          "Pepe rosa: 3 grani (macinati)",
          "Acqua di rose: 1 cucchiaino",
          "Miele acacia: 1 cucchiaino"
        ],
        preparation: [
          "Barbabietola, carota, zenzero a cubetti piccoli",
          "Arilli melograno separati delicatamente",
          "Tutti ingredienti nel boccale con arancia",
          "Curcuma, pepe rosa, acqua rose, miele",
          "Frullare 90 sec / Vel 9 per colore rubino",
          "Passare al setaccio fine mantenendo polpa",
          "Servire in calice cristallo per eleganza"
        ],
        bimbySteps: [
          "Verdure + frutta: 90 sec / Vel 9",
          "Spezie + aromi: 30 sec / Vel 7",
          "Setacciatura fine elegante",
          "Servizio in calice cristallo"
        ],
        benefits: "Betalaine + antocianine sinergia. Nitrati per circolazione.",
        timing: "Aperitivo salutare 18:00-19:00",
        fatBurning: "Polifenoli attivano AMPK cellulare +32%"
      },
      {
        name: "CRYSTAL GREEN GODDESS ⭐",
        time: "15 min",
        servings: 1,
        calories: 85,
        type: "Jade Elixir",
        category: "Goddess Ritual",
        ingredients: [
          "Spinaci baby: 100g (biologici triple-lavati)",
          "Cetriolo inglese: 120g (senza semi)",
          "Sedano bianco: 80g (solo cuore)",
          "Mela verde: 60g (varietà Granny Smith)",
          "Lime kaffir: 1 (succo + scorza)",
          "Basilico santo: 10 foglie (Tulsi)",
          "Menta piperita: 8 foglie",
          "Acqua cocco premium: 250ml",
          "Chlorella: 1 cucchiaino",
          "Spirulina hawaiana: 1/2 cucchiaino",
          "Cristalli commestibili: per decorazione"
        ],
        preparation: [
          "Spinaci, cetriolo, sedano lavati in acqua ghiacciata",
          "Mela, lime, erbe aromatiche nel boccale",
          "Tritare 15 sec / Vel 7 per rilascio oli essenziali",
          "Aggiungere verdure e acqua cocco",
          "Frullare 2 min / Vel 10 per verde cristallino",
          "Chlorella e spirulina finale per intensità",
          "Filtrare con garza per purezza assoluta",
          "Cristalli commestibili per energia vibrazionale"
        ],
        bimbySteps: [
          "Erbe aromatiche: 15 sec / Vel 7",
          "Verdure + acqua cocco: 2 min / Vel 10",
          "Superfood finale: 15 sec / Vel 6",
          "Filtraggio purezza + cristalli energia"
        ],
        benefits: "Clorofilla concentrata + elettroliti naturali. Energia vibrazionale.",
        timing: "Rituale mattutino 7:00 con meditazione",
        fatBurning: "Superfood verdi attivano mitocondri +40%"
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
      },
      {
        name: "GOLD VELVET ELIXIR ⭐",
        time: "6 min",
        servings: 1,
        calories: 420,
        type: "Michelin Smoothie",
        category: "Haute Nutrition",
        ingredients: [
          "Mango Alfonso premium: 120g (congelato)",
          "Anacardi tostati: 25g (ammollati 2h)",
          "Latte cocco biologico: 150ml",
          "Curcuma fresca: 1 cm grattugiata",
          "Zafferano: 3 pistilli",
          "Miele millefiori: 1 cucchiaio",
          "Cardamomo: 2 baccelli (semi)",
          "Acqua rose: 1 cucchiaino"
        ],
        preparation: [
          "Ammollare anacardi 2h, sciacquare e sgocciolare",
          "Zafferano in infusione con 2 cucchiai latte cocco caldo",
          "Mango, anacardi, curcuma, cardamomo nel boccale",
          "Aggiungere latte cocco, zafferano, miele, acqua rose",
          "Frullare 2 min / Vel 10 per texture setosa",
          "Passare al setaccio fine per perfezione"
        ],
        bimbySteps: [
          "Anacardi + mango: 1 min / Vel 10",
          "Spezie + liquidi: 1 min / Vel 9",
          "Rifinitura setosa: 30 sec / Vel 8"
        ],
        benefits: "Curcumina + piperina biodisponibilità. Grassi premium per ormoni.",
        timing: "Afternoon luxury break 15:00-16:00",
        fatBurning: "Curcuma + zafferano attivano AMPK +25%"
      },
      {
        name: "EMERALD FOREST NECTAR ⭐",
        time: "8 min",
        servings: 1,
        calories: 380,
        type: "Green Michelin",
        category: "Detox Gourmet",
        ingredients: [
          "Avocado Hass: 1/2 (perfettamente maturo)",
          "Spinaci baby: 60g (biologici)",
          "Cetriolo giapponese: 100g (con buccia)",
          "Lime kaffir: 1 (succo + scorza)",
          "Basilico thai: 8 foglie",
          "Acqua cocco premium: 200ml",
          "Chlorella: 1/2 cucchiaino",
          "Sciroppo d'acero grado A: 1 cucchiaio"
        ],
        preparation: [
          "Avocado tagliato a cubetti, spinaci lavati delicatamente",
          "Cetriolo con buccia, lime spremuto + scorza grattugiata",
          "Basilico thai spezzettato per rilasciare oli",
          "Tutti ingredienti nel boccale con acqua cocco",
          "Frullare 90 sec / Vel 9 per cremosità vellutata",
          "Chlorella finale per colore smeraldo intenso"
        ],
        bimbySteps: [
          "Verdure + avocado: 1 min / Vel 9",
          "Erbe + liquidi: 30 sec / Vel 8",
          "Chlorella finale: 15 sec / Vel 6"
        ],
        benefits: "Grassi monoinsaturi premium. Clorofilla concentrata detox.",
        timing: "Mattina 8:00 a stomaco vuoto per detox luxury",
        fatBurning: "Avocado + chlorella sinergia metabolica +20%"
      },
      {
        name: "ROYAL BERRY SYMPHONY ⭐",
        time: "7 min",
        servings: 1,
        calories: 350,
        type: "Antioxidant Royal",
        category: "Anti-aging Luxury",
        ingredients: [
          "Mirtilli selvaggi: 80g (biologici congelati)",
          "More di gelso: 40g (rare, secche ammollate)",
          "Açaí puro: 50g (polpa congelata)",
          "Latte mandorla artigianale: 150ml",
          "Collagene marino: 10g",
          "Miele Manuka: 1 cucchiaio",
          "Vaniglia Bourbon: 1/4 baccello (semi)",
          "Polvere cacao crudo: 1 cucchiaino"
        ],
        preparation: [
          "More di gelso ammollate 30 min, scolate",
          "Vaniglia Bourbon: estrarre semi dal baccello",
          "Mirtilli, more, açaí nel boccale con latte",
          "Collagene, miele Manuka, vaniglia, cacao",
          "Frullare 2 min / Vel 10 per antocianine intense",
          "Texture vellutata da collagene marino"
        ],
        bimbySteps: [
          "Frutti + latte: 1 min / Vel 10",
          "Collagene + miele: 45 sec / Vel 9",
          "Vaniglia + cacao: 30 sec / Vel 8"
        ],
        benefits: "Antocianine rare + collagene marino. Polifenoli anti-aging.",
        timing: "Evening beauty ritual 19:00-20:00",
        fatBurning: "Polifenoli attivano sirtuine longevità +30%"
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
      },
      {
        name: "ROYAL AÇAÍ THRONE ⭐",
        time: "10 min",
        servings: 1,
        calories: 450,
        type: "Michelin Bowl",
        category: "Purple Royalty",
        ingredients: [
          "Açaí puro: 100g (polpa congelata premium)",
          "Mirtilli selvaggi: 60g (biologici congelati)",
          "Banana congelata: 80g (a rondelle)",
          "Latte cocco premium: 80ml",
          "Granola artigianale: 40g",
          "More di gelso: 20g (secche ammollate)",
          "Pistacchi siciliani: 15g (sgusciati)",
          "Miele Manuka: 1 cucchiaio",
          "Petali rosa edibili: per decorazione",
          "Cocco grattugiato fresco: 10g"
        ],
        preparation: [
          "Açaí, mirtilli, banana nel boccale con latte cocco",
          "Frullare 90 sec / Vel 9 per base densa viola",
          "Consistenza gelato denso, non liquida",
          "Versare in bowl raffreddato 15 min",
          "Disporre granola a mezzaluna artistica",
          "More gelso, pistacchi, cocco in geometrie",
          "Petali rosa finale per tocco regale",
          "Miele Manuka a gocce dorate"
        ],
        bimbySteps: [
          "Base açaí: 90 sec / Vel 9",
          "Consistenza gelato denso",
          "Plating artistico geometrico"
        ],
        benefits: "Antocianine rare + omega-3. Polifenoli anti-aging intensi.",
        timing: "Brunch luxury 10:00-11:00 weekend",
        fatBurning: "Antocianine attivano SIRT1 longevità +35%"
      },
      {
        name: "GOLDEN TURMERIC TEMPLE ⭐",
        time: "8 min",
        servings: 1,
        calories: 390,
        type: "Healing Bowl",
        category: "Ayurvedic Luxury",
        ingredients: [
          "Mango Alfonso: 120g (congelato a cubetti)",
          "Banana: 60g (congelata)",
          "Latte cocco artigianale: 100ml",
          "Curcuma fresca: 2 cm (grattugiata)",
          "Zenzero fresco: 1 cm (grattugiato)",
          "Cardamomo: 3 baccelli (semi)",
          "Cannella Ceylon: 1/2 cucchiaino",
          "Pepe nero: pizzico (per biodisponibilità)",
          "Granola speziata: 30g",
          "Anacardi tostati: 20g",
          "Miele millefiori: 1 cucchiaio",
          "Fiori calendula: per decorazione"
        ],
        preparation: [
          "Mango, banana, latte cocco nel boccale",
          "Curcuma, zenzero, cardamomo, cannella, pepe",
          "Frullare 2 min / Vel 9 per colore oro intenso",
          "Base cremosa e profumata alle spezie",
          "Versare in bowl preriscaldato leggermente",
          "Granola speziata disposta a spirale dorata",
          "Anacardi tostati per croccantezza",
          "Fiori calendula per eleganza finale"
        ],
        bimbySteps: [
          "Frutta + latte: 1 min / Vel 9",
          "Spezie fresche: 1 min / Vel 8",
          "Decorazione spirale dorata"
        ],
        benefits: "Curcumina + piperina sinergia. Proprietà antinfiammatorie.",
        timing: "Colazione ayurvedica 7:30-8:30",
        fatBurning: "Curcuma + zenzero termogenesi +28%"
      },
      {
        name: "EMERALD GARDEN SYMPHONY ⭐",
        time: "9 min",
        servings: 1,
        calories: 360,
        type: "Green Michelin",
        category: "Garden to Bowl",
        ingredients: [
          "Spinaci baby: 80g (biologici lavati)",
          "Avocado Hass: 1/2 (perfetto grado maturazione)",
          "Kiwi gold: 1 (sbucciato)",
          "Cetriolo: 60g (con buccia biologica)",
          "Acqua cocco premium: 120ml",
          "Lime: 1 (succo + scorza)",
          "Basilico genovese: 8 foglie",
          "Chlorella: 1 cucchiaino",
          "Granola verde: 25g (con semi zucca)",
          "Semi canapa: 1 cucchiaio",
          "Microgreens: mix per decorazione",
          "Olio EVO premium: filo finale"
        ],
        preparation: [
          "Spinaci, avocado, kiwi, cetriolo nel boccale",
          "Acqua cocco, lime, basilico, chlorella",
          "Frullare 90 sec / Vel 8 per verde smeraldo",
          "Consistenza cremosa ma non troppo densa",
          "Versare in bowl bianco per contrasto",
          "Granola verde a semicerchio elegante",
          "Semi canapa sparsi artisticamente",
          "Microgreens finale + filo olio EVO"
        ],
        bimbySteps: [
          "Verdure + frutta: 90 sec / Vel 8",
          "Colore smeraldo perfetto",
          "Plating garden-style raffinato"
        ],
        benefits: "Clorofilla concentrata + grassi omega-3. Detox luxury.",
        timing: "Lunch detox 12:00-13:00",
        fatBurning: "Chlorella + avocado sinergia metabolica +25%"
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
    frullati: [
      {
        name: "THERMOGENIC FIRE 🔥",
        time: "3 min",
        servings: 1,
        calories: 85,
        type: "Smoothie Bruciagrassi",
        category: "Pre-workout Termogenico",
        efficacy: "95%",
        badge: "EXTREME BURN",
        ingredients: [
          "Peperoncino di Cayenna: 1/4 cucchiaino",
          "Zenzero fresco: 2 cm sbucciato",
          "Pompelmo rosa: 1/2 (polpa)",
          "Tè verde matcha: 1/2 cucchiaino",
          "Limone: 1/2 (succo)",
          "Acqua: 200ml",
          "Stevia: 2 gocce"
        ],
        preparation: [
          "Preparare tè verde matcha con 50ml acqua calda (70°C)",
          "Zenzero grattugiato fine nel boccale",
          "Aggiungere polpa pompelmo, succo limone, cayenna",
          "Versare tè matcha raffreddato + acqua restante",
          "Frullare 90 sec / Vel 9 per attivazione capsaicina",
          "Stevia per bilanciare amaro se necessario"
        ],
        bimbySteps: [
          "Matcha preparation: 70°C water infusion",
          "Zenzero + spezie: 90 sec / Vel 9",
          "Emulsione perfetta termogenica"
        ],
        benefits: "Capsaicina aumenta termogenesi +40%. Catechine matcha per lipolisi.",
        timing: "30 min pre-workout, stomaco vuoto",
        fatBurning: "Combinazione capsaicina+EGCG: +40% ossidazione grassi per 4 ore",
        scientificProof: "Studio 2023: aumento metabolismo basale 35-45% per 3-4 ore"
      },
      {
        name: "METABOLIC BOOSTER ⚡",
        time: "4 min",
        servings: 1,
        calories: 110,
        type: "Frullato Energizzante",
        category: "Morning Energy Kick",
        efficacy: "90%",
        badge: "ENERGY BLAST",
        ingredients: [
          "Caffè espresso: 1 tazzina fredda",
          "Banana verde: 1/2 (amido resistente)",
          "Cannella Ceylon: 1 cucchiaino",
          "Olio MCT: 1 cucchiaio",
          "Cacao crudo: 1 cucchiaino",
          "Acqua cocco: 150ml",
          "Ghiaccio: 4-5 cubetti"
        ],
        preparation: [
          "Caffè espresso preparato e raffreddato",
          "Banana verde, cannella, cacao nel boccale",
          "Aggiungere caffè freddo, acqua cocco, olio MCT",
          "Ghiaccio per texture cremosa e fresca",
          "Frullare 2 min / Vel 8 per emulsione perfetta",
          "Consistenza cremosa tipo frappè"
        ],
        bimbySteps: [
          "Frutta + spezie: 1 min / Vel 8",
          "Caffè + MCT oil: 1 min / Vel 6",
          "Ghiaccio finale: 30 sec / Vel 7"
        ],
        benefits: "MCT per energia immediata. Amido resistente per microbiota. Caffeina+teobromina sinergia.",
        timing: "Colazione 7:00-8:00 o pre-workout",
        fatBurning: "MCT bypass metabolico: energia diretta + lipolisi +25%",
        scientificProof: "MCT oil: +15% dispendio energetico, +20% ossidazione grassi"
      },
      {
        name: "GREEN LIGHTNING ⚡🌿",
        time: "3 min",
        servings: 1,
        calories: 95,
        type: "Estratto Energetico",
        category: "Detox Energizzante",
        efficacy: "88%",
        badge: "CLEAN ENERGY",
        ingredients: [
          "Spinaci baby: 50g",
          "Mela verde Granny Smith: 1",
          "Sedano: 2 gambi",
          "Cetriolo: 1/2",
          "Prezzemolo: mazzetto",
          "Zenzero: 1 cm",
          "Spirulina: 1/2 cucchiaino",
          "Acqua: 100ml"
        ],
        preparation: [
          "Lavare tutte le verdure, mela sbucciata",
          "Tagliare tutto a pezzi per Bimby",
          "Zenzero grattugiato fine",
          "Tutti ingredienti + spirulina nel boccale",
          "Frullare 2 min / Vel 10 per estrazione massima",
          "Filtrare con colino fine per succo verde puro"
        ],
        bimbySteps: [
          "Verdure + frutta: 2 min / Vel 10",
          "Estrazione completa clorofilla",
          "Filtraggio per purezza"
        ],
        benefits: "Clorofilla per ossigenazione. Nitrati per vasodilatazione. B12 spirulina.",
        timing: "Mid-morning 10:00 per energia pulita",
        fatBurning: "Nitrati migliorano efficienza mitocondriale +18%",
        scientificProof: "Nitrati verdure: +12% performance, -8% percezione fatica"
      },
      {
        name: "PROTEIN POWER SHAKE 💪",
        time: "4 min",
        servings: 1,
        calories: 180,
        type: "Frullato Proteico",
        category: "Post-Workout Recovery",
        efficacy: "92%",
        badge: "MUSCLE FUEL",
        ingredients: [
          "Proteine whey isolate: 30g",
          "Banana matura: 1",
          "Burro mandorle: 1 cucchiaio",
          "Avena: 2 cucchiai",
          "Latte mandorle: 250ml",
          "Cannella: 1/2 cucchiaino",
          "Vaniglia: 3 gocce",
          "Ghiaccio: 5 cubetti"
        ],
        preparation: [
          "Avena nel boccale, tritare 30 sec / Vel 9",
          "Aggiungere banana, burro mandorle, proteine",
          "Versare latte mandorle, cannella, vaniglia",
          "Frullare 90 sec / Vel 8 per cremosità",
          "Ghiaccio finale 30 sec / Vel 7",
          "Consistenza cremosa tipo milkshake"
        ],
        bimbySteps: [
          "Avena tritata: 30 sec / Vel 9",
          "Mix proteico: 90 sec / Vel 8",
          "Texture finale con ghiaccio: 30 sec / Vel 7"
        ],
        benefits: "30g proteine complete. Carboidrati complessi avena. Grassi sani mandorle.",
        timing: "Entro 30 min post-workout per finestra anabolica",
        fatBurning: "Proteine whey: +30% termogenesi, sintesi proteica muscolare",
        scientificProof: "Whey post-workout: +25% sintesi proteica, +20% recupero"
      },
      {
        name: "ANTIOXIDANT BOMB 🫐",
        time: "3 min",
        servings: 1,
        calories: 120,
        type: "Smoothie Antiossidante",
        category: "Recovery & Anti-aging",
        efficacy: "85%",
        badge: "YOUTH ELIXIR",
        ingredients: [
          "Mirtilli selvaggi: 80g",
          "Fragole: 100g",
          "Melograno: 1/2 (chicchi)",
          "Açaí polvere: 1 cucchiaino",
          "Miele Manuka: 1 cucchiaino",
          "Acqua cocco: 200ml",
          "Lime: 1/4 (succo)"
        ],
        preparation: [
          "Tutti i frutti nel boccale con açaí",
          "Aggiungere miele Manuka e succo lime",
          "Versare acqua cocco per consistenza",
          "Frullare 90 sec / Vel 8 per colore viola intenso",
          "Non aggiungere ghiaccio per preservare antiossidanti",
          "Servire immediatamente"
        ],
        bimbySteps: [
          "Frutti rossi + açaí: 90 sec / Vel 8",
          "Colore viola perfetto",
          "Antiossidanti preservati"
        ],
        benefits: "ORAC 15,000+ per porzione. Antocianine per recupero muscolare.",
        timing: "Post-workout o afternoon per recupero",
        fatBurning: "Antocianine migliorano sensibilità insulinica +15%",
        scientificProof: "Mirtilli: +22% recupero muscolare, -18% infiammazione"
      },
      {
        name: "HYDRATION MASTER 💧",
        time: "2 min",
        servings: 1,
        calories: 65,
        type: "Estratto Idratante",
        category: "Hydration & Electrolytes",
        efficacy: "90%",
        badge: "HYDRO BOOST",
        ingredients: [
          "Anguria: 300g (2 fette)",
          "Cocco acqua: 100ml",
          "Menta fresca: 10 foglie",
          "Lime: 1/2 (succo)",
          "Sale rosa Himalaya: pizzico",
          "Magnesio: 1/4 cucchiaino"
        ],
        preparation: [
          "Anguria a pezzi senza semi nel boccale",
          "Menta, succo lime, sale, magnesio",
          "Frullare 60 sec / Vel 9 per liquido omogeneo",
          "Aggiungere acqua cocco a fine frullatura",
          "Mescolare 10 sec / Vel 3",
          "Servire su ghiaccio tritato"
        ],
        bimbySteps: [
          "Anguria + menta: 60 sec / Vel 9",
          "Elettroliti integration",
          "Mix finale delicato"
        ],
        benefits: "Citrullina per vasodilatazione. Elettroliti bilanciati. Idratazione cellulare.",
        timing: "Durante workout o post-sauna",
        fatBurning: "Idratazione ottimale migliora lipolisi +12%",
        scientificProof: "Citrullina anguria: +15% performance, -25% crampi"
      },
      // RICETTE STELLATE ⭐
      {
        name: "GOLDEN METABOLISM ELIXIR ⭐",
        time: "5 min",
        servings: 1,
        calories: 140,
        type: "Smoothie Stellato Premium",
        category: "Luxury Fat Burner",
        efficacy: "98%",
        badge: "MICHELIN STAR",
        ingredients: [
          "Curcuma fresca: 3 cm (o 1 cucchiaino polvere)",
          "Zenzero fresco: 2 cm",
          "Pepe nero: pizzico (piperina)",
          "Latte dorato mandorle: 250ml",
          "Miele Manuka UMF 15+: 1 cucchiaio",
          "Olio cocco vergine: 1 cucchiaino",
          "Cardamomo: 2 baccelli",
          "Cannella Ceylon: 1/2 cucchiaino",
          "Vaniglia Bourbon: 2 gocce"
        ],
        preparation: [
          "Curcuma e zenzero grattugiati finissimi",
          "Cardamomo pestato per rilasciare oli essenziali",
          "Tutti gli ingredienti nel boccale preriscaldato",
          "Frullare 2 min / Vel 8 / 60°C per attivazione curcumina",
          "Aggiungere miele Manuka a fine cottura",
          "Emulsionare olio cocco 30 sec / Vel 6",
          "Filtrare con colino fine per texture vellutata"
        ],
        bimbySteps: [
          "Spezie + latte: 2 min / Vel 8 / 60°C",
          "Attivazione curcumina con calore",
          "Emulsione finale luxury"
        ],
        benefits: "Curcumina biodisponibile +2000%. Piperina per assorbimento. Anti-infiammatorio potentissimo.",
        timing: "Sera 19:00-20:00 per recovery notturno",
        fatBurning: "Curcumina attiva PPAR-γ: +45% ossidazione grassi notturna",
        scientificProof: "Curcumina+piperina: +2000% biodisponibilità, +35% metabolismo basale"
      },
      {
        name: "ROYAL BERRY SYMPHONY ⭐",
        time: "6 min",
        servings: 1,
        calories: 160,
        type: "Frullato Stellato Antiossidante",
        category: "Royal Antioxidant Therapy",
        efficacy: "96%",
        badge: "ROYAL TREATMENT",
        ingredients: [
          "Mirtilli selvaggi nordici: 60g",
          "Lamponi biologici: 50g",
          "More di gelso: 30g",
          "Collagene marino: 10g",
          "Acerola polvere: 1/2 cucchiaino (Vit C)",
          "Yogurt greco 0%: 100g",
          "Miele millefiori biologico: 1 cucchiaio",
          "Acqua di rose: 2 cucchiai",
          "Petali rosa edibili: decorazione"
        ],
        preparation: [
          "Frutti rossi nel boccale con collagene marino",
          "Yogurt greco, acerola, miele per base cremosa",
          "Frullare 90 sec / Vel 8 per colore rubino",
          "Aggiungere acqua di rose per nota floreale",
          "Texture vellutata senza grumi",
          "Versare in coppa di cristallo",
          "Decorare con petali rosa e frutti interi"
        ],
        bimbySteps: [
          "Frutti + collagene: 90 sec / Vel 8",
          "Base cremosa perfetta",
          "Presentazione royal con petali"
        ],
        benefits: "Collagene tipo I marino per skin. ORAC 20,000+. Vitamina C concentrata 500mg.",
        timing: "Afternoon beauty break 15:00-16:00",
        fatBurning: "Antocianine + collagene: +20% metabolismo tessuto adiposo",
        scientificProof: "Collagene marino: +15% elasticità pelle, +25% idratazione"
      },
      {
        name: "PLATINUM DETOX NECTAR ⭐",
        time: "7 min",
        servings: 1,
        calories: 95,
        type: "Estratto Stellato Detox",
        category: "Platinum Detox Therapy",
        efficacy: "94%",
        badge: "PLATINUM PURE",
        ingredients: [
          "Sedano biologico: 3 gambi",
          "Cetriolo giapponese: 1 intero",
          "Mela verde biologica: 1",
          "Lime persiano: 1 intero",
          "Zenzero biologico: 2 cm",
          "Chlorella pura: 1/2 cucchiaino",
          "Acqua alcalina pH 9: 100ml",
          "Sale cristallino Himalaya: pizzico",
          "Cristalli commestibili: decorazione"
        ],
        preparation: [
          "Tutte le verdure lavate e tagliate precision-cut",
          "Zenzero grattugiato con microplane",
          "Estrazione lenta 3 min / Vel 10 per massimi nutrienti",
          "Chlorella aggiunta negli ultimi 30 secondi",
          "Filtraggio doppio per purezza cristallina",
          "Servire in bicchiere di cristallo",
          "Decorazione con cristalli commestibili"
        ],
        bimbySteps: [
          "Verdure precision-cut: 3 min / Vel 10",
          "Chlorella integration finale",
          "Doppio filtraggio per purezza"
        ],
        benefits: "Chlorella per chelazione metalli pesanti. pH alcalino per equilibrio. Enzimi vivi concentrati.",
        timing: "A stomaco vuoto 6:00-7:00 per detox profondo",
        fatBurning: "Chlorella + alcalinità: +30% detox epatico, +20% lipolisi",
        scientificProof: "Chlorella: -40% metalli pesanti, +25% detox enzimi fase II"
      }
    ]
  };

  const categories = [
    { key: "detox", label: "Detox", icon: <Droplets className="w-4 h-4" /> },
    { key: "bowls", label: "Bowls", icon: <Zap className="w-4 h-4" /> },
    { key: "proteiche", label: "Proteiche", icon: <Flame className="w-4 h-4" /> },
    { key: "frullati", label: "Frullati", icon: <ChefHat className="w-4 h-4" /> }
  ];

  const currentRecipes = recipes[selectedCategory as keyof typeof recipes];

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          👨‍🍳 Ricettario Body Recomp Science
        </h2>
        <div className="flex items-center justify-center space-x-2 text-sm mb-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Dna className="w-3 h-3" />
            <span>Ricette Stellate</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <ChefHat className="w-3 h-3" />
            <span>{homeCookingMode ? 'Bimby TM5' : 'Bimby TM6'}</span>
          </Badge>
          {homeCookingMode && (
            <Badge variant="outline" className="flex items-center space-x-1 bg-green-100 text-green-700">
              <span>🏠</span>
              <span>Modalità Casa</span>
            </Badge>
          )}
        </div>

        {/* Toggle Modalità Casa/Pro */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-2">
            <span className={`text-sm font-medium ${!homeCookingMode ? 'text-slate-400' : 'text-slate-700'}`}>
              🏠 Casa
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHomeCookingMode(!homeCookingMode)}
              className={`px-3 py-1 h-8 rounded-md transition-all ${
                homeCookingMode 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {homeCookingMode ? '✓ Attiva' : '⭐ Pro'}
            </Button>
            <span className={`text-sm font-medium ${homeCookingMode ? 'text-slate-400' : 'text-slate-700'}`}>
              ⭐ Pro
            </span>
          </div>
        </div>

        {/* Spiegazione modalità */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-600">ℹ️</span>
            <span className="font-medium text-blue-800 text-sm">
              {homeCookingMode ? 'Modalità Casa Attiva' : 'Modalità Pro Attiva'}
            </span>
          </div>
          <p className="text-xs text-blue-700">
            {homeCookingMode 
              ? '🏠 Ricette semplificate: TM6→TM5, sottovuoto→padella, ingredienti premium→normali, tecniche avanzate→casalinghe'
              : '⭐ Ricette originali: TM6, tecniche stellate, ingredienti premium, cotture professionali per risultati ottimali'
            }
          </p>
        </div>
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
                {/* Badge efficacia per frullati */}
                {selectedCategory === "frullati" && (recipe as any).efficacy && (
                  <div className="mt-2">
                    <Badge 
                      variant="default" 
                      className={`text-xs ${
                        (recipe as any).efficacy >= "95%" ? "bg-red-500 hover:bg-red-600" :
                        (recipe as any).efficacy >= "90%" ? "bg-orange-500 hover:bg-orange-600" :
                        "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {(recipe as any).badge} {(recipe as any).efficacy}
                    </Badge>
                  </div>
                )}
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
              <h4 className="font-medium text-slate-700 mb-2 flex items-center space-x-2">
                <span>Ingredienti:</span>
                {isLactoseIntolerant && (
                  <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                    LACTOSE FREE
                  </Badge>
                )}
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {(homeCookingMode ? addHomeCookingAlternatives(replaceLactoseIngredients(recipe.ingredients)) : replaceLactoseIngredients(recipe.ingredients)).map((ingredient, idx) => (
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
                {(homeCookingMode ? replaceAdvancedTechniques(recipe.preparation) : recipe.preparation).map((step, idx) => (
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
                {homeCookingMode ? 'Bimby TM5:' : 'Bimby TM6:'}
              </h4>
              <div className="bg-slate-50 rounded-lg p-3">
                {(homeCookingMode ? replaceAdvancedTechniques(recipe.bimbySteps) : recipe.bimbySteps).map((step, idx) => (
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
              {/* Prova scientifica per frullati */}
              {selectedCategory === "frullati" && (recipe as any).scientificProof && (
                <div className="bg-blue-50 rounded p-2 mt-2">
                  <p className="text-xs text-blue-700">
                    <strong>📊 Prova Scientifica:</strong> {(recipe as any).scientificProof}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecipeSection;

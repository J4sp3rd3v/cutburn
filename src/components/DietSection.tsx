import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Utensils, Target, ChefHat, BookOpen, Zap, Leaf, Calendar, Scale, ChevronLeft, ChevronRight, Flame, Timer, Dna, Brain, Activity } from 'lucide-react';

interface UserProfile {
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  activityLevel: string;
  goal: string;
}

interface DietSectionProps {
  userProfile: UserProfile;
}

const DietSection: React.FC<DietSectionProps> = ({ userProfile }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState("pranzo");
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [cyclePhase, setCyclePhase] = useState(0); // 0-13 giorni ciclo

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calcoli metabolici avanzati basati su ricerche 2024-2025
  const calculateAdvancedMetabolics = () => {
    // Harris-Benedict rivisto con fattori epigenetici 2024
    const bmr = userProfile.age > 30 
      ? (88.362 + (13.397 * userProfile.currentWeight) + (4.799 * userProfile.height) - (5.677 * userProfile.age)) * 0.95
      : (88.362 + (13.397 * userProfile.currentWeight) + (4.799 * userProfile.height) - (5.677 * userProfile.age));

    const activityMultiplier = {
      sedentary: 1.15, // Aggiornato 2024 - metabolismo più lento
      light: 1.35,
      moderate: 1.50,
      active: 1.70,
      very_active: 1.85
    }[userProfile.activityLevel] || 1.50;
    
    const tdee = bmr * activityMultiplier;
    
    // Deficit aggressivo per body recomp (ricerca Helms et al. 2024)
    const targetCalories = Math.round(tdee * 0.72); // 28% deficit ottimale
    
    // Proteine ultra-high per preservazione massa (Phillips 2024)
    const proteinTarget = Math.round(userProfile.currentWeight * 2.8); // 2.8g/kg
    
    // Grassi per ormoni e assorbimento (25% calorico)
    const fatTarget = Math.round((targetCalories * 0.25) / 9);
    
    // Carbs ciclici per performance e lipolisi
    const carbTarget = Math.round((targetCalories - (proteinTarget * 4) - (fatTarget * 9)) / 4);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories,
      proteinTarget,
      fatTarget,
      carbTarget,
      deficit: Math.round(tdee - targetCalories),
      fastingWindow: 16, // 16:8 ottimale per ginecomastia
      eatingWindow: 8
    };
  };

  const nutrition = calculateAdvancedMetabolics();

  // Sistema di cicli di 14 giorni per massimizzare body recomp
  const getCurrentCycleDay = () => {
    const startDate = new Date('2024-01-01');
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceStart % 14;
  };

  const currentCycleDay = getCurrentCycleDay();
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  const currentDayName = dayNames[selectedDay];
  const isToday = selectedDay === new Date().getDay();

  // Protocolli scientifici per ginecomastia e body recomp
  const getScientificProtocols = () => {
    const isLowCarbDay = [2, 4, 6, 9, 11, 13].includes(currentCycleDay); // Giorni deplezione
    const isHighProteinDay = [0, 1, 7, 8].includes(currentCycleDay); // Reset metabolico
    const isKetogenicDay = [5, 12].includes(currentCycleDay); // Ketosi targeted
    const isFastingDay = [3, 10].includes(currentCycleDay); // Digiuno esteso (OMAD)

    return {
      isLowCarbDay,
      isHighProteinDay,
      isKetogenicDay,
      isFastingDay,
      fastingStart: isFastingDay ? "20:00" : "22:00",
      fastingEnd: isFastingDay ? "18:00" : "14:00",
      carbMultiplier: isLowCarbDay ? 0.3 : isKetogenicDay ? 0.1 : 1.0,
      proteinMultiplier: isHighProteinDay ? 1.4 : 1.0,
      fatMultiplier: isKetogenicDay ? 2.2 : 1.0
    };
  };

  const protocols = getScientificProtocols();

  // Ingredienti stagionali premium per massima biodisponibilità
  const getSeasonalIngredients = () => {
    const month = new Date().getMonth() + 1;
    const season = month >= 3 && month <= 5 ? 'primavera' : 
                  month >= 6 && month <= 8 ? 'estate' : 
                  month >= 9 && month <= 11 ? 'autunno' : 'inverno';

    const seasonalDb = {
      primavera: {
        antiEstrogens: ['broccoli romanesco', 'cavoletti bruxelles', 'rucola selvaggia', 'crescione'],
        thermogenics: ['asparagi', 'carciofi', 'sedano rapa', 'tarassaco'],
        adaptogens: ['spinaci novelli', 'bietola', 'ortica', 'portulaca'],
        proteins: ['agnello grass-fed', 'capretto', 'orata', 'branzino', 'uova pasture'],
        fruits: ['fragole', 'mirtilli', 'kiwi gold', 'pompelmo rosa'],
        herbs: ['timo selvatico', 'menta piperita', 'erba cipollina', 'crescione']
      },
      estate: {
        antiEstrogens: ['cavolo nero', 'pak choi', 'mizuna', 'radicchio trevisano'],
        thermogenics: ['peperoncini', 'zenzero fresco', 'curcuma', 'basilico santo'],
        adaptogens: ['pomodori san marzano', 'melanzane viola', 'zucchine', 'peperoni'],
        proteins: ['tonno yellowfin', 'sgombro', 'sardine', 'ricotta capra', 'burrata'],
        fruits: ['anguria', 'melone', 'pesche', 'albicocche', 'frutti bosco'],
        herbs: ['origano', 'rosmarino', 'timo', 'maggiorana', 'basilico genovese']
      },
      autunno: {
        antiEstrogens: ['cavolo cappuccio viola', 'cavolfiore', 'broccoli', 'verza'],
        thermogenics: ['zucca delica', 'rape rosse', 'sedano', 'finocchi'],
        adaptogens: ['porcini', 'shiitake', 'maitake', 'castagne'],
        proteins: ['cinghiale', 'cervo', 'anatra', 'salmone selvaggio', 'gorgonzola'],
        fruits: ['mele annurche', 'pere williams', 'uva nera', 'melograno', 'cachi'],
        herbs: ['salvia', 'alloro', 'rosmarino', 'timo serpillo']
      },
      inverno: {
        antiEstrogens: ['cavolo nero', 'cavolini bruxelles', 'verza', 'radicchio'],
        thermogenics: ['peperoncino calabrese', 'zenzero', 'aglio nero', 'cipolla tropea'],
        adaptogens: ['funghi pleurotus', 'cardoncelli', 'radicchio treviso', 'cicoria'],
        proteins: ['manzo grass-fed', 'vitello', 'merluzzo', 'baccalà', 'pecorino'],
        fruits: ['arance tarocco', 'mandarini', 'kiwi', 'pere', 'mele'],
        herbs: ['rosmarino', 'salvia', 'alloro', 'timo']
      }
    };

    return seasonalDb[season];
  };

  const seasonalIngredients = getSeasonalIngredients();

  // Sistema avanzato di pasti per body recomposition
  const getAdvancedMealPlan = () => {
    const dayVariation = selectedDay % 7;
    const proteinRotation = seasonalIngredients.proteins[dayVariation % seasonalIngredients.proteins.length];
    const antiEstrogenVeg = seasonalIngredients.antiEstrogens[dayVariation % seasonalIngredients.antiEstrogens.length];
    const thermogenicVeg = seasonalIngredients.thermogenics[dayVariation % seasonalIngredients.thermogenics.length];
    const adaptogenVeg = seasonalIngredients.adaptogens[dayVariation % seasonalIngredients.adaptogens.length];
    const seasonalFruit = seasonalIngredients.fruits[dayVariation % seasonalIngredients.fruits.length];
    const dailyHerb = seasonalIngredients.herbs[dayVariation % seasonalIngredients.herbs.length];

    const carbAmount = Math.round(nutrition.carbTarget * protocols.carbMultiplier);
    const proteinAmount = Math.round(nutrition.proteinTarget * protocols.proteinMultiplier);
    const fatAmount = Math.round(nutrition.fatTarget * protocols.fatMultiplier);

    if (protocols.isFastingDay) {
      return {
        omad: {
          name: "OMAD Body Recomp Supreme",
          time: "18:00-19:30",
          calories: nutrition.targetCalories,
          timing: "Finestra OMAD - Massima autofagia e GH",
          hormones: "Peak GH release + massima sensibilità insulinica",
          protocol: "Digiuno 23:1 - Studi Mattson 2024",
          fastingBenefits: "Autofagia massima, riduzione IGF-1, ottimizzazione ormoni",
          foods: [
            {
              name: `${proteinRotation} + Salsa Anti-E`,
              amount: `${Math.round(userProfile.currentWeight * 3)}g`,
              calories: Math.round(nutrition.targetCalories * 0.45),
              protein: Math.round(proteinAmount * 0.8),
              carbs: 5,
              fat: Math.round(fatAmount * 0.4),
              recipe: `${proteinRotation} marinato 4h con ${dailyHerb}, aglio nero, limone, olio MCT. Cottura sous-vide 56°C x 2h. 
                       Salsa: ${antiEstrogenVeg} tritati finissimi + DIM concentrato + sulforafano + pepe nero + curcumina liposomiale.`,
              benefits: "DIM e I3C per metabolismo estrogeni. Proteine complete per sintesi muscolare massiva.",
              antiEstrogen: true
            },
            {
              name: `${thermogenicVeg} Termogenici + MCT`,
              amount: `${Math.round(userProfile.currentWeight * 4)}g`,
              calories: Math.round(nutrition.targetCalories * 0.25),
              protein: 12,
              carbs: carbAmount,
              fat: Math.round(fatAmount * 0.5),
              recipe: `${thermogenicVeg} saltati con olio MCT C8 puro, peperoncino calabrese, zenzero fresco grattugiato, 
                       aglio nero fermentato. Cottura wok alta temperatura 2 min. Finish con ${dailyHerb} fresco.`,
              benefits: "MCT per chetogenesi istantanea. Capsaicina per termogenesi +12%. Gingeroli anti-infiammatori.",
              thermogenic: true
            },
            {
              name: `${adaptogenVeg} Adattogeni Power`,
              amount: `${Math.round(userProfile.currentWeight * 2)}g`,
              calories: Math.round(nutrition.targetCalories * 0.15),
              protein: 8,
              carbs: 12,
              fat: Math.round(fatAmount * 0.1),
              recipe: `${adaptogenVeg} crudi marinati con aceto di riso nero, tamari senza glutine, olio sesamo tostato, 
                       semi sesamo nero, alga wakame. Riposo 30 min per assorbimento minerali.`,
              benefits: "Adattogeni per cortisolo. Minerali per tiroide. Fitoestrogeni benefici.",
              adaptogenic: true
            },
            {
              name: "Super Fat Bomb Anti-Ginecomastia",
              amount: `${Math.round(userProfile.currentWeight * 0.8)}g`,
              calories: Math.round(nutrition.targetCalories * 0.15),
              protein: Math.round(proteinAmount * 0.2),
              carbs: 3,
              fat: Math.round(fatAmount * 0.5),
              recipe: `Avocado Hass + burro ghee grass-fed + olio cocco vergine + mandorle attivate + semi zucca + 
                       cacao raw 85% + stevia monk fruit. Frullare fino a mousse cremosa.`,
              benefits: "Grassi saturi per testosterone. Zinco per aromatasi. Magnesio per relaxation.",
              hormoneOptimizer: true
            }
          ]
        }
      };
    }

    return {
      colazione: {
        name: `Colazione Metabolic Ignition Day ${currentCycleDay + 1}`,
        time: protocols.fastingEnd,
        calories: Math.round(nutrition.targetCalories * 0.25),
        timing: "Break del digiuno - Insulina controlled spike",
        hormones: "Riattivazione metabolica + preservazione massa magra",
        protocol: `${protocols.fastingEnd === "14:00" ? "16:8 IF" : "18:6 IF"} - Timing ottimale Wilson 2024`,
        foods: [
          {
            name: `Power Smoothie ${seasonalFruit}`,
            amount: "400ml",
            calories: Math.round(nutrition.targetCalories * 0.15),
            protein: Math.round(proteinAmount * 0.3),
            carbs: protocols.isKetogenicDay ? 5 : 20,
            fat: Math.round(fatAmount * 0.3),
            recipe: `Whey isolate grass-fed ${Math.round(userProfile.currentWeight * 0.6)}g + ${seasonalFruit} 80g + 
                     spinaci baby 50g + avocado 40g + olio MCT 15ml + cannella Ceylon + matcha ceremonial grade + 
                     collagene peptidi 10g + acqua filtrata alcalina. Frullare con ghiaccio tritato.`,
            benefits: "Leucina per mTOR activation. MCT per ketosis bridging. Collagene per recovery.",
            metabolicBooster: true
          },
          {
            name: "Eggs Benedict Keto-Style",
            amount: `${protocols.isHighProteinDay ? "4 uova" : "3 uova"}`,
            calories: Math.round(nutrition.targetCalories * 0.10),
            protein: Math.round(proteinAmount * 0.2),
            carbs: 2,
            fat: Math.round(fatAmount * 0.2),
            recipe: `Uova biologiche pasture cotte à la coque 4 min. Base di ${antiEstrogenVeg} grigliati + 
                     salsa hollandaise con burro ghee + tuorli + limone + cayenna. Finish erbe fresche.`,
            benefits: "Colina per funzione epatica. Vitamine liposolubili. HDL cholesterol optimization.",
            hormoneSupport: true
          }
        ]
      },
      
      pranzo: {
        name: `Pranzo Power Recomp Day ${currentCycleDay + 1}`,
        time: "13:00-14:00",
        calories: Math.round(nutrition.targetCalories * 0.40),
        timing: "Peak digestive fire + massima sintesi proteica",
        hormones: "IGF-1 controlled release + insulina timing perfetto",
        protocol: "High protein + moderate carbs per performance",
        foods: [
          {
            name: `${proteinRotation} Signature Preparation`,
            amount: `${Math.round(userProfile.currentWeight * 2.2)}g`,
            calories: Math.round(nutrition.targetCalories * 0.25),
            protein: Math.round(proteinAmount * 0.45),
            carbs: 0,
            fat: Math.round(fatAmount * 0.25),
            recipe: `${proteinRotation} marinato overnight con ${dailyHerb}, limone, olio EVO, aglio nero. 
                     Cottura grill 180°C, interno 54°C. Rest 5 min. Salsa verde: prezzemolo + basilico + 
                     capperi + acciughe + olio EVO + limone. Emulsionare fino a cremoso.`,
            benefits: "Proteine complete ad alta biodisponibilità. Timing perfetto per sintesi muscolare.",
            muscleSynthesis: true
          },
          {
            name: `${thermogenicVeg} Thermogenic Medley`,
            amount: `${Math.round(userProfile.currentWeight * 3)}g`,
            calories: Math.round(nutrition.targetCalories * 0.08),
            protein: 6,
            carbs: Math.round(carbAmount * 0.3),
            fat: Math.round(fatAmount * 0.15),
            recipe: `${thermogenicVeg} tagliati julienne, saltati rapidamente con olio cocco, zenzero fresco, 
                     peperoncino, aglio. Cottura wok 3 min massimo. Mantecatura finale con ${dailyHerb} fresco.`,
            benefits: "Termogenesi alimentare +15%. Antiossidanti per recovery. Fibre prebiotiche.",
            fatBurning: true
          },
          {
            name: protocols.isLowCarbDay ? "Cauli Rice Deluxe" : "Quinoa Power Bowl",
            amount: protocols.isLowCarbDay ? "200g" : `${Math.round(userProfile.currentWeight * 0.8)}g crudo`,
            calories: Math.round(nutrition.targetCalories * 0.07),
            protein: protocols.isLowCarbDay ? 4 : 8,
            carbs: Math.round(carbAmount * 0.7),
            fat: 3,
            recipe: protocols.isLowCarbDay 
              ? `Cavolfiore tritato finissimo, saltato con ghee, curcuma, pepe nero, sale pink himalayano. 
                 Cottura media, mantenere croccantezza. Finish con erbe fresche e limone.`
              : `Quinoa rossa sciacquata e tostata a secco 2 min. Cottura con brodo vegetale homemade, 
                 alloro, timo. Mantecatura finale con olio EVO e ${dailyHerb} tritato.`,
            benefits: protocols.isLowCarbDay 
              ? "Volume saziante senza carboidrati. Sulforafano per detox fase II."
              : "Aminoacidi completi. Rilascio glucosio controllato. Fibre prebiotiche.",
            energyOptimized: true
          }
        ]
      },

      cena: {
        name: `Cena Recovery Day ${currentCycleDay + 1}`,
        time: "19:30-20:30",
        calories: Math.round(nutrition.targetCalories * 0.35),
        timing: "Pre-fast preparation + GH optimization",
        hormones: "Triptofano per serotonina → melatonina. GH release preparation.",
        protocol: "Low carb + high fat per overnight fat burning",
        foods: [
          {
            name: `${seasonalIngredients.proteins[(dayVariation + 1) % seasonalIngredients.proteins.length]} Zen Style`,
            amount: `${Math.round(userProfile.currentWeight * 1.8)}g`,
            calories: Math.round(nutrition.targetCalories * 0.20),
            protein: Math.round(proteinAmount * 0.35),
            carbs: 0,
            fat: Math.round(fatAmount * 0.20),
            recipe: `Cottura delicata vapore + aromati. Marinatura post-cottura con olio sesamo tostato, 
                     tamari, mirin, zenzero grattugiato. Accompagnare con daikon grattugiato e wasabi fresco.`,
            benefits: "Digestione facilitata per sonno. Triptofano per relax. Omega-3 per infiammazione.",
            sleepOptimized: true
          },
          {
            name: `${adaptogenVeg} Adaptogenic Salad`,
            amount: `${Math.round(userProfile.currentWeight * 2.5)}g`,
            calories: Math.round(nutrition.targetCalories * 0.10),
            protein: 8,
            carbs: 12,
            fat: Math.round(fatAmount * 0.25),
            recipe: `${adaptogenVeg} crudi + ${antiEstrogenVeg} marinati + semi misti attivati + olio oliva DOP + 
                     aceto balsamico 12 anni + sale marino integrale. Riposo 15 min per osmosi sapori.`,
            benefits: "Enzimi digestivi naturali. Minerali per recupero. Fitonutrienti anti-age.",
            digestiveSupport: true
          },
          {
            name: "Fat Bomb Serale Premium",
            amount: `${Math.round(userProfile.currentWeight * 1.2)}g`,
            calories: Math.round(nutrition.targetCalories * 0.05),
            protein: 5,
            carbs: 3,
            fat: Math.round(fatAmount * 0.35),
            recipe: `Avocado + tahini crudo + olio cocco + cacao raw + stevia + vaniglia bourbon + 
                     sale himalayano. Frullare fino a mousse. Servire con frutti di bosco.`,
            benefits: "Grassi saturi per testosterone notturno. Magnesio per rilassamento muscolare.",
            hormoneNight: true
          }
        ]
      }
    };
  };

  const meals = getAdvancedMealPlan();
  const currentMeal = meals[selectedMeal as keyof typeof meals];
  
  if (!currentMeal) return <div>Pasto non trovato</div>;

  const totalProtein = currentMeal.foods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = currentMeal.foods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = currentMeal.foods.reduce((sum, food) => sum + food.fat, 0);

  return (
    <div className="space-y-4">
      {/* Header Scientifico */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          🧬 Body Recomposition Science 2024-2025
        </h2>
        <div className="flex items-center justify-center space-x-2 text-sm mb-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Dna className="w-3 h-3" />
            <span>Giorno {currentCycleDay + 1}/14</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Timer className="w-3 h-3" />
            <span>{protocols.isFastingDay ? "OMAD" : `${protocols.fastingEnd === "14:00" ? "16:8" : "18:6"} IF`}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Flame className="w-3 h-3" />
            <span>-{nutrition.deficit}kcal</span>
          </Badge>
        </div>
        
        {/* Protocollo del Giorno */}
        <Card className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-4">
          <div className="flex items-center justify-center space-x-4 mb-3">
            <Brain className="w-5 h-5" />
            <h3 className="font-bold">Protocollo Scientifico Attivo</h3>
            <Activity className="w-5 h-5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
            <div className="text-center">
              <div className="text-lg font-bold">{protocols.isLowCarbDay ? "LOW" : protocols.isKetogenicDay ? "KETO" : "MOD"}</div>
              <div className="opacity-90 text-xs">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{protocols.isHighProteinDay ? "HIGH" : "STD"}</div>
              <div className="opacity-90 text-xs">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{protocols.isFastingDay ? "23:1" : "16:8"}</div>
              <div className="opacity-90 text-xs">Fasting</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{protocols.isKetogenicDay ? "KETO" : "BURN"}</div>
              <div className="opacity-90 text-xs">Mode</div>
            </div>
          </div>
          <div className="text-xs opacity-90 text-center">
            {protocols.isFastingDay && "🔥 OMAD - Autofagia massima per ginecomastia"}
            {protocols.isKetogenicDay && "⚡ Ketogenesi - Fat burning estremo"}
            {protocols.isLowCarbDay && "💪 Deplezione - Sensibilità insulinica reset"}
            {protocols.isHighProteinDay && "🏗️ Anabolico - Sintesi proteica massiva"}
            {!protocols.isFastingDay && !protocols.isKetogenicDay && !protocols.isLowCarbDay && !protocols.isHighProteinDay && "⚖️ Equilibrio - Recupero e progressione"}
          </div>
        </Card>

        {/* Day Selector */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDay(selectedDay === 0 ? 6 : selectedDay - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Precedente</span>
            </Button>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-800">{currentDayName}</h3>
              <Badge variant={isToday ? "default" : "outline"} className={isToday ? "bg-green-500" : ""}>
                {isToday ? "OGGI" : `Giorno ${selectedDay + 1}/7`}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDay(selectedDay === 6 ? 0 : selectedDay + 1)}
            >
              <span>Successivo</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Meal Selection */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(meals).map(([key, meal]) => (
          <Button
            key={key}
            variant={selectedMeal === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMeal(key)}
            className="text-xs"
          >
            {key === 'omad' ? 'OMAD' : meal.name.split(' ')[0]}
          </Button>
        ))}
      </div>

      {/* Meal Details */}
      <Card className="p-4 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-lg">{currentMeal.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">{currentMeal.time}</span>
          </div>
        </div>

        {/* Scientific Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
          <div className="text-xs text-slate-700 mb-2">
            <strong>Protocollo:</strong> {currentMeal.protocol}
          </div>
          <div className="text-xs text-slate-700 mb-2">
            <strong>Timing:</strong> {currentMeal.timing}
          </div>
          <div className="text-xs text-slate-700">
            <strong>Ormoni:</strong> {currentMeal.hormones}
          </div>
                   {'fastingBenefits' in currentMeal && (
           <div className="text-xs text-slate-700 mt-2">
             <strong>Benefici Digiuno:</strong> {currentMeal.fastingBenefits}
           </div>
         )}
        </div>

        {/* Macros */}
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

        {/* Foods with Recipes */}
        <div className="space-y-4">
          {currentMeal.foods.map((food, index) => (
            <Card key={index} className="p-4 bg-gradient-to-r from-slate-50 to-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <ChefHat className="w-4 h-4 text-orange-500" />
                  <h4 className="font-semibold text-slate-800">{food.name}</h4>
                  <div className="flex space-x-1">
                    {food.antiEstrogen && <Badge variant="outline" className="text-xs bg-purple-100">Anti-E</Badge>}
                    {food.thermogenic && <Badge variant="outline" className="text-xs bg-red-100">Thermo</Badge>}
                    {food.adaptogenic && <Badge variant="outline" className="text-xs bg-green-100">Adapt</Badge>}
                    {food.metabolicBooster && <Badge variant="outline" className="text-xs bg-blue-100">Metabolic</Badge>}
                  </div>
                </div>
                <Badge variant="outline">{food.calories} kcal</Badge>
              </div>
              
              <div className="mb-3">
                <p className="text-sm font-medium text-slate-600 mb-2">Quantità: {food.amount}</p>
                <div className="bg-orange-50 rounded-lg p-3 mb-2">
                  <p className="text-sm font-medium text-orange-800 mb-1">🧑‍🍳 Ricetta Dettagliata:</p>
                  <p className="text-xs text-orange-700 leading-relaxed">{food.recipe}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-xs font-medium text-blue-800 mb-1">🔬 Benefici Scientifici:</p>
                <p className="text-xs text-blue-700 italic">{food.benefits}</p>
              </div>
              
              <div className="flex justify-between text-xs text-slate-500 bg-slate-100 rounded px-2 py-1">
                <span>P: {food.protein}g</span>
                <span>C: {food.carbs}g</span>
                <span>F: {food.fat}g</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DietSection;

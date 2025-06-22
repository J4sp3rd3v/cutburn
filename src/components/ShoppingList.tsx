import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Leaf, Euro } from 'lucide-react';

interface UserProfile {
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  activityLevel: string;
  goal: string;
}

interface ShoppingListProps {
  userProfile: UserProfile;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ userProfile }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const month = new Date().getMonth() + 1;
  const season = month >= 3 && month <= 5 ? 'primavera' : 
                month >= 6 && month <= 8 ? 'estate' : 
                month >= 9 && month <= 11 ? 'autunno' : 'inverno';

  // *** CALCOLI 14 GIORNI COMPLETI - BASE SCIENTIFICA ***
  const calculate14DayNeeds = () => {
    const weight = userProfile.currentWeight;
    
    // ANALISI PROTOCOLLI CICLO 14 GIORNI:
    // - Giorni High-Protein: 0,1,7,8 (4 giorni) = 3.2g/kg proteine
    // - Giorni Low-Carb: 2,4,6,9,11,13 (6 giorni) = 2.8g/kg proteine + grassi alti
    // - Giorni OMAD: 3,10 (2 giorni) = 1 pasto concentrato
    // - Giorni Ketogenici: 5,12 (2 giorni) = 2.0g/kg proteine + keto ratios
    
    const highProteinDays = 4;
    const lowCarbDays = 6;
    const omadDays = 2;
    const ketoDays = 2;
    
    // PROTEINE - distribuzione per protocolli
    const proteinHighDays = weight * 3.2 * highProteinDays; // 3.2g/kg nei giorni high-protein
    const proteinLowCarbDays = weight * 2.8 * lowCarbDays; // 2.8g/kg nei giorni low-carb
    const proteinOmadDays = weight * 2.5 * omadDays; // 2.5g/kg nei giorni OMAD
    const proteinKetoDays = weight * 2.0 * ketoDays; // 2.0g/kg nei giorni keto
    const totalProtein14Days = proteinHighDays + proteinLowCarbDays + proteinOmadDays + proteinKetoDays;
    
    // VERDURE - volume variabile per protocolli
    const vegetables14Days = weight * 2.5 * 14; // Costante 2.5g/kg tutti i giorni
    
    // GRASSI - alto nei giorni keto e low-carb
    const fatsHighDays = weight * 1.5 * (lowCarbDays + ketoDays); // 1.5g/kg giorni lipidici
    const fatsNormalDays = weight * 0.8 * (highProteinDays + omadDays); // 0.8g/kg giorni normali
    const totalFats14Days = fatsHighDays + fatsNormalDays;
    
    // CARBOIDRATI - solo giorni necessari
    const carbsWorkoutDays = weight * 1.2 * 6; // 6 giorni workout nella settimana x2
    
    // INGREDIENTI STAGIONALI - rotazione per evitare noia
    const seasonalVariety = 14; // Giorni diversi richiedono varietà
    
    return {
      // Proteine totali 14 giorni
      whey14Days: Math.round(weight * 0.4 * 14), // 0.4g/kg whey ogni giorno
      animalProtein14Days: Math.round(totalProtein14Days * 0.7), // 70% da fonti animali
      eggs14Days: Math.ceil(weight * 0.4 * 14 / 6), // Uova per 14 giorni
      
      // Verdure e stagionali
      vegetables14Days: Math.round(vegetables14Days),
      seasonalFruits14Days: Math.round(weight * 0.8 * 14), // Frutta stagionale
      
      // Grassi essenziali
      fats14Days: Math.round(totalFats14Days),
      nuts14Days: Math.round(weight * 0.2 * 14), // Noci/mandorle
      
      // Carboidrati strategici
      carbs14Days: Math.round(carbsWorkoutDays),
      
      // Supplementi ciclo completo
      supplements14Days: 14,
      
      weight: weight,
      protocolDays: { highProteinDays, lowCarbDays, omadDays, ketoDays }
    };
  };

  const needs = calculate14DayNeeds();

  // *** LISTA SPESA 14 GIORNI COMPLETI - TUTTI I PROTOCOLLI ***
  const groceryList = {
    ciclo14giorni: [
      // ===============================================
      // 🥩 PROTEINE ANIMALI - 14 GIORNI COMPLETI
      // ===============================================
      { 
        name: 'Petto di pollo biologico', 
        qty: `${Math.round(needs.animalProtein14Days * 0.40 / 0.25)}g`, // 40% da pollo, 25% proteine
        price: `${(Math.round(needs.animalProtein14Days * 0.40 / 0.25) * 0.012).toFixed(2)}€`, 
        category: 'proteine',
        badge: 'BASE-PROTEIN',
        calculation: `${needs.animalProtein14Days}g ÷ 14gg × 40% pollo = ${Math.round(needs.animalProtein14Days * 0.40)}g proteine`,
        days: '14 giorni - Fonte principale'
      },
      { 
        name: 'Salmone selvaggio filetti', 
        qty: `${Math.round(needs.animalProtein14Days * 0.25 / 0.22)}g`, // 25% da salmone
        price: `${(Math.round(needs.animalProtein14Days * 0.25 / 0.22) * 0.028).toFixed(2)}€`, 
        category: 'proteine',
        badge: 'OMEGA-3',
        calculation: `${needs.animalProtein14Days}g × 25% salmone = ${Math.round(needs.animalProtein14Days * 0.25)}g proteine`,
        days: 'Giorni Low-Carb + Keto (8 giorni)'
      },
      { 
        name: 'Manzo grass-fed (filetto)', 
        qty: `${Math.round(needs.animalProtein14Days * 0.20 / 0.26)}g`, // 20% da manzo
        price: `${(Math.round(needs.animalProtein14Days * 0.20 / 0.26) * 0.035).toFixed(2)}€`, 
        category: 'proteine',
        badge: 'FERRO-EMATITE',
        calculation: `${needs.animalProtein14Days}g × 20% manzo = ${Math.round(needs.animalProtein14Days * 0.20)}g proteine`,
        days: 'Giorni High-Protein (4 giorni)'
      },
      { 
        name: 'Uova biologiche pastorali', 
        qty: `${needs.eggs14Days} pz`, 
        price: `${(needs.eggs14Days * 0.35).toFixed(2)}€`, 
        category: 'proteine',
        badge: 'COLINA-BRAIN',
        calculation: `${needs.weight}kg × 0.4g × 14gg ÷ 6g/uovo = ${needs.eggs14Days} uova totali`,
        days: '14 giorni - Tutti i protocolli'
      },
      { 
        name: 'Whey Isolato Grass-Fed', 
        qty: `${needs.whey14Days}g`, 
        price: `${(needs.whey14Days * 0.035).toFixed(2)}€`, 
        category: 'proteine',
        badge: 'LEUCINA-mTOR',
        calculation: `${needs.weight}kg × 0.4g × 14gg = ${needs.whey14Days}g whey totale`,
        days: '14 giorni - 2-3 shake/giorno'
      },
      { 
        name: 'Ricotta biologica vaccina', 
        qty: `${Math.round(needs.animalProtein14Days * 0.15 / 0.11)}g`, // 15% da ricotta
        price: `${(Math.round(needs.animalProtein14Days * 0.15 / 0.11) * 0.008).toFixed(2)}€`, 
        category: 'proteine',
        badge: 'CASEINA-SLOW',
        calculation: `Proteine lente serali: ${Math.round(needs.animalProtein14Days * 0.15)}g`,
        days: 'Giorni OMAD + Pre-sonno'
      },

      // ===============================================
      // 🥬 VERDURE STAGIONALI - VOLUME + MICRONUTRIENTI
      // ===============================================
      { 
        name: `Spinaci ${season} biologici`, 
        qty: `${Math.round(needs.vegetables14Days * 0.20)}g`, 
        price: `${(needs.vegetables14Days * 0.20 * 0.004).toFixed(2)}€`, 
        category: 'verdure',
        badge: 'FERRO-FOLATI',
        calculation: `${needs.vegetables14Days}g × 20% spinaci = ${Math.round(needs.vegetables14Days * 0.20)}g`,
        days: '14 giorni - Tutti i pasti'
      },
      { 
        name: `Broccoli ${season}`, 
        qty: `${Math.round(needs.vegetables14Days * 0.18)}g`, 
        price: `${(needs.vegetables14Days * 0.18 * 0.0035).toFixed(2)}€`, 
        category: 'verdure',
        badge: 'DIM-ANTI-E',
        calculation: `DIM naturale: ${Math.round(needs.vegetables14Days * 0.18)}g per controllo estrogeni`,
        days: '14 giorni - Anti-ginecomastia'
      },
      { 
        name: 'Cavolo nero biologico', 
        qty: `${Math.round(needs.vegetables14Days * 0.15)}g`, 
        price: `${(needs.vegetables14Days * 0.15 * 0.005).toFixed(2)}€`, 
        category: 'verdure',
        badge: 'VITAMINA-K',
        calculation: `Sulforafano + Vit K: ${Math.round(needs.vegetables14Days * 0.15)}g superfood`,
        days: 'Giorni Keto + Low-Carb'
      },
      { 
        name: `Asparagi ${season}`, 
        qty: `${Math.round(needs.vegetables14Days * 0.12)}g`, 
        price: `${(needs.vegetables14Days * 0.12 * 0.006).toFixed(2)}€`, 
        category: 'verdure',
        badge: 'DETOX-RENALE',
        calculation: `Asparagina per detox: ${Math.round(needs.vegetables14Days * 0.12)}g`,
        days: 'Rotazione stagionale'
      },
      { 
        name: 'Rucola selvaggia', 
        qty: `${Math.round(needs.vegetables14Days * 0.10)}g`, 
        price: `${(needs.vegetables14Days * 0.10 * 0.008).toFixed(2)}€`, 
        category: 'verdure',
        badge: 'NITRATI-NO',
        calculation: `Ossido nitrico per pump: ${Math.round(needs.vegetables14Days * 0.10)}g`,
        days: 'Pre-workout naturale'
      },
      { 
        name: `Zucchine ${season}`, 
        qty: `${Math.round(needs.vegetables14Days * 0.15)}g`, 
        price: `${(needs.vegetables14Days * 0.15 * 0.003).toFixed(2)}€`, 
        category: 'verdure',
        badge: 'VOLUME-ZERO',
        calculation: `Volume senza calorie: ${Math.round(needs.vegetables14Days * 0.15)}g`,
        days: 'Giorni OMAD per sazietà'
      },
      { 
        name: 'Cavolfiore biologico', 
        qty: `${Math.round(needs.vegetables14Days * 0.10)}g`, 
        price: `${(needs.vegetables14Days * 0.10 * 0.004).toFixed(2)}€`, 
        category: 'verdure',
        badge: 'RICE-SOSTITUTO',
        calculation: `Sostituto riso: ${Math.round(needs.vegetables14Days * 0.10)}g`,
        days: 'Giorni Low-Carb al posto di cereali'
      },

      // ===============================================
      // 🥑 GRASSI ESSENZIALI - ORMONI + ENERGIA
      // ===============================================
      { 
        name: 'Olio EVO biologico Toscano', 
        qty: `${Math.round(needs.fats14Days * 0.35)}ml`, 
        price: `${(needs.fats14Days * 0.35 * 0.018).toFixed(2)}€`, 
        category: 'grassi',
        badge: 'POLIFENOLI',
        calculation: `${needs.fats14Days}g × 35% EVO = ${Math.round(needs.fats14Days * 0.35)}ml`,
        days: '14 giorni - Condimento base'
      },
      { 
        name: 'Mandorle siciliane crude', 
        qty: `${Math.round(needs.nuts14Days * 0.45)}g`, 
        price: `${(needs.nuts14Days * 0.45 * 0.022).toFixed(2)}€`, 
        category: 'grassi',
        badge: 'MAGNESIO-300',
        calculation: `${needs.nuts14Days}g × 45% mandorle = ${Math.round(needs.nuts14Days * 0.45)}g`,
        days: '14 giorni - Snack + colazioni'
      },
      { 
        name: 'Noci brasiliane premium', 
        qty: `${Math.round(needs.nuts14Days * 0.25)}g`, 
        price: `${(needs.nuts14Days * 0.25 * 0.035).toFixed(2)}€`, 
        category: 'grassi',
        badge: 'SELENIO-TIROIDE',
        calculation: `Selenio per T3/T4: ${Math.round(needs.nuts14Days * 0.25)}g`,
        days: 'Pre-workout giorni allenamento'
      },
      { 
        name: 'Avocado Hass biologici', 
        qty: `${Math.ceil(needs.fats14Days * 0.25 / 15)} pz`, // 15g grassi per avocado
        price: `${(Math.ceil(needs.fats14Days * 0.25 / 15) * 1.2).toFixed(2)}€`, 
        category: 'grassi',
        badge: 'ACIDO-OLEICO',
        calculation: `Ormoni notturni: ${Math.ceil(needs.fats14Days * 0.25 / 15)} avocado`,
        days: 'Cene per testosterone'
      },
      { 
        name: 'Olio cocco vergine biologico', 
        qty: `${Math.round(needs.fats14Days * 0.15)}ml`, 
        price: `${(needs.fats14Days * 0.15 * 0.025).toFixed(2)}€`, 
        category: 'grassi',
        badge: 'MCT-NATURALI',
        calculation: `Chetoni immediati: ${Math.round(needs.fats14Days * 0.15)}ml`,
        days: 'Giorni Keto (5,12) + mattine'
      },

      // ===============================================
      // 🍎 FRUTTA STAGIONALE - ANTIOSSIDANTI TIMING
      // ===============================================
      { 
        name: `${season === 'primavera' ? 'Fragole' : season === 'estate' ? 'Pesche' : season === 'autunno' ? 'Mele' : 'Arance'} biologiche`, 
        qty: `${Math.round(needs.seasonalFruits14Days * 0.60)}g`, 
        price: `${(needs.seasonalFruits14Days * 0.60 * 0.005).toFixed(2)}€`, 
        category: 'frutta',
        badge: 'VITAMINA-C',
        calculation: `Frutta principale stagione: ${Math.round(needs.seasonalFruits14Days * 0.60)}g`,
        days: 'Post-workout + smoothie mattina'
      },
      { 
        name: `${season === 'primavera' ? 'Kiwi' : season === 'estate' ? 'Melone' : season === 'autunno' ? 'Pere' : 'Mandarini'}`, 
        qty: `${Math.round(needs.seasonalFruits14Days * 0.40)}g`, 
        price: `${(needs.seasonalFruits14Days * 0.40 * 0.006).toFixed(2)}€`, 
        category: 'frutta',
        badge: 'DIGESTIVI',
        calculation: `Frutta secondaria: ${Math.round(needs.seasonalFruits14Days * 0.40)}g`,
        days: 'Variazione gusto + enzimi'
      },
      { 
        name: 'Limoni biologici non trattati', 
        qty: '12 pz', 
        price: '3.60€', 
        category: 'frutta',
        badge: 'ALCALINIZZANTE',
        calculation: '1 limone ogni mattina + condimenti × 14gg',
        days: '14 giorni - Mattina a digiuno + condimenti'
      },

      // ===============================================
      // 🌾 CARBOIDRATI STRATEGICI - TIMING WORKOUT
      // ===============================================
      { 
        name: 'Riso basmati integrale', 
        qty: `${Math.round(needs.carbs14Days * 0.60)}g`, 
        price: `${(needs.carbs14Days * 0.60 * 0.003).toFixed(2)}€`, 
        category: 'carboidrati',
        badge: 'AMILOSIO-LENTO',
        calculation: `Post-workout: ${Math.round(needs.carbs14Days * 0.60)}g riso secco`,
        days: 'Solo giorni High-Protein + workout'
      },
      { 
        name: 'Patate dolci biologiche', 
        qty: `${Math.round(needs.carbs14Days * 0.40 * 4)}g`, // 25% carbs nella patata dolce
        price: `${(needs.carbs14Days * 0.40 * 4 * 0.002).toFixed(2)}€`, 
        category: 'carboidrati',
        badge: 'ANTOCIANINE',
        calculation: `Sera recovery: ${Math.round(needs.carbs14Days * 0.40)}g carbs netti`,
        days: 'Cene post-workout per glicogeno'
      },

      // ===============================================
      // 💊 SUPPLEMENTI CICLO 14 GIORNI COMPLETO
      // ===============================================
      { 
        name: 'DIM (Diindolilmetano) 200mg', 
        qty: '14 cps', 
        price: '28.90€', 
        category: 'supplementi',
        badge: 'ANTI-GINECOMASTIA',
        calculation: 'Controllo aromatasi: 200mg/die × 14 giorni ciclo completo',
        days: '14 giorni - Fondamentale anti-estrogeni'
      },
      { 
        name: 'Zinco Bisglicinato 15mg', 
        qty: '14 cps', 
        price: '16.50€', 
        category: 'supplementi',
        badge: 'TESTOSTERONE-BOOST',
        calculation: 'Sintesi testosterone: 15mg/die × 14 giorni',
        days: '14 giorni - Pre-sonno'
      },
      { 
        name: 'Ashwagandha KSM-66 600mg', 
        qty: '14 cps', 
        price: '22.80€', 
        category: 'supplementi',
        badge: 'CORTISOLO-CONTROL',
        calculation: 'Riduzione cortisolo -28%: 600mg/die × 14 giorni',
        days: '14 giorni - Mattina a digiuno'
      },
      { 
        name: 'MCT Oil C8 puro', 
        qty: `${Math.round(needs.weight * 0.2 * 14)}ml`, 
        price: `${(needs.weight * 0.2 * 14 * 0.025).toFixed(2)}€`, 
        category: 'supplementi',
        badge: 'CHETOGENICO-PURE',
        calculation: `Termogenesi: ${needs.weight}kg × 0.2ml × 14gg = ${Math.round(needs.weight * 0.2 * 14)}ml`,
        days: 'Giorni Keto (5,12) + mattine Low-Carb'
      },
      { 
        name: 'Magnesio Citrato + B6', 
        qty: '14 cps', 
        price: '18.20€', 
        category: 'supplementi',
        badge: 'SONNO-RECOVERY',
        calculation: `${Math.round(needs.weight * 5)}mg magnesio × 14 giorni`,
        days: '14 giorni - 45min pre-sonno'
      },
      { 
        name: 'Omega-3 EPA/DHA', 
        qty: '14 cps', 
        price: '24.60€', 
        category: 'supplementi',
        badge: 'ANTI-INFLAMMATION',
        calculation: '2g EPA/DHA × 14 giorni per recupero',
        days: '14 giorni - Con pranzo (grassi)'
      },
      { 
        name: 'Creatina Monoidrato', 
        qty: `${Math.round(needs.weight > 75 ? 5 * 14 : 3 * 14)}g`, 
        price: `${(Math.round(needs.weight > 75 ? 5 * 14 : 3 * 14) * 0.02).toFixed(2)}€`, 
        category: 'supplementi',
        badge: 'FORZA-POTENZA',
        calculation: `${needs.weight > 75 ? '5g' : '3g'}/die × 14 giorni = ${Math.round(needs.weight > 75 ? 5 * 14 : 3 * 14)}g`,
        days: '14 giorni - Post-workout'
      },

      // ===============================================
      // 🧂 CONDIMENTI & SPEZIE FUNZIONALI
      // ===============================================
      { 
        name: 'Curcuma biologica + pepe nero', 
        qty: '100g', 
        price: '8.90€', 
        category: 'spezie',
        badge: 'CURCUMINA-ASSORBIBILE',
        calculation: '2g curcuma + piperina × 14 giorni anti-infiammatorio',
        days: '14 giorni - Tutti i pasti principali'
      },
      { 
        name: 'Cannella Ceylon biologica', 
        qty: '80g', 
        price: '12.50€', 
        category: 'spezie',
        badge: 'GLICEMIA-CONTROL',
        calculation: '1g/die per sensibilità insulinica × 14 giorni',
        days: 'Smoothie + dolcificante naturale'
      },
      { 
        name: 'Zenzero fresco biologico', 
        qty: '200g', 
        price: '4.80€', 
        category: 'spezie',
        badge: 'DIGESTIONE-PRO',
        calculation: '10g/die per digestione + termogenesi',
        days: 'Tisane + condimenti + shot mattina'
      },
      { 
        name: 'Aglio biologico', 
        qty: '150g', 
        price: '3.20€', 
        category: 'spezie',
        badge: 'ALLICINA-IMMUNO',
        calculation: '2 spicchi/die × 14 giorni = cardiovascolare',
        days: '14 giorni - Tutti i soffritti'
      },
      { 
        name: 'Sale rosa Himalayano', 
        qty: '500g', 
        price: '6.90€', 
        category: 'spezie',
        badge: 'ELETTROLITI-84',
        calculation: '84 minerali traccia per idratazione ottimale',
        days: 'Dura 2+ cicli - Tutti i pasti'
      },

      // ===============================================
      // ☕ BEVANDE FUNZIONALI
      // ===============================================
      { 
        name: 'Tè verde Matcha premium', 
        qty: '100g', 
        price: '28.50€', 
        category: 'bevande',
        badge: 'EGCG-TERMOGENICO',
        calculation: `${Math.round(needs.weight * 0.05)}g × 14 giorni = termogenesi +18%`,
        days: '14 giorni - Mattina + pre-workout'
      },
      { 
        name: 'Caffè espresso biologico', 
        qty: '500g', 
        price: '18.90€', 
        category: 'bevande',
        badge: 'CAFFEINA-LIPOLISI',
        calculation: `${Math.round(needs.weight * 6)}mg caffeina target × 14 giorni`,
        days: '14 giorni - Digiuno intermittente + pre-workout'
      },
      { 
        name: 'Acqua oligominerale', 
        qty: '12 bottiglie 1.5L', 
        price: '8.40€', 
        category: 'bevande',
        badge: 'IDRATAZIONE-PURA',
        calculation: `${Math.round(needs.weight * 35)}ml × 14 giorni = ${Math.round(needs.weight * 35 * 14 / 1000)}L`,
        days: '14 giorni - Base idratazione'
      }
    ]
  };

  const currentList = groceryList.ciclo14giorni;
  const totalPrice = currentList.reduce((sum, item) => sum + parseFloat(item.price.replace('€', '')), 0);

  const toggleItem = (itemName: string) => {
    setCheckedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const categories = [
    { key: 'proteine', label: '🥩 Proteine 14 Giorni', color: 'bg-red-100 text-red-800', icon: '💪' },
    { key: 'verdure', label: '🥬 Verdure Stagionali', color: 'bg-green-100 text-green-800', icon: '🥬' },
    { key: 'grassi', label: '🥑 Grassi Ormoni', color: 'bg-purple-100 text-purple-800', icon: '🥑' },
    { key: 'frutta', label: '🍎 Frutta Antiossidanti', color: 'bg-orange-100 text-orange-800', icon: '🍎' },
    { key: 'carboidrati', label: '🌾 Carbs Strategici', color: 'bg-yellow-100 text-yellow-800', icon: '🌾' },
    { key: 'supplementi', label: '💊 Supplementi Elite', color: 'bg-blue-100 text-blue-800', icon: '💊' },
    { key: 'spezie', label: '🧂 Spezie Funzionali', color: 'bg-amber-100 text-amber-800', icon: '🧂' },
    { key: 'bevande', label: '☕ Bevande Attive', color: 'bg-cyan-100 text-cyan-800', icon: '☕' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center space-x-2">
            <ShoppingCart className="w-6 h-6" />
            <span>Lista Spesa Ciclo 14 Giorni Completo</span>
          </h2>
        <div className="flex items-center justify-center space-x-2 text-sm mb-3">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Leaf className="w-3 h-3" />
            <span>Stagione: {season}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Euro className="w-3 h-3" />
            <span>Budget: {totalPrice.toFixed(2)}€</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1 bg-blue-50">
            <span>💪 {needs.weight}kg</span>
          </Badge>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 text-sm">
          <div className="font-semibold text-slate-800 mb-1">🧬 Calcoli Ciclo 14 Giorni Completo</div>
          <div className="text-slate-600 text-xs mb-1">
            Proteine: {Math.round(needs.animalProtein14Days + needs.whey14Days)}g totali • 
            Verdure: {Math.round(needs.vegetables14Days/1000)}kg • 
            Grassi: {Math.round(needs.fats14Days)}g
          </div>
          <div className="text-slate-500 text-xs">
            Protocolli: {needs.protocolDays.highProteinDays}gg High-Protein • {needs.protocolDays.lowCarbDays}gg Low-Carb • {needs.protocolDays.ketoDays}gg Keto • {needs.protocolDays.omadDays}gg OMAD
          </div>
        </div>
      </div>

      {categories.map(category => {
        const categoryItems = currentList.filter(item => item.category === category.key);
        
        if (categoryItems.length === 0) return null;

        return (
          <Card key={category.key} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className={category.color}>
                {category.icon} {category.label}
              </Badge>
              <span className="text-sm text-slate-600">
                {categoryItems.length} prodotti
              </span>
            </div>
            
            <div className="space-y-3">
              {categoryItems.map((item, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start space-x-3 flex-1">
                      <Checkbox
                        checked={checkedItems.includes(item.name)}
                        onCheckedChange={() => toggleItem(item.name)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`font-medium ${checkedItems.includes(item.name) ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                            {item.name}
                          </span>
                          {(item as any).badge && (
                            <Badge variant="outline" className="text-xs bg-emerald-100 text-emerald-700">
                              {(item as any).badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-blue-600 mb-1">{item.qty}</div>
                        {(item as any).days && (
                          <div className="text-xs text-emerald-600 mb-1">
                            📅 {(item as any).days}
                          </div>
                        )}
                        {(item as any).calculation && (
                          <div className="text-xs text-slate-500 italic">
                            📊 {(item as any).calculation}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-slate-800">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      <Card className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">💰 Riepilogo Ciclo 14 Giorni</h3>
            <p className="text-sm text-slate-600">
              {checkedItems.length} di {currentList.length} prodotti selezionati
            </p>
            <p className="text-xs text-slate-500">
              Tutti i protocolli • Ingredienti stagionali • Anti-ginecomastia
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-700">{totalPrice.toFixed(2)}€</div>
            <div className="text-sm text-slate-600">Ciclo completo</div>
            <div className="text-xs text-slate-500">
              ≈ {(totalPrice / 14).toFixed(1)}€/giorno
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-600 bg-white rounded p-2">
          <strong>🎯 RISULTATO GARANTITO:</strong> Body recomposition scientifica con {needs.protocolDays.highProteinDays} giorni High-Protein, {needs.protocolDays.lowCarbDays} giorni Low-Carb, {needs.protocolDays.ketoDays} giorni Keto e {needs.protocolDays.omadDays} giorni OMAD
        </div>
      </Card>
    </div>
  );
};

export default ShoppingList;

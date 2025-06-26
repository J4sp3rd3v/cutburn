import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Leaf, Euro, Calculator, Clock } from 'lucide-react';
import { useProgressTracking } from '@/hooks/useProgressTracking';

const ShoppingList: React.FC = () => {
  const { userProfile } = useProgressTracking();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  if (!userProfile) {
    return <div>Caricamento...</div>;
  }

  const toggleItem = (itemName: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  // *** CALCOLI SCIENTIFICI PERSONALIZZATI PER 14 GIORNI ***
  const getShoppingNeeds = () => {
    const weight = userProfile.current_weight || 70;
    const height = userProfile.height || 175;
    const age = userProfile.age || 30;
    const goal = userProfile.goal || 'weight_loss';
    const targetedFatArea = userProfile.targeted_fat_area;
    
    // BMR e TDEE personalizzati
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    const activityMultiplier = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
    }[userProfile.activity_level] || 1.55;
    const tdee = bmr * activityMultiplier;
    
    // Deficit personalizzato per tipo di grasso localizzato
    let deficitPercentage = 0.20; // Default
    if (goal === 'targeted_fat_loss' && targetedFatArea) {
      const deficitMap = {
        'abdominal': 0.25,
        'gynecomastia': 0.22,
        'love_handles': 0.20,
        'thighs': 0.18,
        'back_fat': 0.20,
        'overall': 0.18
      };
      deficitPercentage = deficitMap[targetedFatArea as keyof typeof deficitMap] || 0.20;
    } else if (goal === 'weight_loss') {
      deficitPercentage = 0.25;
    } else if (goal === 'muscle_gain') {
      deficitPercentage = -0.10; // Surplus
    }
    
    const targetCalories = Math.round(tdee * (1 - deficitPercentage));
    
    // Macronutrienti personalizzati per tipo di grasso
    let proteinRatio = 0.40, carbRatio = 0.30, fatRatio = 0.30;
    if (goal === 'targeted_fat_loss' && targetedFatArea) {
      const macroMap = {
        'abdominal': { protein: 0.50, carbs: 0.20, fat: 0.30 },
        'gynecomastia': { protein: 0.48, carbs: 0.22, fat: 0.30 },
        'love_handles': { protein: 0.45, carbs: 0.25, fat: 0.30 },
        'thighs': { protein: 0.42, carbs: 0.28, fat: 0.30 },
        'back_fat': { protein: 0.46, carbs: 0.24, fat: 0.30 },
        'overall': { protein: 0.44, carbs: 0.26, fat: 0.30 }
      };
      const macros = macroMap[targetedFatArea as keyof typeof macroMap];
      if (macros) {
        proteinRatio = macros.protein;
        carbRatio = macros.carbs;
        fatRatio = macros.fat;
      }
    }
    
    const dailyProtein = Math.round((targetCalories * proteinRatio) / 4);
    const dailyCarbs = Math.round((targetCalories * carbRatio) / 4);
    const dailyFats = Math.round((targetCalories * fatRatio) / 9);
    
    return {
      // Totali 14 giorni
      totalProtein14Days: dailyProtein * 14,
      totalFats14Days: dailyFats * 14,
      totalCarbs14Days: dailyCarbs * 14,
      totalVegetables14Days: weight * 12 * 14, // Aumentato per grasso localizzato
      totalFruits14Days: weight * 2 * 14, // Ridotto per controllo zuccheri
      
      // Dati giornalieri
      dailyProtein,
      dailyFats,
      dailyCarbs,
      targetCalories,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      deficit: Math.round(tdee - targetCalories),
      targetedFatArea
    };
  };

  const needs = getShoppingNeeds();
  const isLactoseIntolerant = userProfile.lactose_intolerant || false;

  // *** LISTA SPESA SCIENTIFICA 14 GIORNI ***
  const groceryList = [
    // === PROTEINE PERSONALIZZATE ===
    {
      name: 'Petto di pollo biologico',
      qty: `${Math.round(needs.totalProtein14Days * 0.35 / 0.25)}g`,
      price: `${(Math.round(needs.totalProtein14Days * 0.35 / 0.25) * 0.012).toFixed(2)}€`,
      category: 'proteine',
      badge: 'LEUCINA-HIGH',
      calculation: `${needs.totalProtein14Days}g × 35% = ${Math.round(needs.totalProtein14Days * 0.35)}g proteine`,
      days: '14 giorni - Fonte principale magra'
    },
    {
      name: 'Salmone selvaggio filetti',
      qty: `${Math.round(needs.totalProtein14Days * 0.30 / 0.22)}g`,
      price: `${(Math.round(needs.totalProtein14Days * 0.30 / 0.22) * 0.028).toFixed(2)}€`,
      category: 'proteine',
      badge: 'OMEGA-3-EPA',
      calculation: `${needs.totalProtein14Days}g × 30% = ${Math.round(needs.totalProtein14Days * 0.30)}g proteine`,
      days: '14 giorni - Anti-infiammatorio'
    },
    {
      name: 'Uova biologiche pastorali',
      qty: `${Math.ceil(needs.totalProtein14Days * 0.20 / 6)} pz`,
      price: `${(Math.ceil(needs.totalProtein14Days * 0.20 / 6) * 0.35).toFixed(2)}€`,
      category: 'proteine',
      badge: 'COLINA-BRAIN',
      calculation: `${Math.ceil(needs.totalProtein14Days * 0.20 / 6)} uova per 14 giorni`,
      days: '14 giorni - Colazioni + spuntini'
    },
    {
      name: isLactoseIntolerant ? 'Proteine Vegetali Isolate' : 'Whey Isolato Grass-Fed',
      qty: `${Math.round(needs.totalProtein14Days * 0.15)}g`,
      price: `${(Math.round(needs.totalProtein14Days * 0.15) * (isLactoseIntolerant ? 0.045 : 0.035)).toFixed(2)}€`,
      category: 'proteine',
      badge: isLactoseIntolerant ? 'PLANT-PROTEIN' : 'LEUCINA-mTOR',
      calculation: `${needs.totalProtein14Days}g × 15% = ${Math.round(needs.totalProtein14Days * 0.15)}g proteine`,
      days: '14 giorni - Shake post-workout'
    },
    
    // === VERDURE ANTI-INFIAMMATORIE ===
    {
      name: 'Broccoli freschi',
      qty: `${Math.round(needs.totalVegetables14Days * 0.25)}g`,
      price: `${(needs.totalVegetables14Days * 0.25 * 0.0035).toFixed(2)}€`,
      category: 'verdure',
      badge: needs.targetedFatArea === 'gynecomastia' ? 'DIM-ANTI-E2' : 'SULFORAFANO',
      calculation: `${Math.round(needs.totalVegetables14Days * 0.25)}g per controllo estrogeni`,
      days: '14 giorni - Anti-ginecomastia'
    },
    {
      name: 'Spinaci biologici',
      qty: `${Math.round(needs.totalVegetables14Days * 0.20)}g`,
      price: `${(needs.totalVegetables14Days * 0.20 * 0.004).toFixed(2)}€`,
      category: 'verdure',
      badge: 'FERRO-FOLATI',
      calculation: `${needs.totalVegetables14Days}g × 20% = ${Math.round(needs.totalVegetables14Days * 0.20)}g`,
      days: '14 giorni - Base verdure'
    },
    {
      name: 'Zucchine',
      qty: `${Math.round(needs.totalVegetables14Days * 0.18)}g`,
      price: `${(needs.totalVegetables14Days * 0.18 * 0.003).toFixed(2)}€`,
      category: 'verdure',
      badge: 'VOLUME-ZERO',
      calculation: `${Math.round(needs.totalVegetables14Days * 0.18)}g volume senza calorie`,
      days: '14 giorni - Sazietà'
    },
    {
      name: 'Cavolo nero',
      qty: `${Math.round(needs.totalVegetables14Days * 0.15)}g`,
      price: `${(needs.totalVegetables14Days * 0.15 * 0.0045).toFixed(2)}€`,
      category: 'verdure',
      badge: 'KALE-SUPERGREEN',
      calculation: `${Math.round(needs.totalVegetables14Days * 0.15)}g superalimento`,
      days: '14 giorni - Smoothie verdi'
    },
    
    // === GRASSI STRATEGICI ===
    {
      name: 'Olio EVO biologico Toscano',
      qty: `${Math.round(needs.totalFats14Days * 0.40)}ml`,
      price: `${(needs.totalFats14Days * 0.40 * 0.018).toFixed(2)}€`,
      category: 'grassi',
      badge: 'POLIFENOLI-HIGH',
      calculation: `${needs.totalFats14Days}g × 40% = ${Math.round(needs.totalFats14Days * 0.40)}ml`,
      days: '14 giorni - Condimento base'
    },
    {
      name: 'Mandorle crude siciliane',
      qty: `${Math.round(needs.totalFats14Days * 0.25 / 0.55)}g`,
      price: `${(Math.round(needs.totalFats14Days * 0.25 / 0.55) * 0.022).toFixed(2)}€`,
      category: 'grassi',
      badge: 'MAGNESIO-300',
      calculation: `${Math.round(needs.totalFats14Days * 0.25)}g grassi da mandorle`,
      days: '14 giorni - Snack + colazioni'
    },
    {
      name: 'Avocado Hass biologici',
      qty: `${Math.ceil(needs.totalFats14Days * 0.20 / 15)} pz`,
      price: `${(Math.ceil(needs.totalFats14Days * 0.20 / 15) * 1.2).toFixed(2)}€`,
      category: 'grassi',
      badge: 'ACIDO-OLEICO',
      calculation: `${Math.ceil(needs.totalFats14Days * 0.20 / 15)} avocado per ormoni`,
      days: '14 giorni - Cene testosterone'
    },
    {
      name: 'Semi di chia biologici',
      qty: `${Math.round(needs.totalFats14Days * 0.15 / 0.31)}g`,
      price: `${(Math.round(needs.totalFats14Days * 0.15 / 0.31) * 0.025).toFixed(2)}€`,
      category: 'grassi',
      badge: 'OMEGA-3-ALA',
      calculation: `${Math.round(needs.totalFats14Days * 0.15)}g grassi Omega-3`,
      days: '14 giorni - Colazioni pudding'
    },
    
    // === CARBOIDRATI STRATEGICI ===
    {
      name: 'Riso basmati integrale',
      qty: `${Math.round(needs.totalCarbs14Days * 0.50 / 0.75)}g`,
      price: `${(Math.round(needs.totalCarbs14Days * 0.50 / 0.75) * 0.003).toFixed(2)}€`,
      category: 'carboidrati',
      badge: 'POST-WORKOUT',
      calculation: `${Math.round(needs.totalCarbs14Days * 0.50)}g carbs da riso`,
      days: 'Solo giorni allenamento'
    },
    {
      name: 'Patate dolci biologiche',
      qty: `${Math.round(needs.totalCarbs14Days * 0.30 / 0.20)}g`,
      price: `${(Math.round(needs.totalCarbs14Days * 0.30 / 0.20) * 0.002).toFixed(2)}€`,
      category: 'carboidrati',
      badge: 'SERA-RECOVERY',
      calculation: `${Math.round(needs.totalCarbs14Days * 0.30)}g carbs da patate dolci`,
      days: 'Cene post-workout glicogeno'
    },
    {
      name: 'Quinoa tricolore',
      qty: `${Math.round(needs.totalCarbs14Days * 0.20 / 0.64)}g`,
      price: `${(Math.round(needs.totalCarbs14Days * 0.20 / 0.64) * 0.008).toFixed(2)}€`,
      category: 'carboidrati',
      badge: 'COMPLETE-PROTEIN',
      calculation: `${Math.round(needs.totalCarbs14Days * 0.20)}g carbs + proteine`,
      days: 'Pranzi bilanciati'
    },
    
    // === SUPPLEMENTI PERSONALIZZATI ===
    {
      name: 'Omega-3 EPA/DHA 2000mg',
      qty: '14 cps',
      price: '24.60€',
      category: 'supplementi',
      badge: 'ANTI-INFLAMMATION',
      calculation: '2g EPA/DHA × 14 giorni per recupero',
      days: '14 giorni - Con pranzo'
    },
    // Supplementi specifici per tipo di grasso localizzato
    ...(needs.targetedFatArea === 'abdominal' ? [
      {
        name: 'Berberina 500mg',
        qty: '28 cps',
        price: '32.90€',
        category: 'supplementi',
        badge: 'INSULINO-RESISTENZA',
        calculation: '500mg × 2/die × 14 giorni per grasso viscerale',
        days: 'Prima dei pasti principali'
      },
      {
        name: 'Cromo Picolinato 200mcg',
        qty: '14 cps',
        price: '18.50€',
        category: 'supplementi',
        badge: 'GLICEMIA-CONTROL',
        calculation: '200mcg/die × 14 giorni controllo insulina',
        days: 'Con colazione'
      }
    ] : []),
    ...(needs.targetedFatArea === 'gynecomastia' ? [
      {
        name: 'DIM (Diindolilmetano) 200mg',
        qty: '14 cps',
        price: '28.90€',
        category: 'supplementi',
        badge: 'ANTI-AROMATASI',
        calculation: '200mg/die × 14 giorni controllo estrogeni',
        days: 'Con cena'
      },
      {
        name: 'Zinco Bisglicinato 15mg',
        qty: '14 cps',
        price: '16.50€',
        category: 'supplementi',
        badge: 'TESTOSTERONE',
        calculation: '15mg/die × 14 giorni sintesi testosterone',
        days: 'Prima di dormire'
      }
    ] : []),
    ...(needs.targetedFatArea === 'love_handles' ? [
      {
        name: 'L-Carnitina Tartrato 2g',
        qty: '14 bustine',
        price: '26.80€',
        category: 'supplementi',
        badge: 'FAT-OXIDATION',
        calculation: '2g/die × 14 giorni mobilizzazione grassi',
        days: 'Pre-workout'
      }
    ] : []),
    ...(needs.targetedFatArea === 'thighs' ? [
      {
        name: 'Centella Asiatica 500mg',
        qty: '14 cps',
        price: '22.40€',
        category: 'supplementi',
        badge: 'CIRCOLAZIONE',
        calculation: '500mg/die × 14 giorni drenaggio linfatico',
        days: 'Con pranzo'
      }
    ] : []),
    
    // === SPEZIE E CONDIMENTI ===
    {
      name: 'Curcuma in polvere biologica',
      qty: '100g',
      price: '8.90€',
      category: 'spezie',
      badge: 'CURCUMINA-95%',
      calculation: '2g/die × 14 giorni = 28g + scorta',
      days: '14 giorni - Anti-infiammatorio'
    },
    {
      name: 'Pepe nero macinato fresco',
      qty: '50g',
      price: '6.50€',
      category: 'spezie',
      badge: 'PIPERINA-BOOST',
      calculation: 'Aumenta biodisponibilità curcuma 2000%',
      days: '14 giorni - Con curcuma'
    },
    {
      name: 'Zenzero fresco biologico',
      qty: '200g',
      price: '4.80€',
      category: 'spezie',
      badge: 'TERMOGENICO',
      calculation: '10g/die × 14 giorni = 140g + scorta',
      days: '14 giorni - Tè e marinature'
    },
    {
      name: 'Aglio biologico',
      qty: '300g',
      price: '3.20€',
      category: 'spezie',
      badge: 'ALLICINA-CARDIO',
      calculation: '2 spicchi/die × 14 giorni',
      days: '14 giorni - Base cucina'
    },
    
    // === BEVANDE FUNZIONALI ===
    {
      name: 'Tè verde Matcha biologico',
      qty: '100g',
      price: '28.90€',
      category: 'bevande',
      badge: 'EGCG-TERMOGENICO',
      calculation: '2g/die × 14 giorni = 28g + scorta',
      days: '14 giorni - Mattina digiuno'
    },
    {
      name: 'Acqua naturale 1.5L',
      qty: `${Math.ceil((needs.dailyProtein * 0.035) * 14 / 1.5)} bottiglie`,
      price: `${(Math.ceil((needs.dailyProtein * 0.035) * 14 / 1.5) * 0.45).toFixed(2)}€`,
      category: 'bevande',
      badge: 'IDRATAZIONE-BASE',
      calculation: `${Math.round(needs.dailyProtein * 0.035)}L/die × 14 giorni`,
      days: '14 giorni - Idratazione ottimale'
    },
    // === RICETTE SPECIALI BIMBY ===
    {
      name: 'Farina di ceci biologica',
      qty: '500g',
      price: '4.20€',
      category: 'ricette_bimby',
      badge: 'SNACK-PROTEIN',
      calculation: 'Per snack proteici falafel - 26g proteine/100g',
      days: 'Ricetta snack vegani anti-fame'
    },
    {
      name: 'Fiocchi di avena integrali',
      qty: '1000g',
      price: '3.80€',
      category: 'ricette_bimby',
      badge: 'BETA-GLUCANI',
      calculation: 'Base per snack + colazioni energetiche',
      days: 'Snack falafel + porridge mattutini'
    },
    {
      name: 'Farina di arachidi sgrassata',
      qty: '500g',
      price: '12.90€',
      category: 'ricette_bimby',
      badge: 'PROTEIN-BOOST',
      calculation: '50% proteine - boost per snack vegani',
      days: 'Snack proteici alta densità'
    },
    {
      name: 'Semi di canapa decorticati',
      qty: '250g',
      price: '8.50€',
      category: 'ricette_bimby',
      badge: 'OMEGA-COMPLETE',
      calculation: 'Profilo amminoacidico completo + Omega 3-6',
      days: 'Snack + smoothie proteici'
    },
    {
      name: 'Fagioli cannellini biologici',
      qty: '800g (4 barattoli)',
      price: '6.40€',
      category: 'ricette_bimby',
      badge: 'PLANT-PROTEIN',
      calculation: '8 burger vegani ad alto contenuto proteico',
      days: 'Burger sostitutivi carne'
    },
    {
      name: 'Farina tipo 0 biologica',
      qty: '1000g',
      price: '1.80€',
      category: 'ricette_bimby',
      badge: 'CINNAMON-ROLLS',
      calculation: 'Base per dolci fit occasionali (cheat meal)',
      days: 'Cinnamon rolls domenicali'
    },
    {
      name: 'Lievito di birra fresco',
      qty: '25g',
      price: '0.80€',
      category: 'ricette_bimby',
      badge: 'VITAMINE-B',
      calculation: 'Lievitazione naturale + vitamine gruppo B',
      days: 'Lievitati fit'
    },
    {
      name: 'Margarina vegetale 80% grassi',
      qty: '250g',
      price: '2.90€',
      category: 'ricette_bimby',
      badge: 'PLANT-BASED',
      calculation: 'Alternativa burro per ricette vegane',
      days: 'Dolci fit vegani'
    },
    {
      name: 'Latte di soia non zuccherato',
      qty: '1L',
      price: '1.50€',
      category: 'ricette_bimby',
      badge: 'ISOFLAVONI',
      calculation: 'Base liquida vegana + fitoestrogeni naturali',
      days: 'Impasti + smoothie'
    },
    {
      name: 'Mix spezie curry biologico',
      qty: '100g',
      price: '4.50€',
      category: 'ricette_bimby',
      badge: 'TERMOGENICO',
      calculation: 'Curcuma + spezie per metabolismo',
      days: 'Snack falafel + piatti esotici'
    },
    {
      name: 'Cannella Ceylon biologica',
      qty: '100g',
      price: '6.80€',
      category: 'ricette_bimby',
      badge: 'GLICEMIA-CONTROL',
      calculation: 'Controllo picchi insulinici + sapore',
      days: 'Cinnamon rolls + dolci fit'
    },
    {
      name: 'Fumo liquido naturale',
      qty: '100ml',
      price: '4.20€',
      category: 'ricette_bimby',
      badge: 'UMAMI-BOOST',
      calculation: 'Sapore affumicato senza grassi aggiunti',
      days: 'Burger vegani + marinature'
    },
    {
      name: 'Farina di psyllium',
      qty: '200g',
      price: '8.90€',
      category: 'ricette_bimby',
      badge: 'FIBER-PLUS',
      calculation: 'Legante naturale + fibre solubili',
      days: 'Burger compatti + regolarità intestinale'
    }
  ];

  const categories = [
    { key: 'all', label: 'Tutto', count: groceryList.length },
    { key: 'proteine', label: 'Proteine', count: groceryList.filter(item => item.category === 'proteine').length },
    { key: 'verdure', label: 'Verdure', count: groceryList.filter(item => item.category === 'verdure').length },
    { key: 'grassi', label: 'Grassi', count: groceryList.filter(item => item.category === 'grassi').length },
    { key: 'carboidrati', label: 'Carboidrati', count: groceryList.filter(item => item.category === 'carboidrati').length },
    { key: 'supplementi', label: 'Supplementi', count: groceryList.filter(item => item.category === 'supplementi').length },
    { key: 'spezie', label: 'Spezie', count: groceryList.filter(item => item.category === 'spezie').length },
    { key: 'bevande', label: 'Bevande', count: groceryList.filter(item => item.category === 'bevande').length },
    { key: 'ricette_bimby', label: 'Ricette Bimby', count: groceryList.filter(item => item.category === 'ricette_bimby').length }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredItems = selectedCategory === 'all' 
    ? groceryList 
    : groceryList.filter(item => item.category === selectedCategory);

  const totalPrice = groceryList.reduce((sum, item) => sum + parseFloat(item.price.replace('€', '')), 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          🛒 Lista Spesa 14 Giorni
        </h2>
        <p className="text-slate-600 mb-4">
          Quantità scientifiche personalizzate per il tuo ciclo completo
        </p>
        
        {/* Stats personalizzate */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="p-3 bg-gradient-to-r from-blue-50 to-green-50">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{needs.totalProtein14Days}g</div>
              <div className="text-xs text-slate-600">Proteine totali 14gg</div>
            </div>
          </Card>
          <Card className="p-3 bg-gradient-to-r from-green-50 to-yellow-50">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{totalPrice.toFixed(2)}€</div>
              <div className="text-xs text-slate-600">Budget totale</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Category Filter */}
      <div className="grid grid-cols-3 gap-2">
        {categories.slice(0, 6).map((category) => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.key)}
            className="text-xs"
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </div>

      {/* Progress */}
      <Card className="p-3 bg-slate-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progresso spesa</span>
          <span className="text-sm text-slate-600">{checkedCount}/{filteredItems.length}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(checkedCount / filteredItems.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Shopping List */}
      <div className="space-y-3">
        {filteredItems.map((item, index) => (
          <Card key={index} className={`p-4 transition-all duration-200 ${
            checkedItems[item.name] ? 'bg-green-50 border-green-200' : 'bg-white'
          }`}>
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={checkedItems[item.name] || false}
                onCheckedChange={() => toggleItem(item.name)}
                className="mt-1"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className={`font-semibold ${checkedItems[item.name] ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                      {item.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.badge}
                      </Badge>
                      <span className="text-sm text-slate-600">{item.days}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{item.qty}</div>
                    <div className="text-sm text-green-600">{item.price}</div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded p-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-1 mb-1">
                    <Calculator className="w-3 h-3" />
                    <span className="font-medium">Calcolo:</span>
                  </div>
                  <div>{item.calculation}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="p-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <h3 className="font-semibold text-slate-700 mb-3">📊 Riepilogo Nutrizionale 14 Giorni</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-bold text-blue-600">{needs.dailyProtein}g/giorno</div>
            <div className="text-slate-600">Proteine medie</div>
          </div>
          <div>
            <div className="font-bold text-green-600">{needs.targetCalories} kcal</div>
            <div className="text-slate-600">Target giornaliero</div>
          </div>
          <div>
            <div className="font-bold text-orange-600">{needs.dailyFats}g/giorno</div>
            <div className="text-slate-600">Grassi per ormoni</div>
          </div>
          <div>
            <div className="font-bold text-purple-600">{needs.dailyCarbs}g/giorno</div>
            <div className="text-slate-600">Carbs strategici</div>
          </div>
        </div>
        
        {isLactoseIntolerant && (
          <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-700">
            ✅ Lista adattata per intolleranza al lattosio
          </div>
        )}
        
        {needs.targetedFatArea && (
          <div className="mt-3 p-3 bg-orange-100 rounded text-xs text-orange-700">
            <div className="font-semibold mb-1">🎯 Personalizzazione per {
              needs.targetedFatArea === 'abdominal' ? 'Grasso Addominale' :
              needs.targetedFatArea === 'gynecomastia' ? 'Ginecomastia' :
              needs.targetedFatArea === 'love_handles' ? 'Maniglie dell\'Amore' :
              needs.targetedFatArea === 'thighs' ? 'Cosce e Glutei' :
              needs.targetedFatArea === 'back_fat' ? 'Grasso Dorsale' :
              'Approccio Combinato'
            }:</div>
            <div>
              Deficit: {Math.round((needs.deficit / needs.tdee) * 100)}% • 
              Proteine: {Math.round((needs.dailyProtein * 4 / needs.targetCalories) * 100)}% • 
              Supplementi specifici inclusi
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ShoppingList;

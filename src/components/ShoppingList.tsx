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

  // *** CALCOLI SCIENTIFICI PER 14 GIORNI COMPLETI ***
  const getShoppingNeeds = () => {
    const weight = userProfile.current_weight || 70;
    const height = userProfile.height || 175;
    const age = userProfile.age || 30;
    
    // BMR e TDEE personalizzati
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    const activityMultiplier = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
    }[userProfile.activity_level] || 1.55;
    const tdee = bmr * activityMultiplier;
    
    // Deficit personalizzato
    const deficitPercentage = userProfile.goal === 'fat-loss' ? 0.25 : 
                             userProfile.goal === 'muscle-gain' ? -0.10 : 0.15;
    const targetCalories = Math.round(tdee * (1 - deficitPercentage));
    
    // Proteine per obiettivo
    const proteinMultiplier = userProfile.goal === 'fat-loss' ? 2.8 : 
                             userProfile.goal === 'muscle-gain' ? 3.2 : 2.5;
    const dailyProtein = Math.round(weight * proteinMultiplier);
    
    // Grassi (28% calorie)
    const dailyFats = Math.round((targetCalories * 0.28) / 9);
    
    // Carboidrati (resto)
    const dailyCarbs = Math.round((targetCalories - (dailyProtein * 4) - (dailyFats * 9)) / 4);
    
    return {
      // Totali 14 giorni
      totalProtein14Days: dailyProtein * 14,
      totalFats14Days: dailyFats * 14,
      totalCarbs14Days: dailyCarbs * 14,
      totalVegetables14Days: weight * 10 * 14, // 10g/kg/giorno
      totalFruits14Days: weight * 3 * 14, // 3g/kg/giorno
      
      // Dati giornalieri
      dailyProtein,
      dailyFats,
      dailyCarbs,
      targetCalories,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee)
    };
  };

  const needs = getShoppingNeeds();
  const isLactoseIntolerant = userProfile.lactose_intolerant || false;

  // *** LISTA SPESA SCIENTIFICA 14 GIORNI ***
  const groceryList = [
    // === PROTEINE ===
    {
      name: 'Petto di pollo biologico',
      qty: `${Math.round(needs.totalProtein14Days * 0.40 / 0.25)}g`,
      price: `${(Math.round(needs.totalProtein14Days * 0.40 / 0.25) * 0.012).toFixed(2)}€`,
      category: 'proteine',
      badge: 'BASE-PROTEIN',
      calculation: `${needs.totalProtein14Days}g × 40% = ${Math.round(needs.totalProtein14Days * 0.40)}g proteine`,
      days: '14 giorni - Fonte principale'
    },
    {
      name: 'Salmone selvaggio filetti',
      qty: `${Math.round(needs.totalProtein14Days * 0.25 / 0.22)}g`,
      price: `${(Math.round(needs.totalProtein14Days * 0.25 / 0.22) * 0.028).toFixed(2)}€`,
      category: 'proteine',
      badge: 'OMEGA-3',
      calculation: `${needs.totalProtein14Days}g × 25% = ${Math.round(needs.totalProtein14Days * 0.25)}g proteine`,
      days: 'Giorni Low-Carb + Keto'
    },
    {
      name: 'Uova biologiche pastorali',
      qty: `${Math.ceil(needs.totalProtein14Days * 0.15 / 6)} pz`,
      price: `${(Math.ceil(needs.totalProtein14Days * 0.15 / 6) * 0.35).toFixed(2)}€`,
      category: 'proteine',
      badge: 'COLINA-BRAIN',
      calculation: `${Math.ceil(needs.totalProtein14Days * 0.15 / 6)} uova per 14 giorni`,
      days: '14 giorni - Colazioni + spuntini'
    },
    {
      name: isLactoseIntolerant ? 'Proteine Vegetali Isolate' : 'Whey Isolato Grass-Fed',
      qty: `${Math.round(needs.totalProtein14Days * 0.20)}g`,
      price: `${(Math.round(needs.totalProtein14Days * 0.20) * (isLactoseIntolerant ? 0.045 : 0.035)).toFixed(2)}€`,
      category: 'proteine',
      badge: isLactoseIntolerant ? 'PLANT-PROTEIN' : 'LEUCINA-mTOR',
      calculation: `${needs.totalProtein14Days}g × 20% = ${Math.round(needs.totalProtein14Days * 0.20)}g proteine`,
      days: '14 giorni - Shake post-workout'
    },
    
    // === VERDURE ===
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
      name: 'Broccoli freschi',
      qty: `${Math.round(needs.totalVegetables14Days * 0.18)}g`,
      price: `${(needs.totalVegetables14Days * 0.18 * 0.0035).toFixed(2)}€`,
      category: 'verdure',
      badge: 'DIM-ANTI-E',
      calculation: `${Math.round(needs.totalVegetables14Days * 0.18)}g per controllo estrogeni`,
      days: '14 giorni - Anti-ginecomastia'
    },
    {
      name: 'Zucchine',
      qty: `${Math.round(needs.totalVegetables14Days * 0.15)}g`,
      price: `${(needs.totalVegetables14Days * 0.15 * 0.003).toFixed(2)}€`,
      category: 'verdure',
      badge: 'VOLUME-ZERO',
      calculation: `${Math.round(needs.totalVegetables14Days * 0.15)}g volume senza calorie`,
      days: '14 giorni - Sazietà'
    },
    
    // === GRASSI ===
    {
      name: 'Olio EVO biologico Toscano',
      qty: `${Math.round(needs.totalFats14Days * 0.35)}ml`,
      price: `${(needs.totalFats14Days * 0.35 * 0.018).toFixed(2)}€`,
      category: 'grassi',
      badge: 'POLIFENOLI',
      calculation: `${needs.totalFats14Days}g × 35% = ${Math.round(needs.totalFats14Days * 0.35)}ml`,
      days: '14 giorni - Condimento base'
    },
    {
      name: 'Mandorle crude',
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
    
    // === CARBOIDRATI STRATEGICI ===
    {
      name: 'Riso basmati integrale',
      qty: `${Math.round(needs.totalCarbs14Days * 0.60 / 0.75)}g`,
      price: `${(Math.round(needs.totalCarbs14Days * 0.60 / 0.75) * 0.003).toFixed(2)}€`,
      category: 'carboidrati',
      badge: 'POST-WORKOUT',
      calculation: `${Math.round(needs.totalCarbs14Days * 0.60)}g carbs da riso`,
      days: 'Solo giorni High-Protein + allenamento'
    },
    {
      name: 'Patate dolci biologiche',
      qty: `${Math.round(needs.totalCarbs14Days * 0.40 / 0.20)}g`,
      price: `${(Math.round(needs.totalCarbs14Days * 0.40 / 0.20) * 0.002).toFixed(2)}€`,
      category: 'carboidrati',
      badge: 'SERA-RECOVERY',
      calculation: `${Math.round(needs.totalCarbs14Days * 0.40)}g carbs da patate dolci`,
      days: 'Cene post-workout per glicogeno'
    },
    
    // === SUPPLEMENTI 14 GIORNI ===
    {
      name: 'DIM (Diindolilmetano) 200mg',
      qty: '14 cps',
      price: '28.90€',
      category: 'supplementi',
      badge: 'ANTI-GINECOMASTIA',
      calculation: '200mg/die × 14 giorni = ciclo completo',
      days: '14 giorni - Controllo aromatasi'
    },
    {
      name: 'Zinco Bisglicinato 15mg',
      qty: '14 cps',
      price: '16.50€',
      category: 'supplementi',
      badge: 'TESTOSTERONE',
      calculation: '15mg/die × 14 giorni per sintesi testosterone',
      days: '14 giorni - Pre-sonno'
    },
    {
      name: 'Ashwagandha KSM-66 600mg',
      qty: '14 cps',
      price: '22.80€',
      category: 'supplementi',
      badge: 'CORTISOLO-CONTROL',
      calculation: '600mg/die × 14 giorni = -28% cortisolo',
      days: '14 giorni - Mattina a digiuno'
    },
    {
      name: 'Omega-3 EPA/DHA',
      qty: '14 cps',
      price: '24.60€',
      category: 'supplementi',
      badge: 'ANTI-INFLAMMATION',
      calculation: '2g EPA/DHA × 14 giorni per recupero',
      days: '14 giorni - Con pranzo'
    }
  ];

  const categories = [
    { key: 'all', label: 'Tutto', count: groceryList.length },
    { key: 'proteine', label: 'Proteine', count: groceryList.filter(item => item.category === 'proteine').length },
    { key: 'verdure', label: 'Verdure', count: groceryList.filter(item => item.category === 'verdure').length },
    { key: 'grassi', label: 'Grassi', count: groceryList.filter(item => item.category === 'grassi').length },
    { key: 'carboidrati', label: 'Carboidrati', count: groceryList.filter(item => item.category === 'carboidrati').length },
    { key: 'supplementi', label: 'Supplementi', count: groceryList.filter(item => item.category === 'supplementi').length }
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
      </Card>
    </div>
  );
};

export default ShoppingList;

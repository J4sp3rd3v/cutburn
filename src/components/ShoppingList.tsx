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

  // *** CALCOLI PERSONALIZZATI SCIENTIFICI ***
  const calculateWeeklyNeeds = () => {
    const weight = userProfile.currentWeight;
    
    // Calcoli basati su protocolli scientifici
    const proteinTargetDaily = weight * 2.4; // 2.4g/kg per body recomp
    const proteinTargetWeekly = proteinTargetDaily * 7;
    
    // Distribuzione fonti proteiche ottimale
    const wheyProteinDaily = weight * 0.4; // 0.4g/kg da whey isolato
    const animalProteinDaily = weight * 1.6; // 1.6g/kg da fonti animali
    const eggProteinDaily = weight * 0.4; // 0.4g/kg da uova
    
    // Verdure per volume e micronutrienti (2.5g/kg peso corporeo)
    const vegetablesDaily = weight * 2.5;
    
    // Grassi essenziali (0.8-1.2g/kg peso corporeo)
    const fatsDaily = weight * 1.0;
    
    return {
      wheyWeekly: Math.round(wheyProteinDaily * 7),
      animalProteinWeekly: Math.round(animalProteinDaily * 7),
      eggsWeekly: Math.ceil((eggProteinDaily * 7) / 6), // 6g proteine per uovo
      vegetablesWeekly: Math.round(vegetablesDaily * 7),
      fatsWeekly: Math.round(fatsDaily * 7),
      weight: weight
    };
  };

  const needs = calculateWeeklyNeeds();

  // Lista spesa scientifica personalizzata
  const groceryList = {
    settimana1: [
      // *** PROTEINE ANIMALI - CALCOLO SCIENTIFICO ***
      { 
        name: 'Petto di pollo biologico', 
        qty: `${Math.round(needs.animalProteinWeekly * 0.6 / 0.25)}g`, // 25% proteine nel pollo
        price: `${(Math.round(needs.animalProteinWeekly * 0.6 / 0.25) * 0.012).toFixed(2)}€`, 
        category: 'proteine',
        badge: 'BODY-RECOMP',
        calculation: `${needs.weight}kg × 1.6g × 7gg × 60% = ${Math.round(needs.animalProteinWeekly * 0.6)}g proteine target`
      },
      { 
        name: 'Salmone selvaggio filetti', 
        qty: `${Math.round(needs.animalProteinWeekly * 0.25 / 0.22)}g`, // 22% proteine + omega-3
        price: `${(Math.round(needs.animalProteinWeekly * 0.25 / 0.22) * 0.025).toFixed(2)}€`, 
        category: 'proteine',
        badge: 'ANTI-ESTROGENI',
        calculation: `${needs.weight}kg × 1.6g × 7gg × 25% = ${Math.round(needs.animalProteinWeekly * 0.25)}g proteine target`
      },
      { 
        name: 'Uova biologiche pastorali', 
        qty: `${needs.eggsWeekly} pz`, 
        price: `${(needs.eggsWeekly * 0.35).toFixed(2)}€`, 
        category: 'proteine',
        badge: 'TESTOSTERONE',
        calculation: `${needs.weight}kg × 0.4g × 7gg ÷ 6g/uovo = ${needs.eggsWeekly} uova/settimana`
      },
      { 
        name: 'Whey Isolato Grass-Fed', 
        qty: `${Math.round(needs.wheyWeekly)}g`, 
        price: `${(needs.wheyWeekly * 0.035).toFixed(2)}€`, 
        category: 'proteine',
        badge: 'MASS-BUILDING',
        calculation: `${needs.weight}kg × 0.4g × 7gg = ${needs.wheyWeekly}g whey/settimana`
      },

      // *** VERDURE STAGIONALI - VOLUME E MICRONUTRIENTI ***
      { 
        name: `Spinaci ${season} biologici`, 
        qty: `${Math.round(needs.vegetablesWeekly * 0.25)}g`, 
        price: `${(needs.vegetablesWeekly * 0.25 * 0.004).toFixed(2)}€`, 
        category: 'verdure',
        badge: 'DETOX',
        calculation: `${needs.weight}kg × 2.5g × 7gg × 25% = ${Math.round(needs.vegetablesWeekly * 0.25)}g/settimana`
      },
      { 
        name: `Broccoli ${season}`, 
        qty: `${Math.round(needs.vegetablesWeekly * 0.20)}g`, 
        price: `${(needs.vegetablesWeekly * 0.20 * 0.0035).toFixed(2)}€`, 
        category: 'verdure',
        badge: 'ANTI-ESTROGENI',
        calculation: `DIM + I3C per controllo aromatasi: ${Math.round(needs.vegetablesWeekly * 0.20)}g/settimana`
      },
      { 
        name: 'Cavolo nero biologico', 
        qty: `${Math.round(needs.vegetablesWeekly * 0.15)}g`, 
        price: `${(needs.vegetablesWeekly * 0.15 * 0.005).toFixed(2)}€`, 
        category: 'verdure',
        badge: 'SUPERFOOD',
        calculation: `Vitamina K + sulforafano: ${Math.round(needs.vegetablesWeekly * 0.15)}g/settimana`
      },

      // *** GRASSI ESSENZIALI - TESTOSTERONE E ORMONI ***
      { 
        name: 'Olio EVO biologico Toscano', 
        qty: `${Math.round(needs.fatsWeekly * 0.4)}ml`, 
        price: `${(needs.fatsWeekly * 0.4 * 0.018).toFixed(2)}€`, 
        category: 'grassi',
        badge: 'TESTOSTERONE',
        calculation: `${needs.weight}kg × 1.0g × 7gg × 40% = ${Math.round(needs.fatsWeekly * 0.4)}ml olio/settimana`
      },
      { 
        name: 'Mandorle siciliane crude', 
        qty: `${Math.round(needs.fatsWeekly * 0.3)}g`, 
        price: `${(needs.fatsWeekly * 0.3 * 0.022).toFixed(2)}€`, 
        category: 'grassi',
        badge: 'MAGNESIO',
        calculation: `Vitamina E + magnesio: ${Math.round(needs.fatsWeekly * 0.3)}g/settimana`
      },
      { 
        name: 'Avocado Hass biologici', 
        qty: `${Math.ceil(needs.fatsWeekly * 0.3 / 15)} pz`, // 15g grassi per avocado
        price: `${(Math.ceil(needs.fatsWeekly * 0.3 / 15) * 1.2).toFixed(2)}€`, 
        category: 'grassi',
        badge: 'ACIDO-OLEICO',
        calculation: `Acido oleico per ormoni: ${Math.ceil(needs.fatsWeekly * 0.3 / 15)} avocado/settimana`
      },

      // *** SUPPLEMENTI SCIENTIFICI 2024-2025 ***
      { 
        name: 'DIM (Diindolilmetano) 200mg', 
        qty: '7 cps', 
        price: '15.50€', 
        category: 'supplementi',
        badge: 'ANTI-GINECOMASTIA',
        calculation: 'Controllo aromatasi: 200mg/die × 7 giorni'
      },
      { 
        name: 'Zinco Bisglicinato 15mg', 
        qty: '7 cps', 
        price: '8.90€', 
        category: 'supplementi',
        badge: 'TESTOSTERONE',
        calculation: 'Sintesi testosterone: 15mg/die × 7 giorni'
      },
      { 
        name: 'Ashwagandha KSM-66 600mg', 
        qty: '7 cps', 
        price: '12.30€', 
        category: 'supplementi',
        badge: 'CORTISOLO',
        calculation: 'Riduzione cortisolo: 600mg/die × 7 giorni'
      },
      { 
        name: 'MCT Oil C8 puro', 
        qty: `${Math.round(needs.weight * 0.2 * 7)}ml`, 
        price: `${(needs.weight * 0.2 * 7 * 0.025).toFixed(2)}€`, 
        category: 'supplementi',
        badge: 'CHETOGENICO',
        calculation: `Termogenesi + chetosi: ${needs.weight}kg × 0.2ml × 7gg = ${Math.round(needs.weight * 0.2 * 7)}ml/settimana`
      }
    ]
  };

  const currentList = groceryList.settimana1;
  const totalPrice = currentList.reduce((sum, item) => sum + parseFloat(item.price.replace('€', '')), 0);

  const toggleItem = (itemName: string) => {
    setCheckedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const categories = [
    { key: 'proteine', label: 'Proteine Scientifiche', color: 'bg-red-100 text-red-800', icon: '💪' },
    { key: 'verdure', label: 'Verdure Funzionali', color: 'bg-green-100 text-green-800', icon: '🥬' },
    { key: 'grassi', label: 'Grassi Essenziali', color: 'bg-purple-100 text-purple-800', icon: '🥑' },
    { key: 'supplementi', label: 'Supplementi Elite', color: 'bg-blue-100 text-blue-800', icon: '💊' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center space-x-2">
          <ShoppingCart className="w-6 h-6" />
          <span>Lista Spesa Scientifica Personalizzata</span>
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
          <div className="font-semibold text-slate-800 mb-1">🧬 Calcoli Body Recomposition</div>
          <div className="text-slate-600 text-xs">
            Proteine: {Math.round(needs.animalProteinWeekly + needs.wheyWeekly)}g/sett • 
            Verdure: {Math.round(needs.vegetablesWeekly/1000)}kg/sett • 
            Grassi: {Math.round(needs.fatsWeekly)}g/sett
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

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">Riepilogo Spesa</h3>
            <p className="text-sm text-slate-600">
              {checkedItems.length} di {currentList.length} prodotti selezionati
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-800">{totalPrice.toFixed(2)}€</div>
            <div className="text-sm text-slate-600">Totale settimana</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShoppingList;

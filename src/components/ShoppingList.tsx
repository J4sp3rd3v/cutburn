
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Calendar, Filter, Share, RefreshCw } from 'lucide-react';

const ShoppingList = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [weekDay, setWeekDay] = useState(new Date().getDay());

  // Weekly meal plan groceries with daily quantities
  const weeklyGroceries = {
    proteine: [
      { 
        id: 'chicken-breast', 
        name: 'Petto di pollo biologico', 
        weeklyQuantity: '900g', 
        dailyUsage: '130g/giorno',
        price: '12.50€', 
        category: 'proteine',
        days: ['lunedì', 'mercoledì', 'venerdì', 'domenica']
      },
      { 
        id: 'salmon', 
        name: 'Salmone selvaggio', 
        weeklyQuantity: '520g', 
        dailyUsage: '130g x 4 giorni',
        price: '16.00€', 
        category: 'proteine',
        days: ['martedì', 'giovedì', 'sabato']
      },
      { 
        id: 'turkey', 
        name: 'Petto di tacchino biologico', 
        weeklyQuantity: '420g', 
        dailyUsage: '140g x 3 cene',
        price: '10.80€', 
        category: 'proteine',
        days: ['lunedì', 'mercoledì', 'venerdì']
      },
      { 
        id: 'greek-yogurt', 
        name: 'Yogurt greco 0%', 
        weeklyQuantity: '1050g', 
        dailyUsage: '150g/giorno colazione',
        price: '8.90€', 
        category: 'proteine',
        days: ['tutti i giorni']
      },
      { 
        id: 'whey-protein', 
        name: 'Proteine Whey Isolate', 
        weeklyQuantity: '210g', 
        dailyUsage: '30g/giorno (15g colazione + 15g spuntino)',
        price: '45.00€', 
        category: 'proteine',
        days: ['tutti i giorni']
      }
    ],
    carboidrati: [
      { 
        id: 'quinoa', 
        name: 'Quinoa rossa biologica', 
        weeklyQuantity: '350g', 
        dailyUsage: '50g crudo/giorno pranzo',
        price: '8.50€', 
        category: 'carboidrati',
        days: ['tutti i giorni']
      },
      { 
        id: 'sweet-potato', 
        name: 'Patate dolci viola', 
        weeklyQuantity: '840g', 
        dailyUsage: '120g/cena x 7 giorni',
        price: '4.20€', 
        category: 'carboidrati',
        days: ['tutti i giorni']
      },
      { 
        id: 'banana', 
        name: 'Banane biologiche', 
        weeklyQuantity: '14 pezzi', 
        dailyUsage: '2 banane/giorno (smoothie + spuntino)',
        price: '4.80€', 
        category: 'carboidrati',
        days: ['tutti i giorni']
      }
    ],
    verdure: [
      { 
        id: 'spinach', 
        name: 'Spinaci baby freschi', 
        weeklyQuantity: '1400g', 
        dailyUsage: '200g cena/giorno',
        price: '6.30€', 
        category: 'verdure',
        days: ['tutti i giorni']
      },
      { 
        id: 'broccoli', 
        name: 'Broccolini freschi', 
        weeklyQuantity: '1050g', 
        dailyUsage: '150g pranzo/giorno',
        price: '7.50€', 
        category: 'verdure',
        days: ['tutti i giorni']
      },
      { 
        id: 'cucumber', 
        name: 'Cetrioli biologici', 
        weeklyQuantity: '2.1kg', 
        dailyUsage: '300g/giorno (succhi detox)',
        price: '4.80€', 
        category: 'verdure',
        days: ['tutti i giorni']
      },
      { 
        id: 'celery', 
        name: 'Sedano fresco', 
        weeklyQuantity: '350g', 
        dailyUsage: '50g/giorno (succhi)',
        price: '2.80€', 
        category: 'verdure',
        days: ['tutti i giorni']
      }
    ],
    frutta: [
      { 
        id: 'green-apple', 
        name: 'Mele verdi biologiche', 
        weeklyQuantity: '14 pezzi', 
        dailyUsage: '2 mele/giorno (succhi + spuntini)',
        price: '5.60€', 
        category: 'frutta',
        days: ['tutti i giorni']
      },
      { 
        id: 'berries', 
        name: 'Mix frutti di bosco', 
        weeklyQuantity: '500g', 
        dailyUsage: '70g x 7 smoothie bowl',
        price: '12.90€', 
        category: 'frutta',
        days: ['tutti i giorni']
      },
      { 
        id: 'lemon-lime', 
        name: 'Limoni e lime', 
        weeklyQuantity: '14 pezzi', 
        dailyUsage: '2 agrumi/giorno (succhi)',
        price: '4.20€', 
        category: 'frutta',
        days: ['tutti i giorni']
      },
      { 
        id: 'pineapple', 
        name: 'Ananas fresco', 
        weeklyQuantity: '1 intero', 
        dailyUsage: '100g x 7 giorni smoothie',
        price: '3.90€', 
        category: 'frutta',
        days: ['tutti i giorni']
      }
    ],
    grassi: [
      { 
        id: 'avocado', 
        name: 'Avocado maturi', 
        weeklyQuantity: '14 pezzi', 
        dailyUsage: '2 avocado/giorno (colazione + cena)',
        price: '11.20€', 
        category: 'grassi',
        days: ['tutti i giorni']
      },
      { 
        id: 'olive-oil', 
        name: 'Olio EVO biologico', 
        weeklyQuantity: '500ml', 
        dailyUsage: '20ml/giorno condimenti',
        price: '12.90€', 
        category: 'grassi',
        days: ['tutti i giorni']
      },
      { 
        id: 'almonds', 
        name: 'Mandorle crude biologiche', 
        weeklyQuantity: '140g', 
        dailyUsage: '20g/giorno spuntino',
        price: '6.80€', 
        category: 'grassi',
        days: ['tutti i giorni']
      }
    ],
    superfood: [
      { 
        id: 'spirulina', 
        name: 'Spirulina polvere biologica', 
        weeklyQuantity: '50g', 
        dailyUsage: '7g/giorno (smoothie)',
        price: '18.50€', 
        category: 'superfood',
        days: ['tutti i giorni']
      },
      { 
        id: 'chia-seeds', 
        name: 'Semi di chia biologici', 
        weeklyQuantity: '100g', 
        dailyUsage: '15g/giorno (bowl + smoothie)',
        price: '8.90€', 
        category: 'superfood',
        days: ['tutti i giorni']
      },
      { 
        id: 'matcha', 
        name: 'Matcha cerimoniale', 
        weeklyQuantity: '30g', 
        daily: '4g x 7 smoothie stellati',
        price: '24.90€', 
        category: 'superfood',
        days: ['tutti i giorni']
      }
    ]
  };

  const categories = [
    { key: 'all', label: 'Tutto', count: Object.values(weeklyGroceries).flat().length },
    { key: 'proteine', label: 'Proteine', count: weeklyGroceries.proteine.length },
    { key: 'verdure', label: 'Verdure', count: weeklyGroceries.verdure.length },
    { key: 'carboidrati', label: 'Carboidrati', count: weeklyGroceries.carboidrati.length },
    { key: 'frutta', label: 'Frutta', count: weeklyGroceries.frutta.length },
    { key: 'grassi', label: 'Grassi', count: weeklyGroceries.grassi.length },
    { key: 'superfood', label: 'Superfood', count: weeklyGroceries.superfood.length }
  ];

  // Auto-update daily
  useEffect(() => {
    const updateDailyList = () => {
      const today = new Date().getDay();
      setWeekDay(today);
    };
    
    const interval = setInterval(updateDailyList, 24 * 60 * 60 * 1000); // Check daily
    return () => clearInterval(interval);
  }, []);

  const allItems = Object.values(weeklyGroceries).flat();
  const filteredItems = selectedFilter === 'all' 
    ? allItems 
    : allItems.filter(item => item.category === selectedFilter);

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const totalPrice = filteredItems.reduce((sum, item) => {
    return sum + parseFloat(item.price.replace('€', ''));
  }, 0);

  const completedItems = checkedItems.length;
  const totalItems = filteredItems.length;

  const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Lista Spesa Settimanale
        </h2>
        <p className="text-slate-600">
          Aggiornamento automatico • Dosaggi precisi • {dayNames[weekDay]}
        </p>
      </div>

      {/* Weekly Summary */}
      <Card className="p-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Spesa Piano Settimanale
          </h3>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {completedItems}/{totalItems}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold">€{totalPrice.toFixed(2)}</div>
            <div className="text-sm opacity-90">Totale settimana</div>
          </div>
          <div>
            <div className="text-xl font-bold">{totalItems}</div>
            <div className="text-sm opacity-90">Prodotti</div>
          </div>
          <div>
            <div className="text-xl font-bold">7</div>
            <div className="text-sm opacity-90">Giorni coperti</div>
          </div>
        </div>
      </Card>

      {/* Auto-Update Notice */}
      <Card className="p-3 bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 text-blue-600" />
          <div className="text-sm text-blue-700">
            <strong>Aggiornamento automatico:</strong> Lista sincronizzata con piano pasti giornaliero
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button variant="outline" className="flex-1 flex items-center space-x-2">
          <Share className="w-4 h-4" />
          <span>Condividi</span>
        </Button>
        <Button variant="outline" className="flex-1 flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Calendario</span>
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={selectedFilter === category.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(category.key)}
            className="flex items-center space-x-1 whitespace-nowrap"
          >
            <Filter className="w-3 h-3" />
            <span>{category.label}</span>
            <Badge variant="secondary" className="text-xs ml-1">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Shopping List */}
      <div className="space-y-2">
        {Object.entries(weeklyGroceries).map(([categoryKey, items]) => {
          if (selectedFilter !== 'all' && selectedFilter !== categoryKey) return null;
          
          const categoryItems = selectedFilter === 'all' ? items : items;
          if (categoryItems.length === 0) return null;

          return (
            <div key={categoryKey} className="space-y-2">
              {selectedFilter === 'all' && (
                <h3 className="font-semibold text-slate-700 capitalize mt-4 mb-2">
                  {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
                </h3>
              )}
              
              {categoryItems.map((item) => (
                <Card 
                  key={item.id}
                  className={`p-3 transition-all duration-200 ${
                    checkedItems.includes(item.id) 
                      ? 'bg-green-50 border-green-200 opacity-60' 
                      : 'bg-white/70 backdrop-blur-sm hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={checkedItems.includes(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${
                            checkedItems.includes(item.id) 
                              ? 'text-slate-500 line-through' 
                              : 'text-slate-800'
                          }`}>
                            {item.name}
                          </h4>
                          <p className="text-sm text-slate-600 font-medium">
                            {item.weeklyQuantity}
                          </p>
                          <p className="text-xs text-slate-500">
                            Uso giornaliero: {item.dailyUsage}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-800">{item.price}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      {/* Daily usage indicator */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.days.map((day, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs px-1 py-0"
                          >
                            {day === 'tutti i giorni' ? '7gg' : day.substring(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          );
        })}
      </div>

      {/* Weekly Planning Science */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-2">🧬 Pianificazione Scientifica</h3>
        <div className="text-sm text-purple-700 space-y-1">
          <p>• <strong>Proteine:</strong> 1.8g/kg peso (124g/giorno) per preservazione massa magra</p>
          <p>• <strong>Deficit calorico:</strong> -500kcal/giorno sicuri per ormoni</p>
          <p>• <strong>Superfood:</strong> Spirulina + Matcha per termogenesi naturale</p>
          <p>• <strong>Timing acquisti:</strong> Domenica sera per settimana ottimale</p>
        </div>
      </Card>
    </div>
  );
};

export default ShoppingList;


import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Calendar, Filter, Share } from 'lucide-react';

const ShoppingList = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const groceries = {
    proteine: [
      { id: 'chicken-breast', name: 'Petto di pollo', quantity: '900g', price: '8.50€', category: 'proteine' },
      { id: 'salmon', name: 'Salmone fresco', quantity: '400g', price: '12.00€', category: 'proteine' },
      { id: 'eggs', name: 'Uova biologiche', quantity: '12 pz', price: '4.20€', category: 'proteine' },
      { id: 'whey-protein', name: 'Proteine Whey Isolate', quantity: '1 kg', price: '35.00€', category: 'proteine' }
    ],
    carboidrati: [
      { id: 'basmati-rice', name: 'Riso basmati integrale', quantity: '1 kg', price: '3.80€', category: 'carboidrati' },
      { id: 'quinoa', name: 'Quinoa biologica', quantity: '500g', price: '6.50€', category: 'carboidrati' },
      { id: 'sweet-potato', name: 'Patate dolci', quantity: '1 kg', price: '2.90€', category: 'carboidrati' }
    ],
    verdure: [
      { id: 'spinach', name: 'Spinaci freschi', quantity: '500g', price: '2.80€', category: 'verdure' },
      { id: 'broccoli', name: 'Broccoli', quantity: '2 cespi', price: '3.20€', category: 'verdure' },
      { id: 'zucchini', name: 'Zucchine', quantity: '800g', price: '2.40€', category: 'verdure' },
      { id: 'cucumber', name: 'Cetrioli', quantity: '3 pz', price: '1.80€', category: 'verdure' }
    ],
    frutta: [
      { id: 'green-apple', name: 'Mele verdi', quantity: '1 kg', price: '2.60€', category: 'frutta' },
      { id: 'berries', name: 'Mirtilli', quantity: '250g', price: '4.50€', category: 'frutta' },
      { id: 'lemon', name: 'Limoni', quantity: '6 pz', price: '2.10€', category: 'frutta' }
    ],
    grassi: [
      { id: 'olive-oil', name: 'Olio EVO biologico', quantity: '500ml', price: '8.90€', category: 'grassi' },
      { id: 'almonds', name: 'Mandorle crude', quantity: '200g', price: '5.40€', category: 'grassi' },
      { id: 'avocado', name: 'Avocado', quantity: '3 pz', price: '4.20€', category: 'grassi' }
    ],
    integratori: [
      { id: 'creatine', name: 'Creatina monoidrato', quantity: '300g', price: '18.00€', category: 'integratori' },
      { id: 'magnesium', name: 'Magnesio citrato', quantity: '90 cps', price: '12.50€', category: 'integratori' },
      { id: 'multivitamin', name: 'Multivitaminico', quantity: '60 cps', price: '15.90€', category: 'integratori' }
    ]
  };

  const categories = [
    { key: 'all', label: 'Tutto', count: Object.values(groceries).flat().length },
    { key: 'proteine', label: 'Proteine', count: groceries.proteine.length },
    { key: 'verdure', label: 'Verdure', count: groceries.verdure.length },
    { key: 'carboidrati', label: 'Carboidrati', count: groceries.carboidrati.length },
    { key: 'frutta', label: 'Frutta', count: groceries.frutta.length },
    { key: 'grassi', label: 'Grassi', count: groceries.grassi.length },
    { key: 'integratori', label: 'Integratori', count: groceries.integratori.length }
  ];

  const allItems = Object.values(groceries).flat();
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

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Lista della Spesa
        </h2>
        <p className="text-slate-600">
          Settimanale • Stagionale • Quantità ottimizzate
        </p>
      </div>

      {/* Summary Card */}
      <Card className="p-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Spesa Settimanale
          </h3>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {completedItems}/{totalItems}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold">€{totalPrice.toFixed(2)}</div>
            <div className="text-sm opacity-90">Totale stimato</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalItems}</div>
            <div className="text-sm opacity-90">Prodotti</div>
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
          <span>Pianifica</span>
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
        {Object.entries(groceries).map(([categoryKey, items]) => {
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
                          <p className="text-sm text-slate-600">{item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-800">{item.price}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          );
        })}
      </div>

      {/* Weekly Planning Note */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Note Pianificazione</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>Proteine:</strong> Calcolo basato su 1.8g/kg peso corporeo</p>
          <p>• <strong>Verdure:</strong> Preferire stagionali per qualità e prezzo</p>
          <p>• <strong>Integratori:</strong> Rifornimento mensile, controllare scadenze</p>
          <p>• <strong>Spesa ottimale:</strong> Martedì/Mercoledì per promozioni</p>
        </div>
      </Card>
    </div>
  );
};

export default ShoppingList;

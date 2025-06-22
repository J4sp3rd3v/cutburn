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

  const groceryList = {
    settimana1: [
      { name: 'Pollo petti', qty: '1.5kg', price: '12.50€', category: 'proteine' },
      { name: 'Uova biologiche', qty: '12 pz', price: '4.20€', category: 'proteine' },
      { name: 'Whey proteine', qty: '1kg', price: '35.00€', category: 'proteine' },
      { name: 'Spinaci', qty: '1kg', price: '3.50€', category: 'verdure' },
      { name: 'Broccoli', qty: '800g', price: '2.80€', category: 'verdure' },
      { name: 'Pomodori', qty: '1kg', price: '2.50€', category: 'verdure' },
      { name: 'Mele', qty: '1kg', price: '4.50€', category: 'frutta' },
      { name: 'Banane', qty: '1kg', price: '3.80€', category: 'frutta' },
      { name: 'Limoni', qty: '6 pz', price: '2.10€', category: 'frutta' },
      { name: 'Riso basmati', qty: '1kg', price: '2.90€', category: 'carboidrati' },
      { name: 'Avena', qty: '500g', price: '1.80€', category: 'carboidrati' },
      { name: 'Olio EVO', qty: '500ml', price: '8.50€', category: 'grassi' },
      { name: 'Mandorle', qty: '200g', price: '4.50€', category: 'grassi' },
      { name: 'Curcuma', qty: '50g', price: '2.80€', category: 'spezie' },
      { name: 'Zenzero fresco', qty: '100g', price: '1.50€', category: 'spezie' }
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
    { key: 'proteine', label: 'Proteine', color: 'bg-red-100 text-red-800' },
    { key: 'verdure', label: 'Verdure', color: 'bg-green-100 text-green-800' },
    { key: 'frutta', label: 'Frutta', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'carboidrati', label: 'Carboidrati', color: 'bg-blue-100 text-blue-800' },
    { key: 'grassi', label: 'Grassi', color: 'bg-purple-100 text-purple-800' },
    { key: 'spezie', label: 'Spezie', color: 'bg-orange-100 text-orange-800' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center space-x-2">
          <ShoppingCart className="w-6 h-6" />
          <span>Lista Spesa Semplice</span>
        </h2>
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Leaf className="w-3 h-3" />
            <span>Stagione: {season}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Euro className="w-3 h-3" />
            <span>Budget: {totalPrice.toFixed(2)}€</span>
          </Badge>
        </div>
      </div>

      {categories.map(category => {
        const categoryItems = currentList.filter(item => item.category === category.key);
        
        if (categoryItems.length === 0) return null;

        return (
          <Card key={category.key} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className={category.color}>
                {category.label}
              </Badge>
              <span className="text-sm text-slate-600">
                {categoryItems.length} prodotti
              </span>
            </div>
            
            <div className="space-y-2">
              {categoryItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={checkedItems.includes(item.name)}
                      onCheckedChange={() => toggleItem(item.name)}
                    />
                    <div>
                      <span className={`font-medium ${checkedItems.includes(item.name) ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {item.name}
                      </span>
                      <div className="text-sm text-slate-600">{item.qty}</div>
                    </div>
                  </div>
                  <span className="font-medium text-slate-800">{item.price}</span>
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

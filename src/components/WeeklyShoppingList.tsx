import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Package, 
  Scale,
  Printer,
  CheckCircle2,
  Apple,
  Milk,
  Wheat,
  Fish
} from 'lucide-react';
import { usePersonalizedDiet } from '@/hooks/usePersonalizedDiet';

interface ShoppingItem {
  item: string;
  totalAmount: number;
  unit: string;
  category: 'proteine' | 'carboidrati' | 'verdure' | 'frutta' | 'latticini' | 'spezie' | 'altro';
  notes?: string;
  priority: 'essenziale' | 'importante' | 'opzionale';
}

const WeeklyShoppingList: React.FC = () => {
  const { dietPlan, loading } = usePersonalizedDiet();

  const shoppingList = useMemo(() => {
    if (!dietPlan || !dietPlan.weeklyPlan.length) return [];

    const itemMap = new Map<string, ShoppingItem>();

    // Aggrega tutti gli ingredienti della settimana
    dietPlan.weeklyPlan.forEach(day => {
      Object.values(day.meals).forEach(meal => {
        meal.ingredients.forEach(ingredient => {
          const key = ingredient.item.toLowerCase();
          
          if (itemMap.has(key)) {
            const existing = itemMap.get(key)!;
            // Somma le quantità (semplificazione - in realtà servirebbe parsing più sofisticato)
            const currentAmount = parseFloat(ingredient.amount.replace(/[^\d.]/g, '')) || 0;
            existing.totalAmount += currentAmount;
          } else {
            // Categorizza automaticamente l'ingrediente
            const category = categorizeIngredient(ingredient.item);
            const priority = determinePriority(ingredient.item, ingredient.notes);
            const amount = parseFloat(ingredient.amount.replace(/[^\d.]/g, '')) || 0;
            const unit = ingredient.amount.replace(/[\d.]/g, '').trim() || 'pz';

            itemMap.set(key, {
              item: ingredient.item,
              totalAmount: amount,
              unit: unit,
              category,
              notes: ingredient.notes,
              priority
            });
          }
        });
      });
    });

    return Array.from(itemMap.values()).sort((a, b) => {
      // Ordina per categoria e poi per priorità
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      const priorityOrder = { 'essenziale': 0, 'importante': 1, 'opzionale': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [dietPlan]);

  const categorizeIngredient = (item: string): ShoppingItem['category'] => {
    const itemLower = item.toLowerCase();
    
    if (itemLower.includes('pollo') || itemLower.includes('salmone') || itemLower.includes('uova') || 
        itemLower.includes('lenticchie') || itemLower.includes('albumi')) {
      return 'proteine';
    }
    if (itemLower.includes('quinoa') || itemLower.includes('avena') || itemLower.includes('pane')) {
      return 'carboidrati';
    }
    if (itemLower.includes('spinaci') || itemLower.includes('broccoli') || itemLower.includes('asparagi') || 
        itemLower.includes('sedano') || itemLower.includes('carote') || itemLower.includes('cipolla')) {
      return 'verdure';
    }
    if (itemLower.includes('frutti') || itemLower.includes('mirtilli') || itemLower.includes('mela') || 
        itemLower.includes('limone')) {
      return 'frutta';
    }
    if (itemLower.includes('skyr') || itemLower.includes('yogurt')) {
      return 'latticini';
    }
    if (itemLower.includes('curcuma') || itemLower.includes('cannella') || itemLower.includes('pepe') || 
        itemLower.includes('aglio') || itemLower.includes('zenzero')) {
      return 'spezie';
    }
    return 'altro';
  };

  const determinePriority = (item: string, notes?: string): ShoppingItem['priority'] => {
    const itemLower = item.toLowerCase();
    
    // Ingredienti essenziali per le proteine e macronutrienti principali
    if (itemLower.includes('pollo') || itemLower.includes('salmone') || itemLower.includes('uova') || 
        itemLower.includes('skyr') || itemLower.includes('lenticchie')) {
      return 'essenziale';
    }
    
    // Ingredienti importanti per fibre e nutrienti
    if (itemLower.includes('quinoa') || itemLower.includes('avena') || itemLower.includes('spinaci') || 
        itemLower.includes('broccoli') || itemLower.includes('frutti')) {
      return 'importante';
    }
    
    // Spezie e condimenti sono opzionali ma migliorano il sapore
    return 'opzionale';
  };

  const getCategoryIcon = (category: ShoppingItem['category']) => {
    switch (category) {
      case 'proteine': return <Fish className="w-4 h-4" />;
      case 'carboidrati': return <Wheat className="w-4 h-4" />;
      case 'verdure': return <Apple className="w-4 h-4 text-green-500" />;
      case 'frutta': return <Apple className="w-4 h-4 text-red-500" />;
      case 'latticini': return <Milk className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: ShoppingItem['category']) => {
    switch (category) {
      case 'proteine': return 'bg-red-50 border-red-200 text-red-800';
      case 'carboidrati': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'verdure': return 'bg-green-50 border-green-200 text-green-800';
      case 'frutta': return 'bg-pink-50 border-pink-200 text-pink-800';
      case 'latticini': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'spezie': return 'bg-orange-50 border-orange-200 text-orange-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: ShoppingItem['priority']) => {
    switch (priority) {
      case 'essenziale':
        return <Badge variant="destructive" className="text-xs">ESSENZIALE</Badge>;
      case 'importante':
        return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">IMPORTANTE</Badge>;
      case 'opzionale':
        return <Badge variant="outline" className="text-xs">OPZIONALE</Badge>;
    }
  };

  const groupedItems = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {};
    shoppingList.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [shoppingList]);

  const totalItems = shoppingList.length;
  const totalCost = shoppingList.reduce((sum, item) => {
    // Stima approssimativa del costo (in realtà dovrebbe essere configurabile)
    const estimatedPricePerUnit = item.category === 'proteine' ? 8 : 
                                 item.category === 'verdure' ? 2 : 
                                 item.category === 'frutta' ? 3 : 4;
    return sum + (item.totalAmount * estimatedPricePerUnit / 100);
  }, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Piano Dietetico Non Disponibile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Completa il tuo profilo per generare la lista della spesa personalizzata.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con statistiche */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Lista Spesa Settimanale</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{totalItems}</p>
              <p className="text-sm text-green-100">Prodotti</p>
            </div>
            <div>
              <p className="text-2xl font-bold">7</p>
              <p className="text-sm text-green-100">Giorni</p>
            </div>
            <div>
              <p className="text-2xl font-bold">€{totalCost.toFixed(0)}</p>
              <p className="text-sm text-green-100">Costo stimato</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Azioni rapide */}
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Printer className="w-4 h-4" />
          <span>Stampa Lista</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Segna Tutto</span>
        </Button>
      </div>

      {/* Lista per categorie */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <Card key={category} className={getCategoryColor(category as ShoppingItem['category'])}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              {getCategoryIcon(category as ShoppingItem['category'])}
              <span className="capitalize">{category}</span>
              <Badge variant="outline" className="text-xs">
                {items.length} prodotti
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-slate-800">{item.item}</span>
                      {getPriorityBadge(item.priority)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Scale className="w-3 h-3" />
                        <span className="font-medium">{item.totalAmount.toFixed(0)} {item.unit}</span>
                      </div>
                      {item.notes && (
                        <span className="text-xs text-slate-500">({item.notes})</span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Suggerimenti per l'acquisto */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">💡 Consigli per la Spesa</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
            <li><strong>Proteine:</strong> Scegli prodotti freschi e di qualità, controlla le date di scadenza</li>
            <li><strong>Verdure:</strong> Preferisci prodotti di stagione per migliore qualità e prezzo</li>
            <li><strong>Spezie:</strong> Investi in spezie di qualità per massimizzare i benefici anti-infiammatori</li>
            <li><strong>Pianificazione:</strong> Acquista i prodotti essenziali per primi, poi aggiungi quelli opzionali</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyShoppingList; 
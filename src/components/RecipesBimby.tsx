import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, Users, Zap, Target, Leaf } from 'lucide-react';

const RecipesBimby: React.FC = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const recipes = [
    {
      id: 'snack_proteici',
      name: 'Snack Proteici Vegani al Falafel',
      category: 'spuntini',
      time: '35 min',
      servings: '20 snack',
      calories: '26g proteine/100g',
      badge: 'ANTI-FAME',
      difficulty: 'Facile',
      benefits: 'Perfetti per spezzare la fame tra i pasti principali senza compromettere il deficit calorico',
      ingredients: [
        { item: 'Farina di ceci biologica', qty: '150g', notes: 'Base proteica principale' },
        { item: 'Fiocchi di avena', qty: '100g', notes: 'Carboidrati complessi' },
        { item: 'Farina di arachidi sgrassata', qty: '80g', notes: 'Boost proteico 50%' },
        { item: 'Semi di canapa decorticati', qty: '30g', notes: 'Omega 3-6 completi' },
        { item: 'Acqua tiepida', qty: '120ml', notes: 'Per l\'impasto' },
        { item: 'Olio EVO', qty: '15ml', notes: 'Grassi buoni' },
        { item: 'Mix spezie curry', qty: '10g', notes: 'Termogenico' },
        { item: 'Sale rosa dell\'Himalaya', qty: '3g', notes: 'Minerali' },
        { item: 'Zucchero di cocco', qty: '5g', notes: 'Dolcificante naturale' }
      ],
      instructions: [
        {
          step: 1,
          title: 'Preparazione spezie',
          bimby: 'Nel boccale asciutto: spezie curry + 50g mix farine. Polverizzare 20 sec / vel 10.',
          detail: 'Le spezie polverizzate si distribuiranno meglio nell\'impasto'
        },
        {
          step: 2,
          title: 'Mix ingredienti secchi',
          bimby: 'Aggiungere tutti gli ingredienti secchi rimanenti. Mescolare 15 sec / vel 4.',
          detail: 'Otterrai un mix omogeneo e ben amalgamato'
        },
        {
          step: 3,
          title: 'Incorporare liquidi',
          bimby: 'Versare acqua e olio. Impastare 40 sec / vel 3 fino a composto compatto.',
          detail: 'L\'impasto deve risultare modellabile ma non appiccicoso'
        },
        {
          step: 4,
          title: 'Formatura',
          bimby: 'Formare palline da 10g ciascuna. Schiacciare leggermente per creare forme irregolari.',
          detail: 'Le forme irregolari aumentano la superficie e la croccantezza'
        },
        {
          step: 5,
          title: 'Cottura ottimale',
          bimby: 'Forno ventilato 160°C per 28-30 min. Girare a metà cottura.',
          detail: 'Devono risultare dorati e croccanti al tatto'
        }
      ],
      tips: [
        'Conservali in contenitore ermetico per 7 giorni',
        'Perfetti con tè verde matcha per boost metabolico',
        'Ideali come pre-workout 30 min prima dell\'allenamento'
      ]
    },
    {
      id: 'burger_vegano',
      name: 'Burger Proteico ai Cannellini',
      category: 'secondo',
      time: '25 min + riposo',
      servings: '4 burger',
      calories: '18g proteine/burger',
      badge: 'PLANT-PROTEIN',
      difficulty: 'Medio',
      benefits: 'Sostituto perfetto della carne con profilo amminoacidico completo e zero colesterolo',
      ingredients: [
        { item: 'Fagioli cannellini cotti', qty: '400g (2 barattoli)', notes: 'Sciacquati e scolati bene' },
        { item: 'Cipolla media', qty: '80g', notes: 'Tritata finemente' },
        { item: 'Farina di ceci', qty: '60g', notes: 'Legante proteico' },
        { item: 'Farina di psyllium', qty: '10g', notes: 'Super-legante naturale' },
        { item: 'Aglio in polvere', qty: '5g', notes: 'Sapore base' },
        { item: 'Timo secco', qty: '3g', notes: 'Aroma mediterraneo' },
        { item: 'Fumo liquido', qty: '5ml', notes: 'Sapore bbq' },
        { item: 'Sale e pepe nero', qty: 'q.b.', notes: 'Condimento' },
        { item: 'Olio di girasole', qty: '10ml', notes: 'Per cottura' },
        { item: 'Salsa di soia', qty: '15ml', notes: 'Caramellatura finale' }
      ],
      instructions: [
        {
          step: 1,
          title: 'Preparazione fagioli',
          bimby: 'Fagioli nel boccale. Tritare 4-5 impulsi / vel 4. Lasciare pezzi grossolani.',
          detail: 'Non ridurre in purea - la texture rustica è fondamentale'
        },
        {
          step: 2,
          title: 'Aggiunta ingredienti',
          bimby: 'Aggiungere tutti gli altri ingredienti tranne olio e salsa di soia. Impastare modalità Spiga 90 sec.',
          detail: 'L\'impasto deve essere compatto ma non liscio'
        },
        {
          step: 3,
          title: 'Riposo compattazione',
          bimby: 'Trasferire l\'impasto in frigorifero per 30 min minimo.',
          detail: 'Il psyllium assorbirà l\'umidità rendendo tutto più saldo'
        },
        {
          step: 4,
          title: 'Formatura burger',
          bimby: 'Con un coppapasta da 10 cm, formare 4 burger pressando bene.',
          detail: 'Usa pellicola nel coppapasta per facilitare l\'estrazione'
        },
        {
          step: 5,
          title: 'Cottura perfetta',
          bimby: 'Padella media con olio. Cuocere 4 min per lato. Sfumare con salsa di soia.',
          detail: 'La salsa di soia creerà una bella caramellatura'
        }
      ],
      tips: [
        'Si possono preparare in anticipo e congelare crudi',
        'Servire con pane integrale e verdure grigliate',
        'Aggiungere avocado per grassi buoni extra'
      ]
    },
    {
      id: 'cinnamon_rolls',
      name: 'Cinnamon Rolls Fit Vegani',
      category: 'dolce',
      time: '4 ore (con lievitazioni)',
      servings: '8 rolls',
      calories: 'Cheat meal domenicale',
      badge: 'WEEKEND-TREAT',
      difficulty: 'Avanzato',
      benefits: 'Versione alleggerita del classico americano, perfetta per il cheat meal domenicale',
      ingredients: [
        { item: 'Farina tipo 0', qty: '400g', notes: 'Base impasto' },
        { item: 'Latte di soia tiepido', qty: '200ml', notes: '35°C - importante!' },
        { item: 'Lievito di birra fresco', qty: '15g', notes: 'Sbriciolato' },
        { item: 'Zucchero di cocco', qty: '40g', notes: 'Dolcificante impasto' },
        { item: 'Margarina vegetale', qty: '80g', notes: 'Morbida, 80% grassi' },
        { item: 'Sale fino', qty: '5g', notes: 'Esalta i sapori' },
        { item: 'Vaniglia in polvere', qty: '2g', notes: 'Aroma base' },
        { item: 'Olio di semi', qty: '20ml', notes: 'Morbidezza' },
        { item: 'Cannella Ceylon', qty: '15g', notes: 'Farcitura' },
        { item: 'Zucchero di canna', qty: '60g', notes: 'Farcitura dolce' },
        { item: 'Margarina fusa', qty: '30g', notes: 'Spennellatura' }
      ],
      instructions: [
        {
          step: 1,
          title: 'Attivazione lievito',
          bimby: 'Latte tiepido + lievito + 1 cucchiaio zucchero nel boccale. 30 sec / vel 2.',
          detail: 'Il lievito deve fare schiuma in 5-10 minuti'
        },
        {
          step: 2,
          title: 'Impasto base',
          bimby: 'Aggiungere farina, zucchero restante, sale, vaniglia, olio. Modalità Spiga 3 min.',
          detail: 'L\'impasto inizierà a formarsi'
        },
        {
          step: 3,
          title: 'Incordatura',
          bimby: 'Aggiungere margarina a pezzetti. Modalità Spiga 5-6 min fino incordatura.',
          detail: 'L\'impasto deve staccarsi dalle pareti del boccale'
        },
        {
          step: 4,
          title: 'Prima lievitazione',
          bimby: 'Contenitore unto, forma rettangolare. Forno spento con luce accesa 2.5 ore.',
          detail: 'Deve raddoppiare di volume'
        },
        {
          step: 5,
          title: 'Formatura e farcitura',
          bimby: 'Stendere 40x30cm. Spennellare con margarina fusa. Cannella + zucchero uniformemente.',
          detail: 'Arrotolare stretto dal lato lungo'
        },
        {
          step: 6,
          title: 'Seconda lievitazione',
          bimby: 'Tagliare girelle 4.5cm. Teglia unta. Lievitare 1.5 ore.',
          detail: 'Devono quasi toccarsi tra loro'
        },
        {
          step: 7,
          title: 'Cottura finale',
          bimby: 'Forno ventilato 180°C per 18-20 min fino doratura.',
          detail: 'Non aprire il forno nei primi 15 minuti'
        }
      ],
      tips: [
        'Preparare la sera prima fino alla seconda lievitazione',
        'Glassare solo quando completamente freddi',
        'Perfetti riscaldati 30 sec al microonde'
      ]
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spuntini': return 'bg-green-100 text-green-700';
      case 'secondo': return 'bg-blue-100 text-blue-700';
      case 'dolce': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-500';
      case 'Medio': return 'bg-yellow-500';
      case 'Avanzato': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          🍽️ Ricette Bimby TM5 Fit
        </h2>
        <p className="text-slate-600 mb-4">
          Ricette ottimizzate per la perdita di grasso localizzato con ingredienti facilmente reperibili
        </p>
      </div>

      {/* Recipe Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <Badge className={getCategoryColor(recipe.category)}>
                  {recipe.category.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  {recipe.badge}
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">
                {recipe.name}
              </CardTitle>
              <p className="text-sm text-slate-600 mt-2">
                {recipe.benefits}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{recipe.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span>{recipe.servings}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>{recipe.calories}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getDifficultyColor(recipe.difficulty)}`}></div>
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
              
              <Button 
                variant={selectedRecipe === recipe.id ? "default" : "outline"} 
                className="w-full"
                onClick={() => setSelectedRecipe(selectedRecipe === recipe.id ? null : recipe.id)}
              >
                {selectedRecipe === recipe.id ? 'Nascondi ricetta' : 'Mostra ricetta'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recipe Detail */}
      {selectedRecipe && (
        <Card className="mt-6 border-2 border-blue-200">
          {(() => {
            const recipe = recipes.find(r => r.id === selectedRecipe);
            if (!recipe) return null;
            
            return (
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <ChefHat className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{recipe.name}</h3>
                    <p className="text-slate-600">Ricetta dettagliata ottimizzata per Bimby TM5</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Ingredienti */}
                  <div>
                    <h4 className="font-bold text-lg text-slate-800 mb-3 flex items-center">
                      <Leaf className="w-5 h-5 mr-2 text-green-600" />
                      Ingredienti
                    </h4>
                    <div className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="bg-slate-50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-slate-800">{ingredient.item}</span>
                            <span className="font-bold text-blue-600">{ingredient.qty}</span>
                          </div>
                          <p className="text-xs text-slate-600">{ingredient.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Istruzioni */}
                  <div>
                    <h4 className="font-bold text-lg text-slate-800 mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-purple-600" />
                      Procedimento Bimby TM5
                    </h4>
                    <div className="space-y-4">
                      {recipe.instructions.map((instruction, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {instruction.step}
                            </div>
                            <h5 className="font-semibold text-slate-800">{instruction.title}</h5>
                          </div>
                          <div className="bg-blue-100 rounded p-3 mb-2">
                            <p className="text-sm font-medium text-blue-800">
                              🥄 <strong>Bimby:</strong> {instruction.bimby}
                            </p>
                          </div>
                          <p className="text-xs text-slate-600">💡 {instruction.detail}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    <div className="mt-6">
                      <h5 className="font-semibold text-slate-800 mb-3">✨ Consigli del Chef</h5>
                      <div className="space-y-2">
                        {recipe.tips.map((tip, index) => (
                          <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                            <p className="text-sm text-yellow-800">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            );
          })()}
        </Card>
      )}
    </div>
  );
};

export default RecipesBimby; 
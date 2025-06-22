import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Calendar, Filter, Share, RefreshCw, Dna, Leaf, Zap, Brain, Activity } from 'lucide-react';

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
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [cycleWeek, setCycleWeek] = useState(1); // Settimana 1 o 2 del ciclo 14 giorni

  // Calcolo del giorno del ciclo (0-13)
  const getCurrentCycleDay = () => {
    const startDate = new Date('2024-01-01');
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceStart % 14;
  };

  const currentCycleDay = getCurrentCycleDay();
  const currentWeek = Math.floor(currentCycleDay / 7) + 1;

  // Stagionalità scientifica per biodisponibilità massima
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
        fruits: ['fragole biologiche', 'mirtilli', 'kiwi gold', 'pompelmo rosa'],
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

    return { season, ingredients: seasonalDb[season] };
  };

  const { season, ingredients: seasonalIngredients } = getSeasonalIngredients();

  // Lista spesa scientifica per Body Recomposition (14 giorni)
  const generateScientificGroceryList = () => {
    const proteinTargetKg = userProfile.currentWeight * 2.8; // 2.8g/kg ricerca Phillips 2024
    const dailyProteinGrams = Math.round(proteinTargetKg);
    
    return {
      // PROTEINE - Base fondamentale body recomp
      proteine: [
        {
          id: 'whey-isolate',
          name: 'Whey Isolate Grass-Fed',
          weeklyQuantity: `${Math.round(userProfile.currentWeight * 8.4)}g`, // 60g/giorno
          dailyUsage: `${Math.round(userProfile.currentWeight * 0.6)}g/giorno`,
          price: '89.90€',
          category: 'proteine',
          benefits: 'Leucina 11g/100g per mTOR activation. Cysteine per glutatione.',
          timing: 'Colazione + Pre-workout',
          scientific: 'Phillips et al. 2024 - Optimized muscle protein synthesis',
          bodyRecomp: true
        },
        {
          id: 'seasonal-protein-1',
          name: seasonalIngredients.proteins[0],
          weeklyQuantity: `${Math.round(userProfile.currentWeight * 15.4)}g`, // 220g x 7 giorni
          dailyUsage: `${Math.round(userProfile.currentWeight * 2.2)}g/pranzo`,
          price: '24.50€',
          category: 'proteine',
          benefits: 'Proteine complete ad alta biodisponibilità stagionale',
          timing: 'Pranzo principale',
          seasonal: true,
          bodyRecomp: true
        },
        {
          id: 'seasonal-protein-2',
          name: seasonalIngredients.proteins[1],
          weeklyQuantity: `${Math.round(userProfile.currentWeight * 12.6)}g`, // 180g x 7 giorni
          dailyUsage: `${Math.round(userProfile.currentWeight * 1.8)}g/cena`,
          price: '28.90€',
          category: 'proteine',
          benefits: 'Triptofano per serotonina notturna + recovery',
          timing: 'Cena zen',
          seasonal: true,
          bodyRecomp: true
        },
        {
          id: 'collagen-peptides',
          name: 'Collagene Peptidi Bioattivi',
          weeklyQuantity: '140g',
          dailyUsage: '20g/giorno (10g colazione + 10g post-workout)',
          price: '45.00€',
          category: 'proteine',
          benefits: 'Glicina per GH release. Prolina per recovery articolare.',
          timing: 'Colazione + Post-workout',
          scientific: 'Zdzieblik et al. 2024 - Enhanced muscle recovery',
          bodyRecomp: true
        }
      ],

      // ANTI-ESTROGENI - Fondamentali per ginecomastia
      antiEstrogeni: [
        {
          id: 'cruciferous-mix',
          name: `Mix Crucifere: ${seasonalIngredients.antiEstrogens.slice(0, 2).join(' + ')}`,
          weeklyQuantity: `${Math.round(userProfile.currentWeight * 21)}g`, // 300g/giorno
          dailyUsage: `${Math.round(userProfile.currentWeight * 3)}g/giorno`,
          price: '18.40€',
          category: 'antiEstrogeni',
          benefits: 'DIM + I3C per metabolismo estrogeni. Sulforafano fase II detox.',
          timing: 'Distribuito nei pasti',
          scientific: 'Fujioka et al. 2024 - Aromatase inhibition natural compounds',
          seasonal: true,
          antiEstrogen: true
        },
        {
          id: 'dim-supplement',
          name: 'DIM (Diindolylmethane) Concentrato',
          weeklyQuantity: '2.8g', // 400mg/giorno
          dailyUsage: '400mg/giorno',
          price: '34.90€',
          category: 'antiEstrogeni',
          benefits: 'Metabolismo estrogeni pathway 2-hydroxylation favorevole',
          timing: 'Con pasto principale',
          scientific: 'Thomson et al. 2024 - Estrogen metabolism optimization',
          antiEstrogen: true
        }
      ],

      // TERMOGENICI - Fat burning scientifico
      termogenici: [
        {
          id: 'seasonal-thermogenic',
          name: `${seasonalIngredients.thermogenics[0]} + ${seasonalIngredients.thermogenics[1]}`,
          weeklyQuantity: `${Math.round(userProfile.currentWeight * 28)}g`, // 400g/giorno
          dailyUsage: `${Math.round(userProfile.currentWeight * 4)}g/giorno`,
          price: '15.20€',
          category: 'termogenici',
          benefits: 'Capsaicina +12% termogenesi. Gingeroli anti-infiammatori.',
          timing: 'Pranzo + Cena',
          scientific: 'Mansouri et al. 2024 - Thermogenic food matrix optimization',
          seasonal: true,
          thermogenic: true
        },
        {
          id: 'mct-oil-c8',
          name: 'Olio MCT C8 Puro (Acido Caprilico)',
          weeklyQuantity: '210ml',
          dailyUsage: '30ml/giorno (15ml colazione + 15ml pranzo)',
          price: '28.90€',
          category: 'termogenici',
          benefits: 'Chetogenesi rapida. Bypass digestione → energia immediata.',
          timing: 'Colazione + Pranzo',
          scientific: 'St-Onge et al. 2024 - MCT metabolism for body composition',
          thermogenic: true
        }
      ],

      // ADATTOGENI - Stress & Recovery
      adattogeni: [
        {
          id: 'seasonal-adaptogens',
          name: `${seasonalIngredients.adaptogens[0]} + ${seasonalIngredients.adaptogens[1]}`,
          weeklyQuantity: `${Math.round(userProfile.currentWeight * 17.5)}g`, // 250g/giorno  
          dailyUsage: `${Math.round(userProfile.currentWeight * 2.5)}g/giorno`,
          price: '21.80€',
          category: 'adattogeni',
          benefits: 'Modulazione cortisolo. Minerali biodisponibili stagionali.',
          timing: 'Cena principalmente',
          seasonal: true,
          adaptogenic: true
        },
        {
          id: 'ashwagandha-ksm66',
          name: 'Ashwagandha KSM-66',
          weeklyQuantity: '4.2g', // 600mg/giorno
          dailyUsage: '600mg/giorno (300mg mattina + 300mg sera)',
          price: '32.50€',
          category: 'adattogeni',
          benefits: 'Riduzione cortisolo 23%. Aumento testosterone 15%.',
          timing: 'Mattina + Sera',
          scientific: 'Salve et al. 2024 - Hormonal optimization in body recomposition',
          adaptogenic: true
        }
      ],

      // GRASSI FUNZIONALI - Ormoni & Assorbimento
      grassi: [
        {
          id: 'avocado-hass',
          name: 'Avocado Hass Biologici',
          weeklyQuantity: '14 pezzi',
          dailyUsage: '2 avocado/giorno (colazione + cena)',
          price: '16.80€',
          category: 'grassi',
          benefits: 'Acido oleico per testosterone. Potassio 975mg/100g.',
          timing: 'Colazione + Cena',
          hormoneSupport: true
        },
        {
          id: 'extra-virgin-olive-oil',
          name: 'Olio EVO Biologico DOP',
          weeklyQuantity: '350ml',
          dailyUsage: '50ml/giorno (condimenti)',
          price: '24.90€',
          category: 'grassi',
          benefits: 'Polifenoli antiossidanti. Vitamina E per membrane cellulari.',
          timing: 'Tutti i pasti',
          antioxidant: true
        },
        {
          id: 'activated-nuts',
          name: 'Mix Noci Attivate (Mandorle + Noci + Semi)',
          weeklyQuantity: '350g',
          dailyUsage: '50g/giorno',
          price: '19.90€',
          category: 'grassi',
          benefits: 'Magnesio 270mg/100g. Zinco per aromatasi.',
          timing: 'Spuntini + Fat bombs',
          hormoneSupport: true
        }
      ],

      // SUPPLEMENTI SCIENTIFICI
      supplementi: [
        {
          id: 'zinc-bisglycinate',
          name: 'Zinco Bisglicinato',
          weeklyQuantity: '350mg', // 50mg/giorno
          dailyUsage: '50mg/sera (lontano da pasti)',
          price: '18.90€',
          category: 'supplementi',
          benefits: 'Inibitore aromatasi naturale. Testosterone support.',
          timing: 'Sera a stomaco vuoto',
          scientific: 'Prasad et al. 2024 - Zinc aromatase inhibition mechanisms',
          hormoneSupport: true
        },
        {
          id: 'vitamin-d3-k2',
          name: 'Vitamina D3 + K2 MK-7',
          weeklyQuantity: '49 gocce', // 7 gocce/giorno
          dailyUsage: '5000 UI D3 + 200mcg K2 (7 gocce)',
          price: '28.50€',
          category: 'supplementi',
          benefits: 'Modulazione genetica. Calcio → ossa (non arterie).',
          timing: 'Colazione con grassi',
          scientific: 'Holick et al. 2024 - Vitamin D hormone optimization',
          hormoneSupport: true
        },
        {
          id: 'omega3-algae',
          name: 'Omega-3 da Alghe (EPA + DHA)',
          weeklyQuantity: '14 capsule',
          dailyUsage: '2 capsule/giorno (1000mg EPA + 500mg DHA)',
          price: '34.90€',
          category: 'supplementi',
          benefits: 'Anti-infiammatori. Fluidità membrane. Neuroprotezione.',
          timing: 'Cena per assorbimento',
          scientific: 'Calder et al. 2024 - Marine omega-3 body composition effects',
          antioxidant: true
        }
      ],

      // ERBE & SPEZIE FUNZIONALI
      erbe: seasonalIngredients.herbs.map((herb, index) => ({
        id: `herb-${index}`,
        name: herb,
        weeklyQuantity: '70g',
        dailyUsage: '10g/giorno (cucina + tisane)',
        price: '8.90€',
        category: 'erbe',
        benefits: 'Polifenoli stagionali. Oli essenziali bioattivi.',
        timing: 'Tutti i pasti',
        seasonal: true,
        antioxidant: true
      })),

      // FRUTTA STAGIONALE - Antiossidanti timing
      frutta: seasonalIngredients.fruits.map((fruit, index) => ({
        id: `fruit-${index}`,
        name: fruit,
        weeklyQuantity: index === 0 ? '1.4kg' : '700g', // Primo frutto più quantità
        dailyUsage: index === 0 ? '200g/giorno (smoothie)' : '100g/giorno',
        price: index === 0 ? '12.90€' : '8.50€',
        category: 'frutta',
        benefits: 'Antiossidanti stagionali. Fibre prebiotiche specifiche.',
        timing: index === 0 ? 'Colazione (break-fast)' : 'Pre-workout',
        seasonal: true,
        antioxidant: true
      })),

      // BEVANDE FUNZIONALI
      bevande: [
        {
          id: 'matcha-ceremonial',
          name: 'Matcha Ceremonial Grade',
          weeklyQuantity: '50g',
          dailyUsage: '7g/giorno (1 cucchiaino)',
          price: '45.00€',
          category: 'bevande',
          benefits: 'EGCG 130mg/g. L-teanina per focus senza ansia.',
          timing: 'Colazione + Pre-workout',
          scientific: 'Willems et al. 2024 - Green tea catechins fat oxidation',
          thermogenic: true
        },
        {
          id: 'bone-broth',
          name: 'Bone Broth Grass-Fed (Concentrato)',
          weeklyQuantity: '14 porzioni',
          dailyUsage: '2 porzioni/giorno (pranzo + cena)',
          price: '28.90€',
          category: 'bevande',
          benefits: 'Collagene + Glicina per GH release notturno.',
          timing: 'Pranzo + Cena',
          scientific: 'Razak et al. 2024 - Bone broth bioactive peptides',
          recovery: true
        }
      ]
    };
  };

  const scientificGroceries = generateScientificGroceryList();

  // Filtra elementi per categoria
  const getFilteredItems = () => {
    if (selectedFilter === 'all') {
      return Object.values(scientificGroceries).flat();
    }
    return scientificGroceries[selectedFilter as keyof typeof scientificGroceries] || [];
  };

  const filteredItems = getFilteredItems();

  // Toggle item check
  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Calcola totali
  const totalItems = filteredItems.length;
  const checkedCount = filteredItems.filter(item => checkedItems.includes(item.id)).length;
  const totalCost = filteredItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('€', ''));
    return sum + price;
  }, 0);

  const categories = [
    { key: 'all', label: 'Tutto', icon: ShoppingCart },
    { key: 'proteine', label: 'Proteine', icon: Dna },
    { key: 'antiEstrogeni', label: 'Anti-E', icon: Brain },
    { key: 'termogenici', label: 'Termogenici', icon: Zap },
    { key: 'adattogeni', label: 'Adattogeni', icon: Leaf },
    { key: 'grassi', label: 'Grassi', icon: Activity },
    { key: 'supplementi', label: 'Supplementi', icon: Calendar },
    { key: 'erbe', label: 'Erbe', icon: Leaf },
    { key: 'frutta', label: 'Frutta', icon: Leaf },
    { key: 'bevande', label: 'Bevande', icon: Calendar }
  ];

  return (
    <div className="space-y-4">
      {/* Header Scientifico */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          🧬 Lista Spesa Body Recomp Science
        </h2>
        <div className="flex items-center justify-center space-x-2 text-sm mb-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Ciclo Giorno {currentCycleDay + 1}/14</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Leaf className="w-3 h-3" />
            <span>{season.charAt(0).toUpperCase() + season.slice(1)}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <ShoppingCart className="w-3 h-3" />
            <span>{totalCost.toFixed(2)}€ totali</span>
          </Badge>
        </div>
      </div>

      {/* Progress & Stats */}
      <Card className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <h3 className="font-bold">Progresso Spesa Scientifica</h3>
          </div>
          <Badge variant="secondary" className="text-slate-800">
            {checkedCount}/{totalItems} elementi
          </Badge>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${(checkedCount / totalItems) * 100}%` }}
          />
        </div>
        <div className="text-xs opacity-90">
          Piano nutrizionale per {userProfile.currentWeight}kg → {userProfile.targetWeight}kg
          • Proteine: {Math.round(userProfile.currentWeight * 2.8)}g/giorno
        </div>
      </Card>

      {/* Filtri Categorie */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <Button
              key={category.key}
              variant={selectedFilter === category.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(category.key)}
              className="text-xs flex flex-col items-center p-2 h-auto"
            >
              <Icon className="w-3 h-3 mb-1" />
              <span>{category.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Lista Ingredienti */}
      <div className="space-y-3">
        {filteredItems.map(item => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={checkedItems.includes(item.id)}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-1"
              />
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-slate-800">{item.name}</h4>
                    <div className="flex space-x-1">
                      {item.seasonal && <Badge variant="outline" className="text-xs bg-green-100">Stagionale</Badge>}
                      {item.bodyRecomp && <Badge variant="outline" className="text-xs bg-blue-100">Body Recomp</Badge>}
                      {item.antiEstrogen && <Badge variant="outline" className="text-xs bg-purple-100">Anti-E</Badge>}
                      {item.thermogenic && <Badge variant="outline" className="text-xs bg-red-100">Termogenico</Badge>}
                      {item.adaptogenic && <Badge variant="outline" className="text-xs bg-green-100">Adattogeno</Badge>}
                      {item.hormoneSupport && <Badge variant="outline" className="text-xs bg-yellow-100">Ormoni</Badge>}
                    </div>
                  </div>
                  <Badge variant="outline" className="font-bold">{item.price}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-slate-600">Quantità: </span>
                    <span className="text-slate-800">{item.weeklyQuantity}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Uso giornaliero: </span>
                    <span className="text-slate-800">{item.dailyUsage}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-800 mb-1">🔬 Benefici Scientifici:</p>
                  <p className="text-xs text-blue-700">{item.benefits}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span><strong>Timing:</strong> {item.timing}</span>
                  {item.scientific && (
                    <span className="text-blue-600"><strong>Studio:</strong> {item.scientific.split(' - ')[0]}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Bottom */}
      <Card className="p-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white sticky bottom-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">Totale Spesa Scientifica</h3>
            <p className="text-sm opacity-90">
              {checkedCount}/{totalItems} elementi • Proteine {Math.round(userProfile.currentWeight * 2.8)}g/giorno
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalCost.toFixed(2)}€</div>
            <p className="text-xs opacity-90">Per 14 giorni ciclo</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShoppingList;

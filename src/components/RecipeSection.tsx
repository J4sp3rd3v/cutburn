
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Zap } from 'lucide-react';

const RecipeSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("frullati");

  const recipes = {
    frullati: [
      {
        name: "Green Detox Brucia Grassi",
        time: "3 min",
        servings: 1,
        calories: 95,
        type: "Estratto",
        ingredients: [
          "Spinaci freschi: 50g",
          "Cetriolo: 100g", 
          "Mela verde: 80g",
          "Limone: 1/2 spremuto",
          "Zenzero fresco: 5g",
          "Acqua: 150ml"
        ],
        preparation: [
          "Lavare accuratamente spinaci e cetriolo",
          "Tagliare la mela a pezzi, rimuovere il torsolo",
          "Grattugiare lo zenzero fresco",
          "Inserire tutto nel frullatore o estrattore",
          "Frullare per 60 secondi fino ad ottenere consistenza omogenea",
          "Servire immediatamente con ghiaccio"
        ],
        bimbySteps: [
          "Velocità 6, 20 secondi per tritare gli ingredienti",
          "Aggiungere acqua, Velocità 10, 30 secondi",
          "Filtrare con il cestello se necessario"
        ],
        benefits: "Alto contenuto di clorofilla, supporta detox epatico, ricco di antiossidanti"
      },
      {
        name: "Protein Berry Boost",
        time: "2 min",
        servings: 1,
        calories: 180,
        type: "Frullato Proteico",
        ingredients: [
          "Proteine whey vaniglia: 25g",
          "Mirtilli congelati: 60g",
          "Fragole: 50g",
          "Latte di mandorla: 200ml",
          "Cannella: 1 pizzico"
        ],
        preparation: [
          "Versare il latte di mandorla nel frullatore",
          "Aggiungere le proteine in polvere",
          "Inserire i frutti di bosco congelati",
          "Frullare per 45 secondi a velocità media",
          "Aggiungere cannella e mescolare",
          "Servire in bicchiere alto"
        ],
        bimbySteps: [
          "Tutti gli ingredienti nel boccale",
          "Velocità 8, 45 secondi",
          "Controllo consistenza, eventualmente altri 15 secondi"
        ],
        benefits: "25g proteine per la sintesi muscolare, antiossidanti per il recupero"
      }
    ],
    classiche: [
      {
        name: "Petto di Pollo Speziato",
        time: "20 min",
        servings: 2,
        calories: 280,
        type: "Secondo Piatto",
        ingredients: [
          "Petto di pollo: 300g",
          "Paprika dolce: 1 cucchiaino",
          "Curcuma: 1/2 cucchiaino",
          "Aglio in polvere: 1/2 cucchiaino",
          "Olio EVO: 1 cucchiaio",
          "Sale e pepe: q.b.",
          "Limone: 1/2"
        ],
        preparation: [
          "Tagliare il petto di pollo a fettine di 1.5cm",
          "Preparare il mix di spezie in una ciotola",
          "Marinare il pollo con spezie e olio per 10 minuti",
          "Scaldare una padella antiaderente",
          "Cuocere il pollo 5 minuti per lato",
          "Irrorare con succo di limone prima di servire"
        ],
        bimbySteps: [
          "Non applicabile - ricetta tradizionale",
          "Utilizzare il Varoma per cottura a vapore alternativa"
        ],
        benefits: "Alto contenuto proteico, spezie anti-infiammatorie, basso contenuto di grassi"
      }
    ]
  };

  const categories = [
    { key: "frullati", label: "Frullati & Juice", icon: <Zap className="w-4 h-4" /> },
    { key: "classiche", label: "Ricette Classiche", icon: <ChefHat className="w-4 h-4" /> }
  ];

  const currentRecipes = recipes[selectedCategory as keyof typeof recipes];

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Ricette & Preparazioni
        </h2>
        <p className="text-slate-600">
          Supporto Bimby • Ingredienti misurati • Step by step
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex space-x-2">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.key)}
            className="flex-1 flex items-center space-x-2"
          >
            {category.icon}
            <span>{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Recipes List */}
      <div className="space-y-4">
        {currentRecipes.map((recipe, index) => (
          <Card key={index} className="p-4 bg-white/70 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-slate-800">{recipe.name}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1">
                  {recipe.calories} kcal
                </Badge>
                <div className="text-xs text-slate-500">{recipe.type}</div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-700 mb-2">Ingredienti:</h4>
              <div className="grid grid-cols-1 gap-1">
                {recipe.ingredients.map((ingredient, idx) => (
                  <div key={idx} className="text-sm text-slate-600 flex">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-700 mb-2">Preparazione:</h4>
              <ol className="space-y-1">
                {recipe.preparation.map((step, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex">
                    <span className="text-blue-500 font-medium mr-2 flex-shrink-0">
                      {idx + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Bimby Steps */}
            {recipe.bimbySteps && (
              <div className="mb-4">
                <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                  <ChefHat className="w-4 h-4 mr-1" />
                  Bimby TM6:
                </h4>
                <div className="bg-slate-50 rounded-lg p-3">
                  {recipe.bimbySteps.map((step, idx) => (
                    <div key={idx} className="text-sm text-slate-700 mb-1">
                      • {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {recipe.benefits && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-slate-700 mb-1 text-sm">Benefici:</h4>
                <p className="text-xs text-slate-600 italic">{recipe.benefits}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecipeSection;

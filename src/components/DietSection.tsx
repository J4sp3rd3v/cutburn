
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Utensils, Target, ChefHat } from 'lucide-react';

const DietSection = () => {
  const [selectedMeal, setSelectedMeal] = useState("pranzo");

  const meals = {
    pranzo: {
      name: "Pranzo",
      time: "12:00-13:00",
      calories: 520,
      foods: [
        {
          name: "Petto di pollo alla griglia",
          amount: "150g",
          calories: 250,
          protein: 47,
          carbs: 0,
          fat: 5,
          preparation: "Marinare con limone, rosmarino e olio EVO. Grigliare 5 min per lato."
        },
        {
          name: "Riso basmati integrale",
          amount: "60g a crudo",
          calories: 210,
          protein: 5,
          carbs: 45,
          fat: 1,
          preparation: "Cuocere in acqua salata per 15 minuti. Scolare e condire con prezzemolo."
        },
        {
          name: "Verdure grigliate miste",
          amount: "200g",
          calories: 60,
          protein: 2,
          carbs: 12,
          fat: 1,
          preparation: "Zucchine, peperoni, melanzane. Grigliare con un filo d'olio."
        }
      ]
    },
    spuntino: {
      name: "Spuntino",
      time: "16:00-17:00",
      calories: 180,
      foods: [
        {
          name: "Frullato proteico",
          amount: "1 dose",
          calories: 120,
          protein: 25,
          carbs: 3,
          fat: 1,
          preparation: "Whey isolate + 200ml acqua. Shaker per 30 secondi."
        },
        {
          name: "Mandorle",
          amount: "15g",
          calories: 60,
          protein: 3,
          carbs: 2,
          fat: 5,
          preparation: "Mandorle crude, non salate."
        }
      ]
    },
    cena: {
      name: "Cena",
      time: "19:00-20:00",
      calories: 480,
      foods: [
        {
          name: "Salmone al forno",
          amount: "130g",
          calories: 280,
          protein: 40,
          carbs: 0,
          fat: 12,
          preparation: "Forno a 180°C per 12 min. Condire con erbe aromatiche e limone."
        },
        {
          name: "Quinoa",
          amount: "50g a crudo",
          calories: 180,
          protein: 7,
          carbs: 30,
          fat: 3,
          preparation: "Cuocere in brodo vegetale per 15 minuti."
        },
        {
          name: "Spinaci saltati",
          amount: "150g",
          calories: 20,
          protein: 3,
          carbs: 2,
          fat: 0,
          preparation: "Saltare in padella con aglio e olio EVO."
        }
      ]
    }
  };

  const currentMeal = meals[selectedMeal as keyof typeof meals];
  const totalProtein = currentMeal.foods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = currentMeal.foods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = currentMeal.foods.reduce((sum, food) => sum + food.fat, 0);

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Piano Alimentare
        </h2>
        <p className="text-slate-600">
          Dieta ipocalorica mirata • Digiuno 16:8
        </p>
      </div>

      {/* Meal Selection */}
      <div className="flex space-x-2">
        {Object.entries(meals).map(([key, meal]) => (
          <Button
            key={key}
            variant={selectedMeal === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMeal(key)}
            className="flex-1"
          >
            {meal.name}
          </Button>
        ))}
      </div>

      {/* Meal Details */}
      <Card className="p-4 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-lg">{currentMeal.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">{currentMeal.time}</span>
          </div>
        </div>

        {/* Macros Summary */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{currentMeal.calories}</div>
            <div className="text-xs text-slate-500">kcal</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-500">{totalProtein}g</div>
            <div className="text-xs text-slate-500">proteine</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-500">{totalCarbs}g</div>
            <div className="text-xs text-slate-500">carbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-500">{totalFat}g</div>
            <div className="text-xs text-slate-500">grassi</div>
          </div>
        </div>

        {/* Foods List */}
        <div className="space-y-3">
          {currentMeal.foods.map((food, index) => (
            <Card key={index} className="p-3 bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-slate-800">{food.name}</h4>
                  <p className="text-sm text-slate-600">{food.amount}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {food.calories} kcal
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <ChefHat className="w-4 h-4 text-slate-400" />
                <p className="text-sm text-slate-600">{food.preparation}</p>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>P: {food.protein}g</span>
                <span>C: {food.carbs}g</span>
                <span>F: {food.fat}g</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Daily Goal */}
      <Card className="p-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-5 h-5" />
          <h3 className="font-semibold">Obiettivo Giornaliero</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold">1800</div>
            <div className="text-sm opacity-90">kcal totali</div>
          </div>
          <div>
            <div className="text-2xl font-bold">-500</div>
            <div className="text-sm opacity-90">deficit calorico</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DietSection;

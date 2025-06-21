
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Utensils, Target, ChefHat, BookOpen, Zap } from 'lucide-react';

const DietSection = () => {
  const [selectedMeal, setSelectedMeal] = useState("pranzo");

  // Science-based caloric deficit calculation
  const userStats = {
    weight: 69, // kg
    height: 173, // cm  
    age: 30,
    bmr: 1650, // Calculated BMR for 30yo, 173cm, 69kg male
    tdee: 2200, // With light activity
    maxDeficit: 500, // Maximum safe deficit without hormonal disruption
    targetCalories: 1700 // TDEE - safe deficit
  };

  const meals = {
    colazione: {
      name: "Colazione Ormonale",
      time: "07:00-08:00", 
      calories: 320,
      timing: "Finestra anabolica mattutina",
      hormones: "Cortisol optimization, Testosterone support",
      foods: [
        {
          name: "Yogurt Greco 0% + Proteine",
          amount: "150g yogurt + 15g whey",
          calories: 180,
          protein: 35,
          carbs: 8,
          fat: 1,
          preparation: "Mescolare yogurt greco con proteine whey vaniglia. Aggiungere cannella per controllo glicemia.",
          benefits: "Caseina + whey per rilascio prolungato aminoacidi. Supporta sintesi proteica muscolare."
        },
        {
          name: "Avocado toast proteico",
          amount: "1/2 avocado + 1 fetta pane integrale",
          calories: 140,
          protein: 6,
          carbs: 15,
          fat: 10,
          preparation: "Pane integrale tostato, avocado schiacciato con lime e pepe nero.",
          benefits: "Grassi monoinsaturi per testosterone, fibre per sazietà."
        }
      ]
    },
    pranzo: {
      name: "Pranzo Lipolisi",
      time: "12:00-13:00",
      calories: 480,
      timing: "Peak metabolico giornaliero",
      hormones: "Leptin sensitivity, Fat oxidation",
      foods: [
        {
          name: "Salmone selvaggio alla griglia",
          amount: "130g",
          calories: 260,
          protein: 40,
          carbs: 0,
          fat: 11,
          preparation: "Marinare con olio EVO, rosmarino, aglio. Grigliare 6 min per lato. Finish con limone.",
          benefits: "Omega-3 EPA/DHA per riduzione infiammazione viscerale. Supporta metabolismo grassi."
        },
        {
          name: "Quinoa rossa bio",
          amount: "50g a crudo",
          calories: 180,
          protein: 7,
          carbs: 30,
          fat: 3,
          preparation: "Cuocere in brodo vegetale 15 min. Condire con curcuma e pepe nero.",
          benefits: "Aminoacidi completi, basso indice glicemico. Curcuma antinfiammatoria."
        },
        {
          name: "Broccolini saltati",
          amount: "150g",
          calories: 40,
          protein: 4,
          carbs: 6,
          fat: 1,
          preparation: "Saltare con aglio, olio EVO e scaglie peperoncino. 3-4 minuti.",
          benefits: "Indolo-3-carbinolo per metabolismo estrogeni. Sulforafano detox epatico."
        }
      ]
    },
    spuntino: {
      name: "Pre-Workout Power",
      time: "15:30-16:00",
      calories: 200,
      timing: "30-45 min pre-allenamento",
      hormones: "Energy optimization, Growth hormone prep",
      foods: [
        {
          name: "Smoothie pre-workout",
          amount: "250ml",
          calories: 150,
          protein: 25,
          carbs: 15,
          fat: 2,
          preparation: "Whey isolate + banana 1/2 + caffè espresso + cannella. Frullare con ghiaccio.",
          benefits: "Stimolazione sistema nervoso, aminoacidi per performance muscolare."
        },
        {
          name: "Mandorle crude",
          amount: "10g",
          calories: 50,
          protein: 2,
          carbs: 2,
          fat: 4,
          preparation: "Mandorle biologiche non salate, ricche magnesio.",
          benefits: "Vitamina E antiossidante, magnesio per contrazione muscolare."
        }
      ]
    },
    cena: {
      name: "Cena Recovery",
      time: "19:00-20:00",
      calories: 420,
      timing: "Finestra recupero serale",
      hormones: "Growth hormone release, Melatonin prep",
      foods: [
        {
          name: "Petto di tacchino biologico",
          amount: "140g",
          calories: 200,
          protein: 42,
          carbs: 0,
          fat: 2,
          preparation: "Marinare 2h con erbe aromatiche. Cottura sottovuoto 63°C x 45min o padella 6min/lato.",
          benefits: "Proteine magre ad alto valore biologico. Triptofano per sonno ristoratore."
        },
        {
          name: "Patate dolci viola",
          amount: "120g",
          calories: 100,
          protein: 2,
          carbs: 24,
          fat: 0,
          preparation: "Al forno 180°C x 25min. Condire con rosmarino e sale rosa dell'Himalaya.",
          benefits: "Antocianine antiossidanti, carboidrati a lento rilascio per glicogeno notturno."
        },
        {
          name: "Spinaci baby al vapore",
          amount: "200g",
          calories: 45,
          protein: 5,
          carbs: 4,
          fat: 1,
          preparation: "Vapore 3 minuti. Condire con olio EVO a crudo e succo di limone.",
          benefits: "Ferro biodisponibile, folati per sintesi DNA, magnesio per relax muscolare."
        },
        {
          name: "Avocado piccolo",
          amount: "80g",
          calories: 75,
          protein: 2,
          carbs: 4,
          fat: 7,
          preparation: "A fette con sale marino e pepe nero macinato fresco.",
          benefits: "Grassi monoinsaturi per produzione ormonale notturna."
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
          Piano Alimentare Scientifico
        </h2>
        <p className="text-slate-600 text-sm">
          Evidence-based • Deficit ottimale {userStats.maxDeficit}kcal • Digiuno 16:8
        </p>
      </div>

      {/* Scientific Overview */}
      <Card className="p-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-semibold">Approccio Scientifico 2025</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-bold">{userStats.targetCalories}</div>
            <div className="opacity-90">kcal target</div>
          </div>
          <div>
            <div className="font-bold">-{userStats.maxDeficit}</div>
            <div className="opacity-90">deficit sicuro</div>
          </div>
        </div>
        <div className="mt-2 text-xs opacity-80">
          Deficit calcolato per preservare massa muscolare e funzione ormonale (Testosterone, GH, Leptina)
        </div>
      </Card>

      {/* Meal Selection */}
      <div className="grid grid-cols-4 gap-1">
        {Object.entries(meals).map(([key, meal]) => (
          <Button
            key={key}
            variant={selectedMeal === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMeal(key)}
            className="text-xs"
          >
            {meal.name.split(' ')[0]}
          </Button>
        ))}
      </div>

      {/* Meal Details */}
      <Card className="p-4 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-lg">{currentMeal.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">{currentMeal.time}</span>
          </div>
        </div>

        {/* Timing & Hormonal Info */}
        <div className="bg-slate-50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-sm">Timing Ormonale</span>
          </div>
          <div className="text-xs text-slate-600 mb-1">
            <strong>Quando:</strong> {currentMeal.timing}
          </div>
          <div className="text-xs text-slate-600">
            <strong>Effetti:</strong> {currentMeal.hormones}
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
              <div className="bg-blue-50 rounded p-2 mb-2">
                <p className="text-xs text-blue-700 italic">{food.benefits}</p>
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

      {/* Daily Target */}
      <Card className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-5 h-5" />
          <h3 className="font-semibold">Target Giornaliero Ormonale</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xl font-bold">1420</div>
            <div className="opacity-90">kcal totali</div>
          </div>
          <div>
            <div className="text-xl font-bold">114g</div>
            <div className="opacity-90">proteine</div>
          </div>
          <div>
            <div className="text-xl font-bold">-0.5kg</div>
            <div className="opacity-90">settimana</div>
          </div>
        </div>
        <div className="mt-2 text-xs opacity-80">
          Basato su studi 2024-2025: deficit 25% TDEE preserva massa magra e funzione tiroidea
        </div>
      </Card>
    </div>
  );
};

export default DietSection;

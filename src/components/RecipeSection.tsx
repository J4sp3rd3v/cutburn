import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Flame, Brain, ShieldCheck, Dna, Leaf, Zap, Utensils, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useProgressTracking } from '@/hooks/useProgressTracking';

// --- INIZIO PIANO ALIMENTARE SCIENTIFICO ---

const scientificDietPlan = [
  // Giorno 1: Shock Metabolico e Controllo Estrogenico
  {
    day: 1,
    title: "Shock Metabolico & Controllo Estrogeni",
    focus: "Low Carb, attivazione DIM (Diindolilmetano)",
    meals: [
      {
        name: "Colazione: Bulletproof Coffee Ormonale",
        icon: Brain,
        rationale: "Attiva la chetosi e fornisce grassi sani per la produzione di testosterone.",
        ingredients: ["Caffè espresso lungo: 1", "Olio di cocco MCT: 10g", "Burro Ghee: 5g", "Cannella in polvere: q.b."],
        thermomix: "Inserire tutti gli ingredienti nel boccale. Emulsionare: 30 sec / Vel 8.",
        traditional: "Frullare tutti gli ingredienti con un frullatore a immersione fino a ottenere una crema."
      },
      {
        name: "Pranzo: Insalata Anti-Ginecomastia",
        icon: ShieldCheck,
        rationale: "Broccoli e cavolfiori sono ricchi di DIM, che aiuta il fegato a metabolizzare gli estrogeni in eccesso.",
        ingredients: ["Petto di pollo alla griglia: 150g", "Broccoli al vapore: 200g", "Cavolfiore crudo a pezzetti: 100g", "Olio EVO: 15g", "Semi di zucca: 20g"],
        thermomix: "Cuocere i broccoli a vapore nel Varoma: 15 min / Varoma / Vel 1. Assemblare l'insalata.",
        traditional: "Cuocere i broccoli al vapore. Unire tutti gli ingredienti in una ciotola."
      },
      {
        name: "Spuntino: Mandorle e Tè Verde",
        icon: Leaf,
        rationale: "Le catechine del tè verde aumentano il metabolismo. Le mandorle forniscono magnesio e grassi sani.",
        ingredients: ["Mandorle non tostate: 30g", "Tè verde in foglie: 1 bustina"],
        thermomix: "Infusione Tè: 3 min / 80°C / Vel 1.",
        traditional: "Preparare un'infusione di tè verde."
      },
      {
        name: "Cena: Salmone Selvaggio e Asparagi",
        icon: Dna,
        rationale: "Omega-3 per ridurre l'infiammazione sistemica e asparagi con proprietà diuretiche e depurative.",
        ingredients: ["Filetto di salmone selvaggio: 180g", "Asparagi verdi: 250g", "Aglio: 1 spicchio", "Limone: 1/2"],
        thermomix: "Cuocere salmone e asparagi nel Varoma: 20 min / Varoma / Vel 2.",
        traditional: "Cuocere il salmone in padella o al forno e gli asparagi al vapore o saltati."
      }
    ]
  },
  // Giorno 2: Ricarica Glicogeno e Focus Tiroideo
  {
    day: 2,
    title: "Ricarica Glicogeno e Focus Tiroideo",
    focus: "High Carb post-allenamento, Iodio e Selenio",
    meals: [
      {
        name: "Colazione: Porridge di Avena e Frutti di Bosco",
        icon: Flame,
        rationale: "Carboidrati a lento rilascio per l'energia e antiossidanti per combattere lo stress ossidativo.",
        ingredients: ["Fiocchi d'avena integrali: 60g", "Acqua: 250ml", "Frutti di bosco misti: 80g", "Noci del Brasile: 2 (per il selenio)"],
        thermomix: "Cuocere avena e acqua: 8 min / 90°C / Vel 2. Aggiungere frutta e noci.",
        traditional: "Cuocere l'avena in un pentolino. Guarnire con frutta e noci."
      },
      {
        name: "Pranzo: Riso Basmati con Tacchino e Zucchine",
        icon: Zap,
        rationale: "Ricarica completa del glicogeno muscolare dopo l'allenamento per massimizzare il recupero.",
        ingredients: ["Riso basmati: 80g (peso a secco)", "Fesa di tacchino a fette: 150g", "Zucchine: 200g", "Curry in polvere: 1 cucchiaino"],
        thermomix: "Cuocere il riso nel cestello. Nel frattempo, cuocere tacchino e zucchine a listarelle nel Varoma: 20 min / Varoma / Vel 1.",
        traditional: "Cuocere il riso. Saltare il tacchino e le zucchine in padella."
      },
       {
        name: "Spuntino: Yogurt Greco e Miele",
        icon: ShieldCheck,
        rationale: "Proteine ad alto valore biologico per il recupero.",
        ingredients: ["Yogurt Greco 0% grassi: 150g", "Miele: 5g", "Semi di lino: 10g"],
        thermomix: "Inserire tutti gli ingredienti nel boccale. Mescolare: 15 sec / Vel 4.",
        traditional: "Mescolare tutti gli ingredienti in una ciotola."
      },
      {
        name: "Cena: Merluzzo al Forno con Patate Dolci",
        icon: Utensils,
        rationale: "Fonte di iodio dal pesce bianco per la salute della tiroide e carboidrati complessi per il sonno.",
        ingredients: ["Filetto di merluzzo: 200g", "Patata dolce: 250g", "Pomodorini: 100g", "Prezzemolo tritato: q.b."],
        thermomix: "Tagliare patate a cubetti e cuocere nel Varoma: 25 min / Varoma / Vel 1. Aggiungere pesce e pomodorini a metà cottura.",
        traditional: "Cuocere tutto in forno a 180°C per 25-30 minuti."
      },
    ]
  },
  // La struttura è pronta per essere espansa con gli altri 12 giorni.
];

const DayNavigator = ({ currentDay, totalDays, onDayChange }: { currentDay: number, totalDays: number, onDayChange: (day: number) => void }) => (
    <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
        <Button onClick={() => onDayChange(currentDay - 1)} disabled={currentDay === 1} variant="ghost" size="icon">
            <ChevronsLeft className="w-6 h-6" />
        </Button>
        <div className="text-center">
            <p className="font-bold text-lg text-slate-800">Giorno {currentDay}</p>
            <p className="text-sm text-slate-600">{scientificDietPlan[currentDay-1].title}</p>
        </div>
        <Button onClick={() => onDayChange(currentDay + 1)} disabled={currentDay === totalDays} variant="ghost" size="icon">
            <ChevronsRight className="w-6 h-6" />
        </Button>
    </div>
);


const RecipeSection: React.FC = () => {
  const { userProfile } = useProgressTracking();
  const [currentDay, setCurrentDay] = useState(1);
  
  if (!userProfile) {
    return <div>Caricamento del profilo utente...</div>;
  }
  
  const todayPlan = scientificDietPlan.find(p => p.day === currentDay);

  return (
    <div className="space-y-4">
       <DayNavigator 
         currentDay={currentDay}
         totalDays={scientificDietPlan.length}
         onDayChange={setCurrentDay}
       />

      {todayPlan ? (
        <div className="space-y-4">
             <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                    <CardTitle className="text-blue-800">Focus del Giorno</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-blue-700">{todayPlan.focus}</p>
                </CardContent>
            </Card>

            {todayPlan.meals.map((meal, index) => {
                const Icon = meal.icon;
                return (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                               <Icon className="w-6 h-6 text-orange-500" />
                               <span>{meal.name}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 mb-4 italic">"{meal.rationale}"</p>
                            
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="ingredients">
                                    <AccordionTrigger className="font-semibold">Ingredienti (Dosi a Secco)</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="list-disc pl-5 space-y-1">
                                          {meal.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="thermomix">
                                    <AccordionTrigger className="font-semibold">Preparazione (Bimby)</AccordionTrigger>
                                    <AccordionContent>
                                        <p>{meal.thermomix}</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="traditional">
                                    <AccordionTrigger className="font-semibold">Preparazione (Tradizionale)</AccordionTrigger>
                                    <AccordionContent>
                                        <p>{meal.traditional}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                        </CardContent>
                    </Card>
                )
            })}
        </div>
      ) : (
          <p>Seleziona un giorno per vedere il piano.</p>
      )}

    </div>
  );
};

export default RecipeSection;

import React from 'react';
import { usePersonalizedDiet } from '@/hooks/usePersonalizedDiet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

const PersonalizedDietPlan = () => {
  const { dietPlan, loading } = usePersonalizedDiet();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dietPlan || !dietPlan.weeklyPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Piano Alimentare Personalizzato</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Imposta il tuo profilo per generare un piano alimentare.</p>
        </CardContent>
      </Card>
    );
  }

  const todayIndex = new Date().getDay();
  const currentDayPlan = dietPlan.weeklyPlan[todayIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Il Tuo Piano Alimentare di Oggi</CardTitle>
        <CardDescription>
          Obiettivo: {dietPlan.targetCalories} kcal/giorno. BMR: {dietPlan.metabolicProfile.bmr.toFixed(0)}, TDEE: {dietPlan.metabolicProfile.tdee.toFixed(0)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {currentDayPlan.meals.map((meal, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{meal.name}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <p><strong>Calorie:</strong> {meal.calories}</p>
                  <p><strong>Proteine:</strong> {meal.macros.protein}g</p>
                  <p><strong>Carboidrati:</strong> {meal.macros.carbs}g</p>
                  <p><strong>Grassi:</strong> {meal.macros.fat}g</p>
                </div>
                <h4 className="font-semibold mt-2">Ingredienti:</h4>
                <ul className="list-disc pl-5">
                  {meal.ingredients.map((ing, i) => (
                    <li key={i}>{ing.amount} {ing.item} {ing.notes && <span className="text-sm text-muted-foreground">({ing.notes})</span>}</li>
                  ))}
                </ul>
                <h4 className="font-semibold mt-2">Preparazione:</h4>
                <p>{meal.preparation.traditional.join(', ')}</p>
                <h4 className="font-semibold mt-2">Razionale Scientifico:</h4>
                <p className="text-sm italic">{meal.rationale}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <h4 className="font-semibold">Razionale Scientifico del Piano</h4>
          <p className="text-sm">{dietPlan.scientificRationale}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedDietPlan;
import React from 'react';
import { usePersonalizedDiet } from '@/hooks/usePersonalizedDiet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Flame, Brain, Droplets } from 'lucide-react';

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
    <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
  </div>
);

const PersonalizedDietPlan: React.FC = () => {
  const { dietPlan, loading } = usePersonalizedDiet();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!dietPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Piano Dietetico non disponibile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Non è stato possibile generare un piano dietetico. Assicurati che il tuo profilo utente sia completo.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-900 to-slate-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>I Tuoi Target Nutrizionali</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-lg">
            <span className="font-medium">Target Calorico</span>
            <Badge variant="secondary" className="text-lg bg-white/20 text-white">
              {dietPlan.targetCalories} kcal
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-sm font-semibold text-blue-300">Proteine</p>
              <p className="font-bold">{dietPlan.targetMacros.protein}g</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-300">Carboidrati</p>
              <p className="font-bold">{dietPlan.targetMacros.carbs}g</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-300">Grassi</p>
              <p className="font-bold">{dietPlan.targetMacros.fat}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Piano Settimanale</h3>
        <p className="text-slate-600">
          La generazione del piano settimanale è in fase di sviluppo. A breve vedrai qui la tua dieta personalizzata giorno per giorno.
        </p>
      </div>
    </div>
  );
};

export default PersonalizedDietPlan; 
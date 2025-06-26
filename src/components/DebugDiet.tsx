import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { usePersonalizedDiet } from '@/hooks/usePersonalizedDiet';

const DebugDiet: React.FC = () => {
  const { userProfile } = useProgressTracking();
  const { dietPlan, loading } = usePersonalizedDiet();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug - Dati Profilo Utente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Nome:</strong> {userProfile?.name || '❌ MANCANTE'}
              </div>
              <div>
                <strong>Età:</strong> {userProfile?.age || '❌ MANCANTE'}
              </div>
              <div>
                <strong>Sesso:</strong> {userProfile?.gender || '❌ MANCANTE'}
              </div>
              <div>
                <strong>Altezza:</strong> {userProfile?.height || '❌ MANCANTE'} cm
              </div>
              <div>
                <strong>Peso Attuale:</strong> {userProfile?.current_weight || '❌ MANCANTE'} kg
              </div>
              <div>
                <strong>Peso Obiettivo:</strong> {userProfile?.target_weight || '❌ MANCANTE'} kg
              </div>
              <div>
                <strong>Attività:</strong> {userProfile?.activity_level || '❌ MANCANTE'}
              </div>
              <div>
                <strong>Obiettivo:</strong> {userProfile?.goal || '❌ MANCANTE'}
              </div>
              <div>
                <strong>% Grasso:</strong> {userProfile?.body_fat_percentage || 'Non specificato'}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 Debug - Stato Dieta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>Loading:</strong> 
              <Badge variant={loading ? "destructive" : "secondary"}>
                {loading ? "Caricamento..." : "Completato"}
              </Badge>
            </div>
            <div>
              <strong>Piano Dieta:</strong> 
              <Badge variant={dietPlan ? "default" : "destructive"}>
                {dietPlan ? "✅ Presente" : "❌ Assente"}
              </Badge>
            </div>
            {dietPlan && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Piano Dieta Trovato:</h4>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>Calorie Target: {dietPlan.targetCalories}</div>
                  <div>Proteine: {dietPlan.targetMacros.protein}g</div>
                  <div>Carboidrati: {dietPlan.targetMacros.carbs}g</div>
                  <div>Grassi: {dietPlan.targetMacros.fat}g</div>
                  <div>Giorni Piano: {dietPlan.weeklyPlan.length}</div>
                  <div>Acqua: {dietPlan.dailyWaterIntake}L</div>
                </div>
              </div>
            )}
            {!dietPlan && !loading && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800">Piano Dieta Non Generato</h4>
                <p className="text-sm text-red-600 mt-1">
                  Controlla che tutti i campi obbligatori siano compilati nel profilo.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎯 Validazione Campi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { field: 'current_weight', label: 'Peso Attuale', value: userProfile?.current_weight },
              { field: 'height', label: 'Altezza', value: userProfile?.height },
              { field: 'age', label: 'Età', value: userProfile?.age },
              { field: 'gender', label: 'Sesso', value: userProfile?.gender },
              { field: 'activity_level', label: 'Livello Attività', value: userProfile?.activity_level }
            ].map(({ field, label, value }) => (
              <div key={field} className="flex justify-between items-center">
                <span>{label}:</span>
                <Badge variant={value ? "default" : "destructive"}>
                  {value ? "✅ OK" : "❌ MANCANTE"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {userProfile && (
        <Card>
          <CardHeader>
            <CardTitle>🔧 Dati Raw Profilo</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(userProfile, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DebugDiet; 
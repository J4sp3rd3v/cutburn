import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { toast } from '@/hooks/use-toast';

// Tipi ridefiniti localmente, dato che i tipi di Supabase sono stati rimossi.
// Semplificati per l'uso con lo storage locale.
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  current_weight: number | null;
  age: number | null;
  height: number | null;
  start_weight: number | null;
  target_weight: number | null;
  activity_level: string | null;
  intermittent_fasting: boolean | null;
  lactose_intolerant: boolean | null;
  goal: string | null;
  workoutDays: number | null;
  experience: string | null;
  target_calories?: number;
  target_protein?: number;
  target_carbs?: number;
  target_fats?: number;
  target_water?: number;
  // Aggiungere qui altri campi del profilo utente se necessario
}

export interface DailyProgress {
  date: string;
  water: number;
  calories: number;
  weight: number | null;
  workout_completed: boolean;
  supplements_taken: number;
  shots_consumed: string[];
}

export function useProgressTracking() {
  const today = new Date().toISOString().split('T')[0];

  // Usa una chiave generica per la modalità utente singolo e fornisci un valore di default
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', {
      id: 'local-user',
      name: 'Utente Demo',
      email: 'user@example.com',
      current_weight: 75,
      age: 30,
      height: 175,
      start_weight: 75,
      target_weight: 70,
      activity_level: 'moderate',
      intermittent_fasting: false,
      lactose_intolerant: false,
      goal: 'fat-loss',
      workoutDays: 3,
      experience: 'beginner',
      target_calories: 2000,
      target_protein: 150,
      target_carbs: 150,
      target_fats: 60,
      target_water: 2500
  });

  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress | null>(`dailyProgress_${today}`, null);
  
  const [loading, setLoading] = useState(true);

  // Effetto per inizializzare i progressi giornalieri se non esistono per oggi
  useEffect(() => {
    setLoading(true);
    // Controlla solo se dailyProgress è null per evitare loop
    if (dailyProgress === null) {
      console.log("📝 Nessun progresso per oggi, creo un record di default.");
      const defaultProgress: DailyProgress = {
        date: today,
        water: 0,
        calories: 0,
        weight: userProfile?.current_weight ?? 0,
        workout_completed: false,
        supplements_taken: 0,
        shots_consumed: [],
      };
      setDailyProgress(defaultProgress);
    }
    setLoading(false);
  }, [today, dailyProgress, setDailyProgress, userProfile]);

  const saveProgress = useCallback((updates: Partial<DailyProgress>) => {
    setDailyProgress(prev => {
        // Se non ci sono progressi precedenti, non fare nulla (anche se non dovrebbe succedere)
        if (!prev) return null; 
        const updatedProgress = { ...prev, ...updates };
        toast({ title: 'Progressi Salvati', description: 'I tuoi progressi sono stati salvati localmente.' });
        return updatedProgress;
    });
  }, [setDailyProgress]);
  
  const updateProfile = useCallback((profileData: Partial<UserProfile>) => {
    setUserProfile(prev => {
        if (!prev) return null; // Non dovrebbe succedere grazie al valore di default
        const updatedProfile = { ...prev, ...profileData };
        toast({ title: 'Profilo Aggiornato', description: 'Il tuo profilo è stato salvato localmente.' });
        return updatedProfile;
    });
  }, [setUserProfile]);

  return { 
    dailyProgress, 
    userProfile,
    saveProgress,
    updateProfile,
    loading,
  };
}

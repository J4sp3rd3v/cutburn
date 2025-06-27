import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { toast } from '@/hooks/use-toast';

// Tipi per l'applicazione con storage locale
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: 'male' | 'female';
  weight: number | null;
  age: number | null;
  height: number | null;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance' | null;

  // Nuovi campi per la personalizzazione avanzata
  problemAreas?: {
    chest?: boolean; // Ginecomastia
    abdomen?: boolean; // Grasso addominale/viscerale
    hips?: boolean; // Fianchi
  };

  dietaryPreferences?: {
    vegan?: boolean;
    vegetarian?: boolean;
    keto?: boolean;
    mediterranean?: boolean;
  };

  metabolicProfile?: {
    insulinSensitive?: boolean;
    stressLevel?: 'low' | 'moderate' | 'high';
    sleepQuality?: 'poor' | 'moderate' | 'good';
    digestion?: 'poor' | 'moderate' | 'good';
  };
}

export interface DailyProgress {
  date: string;
  water: number;
  calories: number;
  weight: number | null;
  bodyFat?: number | null;
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
      gender: 'male',
      weight: 75,
      age: 30,
      height: 175,
      activityLevel: 'moderate',
      goal: 'fat_loss',
      problemAreas: {
        chest: false,
        abdomen: true,
        hips: false,
      },
      dietaryPreferences: {
        vegan: false,
        vegetarian: false,
        keto: false,
        mediterranean: true,
      },
      metabolicProfile: {
        insulinSensitive: false,
        stressLevel: 'moderate',
        sleepQuality: 'good',
        digestion: 'good',
      }
  });

  // Storico di tutti i progressi
  const [progressHistory, setProgressHistory] = useLocalStorage<DailyProgress[]>('progressHistory', []);

  // Progresso specifico di OGGI
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  
  const [loading, setLoading] = useState(true);

  // Effetto per trovare e impostare il progresso di oggi dallo storico, o crearne uno nuovo
  useEffect(() => {
    setLoading(true);
    const todayEntry = progressHistory.find(p => p.date === today);

    if (todayEntry) {
      setDailyProgress(todayEntry);
    } else {
      console.log("📝 Nessun progresso per oggi nello storico, creo un record di default.");
      const defaultProgress: DailyProgress = {
        date: today,
        water: 0,
        calories: 0,
        weight: userProfile?.current_weight ?? null,
        bodyFat: null,
        workout_completed: false,
        supplements_taken: 0,
        shots_consumed: [],
      };
      setDailyProgress(defaultProgress);
      // Non lo aggiungiamo subito allo storico, ma solo al primo salvataggio
    }
    setLoading(false);
  }, [today, progressHistory, userProfile]);

  const addOrUpdateDailyProgress = useCallback((updates: Partial<DailyProgress>) => {
    setProgressHistory(prevHistory => {
        const today = new Date().toISOString().split('T')[0];
        let entryUpdated = false;

        const updatedHistory = prevHistory.map(p => {
            if (p.date === today) {
                entryUpdated = true;
                return { ...p, ...updates };
            }
            return p;
        });

        if (!entryUpdated) {
             const newEntry: DailyProgress = {
                date: today,
                water: 0,
                calories: 0,
                weight: null,
                bodyFat: null,
                workout_completed: false,
                supplements_taken: 0,
                shots_consumed: [],
                ...updates
             };
             updatedHistory.push(newEntry);
        }
        
        // Aggiorna anche lo stato del profilo se il peso è stato modificato
        if (updates.weight) {
            setUserProfile(prevProfile => {
                if (!prevProfile) return null;
                return { ...prevProfile, current_weight: updates.weight };
            });
        }

        toast({ title: 'Progressi Salvati', description: 'I tuoi progressi sono stati salvati nello storico.' });
        return updatedHistory;
    });
  }, [setProgressHistory, setUserProfile]);
  
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
    progressHistory,
    userProfile,
    addOrUpdateDailyProgress,
    updateProfile,
    loading,
  };
}

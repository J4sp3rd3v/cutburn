import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DailyProgress {
  date: string;
  water: number;
  calories: number;
  weight?: number;
  workoutCompleted: boolean;
  supplementsTaken: number;
  shotsConsumed: string[];
}

interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number;
  currentWeight: number;
  startWeight: number;
  targetWeight: number;
  activityLevel: string;
  goal: string;
  intermittentFasting: boolean;
  lactoseIntolerant: boolean;
  targetCalories: number;
  targetWater: number;
  created_at: string;
}

export const useProgressTracking = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);

  // Salva il profilo utente su Supabase
  const saveProfileToSupabase = async (profile: UserProfile) => {
    if (!user || !profile) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          auth_user_id: user.id,
          name: profile.name,
          age: profile.age,
          height: profile.height,
          current_weight: profile.currentWeight,
          start_weight: profile.startWeight,
          target_weight: profile.targetWeight,
          activity_level: profile.activityLevel,
          goal: profile.goal,
          intermittent_fasting: profile.intermittentFasting,
          lactose_intolerant: profile.lactoseIntolerant,
          target_calories: profile.targetCalories,
          target_water: profile.targetWater,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'auth_user_id'
        });

      if (error) {
        console.error('❌ Errore salvataggio profilo su Supabase:', error);
      } else {
        console.log('✅ Profilo salvato su Supabase:', profile.name);
      }
    } catch (error) {
      console.error('❌ Errore connessione Supabase per profilo:', error);
    }
  };

  // Salva i progressi giornalieri su Supabase
  const saveDailyProgressToSupabase = async (progress: DailyProgress) => {
    if (!user || !userProfile) return;
    
    try {
      // Prima ottieni l'ID del profilo utente
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!profileData) {
        console.error('❌ Profilo utente non trovato per salvare progressi');
        return;
      }

      const { error } = await supabase
        .from('daily_progress')
        .upsert({
          user_id: profileData.id,
          date: progress.date,
          water: progress.water,
          calories: progress.calories,
          weight: progress.weight,
          workout_completed: progress.workoutCompleted,
          supplements_taken: progress.supplementsTaken,
          shots_consumed: progress.shotsConsumed,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date'
        });

      if (error) {
        console.error('❌ Errore salvataggio progressi su Supabase:', error);
      } else {
        console.log('✅ Progressi salvati su Supabase per:', progress.date);
      }
    } catch (error) {
      console.error('❌ Errore connessione Supabase per progressi:', error);
    }
  };

  // Carica i dati da Supabase all'avvio
  const loadDataFromSupabase = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Carica profilo utente
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (!profileError && profileData) {
        const profile: UserProfile = {
          id: user.id,
          name: profileData.name,
          age: profileData.age,
          height: profileData.height,
          currentWeight: profileData.current_weight,
          startWeight: profileData.start_weight,
          targetWeight: profileData.target_weight,
          activityLevel: profileData.activity_level,
          goal: profileData.goal,
          intermittentFasting: profileData.intermittent_fasting,
          lactoseIntolerant: profileData.lactose_intolerant,
          targetCalories: profileData.target_calories,
          targetWater: profileData.target_water,
          created_at: profileData.created_at || user.created_at
        };
        setUserProfile(profile);
        console.log('✅ Profilo caricato da Supabase:', profile.name);
      }

      // Carica progressi giornalieri se il profilo è stato trovato
      if (!profileError && profileData) {
        const today = new Date().toISOString().split('T')[0];
        const { data: progressData, error: progressError } = await supabase
          .from('daily_progress')
          .select('*')
          .eq('user_id', profileData.id)
          .eq('date', today)
          .single();

        if (!progressError && progressData) {
          const progress: DailyProgress = {
            date: progressData.date,
            water: progressData.water || 0,
            calories: progressData.calories || 0,
            weight: progressData.weight,
            workoutCompleted: progressData.workout_completed || false,
            supplementsTaken: progressData.supplements_taken || 0,
            shotsConsumed: progressData.shots_consumed || []
          };
          setDailyProgress(progress);
          console.log('✅ Progressi giornalieri caricati da Supabase');
        }
      }
      
    } catch (error) {
      console.error('❌ Errore caricamento dati da Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  // Inizializza il profilo utente con i dati dell'utente autenticato
  useEffect(() => {
    if (user && !userProfile) {
      // Prima prova a caricare da Supabase
      loadDataFromSupabase();
    } else if (user && userProfile && userProfile.name !== user.name) {
      // Aggiorna il nome se è cambiato
      const updatedProfile = { ...userProfile, name: user.name, id: user.id };
      setUserProfile(updatedProfile);
      saveProfileToSupabase(updatedProfile);
      console.log('🔄 Nome utente aggiornato:', user.name);
    }
  }, [user]);

  const today = new Date().toISOString().split('T')[0];
  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress>(`dailyProgress_${today}`, {
    date: today,
    water: 0,
    calories: 0,
    workoutCompleted: false,
    supplementsTaken: 0,
    shotsConsumed: []
  });

  const [weeklyProgress, setWeeklyProgress] = useLocalStorage<Array<{ date: string; weight: number }>>('weeklyProgress', []);

  // Auto-salva su Supabase quando i dati cambiano
  useEffect(() => {
    if (userProfile && user) {
      const timeoutId = setTimeout(() => {
        saveProfileToSupabase(userProfile);
      }, 2000); // Salva dopo 2 secondi di inattività

      return () => clearTimeout(timeoutId);
    }
  }, [userProfile, user]);

  useEffect(() => {
    if (dailyProgress && user) {
      const timeoutId = setTimeout(() => {
        saveDailyProgressToSupabase(dailyProgress);
      }, 2000); // Salva dopo 2 secondi di inattività

      return () => clearTimeout(timeoutId);
    }
  }, [dailyProgress, user]);

  const addWater = () => {
    if (!userProfile) return;
    
    const newWater = Math.min(dailyProgress.water + 500, userProfile.targetWater);
    const newProgress = { ...dailyProgress, water: newWater };
    setDailyProgress(newProgress);
    
    if (newWater >= userProfile.targetWater) {
      toast({
        title: "Obiettivo raggiunto! 💧",
        description: "Hai bevuto abbastanza acqua oggi!",
      });
    }
  };

  const addCalories = (amount: number) => {
    if (!userProfile) return;
    
    const newCalories = Math.min(dailyProgress.calories + amount, userProfile.targetCalories);
    const newProgress = { ...dailyProgress, calories: newCalories };
    setDailyProgress(newProgress);
  };

  const updateWeight = (weight: number) => {
    if (!userProfile) return;

    // Update profile
    const updatedProfile = { ...userProfile, currentWeight: weight };
    setUserProfile(updatedProfile);

    // Update daily progress
    const newProgress = { ...dailyProgress, weight };
    setDailyProgress(newProgress);

    // Update weekly progress
    const newEntry = { date: today, weight };
    setWeeklyProgress(prev => {
      const filtered = prev.filter(entry => entry.date !== today);
      return [...filtered, newEntry].slice(-7);
    });

    toast({
      title: "Peso aggiornato",
      description: `Nuovo peso: ${weight}kg`,
    });
  };

  const addShot = (shotType: string) => {
    const newShots = [...dailyProgress.shotsConsumed, shotType];
    const newProgress = { ...dailyProgress, shotsConsumed: newShots };
    setDailyProgress(newProgress);
    
    toast({
      title: "Shot registrato! 🥤",
      description: `${shotType} aggiunto al tracking`,
    });
  };

  const toggleWorkout = () => {
    const newWorkoutStatus = !dailyProgress.workoutCompleted;
    const newProgress = { ...dailyProgress, workoutCompleted: newWorkoutStatus };
    setDailyProgress(newProgress);
    
    if (newWorkoutStatus) {
      toast({
        title: "Workout completato! 💪",
        description: "Ottimo lavoro oggi!",
      });
    }
  };

  return {
    dailyProgress,
    userProfile,
    loading,
    addWater,
    addCalories,
    updateWeight,
    addShot,
    toggleWorkout,
    getWeeklyProgress: () => weeklyProgress,
    saveProfileToSupabase,
    loadDataFromSupabase
  };
};

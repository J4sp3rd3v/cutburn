import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

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
  created_at?: string;
}

export const useSupabaseProgressTracking = () => {
  const { user } = useAuth();
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({
    date: new Date().toISOString().split('T')[0],
    water: 0,
    calories: 0,
    workoutCompleted: false,
    supplementsTaken: 0,
    shotsConsumed: []
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          return;
        }

        if (data) {
          setUserProfile({
            id: data.id,
            name: data.name || 'Utente',
            age: data.age || 30,
            height: data.height || 173,
            currentWeight: data.current_weight || 69,
            startWeight: data.start_weight || 69,
            targetWeight: data.target_weight || 65,
            activityLevel: data.activity_level || 'moderate',
            goal: data.goal || 'fat-loss',
            intermittentFasting: data.intermittent_fasting || true,
            lactoseIntolerant: data.lactose_intolerant || false,
            targetCalories: data.target_calories || 1700,
            targetWater: data.target_water || 2500,
            created_at: data.created_at
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [user]);

  // Load daily progress
  useEffect(() => {
    const loadDailyProgress = async () => {
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      try {
        const { data, error } = await supabase
          .from('daily_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading daily progress:', error);
          return;
        }

        if (data) {
          setDailyProgress({
            date: data.date,
            water: data.water || 0,
            calories: data.calories || 0,
            weight: data.weight,
            workoutCompleted: data.workout_completed || false,
            supplementsTaken: data.supplements_taken || 0,
            shotsConsumed: data.shots_consumed || []
          });
        }
      } catch (error) {
        console.error('Error loading daily progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDailyProgress();
  }, [user]);

  const saveDailyProgress = async (progress: Partial<DailyProgress>) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { error } = await supabase
        .from('daily_progress')
        .upsert({
          user_id: user.id,
          date: today,
          ...progress
        });

      if (error) {
        console.error('Error saving progress:', error);
        toast({
          title: "Errore",
          description: "Impossibile salvare i progressi",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving daily progress:', error);
    }
  };

  const addWater = async () => {
    if (!userProfile) return;
    
    const newWater = Math.min(dailyProgress.water + 500, userProfile.targetWater);
    setDailyProgress(prev => ({ ...prev, water: newWater }));
    await saveDailyProgress({ water: newWater });
  };

  const addCalories = async (amount: number) => {
    if (!userProfile) return;
    
    const newCalories = Math.min(dailyProgress.calories + amount, userProfile.targetCalories);
    setDailyProgress(prev => ({ ...prev, calories: newCalories }));
    await saveDailyProgress({ calories: newCalories });
  };

  const updateWeight = async (weight: number) => {
    if (!user || !userProfile) return;

    // Update profile
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ current_weight: weight })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating weight in profile:', profileError);
        return;
      }

      setUserProfile(prev => prev ? { ...prev, currentWeight: weight } : null);
    } catch (error) {
      console.error('Error updating weight:', error);
    }

    // Update daily progress
    setDailyProgress(prev => ({ ...prev, weight }));
    await saveDailyProgress({ weight });

    toast({
      title: "Peso aggiornato",
      description: `Nuovo peso: ${weight}kg`,
    });
  };

  const addShot = async (shotType: string) => {
    const newShots = [...dailyProgress.shotsConsumed, shotType];
    setDailyProgress(prev => ({ ...prev, shotsConsumed: newShots }));
    await saveDailyProgress({ shotsConsumed: newShots });
  };

  const toggleWorkout = async () => {
    const newWorkoutStatus = !dailyProgress.workoutCompleted;
    setDailyProgress(prev => ({ ...prev, workoutCompleted: newWorkoutStatus }));
    await saveDailyProgress({ workoutCompleted: newWorkoutStatus });
  };

  const getWeeklyProgress = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('daily_progress')
        .select('date, weight')
        .eq('user_id', user.id)
        .not('weight', 'is', null)
        .order('date', { ascending: true })
        .limit(7);

      if (error) {
        console.error('Error loading weekly progress:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error loading weekly progress:', error);
      return [];
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
    getWeeklyProgress
  };
};

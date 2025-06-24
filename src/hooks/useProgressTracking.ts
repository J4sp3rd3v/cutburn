import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, DailyProgress, PendingData } from '@/integrations/supabase/types';

export const useProgressTracking = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [pendingSync, setPendingSync] = useLocalStorage<PendingData[]>('pendingSync', []);
  const [lastSyncDate, setLastSyncDate] = useLocalStorage<string>('lastSyncDate', '');
  
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

  // Sync and day change logic
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Connessione ripristinata - avvio sincronizzazione');
      setIsOnline(true);
      syncPendingData();
    };

    const handleOffline = () => {
      console.log('📡 Connessione persa - modalità offline attiva');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkForDayChange();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkForDayChange = () => {
    const today = new Date().toISOString().split('T')[0];
    if (lastSyncDate && lastSyncDate !== today) {
      console.log('📅 Cambio giorno rilevato:', lastSyncDate, '→', today);
      toast({
        title: "Nuovo Giorno! 🌅",
        description: "Reset dei progressi giornalieri.",
      });

      const newProgress: DailyProgress = {
        date: today, water: 0, calories: 0, workoutCompleted: false, supplementsTaken: 0, shotsConsumed: []
      };
      setDailyProgress(newProgress);
    }
    setLastSyncDate(today);
  };
  
  const addToPendingSync = (type: 'profile' | 'progress', data: any) => {
    const pendingItem: PendingData = { id: `${type}_${Date.now()}`, type, data, timestamp: Date.now(), attempts: 0 };
    setPendingSync(prev => [...prev.filter(item => item.id !== pendingItem.id), pendingItem]);
    console.log('📦 Dati aggiunti alla coda di sincronizzazione:', type);
  };

  const syncPendingData = async () => {
    if (!isOnline || !user || pendingSync.length === 0) return;
    console.log(`🔄 Sincronizzazione ${pendingSync.length} elementi...`);
    
    let successfulSyncs: string[] = [];
    for (const item of pendingSync) {
      try {
        if (item.type === 'profile') await saveProfileToSupabase(item.data);
        else if (item.type === 'progress') await saveDailyProgressToSupabase(item.data);
        successfulSyncs.push(item.id);
      } catch (error) {
        console.error('❌ Errore sincronizzazione:', item.id, error);
      }
    }
    
    if (successfulSyncs.length > 0) {
      setPendingSync(prev => prev.filter(item => !successfulSyncs.includes(item.id)));
      toast({ title: "Sincronizzazione Completata! ✅" });
    }
  };

  // Supabase interaction functions
  const saveProfileToSupabase = async (profile: Partial<UserProfile>) => {
    if (!user) throw new Error("Utente non autenticato.");
    
    // Map camelCase to snake_case for Supabase
    const profileForDb = {
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
    };

    const { error } = await supabase.from('user_profiles').upsert(profileForDb, { onConflict: 'auth_user_id' });
    if (error) throw error;
    console.log('✅ Profilo salvato su Supabase');
  };

  const saveDailyProgressToSupabase = async (progress: DailyProgress) => {
    if (!userProfile) throw new Error("Profilo utente non caricato.");
    const { error } = await supabase.from('daily_progress').upsert({ user_id: userProfile.id, ...progress }, { onConflict: 'user_id,date' });
    if (error) throw error;
    console.log('✅ Progressi salvati su Supabase');
  };

  const loadDataFromSupabase = async () => {
    if (!user) return;
    setLoading(true);
    console.log('🔄 Caricamento dati da Supabase per:', user.email);

    try {
      const { data: profileFromDb, error } = await supabase.from('user_profiles').select('*').eq('auth_user_id', user.id).single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found

      if (profileFromDb) {
        // Map snake_case to camelCase
        const profile: UserProfile = {
          id: profileFromDb.id,
          name: profileFromDb.name,
          age: profileFromDb.age,
          height: profileFromDb.height,
          currentWeight: profileFromDb.current_weight,
          startWeight: profileFromDb.start_weight,
          targetWeight: profileFromDb.target_weight,
          activityLevel: profileFromDb.activity_level,
          goal: profileFromDb.goal,
          intermittentFasting: profileFromDb.intermittent_fasting,
          lactoseIntolerant: profileFromDb.lactose_intolerant,
          targetCalories: profileFromDb.target_calories,
          targetWater: profileFromDb.target_water,
          created_at: profileFromDb.created_at,
        };
        setUserProfile(profile);

        const { data: progress } = await supabase.from('daily_progress').select('*').eq('user_id', profile.id).eq('date', today).single();
        if (progress) setDailyProgress(progress);
        console.log('✅ Dati caricati da Supabase');
      } else {
        console.log('✅ Nuovo utente: creazione profilo...');
        const newProfile: Partial<UserProfile> = { name: user.email?.split('@')[0] || 'Nuovo Utente' };
        await saveProfileToSupabase(newProfile);
        const { data: createdProfileFromDb } = await supabase.from('user_profiles').select('*').eq('auth_user_id', user.id).single();
        if(createdProfileFromDb) {
            const createdProfile: UserProfile = {
                id: createdProfileFromDb.id,
                name: createdProfileFromDb.name,
                age: createdProfileFromDb.age,
                height: createdProfileFromDb.height,
                currentWeight: createdProfileFromDb.current_weight,
                startWeight: createdProfileFromDb.start_weight,
                targetWeight: createdProfileFromDb.target_weight,
                activityLevel: createdProfileFromDb.activity_level,
                goal: createdProfileFromDb.goal,
                intermittentFasting: createdProfileFromDb.intermittent_fasting,
                lactoseIntolerant: createdProfileFromDb.lactose_intolerant,
                targetCalories: createdProfileFromDb.target_calories,
                targetWater: createdProfileFromDb.target_water,
                created_at: createdProfileFromDb.created_at,
            };
            setUserProfile(createdProfile);
        }
      }
    } catch (err) {
      console.error("❌ Errore caricamento dati da Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  // Main effect for user initialization
  useEffect(() => {
    if (user) {
      loadDataFromSupabase();
    } else {
      setLoading(false); 
    }
  }, [user]);

  // UI interaction functions
  const addWater = () => {
    if (!userProfile || !userProfile.targetWater) return;
    const newWater = Math.min(dailyProgress.water + 500, userProfile.targetWater);
    const newProgress = { ...dailyProgress, water: newWater };
    setDailyProgress(newProgress);
    saveProgressWithOfflineSupport(newProgress);
  };

  const addCalories = (amount: number) => {
    if (!userProfile || !userProfile.targetCalories) return;
    const newCalories = Math.min(dailyProgress.calories + amount, userProfile.targetCalories);
    const newProgress = { ...dailyProgress, calories: newCalories };
    setDailyProgress(newProgress);
    saveProgressWithOfflineSupport(newProgress);
  };
  
  const updateWeight = (weight: number) => {
    if (!userProfile) return;
    const updatedProfile: UserProfile = { ...userProfile, currentWeight: weight };
    setUserProfile(updatedProfile);
    saveProfileWithOfflineSupport(updatedProfile);

    const newProgress = { ...dailyProgress, weight };
    setDailyProgress(newProgress);
    saveProgressWithOfflineSupport(newProgress);

    const newEntry = { date: today, weight };
    setWeeklyProgress(prev => [...prev.filter(entry => entry.date !== today), newEntry].slice(-7));
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updatedProfile = { ...userProfile, ...profileData };
    setUserProfile(updatedProfile as UserProfile);
    saveProfileWithOfflineSupport(updatedProfile);
  };
  
  const saveProfileWithOfflineSupport = (profile: Partial<UserProfile>) => {
    if (isOnline) saveProfileToSupabase(profile).catch(() => addToPendingSync('profile', profile));
    else addToPendingSync('profile', profile);
  };
  
  const saveProgressWithOfflineSupport = (progress: DailyProgress) => {
    if (isOnline) saveDailyProgressToSupabase(progress).catch(() => addToPendingSync('progress', progress));
    else addToPendingSync('progress', progress);
  };
  
  const addShot = (shotType: string) => {
    const newShots = [...new Set([...dailyProgress.shotsConsumed, shotType])];
    const newProgress = { ...dailyProgress, shotsConsumed: newShots };
    setDailyProgress(newProgress);
    saveProgressWithOfflineSupport(newProgress);
  };

  const toggleWorkout = () => {
    const newProgress = { ...dailyProgress, workoutCompleted: !dailyProgress.workoutCompleted };
    setDailyProgress(newProgress);
    saveProgressWithOfflineSupport(newProgress);
  };

  return {
    dailyProgress,
    userProfile,
    loading,
    isOnline,
    pendingSync: pendingSync.length,
    addWater,
    addCalories,
    updateWeight,
    updateProfile,
    addShot,
    toggleWorkout,
    getWeeklyProgress: () => weeklyProgress,
  };
};

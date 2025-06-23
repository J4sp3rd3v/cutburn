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

interface PendingData {
  id: string;
  type: 'profile' | 'progress';
  data: any;
  timestamp: number;
  attempts: number;
}

export const useProgressTracking = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Timeout di sicurezza per evitare loading infinito
  useEffect(() => {
    if (user && loading) {
      const timeout = setTimeout(() => {
        console.warn('🚨 TIMEOUT CRITICO: Forzando loading=false dopo 3 secondi');
        setLoading(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [user, loading]);
  
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [pendingSync, setPendingSync] = useLocalStorage<PendingData[]>('pendingSync', []);
  const [lastSyncDate, setLastSyncDate] = useLocalStorage<string>('lastSyncDate', '');

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Connessione ripristinata - avvio sincronizzazione');
      setIsOnline(true);
      syncPendingData();
      checkForDayChange();
    };

    const handleOffline = () => {
      console.log('📡 Connessione persa - modalità offline attiva');
      setIsOnline(false);
      toast({
        title: "Modalità Offline 📡",
        description: "I dati verranno sincronizzati al ritorno online",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for day change and update diet accordingly
  const checkForDayChange = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (lastSyncDate && lastSyncDate !== today) {
      console.log('📅 Cambio giorno rilevato:', lastSyncDate, '→', today);
      
      toast({
        title: "Nuovo Giorno! 🌅",
        description: "Aggiornamento protocollo dieta e reset progressi",
      });

      // Reset daily progress for new day
      const newProgress: DailyProgress = {
        date: today,
        water: 0,
        calories: 0,
        workoutCompleted: false,
        supplementsTaken: 0,
        shotsConsumed: []
      };
      setDailyProgress(newProgress);

      // Force reload of diet data if needed
      if (window.location.pathname === '/' || window.location.pathname === '/diet') {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
    
    setLastSyncDate(today);
  };

  // Add data to pending sync queue
  const addToPendingSync = (type: 'profile' | 'progress', data: any) => {
    const pendingItem: PendingData = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      attempts: 0
    };

    setPendingSync(prev => {
      // Remove old entries of same type to avoid duplicates
      const filtered = prev.filter(item => 
        !(item.type === type && Date.now() - item.timestamp < 5000)
      );
      return [...filtered, pendingItem];
    });

    console.log('📦 Dati aggiunti alla coda di sincronizzazione:', type);
  };

  // Sync all pending data when online
  const syncPendingData = async () => {
    if (!isOnline || !user || pendingSync.length === 0) return;

    console.log('🔄 Sincronizzazione dati pending:', pendingSync.length, 'elementi');
    // NON impostare loading=true per la sincronizzazione
    // setLoading(true); // RIMOSSO

    const successfulSyncs: string[] = [];
    
    for (const item of pendingSync) {
      try {
        if (item.type === 'profile') {
          await saveProfileToSupabase(item.data);
          successfulSyncs.push(item.id);
          console.log('✅ Profilo sincronizzato:', item.id);
        } else if (item.type === 'progress') {
          await saveDailyProgressToSupabase(item.data);
          successfulSyncs.push(item.id);
          console.log('✅ Progressi sincronizzati:', item.id);
        }
      } catch (error) {
        console.error('❌ Errore sincronizzazione:', item.id, error);
        
        // Increment attempts and remove if too many failures
        item.attempts++;
        if (item.attempts >= 3) {
          successfulSyncs.push(item.id); // Remove after 3 failed attempts
          console.warn('⚠️ Elemento rimosso dopo 3 tentativi falliti:', item.id);
        }
      }
    }

    // Remove successfully synced items
    if (successfulSyncs.length > 0) {
      setPendingSync(prev => prev.filter(item => !successfulSyncs.includes(item.id)));
      
      toast({
        title: "Sincronizzazione Completata! ✅",
        description: `${successfulSyncs.length} elementi sincronizzati con successo`,
      });
    }

    // NON modificare loading per la sincronizzazione
    // setLoading(false); // RIMOSSO
  };

  // Enhanced save functions with offline support
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
        throw error;
      }
      
      console.log('✅ Profilo salvato su Supabase:', profile.name);
    } catch (error) {
      console.error('❌ Errore salvataggio profilo su Supabase:', error);
      throw error;
    }
  };

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
        throw new Error('Profilo utente non trovato');
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
        throw error;
      }
      
      console.log('✅ Progressi salvati su Supabase per:', progress.date);
    } catch (error) {
      console.error('❌ Errore salvataggio progressi su Supabase:', error);
      throw error;
    }
  };

  // Enhanced save with offline support
  const saveProfileWithOfflineSupport = (profile: UserProfile) => {
    if (isOnline) {
      // Try immediate save
      saveProfileToSupabase(profile).catch(() => {
        addToPendingSync('profile', profile);
      });
    } else {
      // Add to pending queue
      addToPendingSync('profile', profile);
    }
  };

  const saveProgressWithOfflineSupport = (progress: DailyProgress) => {
    if (isOnline) {
      // Try immediate save
      saveDailyProgressToSupabase(progress).catch(() => {
        addToPendingSync('progress', progress);
      });
    } else {
      // Add to pending queue
      addToPendingSync('progress', progress);
    }
  };

  // Carica i dati da Supabase all'avvio
  const loadDataFromSupabase = async () => {
    if (!user) return;
    
    // NON impostare loading=true qui per evitare blocchi
    // setLoading(true); // RIMOSSO
    try {
      console.log('🔄 Caricamento dati utente da Supabase per:', user.email);
      
      // Carica profilo utente con timeout di 10 secondi
      const profilePromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout caricamento profilo')), 10000)
      );

      const { data: profileData, error: profileError } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

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

        // Carica progressi giornalieri solo se il profilo è stato trovato
        try {
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
        } catch (progressError) {
          console.log('⚠️ Errore caricamento progressi (non critico):', progressError);
        }
      } else {
        console.log('⚠️ Profilo non trovato nel database - nuovo utente o errore:', profileError?.message);
        
        // Per nuovi utenti, crea un profilo di base
        const defaultProfile: UserProfile = {
          id: user.id,
          name: user.name || user.email?.split('@')[0] || 'Utente',
          age: 0, // Valori vuoti per nuovo utente
          height: 0,
          currentWeight: 0,
          startWeight: 0,
          targetWeight: 0,
          activityLevel: 'moderate',
          goal: 'fat-loss',
          intermittentFasting: false,
          lactoseIntolerant: false,
          targetCalories: 1800,
          targetWater: 2500,
          created_at: user.created_at
        };
        
        setUserProfile(defaultProfile);
        console.log('✅ Profilo di base creato per nuovo utente');
      }
      
    } catch (error) {
      console.error('❌ Errore caricamento dati da Supabase:', error);
      
      // Fallback: crea sempre un profilo di base per evitare blocchi
      const fallbackProfile: UserProfile = {
        id: user.id,
        name: user.name || user.email?.split('@')[0] || 'Utente',
        age: 0,
        height: 0,
        currentWeight: 0,
        startWeight: 0,
        targetWeight: 0,
        activityLevel: 'moderate',
        goal: 'fat-loss',
        intermittentFasting: false,
        lactoseIntolerant: false,
        targetCalories: 1800,
        targetWater: 2500,
        created_at: user.created_at
      };
      
      setUserProfile(fallbackProfile);
      console.log('✅ Profilo fallback creato dopo errore');
    } finally {
      // NON modificare loading qui, è già gestito nell'useEffect principale
      // setLoading(false); // RIMOSSO
      console.log('✅ Caricamento dati completato');
    }
  };

  // Inizializza il profilo utente con i dati dell'utente autenticato
  useEffect(() => {
    if (user && !userProfile) {
      console.log('🔄 Inizializzazione profilo per utente:', user.email);
      
      // Sempre crea un profilo di base IMMEDIATAMENTE per evitare blocchi
      const baseProfile: UserProfile = {
        id: user.id,
        name: user.name || user.email?.split('@')[0] || 'Utente',
        age: 0,
        height: 0,
        currentWeight: 0,
        startWeight: 0,
        targetWeight: 0,
        activityLevel: 'moderate',
        goal: 'fat-loss',
        intermittentFasting: false,
        lactoseIntolerant: false,
        targetCalories: 1800,
        targetWater: 2500,
        created_at: user.created_at
      };
      
      setUserProfile(baseProfile);
      setLoading(false); // IMPORTANTE: Imposta loading a false SUBITO
      console.log('✅ Profilo base creato immediatamente');
      
      // POI, se online, prova a caricare dati da Supabase in background
      if (isOnline) {
        console.log('🌐 Tentativo caricamento dati da Supabase in background...');
        loadDataFromSupabase().catch(error => {
          console.warn('⚠️ Errore caricamento background, continuo con profilo base:', error);
        });
      }
    } else if (user && userProfile && userProfile.name !== user.name) {
      // Aggiorna il nome se è cambiato
      const updatedProfile = { ...userProfile, name: user.name, id: user.id };
      setUserProfile(updatedProfile);
      saveProfileWithOfflineSupport(updatedProfile);
      console.log('🔄 Nome utente aggiornato:', user.name);
    } else if (user && userProfile) {
      // Utente e profilo già presenti, assicurati che loading sia false
      setLoading(false);
      console.log('✅ Utente e profilo già disponibili');
    }
  }, [user]);

  // Check for day change on app start
  useEffect(() => {
    if (user) {
      checkForDayChange();
    }
  }, [user]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && user && pendingSync.length > 0) {
      setTimeout(() => {
        syncPendingData();
      }, 1000); // Wait 1 second after coming online
    }
  }, [isOnline, user]);

  // Listen for service worker sync triggers
  useEffect(() => {
    const handleServiceWorkerSync = (event: any) => {
      console.log('🔄 Service Worker triggered sync:', event.detail);
      if (user && isOnline) {
        syncPendingData();
      }
    };

    window.addEventListener('triggerSync', handleServiceWorkerSync);
    
    return () => {
      window.removeEventListener('triggerSync', handleServiceWorkerSync);
    };
  }, [user, isOnline]);

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

  const addWater = () => {
    if (!userProfile) return;
    
    const newWater = Math.min(dailyProgress.water + 500, userProfile.targetWater);
    const newProgress = { ...dailyProgress, water: newWater };
    setDailyProgress(newProgress);
    saveProgressWithOfflineSupport(newProgress);
    
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
    saveProgressWithOfflineSupport(newProgress);
  };

  const updateWeight = (weight: number) => {
    if (!userProfile) return;

    // Update profile
    const updatedProfile = { ...userProfile, currentWeight: weight };
    setUserProfile(updatedProfile);
    saveProfileWithOfflineSupport(updatedProfile);

    // Update daily progress
    const newProgress = { ...dailyProgress, weight };
    setDailyProgress(newProgress);
    saveProgressWithOfflineSupport(newProgress);

    // Update weekly progress
    const newEntry = { date: today, weight };
    setWeeklyProgress(prev => {
      const filtered = prev.filter(entry => entry.date !== today);
      return [...filtered, newEntry].slice(-7);
    });

    toast({
      title: "Peso aggiornato",
      description: `Nuovo peso: ${weight}kg ${!isOnline ? '(sarà sincronizzato online)' : ''}`,
    });
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    if (!userProfile) return;

    // Update profile with new data
    const updatedProfile = { ...userProfile, ...profileData };
    setUserProfile(updatedProfile);
    saveProfileWithOfflineSupport(updatedProfile);

    console.log('✅ Profilo aggiornato:', updatedProfile);
    
    toast({
      title: "Profilo aggiornato",
      description: `Le modifiche sono state salvate ${!isOnline ? '(saranno sincronizzate online)' : ''}`,
    });
  };

  const addShot = (shotType: string) => {
    const newShots = [...dailyProgress.shotsConsumed, shotType];
    const newProgress = { ...dailyProgress, shotsConsumed: newShots };
    setDailyProgress(newProgress);
    saveProgressWithOfflineSupport(newProgress);
    
    toast({
      title: "Shot registrato! 🥤",
      description: `${shotType} aggiunto al tracking`,
    });
  };

  const toggleWorkout = () => {
    const newWorkoutStatus = !dailyProgress.workoutCompleted;
    const newProgress = { ...dailyProgress, workoutCompleted: newWorkoutStatus };
    setDailyProgress(newProgress);
    saveProgressWithOfflineSupport(newProgress);
    
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
    isOnline,
    pendingSync: pendingSync.length,
    addWater,
    addCalories,
    updateWeight,
    updateProfile,
    addShot,
    toggleWorkout,
    getWeeklyProgress: () => weeklyProgress,
    saveProfileToSupabase,
    loadDataFromSupabase,
    syncPendingData,
    checkForDayChange
  };
};

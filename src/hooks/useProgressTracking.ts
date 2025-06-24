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
  age: number | null;
  height: number | null;
  currentWeight: number | null;
  startWeight: number | null;
  targetWeight: number | null;
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

  // Test connessione Supabase
  const testSupabaseConnection = async () => {
    try {
      console.log('🔍 Test connessione Supabase...');
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
      if (error) {
        console.error('❌ Test Supabase fallito:', error);
        return false;
      }
      console.log('✅ Connessione Supabase OK');
      return true;
    } catch (error) {
      console.error('❌ Errore test Supabase:', error);
      return false;
    }
  };

  // Enhanced save functions with offline support
  const saveProfileToSupabase = async (profile: UserProfile) => {
    if (!user || !profile) {
      console.warn('⚠️ saveProfileToSupabase: user o profile mancanti');
      return;
    }
    
    console.log('🔄 Tentativo salvataggio profilo su Supabase per:', user.email);
    console.log('📊 Dati profilo da salvare:', {
      name: profile.name,
      age: profile.age,
      height: profile.height,
      currentWeight: profile.currentWeight,
      targetWeight: profile.targetWeight,
      goal: profile.goal
    });
    
    try {
      const profileData = {
        auth_user_id: user.id,
        name: profile.name,
        age: profile.age || null,
        height: profile.height || null,
        current_weight: profile.currentWeight || null,
        start_weight: profile.startWeight || null,
        target_weight: profile.targetWeight || null,
        activity_level: profile.activityLevel,
        goal: profile.goal,
        intermittent_fasting: profile.intermittentFasting,
        lactose_intolerant: profile.lactoseIntolerant,
        target_calories: profile.targetCalories,
        target_water: profile.targetWater,
        updated_at: new Date().toISOString()
      };

      console.log('📤 Invio dati a Supabase:', profileData);

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData, {
          onConflict: 'auth_user_id'
        });

      if (error) {
        console.error('❌ Errore Supabase:', error);
        throw error;
      }
      
      console.log('✅ Profilo salvato su Supabase con successo:', profile.name);
      console.log('📊 Risposta Supabase:', data);
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
          age: profileData.age || null,
          height: profileData.height || null,
          currentWeight: profileData.current_weight || null,
          startWeight: profileData.start_weight || null,
          targetWeight: profileData.target_weight || null,
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
        
        // Per nuovi utenti, crea un profilo vuoto su Supabase
        console.log('🆕 Nuovo utente rilevato, creazione profilo vuoto su Supabase...');
        const newProfile: UserProfile = {
          id: user.id,
          name: user.name || user.email?.split('@')[0] || '',
          age: null,
          height: null,
          currentWeight: null,
          startWeight: null,
          targetWeight: null,
          activityLevel: 'moderate',
          goal: 'fat-loss',
          intermittentFasting: false,
          lactoseIntolerant: false,
          targetCalories: 0, // ZERO - nessun valore demo
          targetWater: 0, // ZERO - nessun valore demo
          created_at: user.created_at
        };
        
        // Salva immediatamente su Supabase (NON localStorage)
        try {
          await saveProfileToSupabase(newProfile);
          setUserProfile(newProfile);
          console.log('✅ Nuovo profilo creato e salvato SOLO su Supabase');
        } catch (error) {
          console.error('❌ ERRORE CRITICO: Impossibile creare profilo su Supabase:', error);
          // NON creare profilo locale - deve funzionare solo con Supabase
          throw new Error('Impossibile creare profilo utente su database');
        }
      }
      
    } catch (error) {
      console.error('❌ Errore caricamento dati da Supabase:', error);
      
      // NESSUN FALLBACK - L'app deve funzionare SOLO con dati Supabase
      console.error('❌ ERRORE CRITICO: Impossibile caricare profilo da Supabase');
      throw new Error('Database non raggiungibile. Riprova più tardi.');
    } finally {
      // NON modificare loading qui, è già gestito nell'useEffect principale
      // setLoading(false); // RIMOSSO
      console.log('✅ Caricamento dati completato');
    }
  };

  // Inizializza il profilo utente con i dati dell'utente autenticato
  useEffect(() => {
    const initializeUser = async () => {
      if (user && !userProfile) {
        console.log('🔄 Inizializzazione profilo per utente:', user.email);
        
        // NESSUN profilo temporaneo - SOLO dati reali da Supabase
        console.log('🔄 Caricamento OBBLIGATORIO da Supabase...');
        
        try {
          await loadDataFromSupabase();
          setLoading(false);
          console.log('✅ Profilo caricato con successo da Supabase');
        } catch (error) {
          console.error('❌ ERRORE CRITICO: Impossibile caricare da Supabase:', error);
          setLoading(false);
          // NON impostare nessun profilo - l'app deve mostrare errore
          throw new Error('Impossibile caricare dati utente. Verifica la connessione.');
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
    };

    // Questo useEffect si attiva quando l'utente cambia (es. login)
    useEffect(() => {
      if (user) {
        console.log('🚀 Inizializzazione utente in useProgressTracking (rilevato cambio utente)...');
        initializeUser();
      }
    }, [user]); // FIX: Aggiunto 'user' come dipendenza per ri-triggerare l'init al login

    // Check for day change on app start
    useEffect(() => {
      checkForDayChange();
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
    // NESSUN valore di default - solo dati da Supabase
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

    const updateProfile = async (profileData: Partial<UserProfile>) => {
      if (!userProfile) return;

      // Update profile with new data and calculate targets based on real data
      const updatedProfile = { ...userProfile, ...profileData };
      
      // Calcola automaticamente calorie e acqua target SOLO se ci sono dati reali
      if (updatedProfile.age && updatedProfile.age > 0 && 
          updatedProfile.height && updatedProfile.height > 0 && 
          updatedProfile.currentWeight && updatedProfile.currentWeight > 0) {
        // Calcolo BMR (Basal Metabolic Rate) con formula Mifflin-St Jeor
        const bmr = updatedProfile.goal === 'muscle-gain' 
          ? 10 * updatedProfile.currentWeight + 6.25 * updatedProfile.height - 5 * updatedProfile.age + 5
          : 10 * updatedProfile.currentWeight + 6.25 * updatedProfile.height - 5 * updatedProfile.age - 161;
        
        // Fattore attività
        const activityMultiplier = {
          'sedentary': 1.2,
          'light': 1.375,
          'moderate': 1.55,
          'active': 1.725,
          'very-active': 1.9
        }[updatedProfile.activityLevel] || 1.55;
        
        // Calorie target basate su obiettivo
        const maintenanceCalories = bmr * activityMultiplier;
        updatedProfile.targetCalories = Math.round(
          updatedProfile.goal === 'fat-loss' ? maintenanceCalories - 500 :
          updatedProfile.goal === 'muscle-gain' ? maintenanceCalories + 300 :
          maintenanceCalories
        );
        
        // Acqua target: 35ml per kg di peso corporeo
        updatedProfile.targetWater = Math.round(updatedProfile.currentWeight * 35);
        
        console.log('📊 Target calcolati automaticamente:', {
          calories: updatedProfile.targetCalories,
          water: updatedProfile.targetWater
        });
      } else {
        // Se non ci sono dati sufficienti, mantieni a 0
        updatedProfile.targetCalories = 0;
        updatedProfile.targetWater = 0;
        console.log('⚠️ Dati insufficienti per calcolare target');
      }
      
      setUserProfile(updatedProfile);

      console.log('🔄 Aggiornamento profilo:', updatedProfile);

      // Prova a salvare immediatamente su Supabase se online
      if (isOnline) {
        // Prima testa la connessione
        const isConnected = await testSupabaseConnection();
        
        if (isConnected) {
          try {
            await saveProfileToSupabase(updatedProfile);
            console.log('✅ Profilo salvato su Supabase con successo');
            
            toast({
              title: "Profilo aggiornato ✅",
              description: "Le modifiche sono state salvate su cloud. App aggiornata automaticamente!",
            });
            
            // Trigger refresh di tutte le sezioni che dipendono dal profilo
            window.dispatchEvent(new CustomEvent('profileUpdated', {
              detail: { profile: updatedProfile }
            }));
          } catch (error) {
            console.warn('⚠️ Errore salvataggio Supabase, aggiungo a pending:', error);
            addToPendingSync('profile', updatedProfile);
            
                    toast({
            title: "Profilo aggiornato ⚠️",
            description: "Salvato localmente, sincronizzazione in corso...",
          });
          
          // Trigger refresh anche per salvataggio offline
          window.dispatchEvent(new CustomEvent('profileUpdated', {
            detail: { profile: updatedProfile }
          }));
          }
        } else {
          console.warn('⚠️ Connessione Supabase non disponibile, aggiungo a pending');
          addToPendingSync('profile', updatedProfile);
          
          toast({
            title: "Profilo aggiornato 🔄",
            description: "Cloud non raggiungibile, sincronizzerà automaticamente",
          });
          
          // Trigger refresh anche quando cloud non raggiungibile
          window.dispatchEvent(new CustomEvent('profileUpdated', {
            detail: { profile: updatedProfile }
          }));
        }
      } else {
        // Se offline, aggiungi alla coda
        addToPendingSync('profile', updatedProfile);
        
        toast({
          title: "Profilo aggiornato 📡",
          description: "Salvato offline, sincronizzerà quando torni online",
        });
        
        // Trigger refresh anche offline
        window.dispatchEvent(new CustomEvent('profileUpdated', {
          detail: { profile: updatedProfile }
        }));
      }
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
  }, [user]);

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

import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Definizione dei tipi basata sullo schema del database generato
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type DailyProgress = Database['public']['Tables']['daily_progress']['Row'];

interface PendingData {
  type: 'progress' | 'profile';
  payload: Partial<DailyProgress> | Partial<UserProfile>;
}

export function useProgressTracking() {
  const { user, loading: authLoading } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(true); // Stato di caricamento dedicato
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress | null>(`dailyProgress_${user?.id}_${today}`, null);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>(`userProfile_${user?.id}`, null);
  const [pendingSync, setPendingSync] = useLocalStorage<PendingData[]>(`pendingSync_${user?.id}`, []);

  const addToSyncQueue = useCallback((data: PendingData) => {
    setPendingSync(prev => [...prev, data]);
    toast({ title: 'Modalità Offline', description: 'I dati verranno sincronizzati appena torni online.'});
  }, [setPendingSync]);
  
  // Riscrivo completamente la logica di caricamento
  useEffect(() => {
    // Non fare nulla finché l'autenticazione non è completata
    if (authLoading || !user) {
      // Se il caricamento dell'auth finisce e non c'è utente, smettiamo di caricare
      if (!authLoading && !user) {
        setLoading(false);
      }
      return;
    }

    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log("🔄 Inizio caricamento dati profilo e progressi...");

        // 1. Carica sempre il profilo utente da Supabase come fonte di verità
        const { data: profileFromDb, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('auth_user_id', user.id) // user.id da useAuth è l'auth_user_id
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // Ignora errore "nessun risultato"
          throw new Error(`Errore caricamento profilo: ${profileError.message}`);
        }
        
        if (!profileFromDb) {
            console.warn("⚠️ Profilo utente non trovato nel database. L'utente potrebbe doverlo completare.");
            // Potremmo dover gestire la creazione di un profilo qui se non esiste
            setLoading(false); // Sblocchiamo comunque l'UI
            return;
        }
        
        console.log("✅ Profilo caricato:", profileFromDb.name);
        setUserProfile(profileFromDb); // Aggiorna la cache locale

        // 2. Carica o crea i progressi del giorno
        const { data: progressFromDb, error: progressError } = await supabase
          .from('daily_progress')
          .select('*')
          .eq('user_id', profileFromDb.id)
          .eq('date', today)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          throw new Error(`Errore caricamento progressi: ${progressError.message}`);
        }

        if (progressFromDb) {
          console.log("✅ Progressi del giorno caricati.");
          setDailyProgress(progressFromDb);
        } else {
          console.log("📝 Nessun progresso per oggi, creo un record di default.");
          const defaultProgress: Omit<DailyProgress, 'id' | 'created_at' | 'updated_at'> = {
            user_id: profileFromDb.id,
            date: today,
            water: 0,
            calories: 0,
            weight: profileFromDb.current_weight,
            workout_completed: false,
            supplements_taken: 0,
            shots_consumed: [],
          };
          
          const { data: newProgress, error: createError } = await supabase
            .from('daily_progress')
            .insert(defaultProgress)
            .select()
            .single();

          if (createError) throw new Error(`Errore creazione progressi: ${createError.message}`);
          
          console.log("✅ Record progressi creato.");
          setDailyProgress(newProgress);
        }

      } catch (error) {
        console.error("❌ Errore critico in loadInitialData:", error);
        toast({ title: 'Errore di Caricamento', description: 'Impossibile caricare i dati. Prova a ricaricare.', variant: 'destructive'});
      } finally {
        console.log("🏁 Caricamento dati completato.");
        setLoading(false); // Sblocca l'UI in ogni caso
      }
    };

    loadInitialData();
  }, [user, authLoading, today, setUserProfile, setDailyProgress]);

  // La funzione saveProgress rimane simile, ma usa l'ID utente corretto
  const saveProgress = useCallback((updates: Partial<DailyProgress>) => {
    if (!dailyProgress || !userProfile) return;
    const updatedProgress = { ...dailyProgress, ...updates };
    setDailyProgress(updatedProgress);
    
    if (isOnline) {
      supabase.from('daily_progress').upsert(updatedProgress, { onConflict: 'user_id,date' }).then(({ error }) => {
        if (error) {
          console.error("Errore salvataggio progressi:", error);
          addToSyncQueue({ type: 'progress', payload: updatedProgress });
        }
      });
    } else {
      addToSyncQueue({ type: 'progress', payload: updatedProgress });
    }
  }, [dailyProgress, isOnline, addToSyncQueue, setDailyProgress]);
  
  // Funzione per aggiornare il profilo con supporto offline
  const updateProfile = useCallback((profileData: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updatedProfile = { ...userProfile, ...profileData };
    setUserProfile(updatedProfile);

    if (isOnline) {
      supabase.from('user_profiles').upsert(updatedProfile, { onConflict: 'id' }).then(({ error }) => { // Usa 'id' del profilo come vincolo
        if (error) {
          console.error("Errore salvataggio profilo:", error);
          addToSyncQueue({ type: 'profile', payload: updatedProfile });
        }
      });
    } else {
      addToSyncQueue({ type: 'profile', payload: updatedProfile });
    }
  }, [userProfile, isOnline, addToSyncQueue, setUserProfile]);

  // Sincronizzazione quando si torna online
  useEffect(() => {
    if (isOnline && pendingSync.length > 0) {
      console.log('Sincronizzazione di', pendingSync.length, 'elementi...');
      const syncAll = async () => {
        const remainingItems = [];
        for (const item of pendingSync) {
          let error = null;
          if (item.type === 'progress') {
            ({ error } = await supabase.from('daily_progress').upsert(item.payload as DailyProgress, { onConflict: 'user_id,date' }));
          } else if (item.type === 'profile') {
            ({ error } = await supabase.from('user_profiles').upsert(item.payload as UserProfile, { onConflict: 'id' })); // Usa 'id' del profilo
          }
          if (error) {
            console.error('Errore durante la sincronizzazione:', error);
            remainingItems.push(item);
          }
        }
        setPendingSync(remainingItems);
        if (remainingItems.length === 0) {
          toast({ title: 'Sincronizzazione completata', description: 'Tutti i dati sono stati salvati sul server.' });
        }
      };
      syncAll();
    }
  }, [isOnline, pendingSync, setPendingSync]);

  return { 
    dailyProgress, 
    userProfile,
    saveProgress,
    updateProfile,
    loading, // Restituisce lo stato di caricamento dedicato
    isOnline,
    pendingSync,
    addToSyncQueue,
    // Aggiungi qui altre funzioni se necessario
  };
}

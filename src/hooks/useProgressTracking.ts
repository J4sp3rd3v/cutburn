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

  // Stato per la gestione online/offline
  const [isOnline, setIsOnline] = useState(true);
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

  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress | null>(`dailyProgress_${today}`, null);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [pendingSync, setPendingSync] = useLocalStorage<PendingData[]>('pendingSync', []);

  // Funzione per aggiungere dati alla coda di sincronizzazione
  const addToSyncQueue = useCallback((data: PendingData) => {
    setPendingSync(prev => [...prev, data]);
    toast('Offline. I dati verranno sincronizzati appena torni online.');
  }, [setPendingSync]);

  // Caricamento iniziale dei dati da Supabase
  const loadData = useCallback(async () => {
    if (!user || !userProfile) return;
    
    try {
      // Forza refresh dello schema
      await supabase.from('daily_progress').select('*', { head: true, count: 'exact' });
      
      const { data: progressFromDb } = await supabase.from('daily_progress').select('*').eq('user_id', userProfile.id).eq('date', today).single();
      
      if (progressFromDb) {
        setDailyProgress(progressFromDb);
      } else {
        // Crea un daily_progress di default se non esiste
        const defaultProgress: DailyProgress = {
          id: '', // Sarà generato da Supabase
          user_id: userProfile.id,
          date: today,
          water: 0,
          calories: 0,
          weight: userProfile.current_weight,
          workout_completed: false,
          supplements_taken: 0,
          shots_consumed: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setDailyProgress(defaultProgress);
      }
    } catch (error) {
      console.error('Errore caricamento dati progressi:', error);
    }
  }, [user, userProfile, today, setDailyProgress]);
  
  // Effetto per caricare i dati quando l'utente è disponibile
  useEffect(() => {
    if (user && !authLoading) {
      // Carica il profilo utente se non è già in cache
      if (!userProfile || userProfile.auth_user_id !== user.auth_user_id) {
        supabase.from('user_profiles').select('*').eq('auth_user_id', user.auth_user_id).single().then(({ data }) => {
          if (data) setUserProfile(data);
        });
      }
      loadData();
    }
  }, [user, authLoading, userProfile, setUserProfile, loadData]);

  // Funzione unificata per salvare i progressi con supporto offline
  const saveProgress = useCallback((updates: Partial<DailyProgress>) => {
    if (!dailyProgress) return;
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
      supabase.from('user_profiles').upsert(updatedProfile, { onConflict: 'auth_user_id' }).then(({ error }) => {
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
            ({ error } = await supabase.from('user_profiles').upsert(item.payload as UserProfile, { onConflict: 'auth_user_id' }));
          }
          if (error) {
            console.error('Errore durante la sincronizzazione:', error);
            remainingItems.push(item);
          }
        }
        setPendingSync(remainingItems);
        if (remainingItems.length === 0) {
          toast('Dati sincronizzati con successo!');
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
    loading: authLoading || !dailyProgress || !userProfile
  };
}

import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  auth_user_id: string;
  email: string;
  name: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isNewUser: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  markProfileCompleted: () => void;
  clearCache: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Funzione per pulire completamente la cache
  const clearCache = async () => {
    try {
      console.log('🧹 Inizio pulizia cache completa...');
      
      // 1. Cancella tutto il localStorage
      localStorage.clear();
      
      // 2. Cancella tutto il sessionStorage
      sessionStorage.clear();
      
      // 3. Cancella cache del Service Worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('🗑️ Service Worker unregistered');
        }
      }
      
      // 4. Cancella cache del browser
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log('🗑️ Cancellazione cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }
      
      // 5. Force logout da Supabase
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        console.log('⚠️ Errore logout Supabase (normale se già disconnesso)');
      }
      
      console.log('✅ Cache completamente pulita');
      
      // 6. Ricarica la pagina per applicare le modifiche
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Errore durante pulizia cache:', error);
      // Fallback: ricarica comunque la pagina
      window.location.reload();
    }
  };

  useEffect(() => {
    // Imposta loading a true all'inizio per mostrare la schermata di caricamento.
    setLoading(true);

    // onAuthStateChange è l'unica fonte di verità.
    // All'avvio, emette subito un evento 'INITIAL_SESSION'.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth Event: ${event}`);
      
      if (session?.user) {
        // Gestisce INITIAL_SESSION (con utente), SIGNED_IN, TOKEN_REFRESHED
        await loadUserProfile(session.user);
      } else {
        // Gestisce INITIAL_SESSION (senza utente) e SIGNED_OUT
        setUser(null);
      }
      
      // Dopo il primo evento, l'app non è più in stato di caricamento iniziale.
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    // NON GESTIRE setLoading qui. Viene gestito dal listener onAuthStateChange.
    try {
      console.log('🔄 Caricamento profilo per:', supabaseUser.id);
      
      const profileColumns = 'id, auth_user_id, name, created_at, age, height, current_weight, start_weight, target_weight, activity_level, goal, intermittent_fasting, lactose_intolerant, target_calories, target_water';

      // Prova a caricare il profilo dal database
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select(profileColumns)
        .eq('auth_user_id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Errore caricamento profilo:', error);
        throw error;
      }

      if (profile) {
        console.log('✅ Profilo trovato:', profile);
        setUser({
          id: profile.id,
          auth_user_id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: profile.name,
          created_at: profile.created_at || supabaseUser.created_at
        });
      } else {
        console.log('⚠️ Profilo non trovato, creo uno nuovo...');
        // Crea profilo se non esiste e lo restituisce
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            auth_user_id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Utente',
            activity_level: 'moderate',
            goal: 'fat-loss',
          })
          .select(profileColumns)
          .single();

        if (insertError) {
          console.error('❌ Errore creazione profilo:', insertError);
          throw insertError;
        }
        
        if (newProfile) {
            console.log('✅ Profilo creato e caricato:', newProfile);
            setUser({
              id: newProfile.id,
              auth_user_id: supabaseUser.id,
              email: supabaseUser.email || '',
              name: newProfile.name,
              created_at: newProfile.created_at || supabaseUser.created_at
            });
            setIsNewUser(true);
        } else {
            // Questo caso non dovrebbe accadere se l'insert va a buon fine
            throw new Error("Creazione profilo fallita: nessun dato restituito.");
        }
      }
    } catch (error) {
      console.error('❌ Errore critico durante il caricamento del profilo:', error);
      // Se non possiamo caricare/creare un profilo, l'app non può funzionare.
      // Eseguiamo il logout per forzare un nuovo tentativo di login.
      setUser(null);
      await supabase.auth.signOut();
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Tentativo login per:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Errore login:', error);
        if (error.message && error.message.includes('Invalid login')) {
          alert('Email o password non corretti');
        } else if (error.message && error.message.includes('Email not confirmed')) {
          alert('Devi confermare la tua email prima di accedere.');
        } else {
          alert(`Errore: ${error.message || 'Errore sconosciuto'}`);
        }
        return false;
      }

      if (data.user && data.session) {
        console.log('✅ Login completato');
        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Errore generale login:', error);
      alert(`Errore di connessione: ${error}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Tentativo registrazione per:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name
          }
        }
      });

      if (error) {
        console.error('❌ Errore registrazione:', error);
        alert(`Errore registrazione: ${error.message || 'Errore sconosciuto'}`);
        return false;
      }

      if (data.user && data.session) {
        console.log('✅ Registrazione completata');
        await loadUserProfile(data.user);
        setIsNewUser(true);
        return true;
      } else if (data.user && !data.session) {
        console.log('📧 Conferma email richiesta');
        alert('Controlla la tua email per confermare la registrazione!');
        return false;
      }

      return false;
    } catch (error) {
      console.error('❌ Errore generale registrazione:', error);
      alert(`Errore di connessione: ${error}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsNewUser(false);
    } catch (error) {
      console.error('❌ Errore logout:', error);
    }
  };

  const markProfileCompleted = () => {
    setIsNewUser(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isNewUser, 
      signIn, 
      signUp, 
      signOut, 
      markProfileCompleted,
      clearCache 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

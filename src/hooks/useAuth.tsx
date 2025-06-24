import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
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
  const [loading, setLoading] = useState(true);
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

  // Controlla sessione esistente all'avvio
  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('🔄 Controllo sessione esistente...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Errore controllo sessione:', error);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('✅ Sessione trovata per:', session.user.email);
          await loadUserProfile(session.user);
        } else {
          console.log('ℹ️ Nessuna sessione attiva');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Errore controllo sessione:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Ascolta cambiamenti autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ Utente loggato');
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 Utente disconnesso');
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token aggiornato');
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('❌ Errore gestione auth state:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('🔄 Caricamento profilo per:', supabaseUser.id);
      
      // Prova a caricare il profilo dal database
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Errore caricamento profilo:', error);
        throw error;
      }

      if (profile) {
        console.log('✅ Profilo trovato:', profile);
        setUser({
          id: profile.id,
          email: supabaseUser.email || '',
          name: profile.name,
          created_at: profile.created_at || supabaseUser.created_at
        });
      } else {
        console.log('⚠️ Profilo non trovato, creo uno nuovo');
        // Crea profilo se non esiste
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Utente',
            email: supabaseUser.email
          });

        if (insertError) {
          console.error('❌ Errore creazione profilo:', insertError);
          throw insertError;
        }

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Utente',
          created_at: supabaseUser.created_at
        });
        
        setIsNewUser(true);
      }
    } catch (error) {
      console.error('❌ Errore loadUserProfile:', error);
      // Fallback con dati minimi
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.email?.split('@')[0] || 'Utente',
        created_at: supabaseUser.created_at
      });
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
        if (error.message.includes('Invalid login')) {
          alert('Email o password non corretti');
        } else if (error.message.includes('Email not confirmed')) {
          alert('Devi confermare la tua email prima di accedere.');
        } else {
          alert(`Errore: ${error.message}`);
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
        alert(`Errore registrazione: ${error.message}`);
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

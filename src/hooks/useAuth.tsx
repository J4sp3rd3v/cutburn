import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { toast } from "@/components/ui/use-toast";

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

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
    // Imposta loading a true all'inizio. Verrà impostato a false solo
    // dentro loadUserProfile o se l'utente è esplicitamente null.
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth Event: ${event}`, { sessionExists: !!session });
      
      // Se c'è una sessione, carica il profilo utente.
      // loadUserProfile si occuperà di impostare setLoading(false) alla fine.
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        // Se non c'è sessione (INITIAL_SESSION senza utente o SIGNED_OUT),
        // imposta l'utente a null e ferma il caricamento.
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log(`[loadUserProfile] START for user ${supabaseUser.id}`);
      
      const profileQuery = supabase
        .from('user_profiles')
        .select('id, name, created_at') // Seleziono solo il minimo indispensabile
        .eq('auth_user_id', supabaseUser.id)
        .single();

      console.log('[loadUserProfile] Executing profile query with 10s timeout...');
      
      // Aggiungo un timeout per forzare un errore invece di un blocco infinito
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query for user profile timed out after 10 seconds.')), 10000)
      );
      
      const result = await Promise.race([
        profileQuery,
        timeoutPromise
      ]) as { data: UserProfile | null, error: any };

      const { data: profile, error } = result;

      console.log('[loadUserProfile] Query finished or timed out.');

      if (error && error.code !== 'PGRST116') { // PGRST116 = 0 risultati, che è ok
        console.error('[loadUserProfile] Supabase query error:', error);
        throw error;
      }
      
      if (profile) {
        console.log('[loadUserProfile] Profile found in DB.');
        setUser({
          id: profile.id,
          auth_user_id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: profile.name,
          created_at: profile.created_at || supabaseUser.created_at
        });
        setIsNewUser(false);
      } else {
        console.log('[loadUserProfile] Profile not found. Marking as new user to complete profile.');
        // Imposto un utente parziale, il componente UserProfile forzerà il completamento
        setUser({
            id: '', // L'ID del profilo non esiste ancora
            auth_user_id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || 'Utente',
            created_at: supabaseUser.created_at
        });
        setIsNewUser(true);
      }
    } catch (error) {
      console.error('[loadUserProfile] CRITICAL ERROR in profile loading:', error);
      // Invece di un signOut forzato che causa un redirect loop,
      // blocchiamo il caricamento e mostriamo l'errore all'utente.
      // L'utente rimane "loggato" ma l'app si ferma qui, rendendo chiaro il problema.
      toast({
        title: "Errore Critico",
        description: `Impossibile caricare il tuo profilo utente dopo il login. Potrebbe essere un problema di permessi sul database (RLS). Contatta il supporto. Errore: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
        duration: Infinity, // Mostra l'errore finché la pagina non viene ricaricata
      });
      setUser(null); // Mantieni l'utente nullo per fermare l'UI
    } finally {
      console.log('[loadUserProfile] FINALLY block reached. Loading finished.');
      setLoading(false);
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
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Debug: controlla localStorage all'avvio e gestisce riapetura app
  useEffect(() => {
    const checkLocalStorage = () => {
      const authToken = localStorage.getItem('cutburn-supabase-auth-token');
      console.log('🔍 localStorage auth token:', authToken ? 'Presente' : 'Assente');
      if (authToken) {
        try {
          const parsed = JSON.parse(authToken);
          console.log('📅 Token expires_at:', parsed.expires_at ? new Date(parsed.expires_at * 1000).toLocaleString() : 'Non specificato');
          console.log('👤 Token user email:', parsed.user?.email || 'Non disponibile');
          
          // Se il token è presente e valido, forza il controllo della sessione
          if (parsed.user && parsed.expires_at && parsed.expires_at * 1000 > Date.now()) {
            console.log('✅ Token valido trovato in localStorage - forzo controllo sessione');
            // Imposta un flag per indicare che dovremmo avere una sessione valida
            sessionStorage.setItem('expected-session', 'true');
          }
        } catch (e) {
          console.warn('⚠️ Errore parsing token localStorage:', e);
        }
      }
    };
    
    checkLocalStorage();
    
    // Gestisce il caso di riapetura dell'app
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log('🔄 App riaperta da cache - verifica sessione');
        checkLocalStorage();
      }
    };
    
    window.addEventListener('pageshow', handlePageShow);
    
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Evita disconnessioni durante la navigazione
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Non fare nulla, mantieni la sessione
    };

    const handleVisibilityChange = async () => {
      if (!document.hidden && user) {
        // Quando l'utente torna alla tab, verifica la sessione
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) {
            console.log('⚠️ Sessione persa durante inattività');
            setUser(null);
          }
        } catch (error) {
          console.warn('⚠️ Errore controllo sessione al ritorno:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  useEffect(() => {
    // Controlla se c'è già un utente loggato con retry e timeout più lungo
    const checkUser = async () => {
      let attempts = 0;
      const maxAttempts = 5; // Aumentato da 3 a 5
      
      while (attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`🔄 Controllo sessione esistente (tentativo ${attempts}/${maxAttempts})...`);
          
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.warn(`⚠️ Errore controllo sessione tentativo ${attempts}:`, error);
            if (attempts < maxAttempts) {
              // Attesa progressiva: 1s, 2s, 3s, 4s
              await new Promise(resolve => setTimeout(resolve, attempts * 1000));
              continue;
            } else {
              // Dopo tutti i tentativi falliti, considera l'utente non autenticato
              console.log('❌ Controllo sessione fallito dopo tutti i tentativi');
              setUser(null);
              setLoading(false);
              return;
            }
          }
          
          if (session?.user) {
            console.log('✅ Sessione trovata per:', session.user.email);
            console.log('📧 Email confermata:', session.user.email_confirmed_at ? 'Sì' : 'No');
            console.log('⏰ Sessione scade:', new Date(session.expires_at! * 1000).toLocaleString());
            
            // Rimuovi il flag di sessione attesa
            sessionStorage.removeItem('expected-session');
            
            // Verifica che la sessione non sia scaduta
            if (session.expires_at && session.expires_at * 1000 < Date.now()) {
              console.log('⚠️ Sessione scaduta, tentativo refresh...');
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
              if (refreshError || !refreshData.session) {
                console.log('❌ Refresh sessione fallito, utente non autenticato');
                setUser(null);
                setLoading(false);
                return;
              }
              await loadUserProfile(refreshData.session.user);
            } else {
              await loadUserProfile(session.user);
            }
          } else {
            // Controlla se ci aspettavamo una sessione
            const expectedSession = sessionStorage.getItem('expected-session');
            if (expectedSession && attempts < maxAttempts) {
              console.log('⚠️ Sessione attesa ma non trovata, riprovo...');
              await new Promise(resolve => setTimeout(resolve, attempts * 1000));
              continue;
            }
            console.log('ℹ️ Nessuna sessione attiva');
            sessionStorage.removeItem('expected-session');
            setUser(null);
          }
          break; // Successo, esci dal loop
          
        } catch (error) {
          console.error(`❌ Errore controllo sessione tentativo ${attempts}:`, error);
          if (attempts < maxAttempts) {
            // Attesa progressiva
            await new Promise(resolve => setTimeout(resolve, attempts * 1000));
          } else {
            // Dopo tutti i tentativi falliti
            console.log('❌ Controllo sessione completamente fallito');
            setUser(null);
          }
        }
      }
      
      setLoading(false);
    };

    checkUser();

    // Ascolta i cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      if (session?.user) {
        console.log('👤 Utente:', session.user.email);
        console.log('📧 Email confermata:', session.user.email_confirmed_at ? 'Sì' : 'No');
        console.log('⏰ Sessione scade:', new Date(session.expires_at! * 1000).toLocaleString());
      }

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ Utente loggato - sessione persistente attiva');
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 Utente disconnesso');
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token aggiornato - sessione estesa');
          await loadUserProfile(session.user);
        } else if (event === 'INITIAL_SESSION' && session?.user) {
          console.log('🔄 Sessione iniziale recuperata');
          await loadUserProfile(session.user);
        } else {
          // Altri eventi
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Errore gestione auth state change:', error);
        setLoading(false);
      }
    });

    // Mantieni la sessione attiva con refresh periodico
    const keepSessionAlive = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Refresh token se la sessione è vicina alla scadenza (< 10 minuti)
          const expiresAt = session.expires_at! * 1000;
          const now = Date.now();
          const tenMinutes = 10 * 60 * 1000;
          
          if (expiresAt - now < tenMinutes) {
            console.log('🔄 Refresh token preventivo...');
            await supabase.auth.refreshSession();
          }
        }
      } catch (error) {
        console.warn('⚠️ Errore refresh preventivo:', error);
      }
    }, 5 * 60 * 1000); // Ogni 5 minuti

    return () => {
      subscription.unsubscribe();
      clearInterval(keepSessionAlive);
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('🔄 Caricamento profilo per utente:', supabaseUser.id);
      
      // Prima imposta l'utente con i dati di base per evitare blocchi
      const basicUser = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Utente',
        created_at: supabaseUser.created_at
      };
      
      console.log('✅ Impostazione utente con dati base:', basicUser);
      setUser(basicUser);
      setLoading(false); // IMPORTANTE: imposta loading a false subito
      
      // Poi prova a caricare il profilo dal database (opzionale)
      try {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('auth_user_id', supabaseUser.id)
          .single();

        if (profile && !error) {
          console.log('✅ Profilo trovato nel database, aggiornamento dati:', profile);
          setUser({
            id: profile.id,
            email: supabaseUser.email || '',
            name: profile.name,
            created_at: profile.created_at || supabaseUser.created_at
          });
        } else {
          console.log('⚠️ Profilo non trovato nel database, uso dati base');
        }
      } catch (dbError) {
        console.log('⚠️ Database non accessibile, uso dati base:', dbError);
        // L'utente è già impostato con i dati base, quindi continuiamo
      }
    } catch (error) {
      console.error('❌ Errore generale loadUserProfile:', error);
      // Fallback: imposta comunque l'utente con dati minimi
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.email?.split('@')[0] || 'Utente',
        created_at: supabaseUser.created_at
      });
      setLoading(false); // IMPORTANTE: imposta loading a false anche in caso di errore
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        setLoading(true);
        attempts++;
        
        console.log(`🔄 Tentativo login ${attempts}/${maxAttempts} per:`, email);
        
        // Login senza timeout - lasciamo che Supabase gestisca i suoi tempi
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          console.error(`❌ Errore login tentativo ${attempts}:`, error);
          
          // Se è l'ultimo tentativo, mostra errore
          if (attempts === maxAttempts) {
            if (error.message.includes('Invalid login')) {
              alert('Email o password non corretti');
            } else if (error.message.includes('Email not confirmed')) {
              alert('Devi confermare la tua email prima di accedere. Controlla la tua casella di posta.');
            } else if (error.message.includes('Too many requests')) {
              alert('Troppi tentativi di login. Riprova tra qualche minuto.');
            } else {
              alert(`Errore: ${error.message}`);
            }
          } else {
            // Attendi 2 secondi prima del prossimo tentativo
            console.log(`⏳ Attendo 2s prima del tentativo ${attempts + 1}...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          return false;
        }

        console.log('✅ Login Supabase completato:', data);

        if (data.user && data.session) {
          console.log('🔄 Caricamento profilo utente...');
          console.log('💾 Sessione salvata in localStorage:', data.session.expires_at ? new Date(data.session.expires_at * 1000).toLocaleString() : 'Scadenza non specificata');
          
          // Caricamento profilo semplificato senza timeout
          try {
            await loadUserProfile(data.user);
          } catch (profileError) {
            console.warn('⚠️ Errore caricamento profilo, uso dati base:', profileError);
            // Imposta utente di base se il profilo non si carica
            setUser({
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.email?.split('@')[0] || 'Utente',
              created_at: data.user.created_at
            });
          }
          
          // Verifica immediata che la sessione sia stata salvata
          setTimeout(async () => {
            const { data: { session: savedSession } } = await supabase.auth.getSession();
            if (savedSession) {
              console.log('✅ Sessione verificata e persistente dopo login');
            } else {
              console.warn('⚠️ Sessione non trovata dopo login - possibile problema di persistenza');
            }
          }, 1000);
          
          console.log('✅ Login completato con successo!');
          return true;
        }

        return false;
      } catch (error: any) {
        console.error(`❌ Errore generale login tentativo ${attempts}:`, error);
        
        // Se è l'ultimo tentativo, mostra errore
        if (attempts === maxAttempts) {
          alert(`Errore di connessione: ${error.message || 'Problema di rete'}`);
          return false;
        } else {
          // Attendi 3 secondi prima del prossimo tentativo
          console.log(`⏳ Attendo 3s prima del tentativo ${attempts + 1}...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } finally {
        if (attempts === maxAttempts) {
          setLoading(false);
        }
      }
    }
    
    return false;
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
        console.error('❌ Errore registrazione Supabase:', error);
        alert(`Errore registrazione: ${error.message}`);
        return false;
      }

      console.log('✅ Registrazione Supabase completata:', data);

      if (data.user && data.session) {
        console.log('🔄 Creazione profilo utente...');
        
        // Aspetta un attimo per assicurarsi che l'utente sia completamente creato
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Crea il profilo utente nel database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            auth_user_id: data.user.id,
            name,
            age: 25,
            height: 170,
            current_weight: 70,
            start_weight: 70,
            target_weight: 65,
            activity_level: 'moderate',
            goal: 'fat-loss',
            intermittent_fasting: false,
            lactose_intolerant: false,
            target_calories: 1800,
            target_water: 2500
          });

        if (profileError) {
          console.error('❌ Errore creazione profilo:', profileError);
          alert(`Errore creazione profilo: ${profileError.message}`);
          // Continua comunque, il profilo può essere creato successivamente
        } else {
          console.log('✅ Profilo creato con successo');
        }

        // Imposta subito l'utente
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          created_at: data.user.created_at
        });

        // Segna come nuovo utente per redirect al profilo
        setIsNewUser(true);
        console.log('✅ Nuovo utente registrato - redirect al profilo necessario');

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
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const markProfileCompleted = () => {
    setIsNewUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isNewUser, signIn, signUp, signOut, markProfileCompleted }}>
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

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
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Controlla se c'è già un utente loggato
    const checkUser = async () => {
      try {
        console.log('🔄 Controllo sessione esistente...');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('✅ Sessione trovata per:', session.user.email);
          console.log('📧 Email confermata:', session.user.email_confirmed_at ? 'Sì' : 'No');
          await loadUserProfile(session.user);
        } else {
          console.log('ℹ️ Nessuna sessione attiva');
        }
      } catch (error) {
        console.error('❌ Errore controllo sessione:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Ascolta i cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      if (session?.user) {
        console.log('👤 Utente:', session.user.email);
        console.log('📧 Email confermata:', session.user.email_confirmed_at ? 'Sì' : 'No');
      }

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
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      console.log('🔄 Tentativo login per:', email);
      
      // Timeout più lungo per connessioni lente
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout connessione')), 30000); // 30 secondi
      });

      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ Errore login Supabase:', error);
        
        // Gestione errori più specifica
        if (error.message.includes('Invalid login')) {
          alert('Email o password non corretti');
        } else if (error.message.includes('Email not confirmed')) {
          alert('Devi confermare la tua email prima di accedere. Controlla la tua casella di posta.');
        } else if (error.message.includes('Too many requests')) {
          alert('Troppi tentativi di login. Riprova tra qualche minuto.');
        } else {
          alert(`Errore: ${error.message}`);
        }
        return false;
      }

      console.log('✅ Login Supabase completato:', data);

      if (data.user && data.session) {
        console.log('🔄 Caricamento profilo utente...');
        
        // Caricamento profilo con timeout separato
        try {
          await Promise.race([
            loadUserProfile(data.user),
            new Promise<never>((_, reject) => {
              setTimeout(() => reject(new Error('Timeout caricamento profilo')), 15000);
            })
          ]);
        } catch (profileError) {
          console.warn('⚠️ Errore caricamento profilo, ma continuo con login:', profileError);
          // Imposta utente di base anche se il profilo non si carica
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.email?.split('@')[0] || 'Utente',
            created_at: data.user.created_at
          });
        }
        
        console.log('✅ Login completato con successo!');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('❌ Errore generale login:', error);
      
      if (error.message === 'Timeout connessione') {
        alert('❌ Timeout durante il login. Controlla la tua connessione internet e riprova.');
      } else if (error.message === 'Timeout caricamento profilo') {
        alert('⚠️ Login completato ma caricamento profilo lento. Ricarica la pagina se necessario.');
        return true; // Login riuscito anche se profilo non caricato
      } else {
        alert(`Errore di connessione: ${error.message}`);
      }
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

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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

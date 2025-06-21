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
    // Timeout di sicurezza per evitare caricamento infinito
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Controlla se c'è già un utente loggato
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        // Fallback silenzioso
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    checkUser();

    // Ascolta i cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        await loadUserProfile(session.user);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Cerca il profilo utente nel database
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', supabaseUser.id)
        .single();

      if (profile) {
        setUser({
          id: profile.id,
          email: supabaseUser.email || '',
          name: profile.name,
          created_at: profile.created_at || supabaseUser.created_at
        });
      } else {
        // Fallback con dati di base
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Utente',
          created_at: supabaseUser.created_at
        });
      }
    } catch (error) {
      // Fallback silenzioso
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: 'Utente',
        created_at: supabaseUser.created_at
      });
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Credenziali demo
      if (email === 'demo@cutburn.com' && password === 'demo123') {
        setUser({
          id: 'demo_user',
          email: 'demo@cutburn.com',
          name: 'Utente Demo',
          created_at: new Date().toISOString()
        });
        return true;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return false;
      }

      if (data.user && data.session) {
        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      
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
        return false;
      }

      if (data.user && data.session) {
        // Crea il profilo utente nel database
        try {
          await supabase
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
              target_calories: 1800,
              target_water: 2500
            });
        } catch (profileError) {
          // Continua anche se la creazione del profilo fallisce
        }

        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
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
      // Fallback silenzioso
      setUser(null);
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

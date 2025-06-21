
import { useState, useEffect, createContext, useContext } from 'react';

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
  // Utente fittizio per bypassare l'autenticazione
  const [user] = useState<User>({
    id: 'demo_user',
    email: 'demo@cutburn.com',
    name: 'Utente Demo',
    created_at: new Date().toISOString()
  });
  const [loading] = useState(false);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    return true;
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    return true;
  };

  const signOut = async () => {
    // Non fa nulla
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

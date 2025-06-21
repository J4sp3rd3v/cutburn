
import { useState, useEffect, createContext, useContext } from 'react';
import { useLocalStorage } from './useLocalStorage';

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
  const [user, setUser] = useLocalStorage<User | null>('currentUser', null);
  const [users, setUsers] = useLocalStorage<User[]>('registeredUsers', []);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setLoading(false);
      return false;
    }
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name: name || 'Utente',
      created_at: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setLoading(false);
    return true;
  };

  const signOut = async () => {
    setUser(null);
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

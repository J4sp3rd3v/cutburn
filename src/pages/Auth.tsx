
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { TrendingDown, Mail, Lock, User, AlertCircle } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const success = await signUp(email, password, name);
    
    if (success) {
      setMessage('Registrazione completata! Bentornato!');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setError('Utente già esistente o errore nella registrazione');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await signIn(email, password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Email o password non corretti');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              CutBurn
            </h1>
          </div>
          <p className="text-slate-600">
            Il tuo percorso di trasformazione inizia qui
          </p>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Accedi</TabsTrigger>
              <TabsTrigger value="signup">Registrati</TabsTrigger>
            </TabsList>

            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marco@esempio.com"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password" className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Password</span>
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
                  disabled={loading}
                >
                  {loading ? 'Accesso in corso...' : 'Accedi'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Nome</span>
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marco"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marco@esempio.com"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Password</span>
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
                  disabled={loading}
                >
                  {loading ? 'Registrazione in corso...' : 'Registrati'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6 text-sm text-slate-600">
          <p>Accedendo accetti i nostri</p>
          <p>Termini di Servizio e Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EmailConfirm from "./pages/EmailConfirm";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";
import { usePWAInstall } from './hooks/usePWAInstall';
import { Button } from './components/ui/button';
import { Download, TrendingDown } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minuti
    },
  },
});

const AppRoutes = () => {
  const { user, loading, isNewUser } = useAuth();
  const { installPrompt, triggerInstall } = usePWAInstall();

  // Mostra una schermata di caricamento globale mentre si verifica l'autenticazione
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <TrendingDown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-700">Caricamento in corso...</h1>
        <p className="text-slate-500">Verifica della sessione sicura.</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Index /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/" replace /> : <Auth />} 
        />
        <Route 
          path="/auth/confirm" 
          element={<EmailConfirm />} 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {installPrompt && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={triggerInstall} className="bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg animate-bounce">
            <Download className="mr-2 h-4 w-4" />
            Installa App
          </Button>
        </div>
      )}
    </BrowserRouter>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

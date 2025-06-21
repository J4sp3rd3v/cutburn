import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EmailConfirm from "./pages/EmailConfirm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [forceReady, setForceReady] = useState(false);

  // Timeout di sicurezza per evitare caricamento infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      setForceReady(true);
    }, 3000); // 3 secondi max di caricamento

    return () => clearTimeout(timeout);
  }, []);

  if (loading && !forceReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600 text-lg">Caricamento CutBurn Pro...</p>
          <p className="text-gray-400 text-sm mt-2">Preparazione ricette stellate...</p>
        </div>
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
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

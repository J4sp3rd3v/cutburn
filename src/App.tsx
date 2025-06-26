import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";
import { usePWAInstall } from './hooks/usePWAInstall';
import { Button } from './components/ui/button';
import { Download } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minuti
    },
  },
});

const App = () => {
  const { installPrompt, triggerInstall } = usePWAInstall();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
      <Routes>
              <Route path="/" element={<Index />} />
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
          </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);
};

export default App;

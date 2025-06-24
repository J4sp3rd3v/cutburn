
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Error Boundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearCache = async () => {
    try {
      // Cancella tutto
      localStorage.clear();
      sessionStorage.clear();
      
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Ricarica
      window.location.reload();
    } catch (error) {
      console.error('Errore pulizia cache:', error);
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-xl font-bold text-slate-800 mb-2">
              Oops! Qualcosa è andato storto
            </h1>
            
            <p className="text-slate-600 mb-6">
              L'applicazione ha riscontrato un errore. Prova a ricaricare la pagina o pulire la cache.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleReload}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Ricarica Pagina
              </Button>
              
              <Button 
                onClick={this.handleClearCache}
                className="w-full"
                variant="outline"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Pulisci Cache e Ricarica
              </Button>
            </div>
            
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-slate-500 cursor-pointer">
                  Dettagli errore (per sviluppatori)
                </summary>
                <pre className="text-xs text-slate-400 mt-2 bg-slate-100 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

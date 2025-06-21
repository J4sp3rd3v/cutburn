import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';

export default function EmailConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('🔄 Gestione conferma email...');
        
        // Ottieni i parametri dalla URL
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        console.log('📧 Parametri URL:', { token_hash: token_hash?.substring(0, 10) + '...', type });

        if (token_hash && type) {
          // Verifica il token di conferma
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any
          });

          if (error) {
            console.error('❌ Errore conferma email:', error);
            setStatus('error');
            setMessage(`Errore nella conferma: ${error.message}`);
          } else if (data.user) {
            console.log('✅ Email confermata con successo!', data.user.email);
            setStatus('success');
            setMessage('Email confermata con successo! Verrai reindirizzato alla dashboard...');
            
            // Reindirizza dopo 3 secondi
            setTimeout(() => {
              navigate('/');
            }, 3000);
          } else {
            setStatus('error');
            setMessage('Conferma fallita - dati utente non validi');
          }
        } else {
          console.log('⚠️ Parametri URL mancanti');
          setStatus('error');
          setMessage('Link di conferma non valido o scaduto');
        }
      } catch (error) {
        console.error('❌ Errore generale conferma email:', error);
        setStatus('error');
        setMessage('Errore durante la conferma email');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  const resendConfirmation = async () => {
    try {
      const email = prompt('Inserisci la tua email per rinviare la conferma:');
      if (!email) return;

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        alert(`Errore: ${error.message}`);
      } else {
        alert('Email di conferma inviata! Controlla la tua casella di posta.');
      }
    } catch (error) {
      alert('Errore durante l\'invio dell\'email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'loading' && <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
            {status === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
          </div>
          
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Conferma Email...'}
            {status === 'success' && 'Email Confermata!'}
            {status === 'error' && 'Conferma Fallita'}
          </CardTitle>
          
          <CardDescription>
            {status === 'loading' && 'Stiamo verificando il tuo link di conferma...'}
            {status === 'success' && 'Il tuo account è stato attivato con successo'}
            {status === 'error' && 'Si è verificato un problema con la conferma'}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            {message}
          </p>

          {status === 'success' && (
            <div className="space-y-2">
              <p className="text-sm text-green-600">
                🎉 Benvenuto in CutBurn! Ora puoi accedere al tuo account.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full"
              >
                Vai al Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <p className="text-sm text-red-600">
                Il link potrebbe essere scaduto o non valido.
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={resendConfirmation}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reinvia Email di Conferma
                </Button>
                
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="secondary"
                  className="w-full"
                >
                  Torna al Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
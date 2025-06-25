import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// --- Script di Pulizia Service Worker ---
// Questo codice cerca e rimuove attivamente qualsiasi vecchio service worker.
// Risolve il problema della cache persistente che obbliga a pulire i dati del sito.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('🧹 Old service worker unregistered successfully');
    }
  }).catch(function(err) {
    console.error('Service worker unregistration failed: ', err);
  });
}
// --- Fine Script di Pulizia ---

createRoot(document.getElementById("root")!).render(<App />);

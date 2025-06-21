# CutBurn Pro - Fitness & Fat Loss Tracker

Un'applicazione completa per il fitness e la perdita di peso con integrazione Supabase.

## 🚀 Configurazione rapida

### 1. Installazione
```bash
git clone https://github.com/J4sp3rd3v/cutburn.git
cd cutburn
npm install
```

### 2. Configurazione Supabase
1. Copia il file `.env.example` in `.env.local`:
```bash
cp .env.example .env.local
```

2. Modifica `.env.local` con le tue credenziali Supabase:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Avvio locale
```bash
npm run dev
```

## 📱 Deploy su Vercel

### 1. Collega il repository su Vercel
1. Vai su [vercel.com](https://vercel.com)
2. Importa il tuo repository GitHub
3. Vercel rileverà automaticamente che è un progetto Vite

### 2. Configura le variabili d'ambiente su Vercel
Nella dashboard di Vercel, aggiungi queste variabili d'ambiente:

- `VITE_SUPABASE_URL`: Il tuo URL Supabase
- `VITE_SUPABASE_ANON_KEY`: La tua chiave pubblica Supabase

### 3. Deploy
Il deploy avverrà automaticamente ad ogni push su main.

## 🔧 Tecnologie utilizzate

- **React** + **TypeScript** + **Vite**
- **Supabase** per database e autenticazione
- **Tailwind CSS** + **shadcn/ui** per l'interfaccia
- **React Query** per la gestione dello stato
- **React Router** per la navigazione

## 📊 Funzionalità

- **Dashboard personalizzato** con tracking calorico
- **Tracciamento pasti** e macro nutrienti
- **Sistema di supplementazione**
- **Programmi di allenamento**
- **Lista della spesa** intelligente
- **Profilo utente** personalizzabile
- **Tracking del progresso** settimanale

## 🏗️ Struttura del progetto

```
src/
├── components/        # Componenti UI riutilizzabili
├── hooks/            # React hooks personalizzati
├── integrations/     # Configurazioni Supabase
├── pages/            # Pagine dell'applicazione
└── lib/              # Utilities e helper functions
```

## 🔐 Sicurezza

- Le credenziali Supabase sono gestite tramite variabili d'ambiente
- Il file `.env.local` è ignorato da Git per la sicurezza
- Utilizza sempre le variabili d'ambiente per le configurazioni sensibili

## 🌐 URL live

- **Vercel**: [cutburn.vercel.app](https://cutburn.vercel.app)

## 📝 Note

- L'applicazione è attualmente configurata con un utente demo
- Per implementare l'autenticazione completa, rimuovere il mock user da `useAuth.tsx`

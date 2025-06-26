# CutBurn Pro - Fitness & Fat Loss Tracker

Un'applicazione completa per il fitness e la perdita di peso con storage locale e ricette Bimby TM5.

## 🚀 Configurazione rapida

### 1. Installazione
```bash
git clone https://github.com/J4sp3rd3v/cutburn.git
cd cutburn
npm install
```

### 2. Avvio locale
```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:8080`

## 📱 Deploy su Vercel

### 1. Collega il repository su Vercel
1. Vai su [vercel.com](https://vercel.com)
2. Importa il tuo repository GitHub
3. Vercel rileverà automaticamente che è un progetto Vite

### 2. Deploy
Il deploy avverrà automaticamente ad ogni push su main.

## 🔧 Tecnologie utilizzate

- **React** + **TypeScript** + **Vite**
- **LocalStorage** per persistenza dati
- **Tailwind CSS** + **shadcn/ui** per l'interfaccia
- **React Query** per la gestione dello stato
- **React Router** per la navigazione

## 📊 Funzionalità

- **Dashboard scientifico** con calcoli personalizzati BMR/TDEE
- **Selezione grasso localizzato** (addominale, ginecomastia, maniglie dell'amore, ecc.)
- **Dieta personalizzata** con deficit ottimizzato per tipo di grasso
- **Ricette Bimby TM5** con ingredienti facilmente reperibili
- **Lista della spesa settimanale** con grammature precise
- **Sistema di supplementazione** specifico per obiettivo
- **Programmi di allenamento** personalizzati
- **Tracking del progresso** completo
- **PWA installabile** su mobile e desktop

## 🍽️ Ricette Bimby TM5 Incluse

- **Snack Proteici Vegani Falafel Style** (26g proteine/100g)
- **Burger Proteico Cannellini Facile** (16g proteine/burger)
- **Cinnamon Rolls Fit Domenicali** (cheat meal bilanciato)

Tutte le ricette sono ottimizzate per:
- Ingredienti facilmente reperibili nei supermercati
- Istruzioni semplificate per Bimby TM5
- Alternative per ingredienti costosi o rari
- Compatibilità con obiettivi di perdita grasso

## 🏗️ Struttura del progetto

```
src/
├── components/        # Componenti UI riutilizzabili
├── hooks/            # React hooks personalizzati
├── pages/            # Pagine dell'applicazione
└── lib/              # Utilities e helper functions
```

## 💾 Storage

- **Completamente locale**: tutti i dati sono salvati nel LocalStorage
- **Nessun server richiesto**: funziona offline dopo il primo caricamento
- **Privacy garantita**: i tuoi dati rimangono sul tuo dispositivo

## 🌐 URL live

- **Vercel**: [cutburn.vercel.app](https://cutburn.vercel.app)

## 📱 PWA (Progressive Web App)

L'app può essere installata come applicazione nativa su:
- **Mobile**: Android e iOS
- **Desktop**: Windows, macOS, Linux

Cerca il pulsante "Installa App" nell'interfaccia.

## 🎯 Caratteristiche Scientifiche

- **Calcoli BMR/TDEE** precisi basati su età, peso, altezza, attività
- **Deficit calorico personalizzato** per tipo di grasso localizzato
- **Macronutrienti ottimizzati** per ogni obiettivo specifico
- **Supplementazione mirata** basata su evidenze scientifiche
- **Lista spesa con grammature** calcolate per 14 giorni

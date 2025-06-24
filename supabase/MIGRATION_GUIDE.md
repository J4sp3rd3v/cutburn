# Guida Migrazione Database - Fix Zeri nei Campi

## 🎯 Problema Risolto
Eliminati definitivamente gli zeri che apparivano nei campi input del profilo utente.

## 📊 Migrazione Database

### Passo 1: Accedi al Dashboard Supabase
1. Vai su [supabase.com](https://supabase.com)
2. Accedi al tuo progetto
3. Vai su **SQL Editor**

### Passo 2: Esegui la Migrazione
Copia e incolla il seguente codice SQL:

```sql
-- Migrazione per permettere valori NULL nei campi del profilo
-- Risolve il problema degli zeri nei campi input

-- Modifica la tabella user_profiles per permettere NULL nei campi fisici
ALTER TABLE user_profiles 
  ALTER COLUMN age DROP NOT NULL,
  ALTER COLUMN height DROP NOT NULL,
  ALTER COLUMN current_weight DROP NOT NULL,
  ALTER COLUMN start_weight DROP NOT NULL,
  ALTER COLUMN target_weight DROP NOT NULL,
  ALTER COLUMN target_calories DROP NOT NULL,
  ALTER COLUMN target_water DROP NOT NULL;

-- Aggiorna i record esistenti che hanno valore 0 impostandoli a NULL
UPDATE user_profiles 
SET 
  age = CASE WHEN age = 0 THEN NULL ELSE age END,
  height = CASE WHEN height = 0 THEN NULL ELSE height END,
  current_weight = CASE WHEN current_weight = 0 THEN NULL ELSE current_weight END,
  start_weight = CASE WHEN start_weight = 0 THEN NULL ELSE start_weight END,
  target_weight = CASE WHEN target_weight = 0 THEN NULL ELSE target_weight END,
  target_calories = CASE WHEN target_calories = 0 THEN NULL ELSE target_calories END,
  target_water = CASE WHEN target_water = 0 THEN NULL ELSE target_water END;

-- Aggiorna anche la tabella weekly_progress per permettere NULL
ALTER TABLE weekly_progress 
  ALTER COLUMN weight DROP NOT NULL;

-- Aggiorna i record esistenti nella tabella weekly_progress
UPDATE weekly_progress 
SET weight = CASE WHEN weight = 0 THEN NULL ELSE weight END;

-- Aggiorna la tabella daily_progress per permettere NULL nel peso
-- (weight è già nullable, ma assicuriamoci)
UPDATE daily_progress 
SET weight = CASE WHEN weight = 0 THEN NULL ELSE weight END;

-- Commento per documentare la migrazione
COMMENT ON TABLE user_profiles IS 'Tabella profili utente - Aggiornata per permettere NULL nei campi fisici';
```

### Passo 3: Esegui la Query
1. Clicca su **Run** per eseguire la migrazione
2. Verifica che non ci siano errori
3. Controlla che la query sia stata eseguita con successo

## ✅ Verifica Post-Migrazione

### Controlla la Struttura
```sql
-- Verifica che i campi ora permettano NULL
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('age', 'height', 'current_weight', 'target_weight');
```

### Controlla i Dati
```sql
-- Verifica che i valori 0 siano stati convertiti in NULL
SELECT name, age, height, current_weight, target_weight 
FROM user_profiles 
LIMIT 10;
```

## 🎯 Risultato Finale

Dopo la migrazione:
- ✅ Campi del profilo completamente vuoti per nuovi utenti
- ✅ Nessun zero visualizzato nei form
- ✅ Digitazione naturale senza caratteri indesiderati
- ✅ Database sincronizzato con frontend

## 🔄 Commit GitHub

La correzione è stata pushata su GitHub con commit:
- **Hash**: `be41044`
- **Messaggio**: "🔧 Fix DEFINITIVO: Eliminati zeri da database e frontend"

## 📝 File Modificati

1. `src/components/UserProfile.tsx` - Frontend fix
2. `supabase/migrations/002_allow_null_profile_fields.sql` - Database migration
3. `supabase/MIGRATION_GUIDE.md` - Questa guida

---

**⚠️ IMPORTANTE**: Esegui questa migrazione **PRIMA** di usare l'app aggiornata per garantire la compatibilità completa. 
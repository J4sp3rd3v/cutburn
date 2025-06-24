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
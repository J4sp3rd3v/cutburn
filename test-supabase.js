// Test script per verificare connessione Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tpajqgopbyyflomvkmly.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYWpxZ29wYnl5ZmxvbXZrbWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTU0NDQsImV4cCI6MjA2NjA5MTQ0NH0.s2SBDWqwNIWgu1u7n9AtiLgIyuTn0SjTfRYx7htzGOI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log('🔍 Testando connessione a Supabase...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count(*)')
      .single();
    
    if (error) {
      console.error('❌ Errore connessione:', error);
      console.log('\n📋 Per risolvere, esegui questo SQL su Supabase:');
      console.log(`
-- Drop all tables if they exist
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS weekly_progress CASCADE;
DROP TABLE IF EXISTS daily_progress CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  height NUMERIC NOT NULL,
  current_weight NUMERIC NOT NULL,
  start_weight NUMERIC NOT NULL,
  target_weight NUMERIC NOT NULL,
  activity_level TEXT NOT NULL,
  goal TEXT NOT NULL,
  intermittent_fasting BOOLEAN DEFAULT false,
  lactose_intolerant BOOLEAN DEFAULT false,
  target_calories INTEGER NOT NULL,
  target_water INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for testing
CREATE POLICY "Allow all operations" ON user_profiles FOR ALL USING (true);

-- Insert demo data
INSERT INTO user_profiles (
  name, age, height, current_weight, start_weight, target_weight,
  activity_level, goal, intermittent_fasting, lactose_intolerant,
  target_calories, target_water
) VALUES (
  'Marco Demo', 30, 173, 69, 69, 65,
  'moderate', 'fat-loss', true, false,
  1700, 2500
);
      `);
      return false;
    }
    
    console.log('✅ Connessione a Supabase OK!');
    console.log('🗄️ Database configurato correttamente');
    return true;
    
  } catch (err) {
    console.error('❌ Errore durante il test:', err);
    return false;
  }
}

// Esegui test
testConnection().then((success) => {
  if (success) {
    console.log('\n🚀 Tutto pronto! Puoi usare l\'app.');
  } else {
    console.log('\n🔧 Configura il database prima di continuare.');
  }
  process.exit(success ? 0 : 1);
}); 
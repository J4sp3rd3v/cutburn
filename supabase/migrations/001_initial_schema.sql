-- Enable Row Level Security
-- JWT secret is managed by Supabase cloud

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  height NUMERIC NOT NULL,
  current_weight NUMERIC NOT NULL,
  start_weight NUMERIC NOT NULL,
  target_weight NUMERIC NOT NULL,
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal TEXT NOT NULL CHECK (goal IN ('fat-loss', 'muscle-gain', 'maintenance')),
  intermittent_fasting BOOLEAN DEFAULT false,
  lactose_intolerant BOOLEAN DEFAULT false,
  target_calories INTEGER NOT NULL,
  target_water INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily_progress table
CREATE TABLE daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  water INTEGER DEFAULT 0,
  calories INTEGER DEFAULT 0,
  weight NUMERIC,
  workout_completed BOOLEAN DEFAULT false,
  supplements_taken INTEGER DEFAULT 0,
  shots_consumed TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create meals table
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('colazione', 'pranzo', 'spuntino', 'cena')),
  calories INTEGER NOT NULL,
  protein NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  fat NUMERIC NOT NULL,
  foods TEXT[] NOT NULL,
  eaten BOOLEAN DEFAULT false,
  eaten_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create weekly_progress table
CREATE TABLE weekly_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth_user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can view own daily progress" ON daily_progress FOR SELECT USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can update own daily progress" ON daily_progress FOR UPDATE USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can insert own daily progress" ON daily_progress FOR INSERT WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view own meals" ON meals FOR SELECT USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can update own meals" ON meals FOR UPDATE USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can insert own meals" ON meals FOR INSERT WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view own weekly progress" ON weekly_progress FOR SELECT USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can update own weekly progress" ON weekly_progress FOR UPDATE USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can insert own weekly progress" ON weekly_progress FOR INSERT WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_progress_updated_at BEFORE UPDATE ON daily_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Demo data removed to prevent database state issues. 
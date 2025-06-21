
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { toast } from '@/hooks/use-toast';

interface DailyProgress {
  date: string;
  water: number;
  calories: number;
  weight?: number;
  workoutCompleted: boolean;
  supplementsTaken: number;
  shotsConsumed: string[];
}

interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number;
  currentWeight: number;
  startWeight: number;
  targetWeight: number;
  activityLevel: string;
  goal: string;
  intermittentFasting: boolean;
  lactoseIntolerant: boolean;
  targetCalories: number;
  targetWater: number;
  created_at: string;
}

export const useProgressTracking = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', {
    id: 'user-1',
    name: 'Marco',
    age: 30,
    height: 173,
    currentWeight: 69,
    startWeight: 69,
    targetWeight: 65,
    activityLevel: 'moderate',
    goal: 'fat-loss',
    intermittentFasting: true,
    lactoseIntolerant: false,
    targetCalories: 1700,
    targetWater: 2500,
    created_at: new Date().toISOString()
  });

  const today = new Date().toISOString().split('T')[0];
  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress>(`dailyProgress_${today}`, {
    date: today,
    water: 0,
    calories: 0,
    workoutCompleted: false,
    supplementsTaken: 0,
    shotsConsumed: []
  });

  const [weeklyProgress, setWeeklyProgress] = useLocalStorage<Array<{ date: string; weight: number }>>('weeklyProgress', []);

  const addWater = () => {
    if (!userProfile) return;
    
    const newWater = Math.min(dailyProgress.water + 500, userProfile.targetWater);
    setDailyProgress(prev => ({ ...prev, water: newWater }));
    
    if (newWater >= userProfile.targetWater) {
      toast({
        title: "Obiettivo raggiunto! 💧",
        description: "Hai bevuto abbastanza acqua oggi!",
      });
    }
  };

  const addCalories = (amount: number) => {
    if (!userProfile) return;
    
    const newCalories = Math.min(dailyProgress.calories + amount, userProfile.targetCalories);
    setDailyProgress(prev => ({ ...prev, calories: newCalories }));
  };

  const updateWeight = (weight: number) => {
    if (!userProfile) return;

    // Update profile
    setUserProfile(prev => prev ? { ...prev, currentWeight: weight } : null);

    // Update daily progress
    setDailyProgress(prev => ({ ...prev, weight }));

    // Update weekly progress
    const newEntry = { date: today, weight };
    setWeeklyProgress(prev => {
      const filtered = prev.filter(entry => entry.date !== today);
      return [...filtered, newEntry].slice(-7);
    });

    toast({
      title: "Peso aggiornato",
      description: `Nuovo peso: ${weight}kg`,
    });
  };

  const addShot = (shotType: string) => {
    const newShots = [...dailyProgress.shotsConsumed, shotType];
    setDailyProgress(prev => ({ ...prev, shotsConsumed: newShots }));
    
    toast({
      title: "Shot registrato! 🥤",
      description: `${shotType} aggiunto al tracking`,
    });
  };

  const toggleWorkout = () => {
    const newWorkoutStatus = !dailyProgress.workoutCompleted;
    setDailyProgress(prev => ({ ...prev, workoutCompleted: newWorkoutStatus }));
    
    if (newWorkoutStatus) {
      toast({
        title: "Workout completato! 💪",
        description: "Ottimo lavoro oggi!",
      });
    }
  };

  return {
    dailyProgress,
    userProfile,
    loading: false,
    addWater,
    addCalories,
    updateWeight,
    addShot,
    toggleWorkout,
    getWeeklyProgress: () => weeklyProgress
  };
};

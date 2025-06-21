
import { useState, useEffect } from 'react';

interface DailyProgress {
  date: string;
  water: number;
  calories: number;
  weight?: number;
  workoutCompleted: boolean;
  supplementsTaken: number;
  shotsConsumed: string[];
}

interface UserStats {
  targetWater: number;
  targetCalories: number;
  currentWeight: number;
  startWeight: number;
  startDate: string;
}

export const useProgressTracking = () => {
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`dailyProgress_${today}`);
    return saved ? JSON.parse(saved) : {
      date: today,
      water: 0,
      calories: 0,
      workoutCompleted: false,
      supplementsTaken: 0,
      shotsConsumed: []
    };
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      targetWater: 2500, // 2.5L default
      targetCalories: 1700,
      currentWeight: 69,
      startWeight: 69,
      startDate: new Date().toISOString().split('T')[0]
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`dailyProgress_${today}`, JSON.stringify(dailyProgress));
  }, [dailyProgress]);

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  const addWater = () => {
    setDailyProgress(prev => ({
      ...prev,
      water: Math.min(prev.water + 500, userStats.targetWater)
    }));
  };

  const addCalories = (amount: number) => {
    setDailyProgress(prev => ({
      ...prev,
      calories: Math.min(prev.calories + amount, userStats.targetCalories)
    }));
  };

  const updateWeight = (weight: number) => {
    setUserStats(prev => ({
      ...prev,
      currentWeight: weight
    }));
    
    const today = new Date().toISOString().split('T')[0];
    setDailyProgress(prev => ({
      ...prev,
      weight: weight
    }));
  };

  const addShot = (shotType: string) => {
    setDailyProgress(prev => ({
      ...prev,
      shotsConsumed: [...prev.shotsConsumed, shotType]
    }));
  };

  const toggleWorkout = () => {
    setDailyProgress(prev => ({
      ...prev,
      workoutCompleted: !prev.workoutCompleted
    }));
  };

  const getWeeklyProgress = () => {
    const weights = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = localStorage.getItem(`dailyProgress_${dateStr}`);
      if (dayData) {
        const parsed = JSON.parse(dayData);
        if (parsed.weight) {
          weights.push({ date: dateStr, weight: parsed.weight });
        }
      }
    }
    return weights;
  };

  return {
    dailyProgress,
    userStats,
    addWater,
    addCalories,
    updateWeight,
    addShot,
    toggleWorkout,
    getWeeklyProgress,
    setUserStats
  };
};

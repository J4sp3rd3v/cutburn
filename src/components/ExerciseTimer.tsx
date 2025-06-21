
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

interface ExerciseTimerProps {
  restTime: number; // in seconds
  onComplete?: () => void;
}

const ExerciseTimer = ({ restTime, onComplete }: ExerciseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(restTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for beep sound
    audioRef.current = new Audio();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            playBeep();
            onComplete?.();
            return 0;
          }
          // Play beep at 10, 5, 4, 3, 2, 1 seconds
          if (prev <= 10 && prev > 1) {
            playBeep();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onComplete]);

  const playBeep = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(restTime);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (isCompleted) return 'text-green-600';
    if (timeLeft <= 10) return 'text-red-500';
    if (timeLeft <= 30) return 'text-orange-500';
    return 'text-blue-600';
  };

  return (
    <Card className="p-4 bg-slate-50 border-slate-200">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Volume2 className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Timer Riposo</span>
        </div>
        
        <div className={`text-4xl font-bold mb-4 ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </div>
        
        {isCompleted && (
          <div className="text-green-600 font-semibold mb-2">
            ✅ Riposo completato!
          </div>
        )}
        
        <div className="flex justify-center space-x-2">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              disabled={timeLeft === 0 && isCompleted}
              className="flex items-center space-x-1"
            >
              <Play className="w-4 h-4" />
              <span>Start</span>
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
              className="flex items-center space-x-1"
            >
              <Pause className="w-4 h-4" />
              <span>Pausa</span>
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex items-center space-x-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        </div>
        
        {timeLeft <= 10 && timeLeft > 0 && (
          <div className="mt-2 text-sm text-red-500 animate-pulse">
            Preparati per la prossima serie!
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExerciseTimer;

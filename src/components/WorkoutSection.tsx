import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Target, Dumbbell, Play, Check, Timer, Flame, Zap } from 'lucide-react';
import ExerciseTimer from '@/components/ExerciseTimer';

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

interface WorkoutSectionProps {
  userProfile: UserProfile;
}

const WorkoutSection: React.FC<WorkoutSectionProps> = ({ userProfile }) => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState('petto');
  const [showTimer, setShowTimer] = useState<string | null>(null);

  // Calcolo personalizzazione basata su profilo utente
  const getPersonalizedWeights = () => {
    const weightFactor = userProfile.currentWeight / 70; // Base 70kg
    const experienceMultiplier = userProfile.activityLevel === 'sedentary' ? 0.7 : 
                                userProfile.activityLevel === 'moderate' ? 1.0 : 1.3;
    
    return {
      light: Math.round(8 * weightFactor * experienceMultiplier),
      medium: Math.round(12 * weightFactor * experienceMultiplier),
      heavy: Math.round(16 * weightFactor * experienceMultiplier)
    };
  };

  const getPersonalizedSets = () => {
    if (userProfile.goal === 'fat-loss') {
      return { sets: '4', reps: '12-15', rest: 45 }; // Higher reps, shorter rest
    } else if (userProfile.goal === 'muscle-gain') {
      return { sets: '4', reps: '8-10', rest: 90 }; // Lower reps, longer rest
    }
    return { sets: '3', reps: '10-12', rest: 60 }; // Maintenance
  };

  const getWorkoutFocus = () => {
    if (userProfile.goal === 'fat-loss') {
      return {
        title: 'Allenamento Fat-Loss',
        subtitle: 'Massima ossidazione grassi • HIIT • Deficit calorico',
        primaryColor: 'from-red-500 to-orange-500'
      };
    } else if (userProfile.goal === 'muscle-gain') {
      return {
        title: 'Allenamento Massa',
        subtitle: 'Ipertrofia muscolare • Sovraccarico progressivo • Forza',
        primaryColor: 'from-blue-500 to-purple-500'
      };
    }
    return {
      title: 'Allenamento Mirato',
      subtitle: 'Tonificazione • Definizione • Benessere',
      primaryColor: 'from-purple-500 to-blue-500'
    };
  };

  const weights = getPersonalizedWeights();
  const setConfig = getPersonalizedSets();
  const workoutFocus = getWorkoutFocus();

  const workouts = {
    petto: {
      name: userProfile.goal === 'fat-loss' ? 'Petto Fat-Burn' : 'Petto & Tricipiti',
      duration: userProfile.goal === 'fat-loss' ? '35 min' : '45 min',
      focus: userProfile.goal === 'fat-loss' ? 
        'Brucia grassi pettorali, definizione estrema' : 
        'Sviluppo torace, definizione muscolare',
      exercises: [
        {
          id: 'bench-press',
          name: 'Panca Piana con Manubri',
          sets: `${setConfig.sets} x ${setConfig.reps}`,
          rest: `${setConfig.rest} sec`,
          restSeconds: setConfig.rest,
          weight: `${weights.medium}kg per braccio`,
          instructions: userProfile.goal === 'fat-loss' ? 
            'Tempo controllato 2-1-2. Focus brucia grassi, alta intensità.' :
            'Scendere lentamente, spingere esplosivamente. Focus sul centro del petto.',
          muscles: 'Torace, deltoidi anteriori'
        },
        {
          id: 'incline-press',
          name: 'Panca Inclinata 30°',
          sets: `${setConfig.sets} x ${setConfig.reps}`,
          rest: `${Math.round(setConfig.rest * 0.8)} sec`,
          restSeconds: Math.round(setConfig.rest * 0.8),
          weight: `${weights.light}kg per braccio`,
          instructions: userProfile.goal === 'fat-loss' ? 
            'Superserie possibili. Movimento esplosivo, massimo consumo calorico.' :
            'Inclinazione 30°. Movimento controllato, massima contrazione in alto.',
          muscles: 'Torace superiore'
        },
        {
          id: 'flyes',
          name: 'Croci su Panca',
          sets: `${setConfig.sets} x ${userProfile.goal === 'fat-loss' ? '15-20' : setConfig.reps}`,
          rest: `${Math.round(setConfig.rest * 0.7)} sec`,
          restSeconds: Math.round(setConfig.rest * 0.7),
          weight: `${weights.light}kg per braccio`,
          instructions: userProfile.goal === 'fat-loss' ? 
            'Range alto, tempo sotto tensione. Brucia grassi localizzati.' :
            'Movimento ad arco, sentire lo stretch. Non bloccare i gomiti.',
          muscles: 'Torace, definizione'
        },
        {
          id: 'push-ups',
          name: userProfile.goal === 'fat-loss' ? 'Flessioni Esplosive' : 'Flessioni Diamante',
          sets: userProfile.goal === 'fat-loss' ? '4 x 15-20' : '3 x max',
          rest: `${Math.round(setConfig.rest * 0.7)} sec`,
          restSeconds: Math.round(setConfig.rest * 0.7),
          weight: 'Corpo libero',
          instructions: userProfile.goal === 'fat-loss' ? 
            'Movimento esplosivo, cardio integrato. Massimo consumo calorico.' :
            'Mani a diamante, corpo rigido. Focus sui tricipiti.',
          muscles: userProfile.goal === 'fat-loss' ? 'Torace, cardio' : 'Tricipiti, torace interno'
        }
      ]
    },
    cardio: {
      name: userProfile.goal === 'fat-loss' ? 'HIIT Fat-Burn' : 'Cardio Brucia Grassi',
      duration: userProfile.goal === 'fat-loss' ? '25 min' : '30 min',
      focus: userProfile.goal === 'fat-loss' ? 
        'HIIT massimo, afterburn effect, grasso viscerale' : 
        'Ossidazione grassi, deficit calorico',
      exercises: [
        {
          id: 'treadmill',
          name: userProfile.goal === 'fat-loss' ? 'HIIT Estremo' : 'Tapis Roulant HIIT',
          sets: userProfile.goal === 'fat-loss' ? '8 rounds' : '5 rounds',
          rest: userProfile.goal === 'fat-loss' ? '30 sec recovery' : '60 sec recovery',
          restSeconds: userProfile.goal === 'fat-loss' ? 30 : 60,
          weight: 'Intensità variabile',
          instructions: userProfile.goal === 'fat-loss' ? 
            '30 sec sprint massimo, 30 sec recovery. FCmax 85-95%. Afterburn garantito.' :
            '2 min a 7 km/h, 1 min a 12 km/h. Mantenere frequenza cardiaca 75-85% FCmax.',
          muscles: userProfile.goal === 'fat-loss' ? 'Cardio, metabolismo' : 'Sistema cardiovascolare'
        },
        {
          id: 'rowing',
          name: userProfile.goal === 'fat-loss' ? 'Rowing Tabata' : 'Vogatore',
          sets: userProfile.goal === 'fat-loss' ? '4 x Tabata' : '4 x 500m',
          rest: userProfile.goal === 'fat-loss' ? '60 sec' : '90 sec',
          restSeconds: userProfile.goal === 'fat-loss' ? 60 : 90,
          weight: 'Resistenza alta',
          instructions: userProfile.goal === 'fat-loss' ? 
            '20 sec massimo sforzo, 10 sec pausa x8. Protocollo Tabata scientifico.' :
            'Tecnica corretta: gambe, core, braccia. Ritmo costante.',
          muscles: userProfile.goal === 'fat-loss' ? 'Full body, fat-burn' : 'Full body, dorso'
        },
        ...(userProfile.goal === 'fat-loss' ? [{
          id: 'burpees',
          name: 'Burpees Metabolici',
          sets: '3 x 12',
          rest: '45 sec',
          restSeconds: 45,
          weight: 'Corpo libero',
          instructions: 'Movimento esplosivo completo. Salto in alto, plank perfetto. Massimo consumo.',
          muscles: 'Full body, core'
        }] : [])
      ]
    },
    addominali: {
      name: userProfile.goal === 'fat-loss' ? 'Addome Fat-Burn' : 'Core & Addominali',
      duration: userProfile.goal === 'fat-loss' ? '25 min' : '20 min',
      focus: userProfile.goal === 'fat-loss' ? 
        'Eliminazione grasso viscerale, addome scolpito, ginecomastia' : 
        'Riduzione grasso addominale, stabilità core',
      exercises: [
        {
          id: 'plank',
          name: userProfile.goal === 'fat-loss' ? 'Plank Dinamico' : 'Plank Statico',
          sets: userProfile.goal === 'fat-loss' ? '5 x 60 sec' : '4 x 45 sec',
          rest: '30 sec',
          restSeconds: 30,
          weight: 'Corpo libero',
          instructions: userProfile.goal === 'fat-loss' ? 
            'Plank con movimento braccia/gambe. Massimo consumo calorico, core instabile.' :
            'Corpo perfettamente allineato. Respirazione controllata.',
          muscles: userProfile.goal === 'fat-loss' ? 'Core, metabolismo' : 'Core, stabilizzatori'
        },
        {
          id: 'bicycle',
          name: 'Bicycle Crunches',
          sets: userProfile.goal === 'fat-loss' ? '5 x 25 per lato' : '4 x 20 per lato',
          rest: userProfile.goal === 'fat-loss' ? '30 sec' : '45 sec',
          restSeconds: userProfile.goal === 'fat-loss' ? 30 : 45,
          weight: 'Corpo libero',
          instructions: userProfile.goal === 'fat-loss' ? 
            'Movimento esplosivo, alta velocità. Target grasso laterale e viscerale.' :
            'Movimento controllato, gomito verso ginocchio opposto.',
          muscles: 'Addominali obliqui'
        },
        {
          id: 'leg-raises',
          name: userProfile.goal === 'fat-loss' ? 'Leg Raises Esplosivi' : 'Leg Raises',
          sets: userProfile.goal === 'fat-loss' ? '4 x 20' : '3 x 15',
          rest: userProfile.goal === 'fat-loss' ? '45 sec' : '60 sec',
          restSeconds: userProfile.goal === 'fat-loss' ? 45 : 60,
          weight: 'Corpo libero',
          instructions: userProfile.goal === 'fat-loss' ? 
            'Movimento esplosivo su, controllo giù. Focus grasso addominale basso.' :
            'Gambe tese, movimento lento e controllato. Non toccare il suolo.',
          muscles: 'Addominali bassi'
        },
        ...(userProfile.goal === 'fat-loss' ? [{
          id: 'mountain-climbers',
          name: 'Mountain Climbers',
          sets: '4 x 30 sec',
          rest: '30 sec',
          restSeconds: 30,
          weight: 'Corpo libero',
          instructions: 'Movimento esplosivo, ginocchia al petto. Cardio + core, brucia grasso viscerale.',
          muscles: 'Core, cardio, fat-burn'
        }, {
          id: 'russian-twists',
          name: 'Russian Twists',
          sets: '4 x 20 per lato',
          rest: '30 sec',
          restSeconds: 30,
          weight: 'Corpo libero',
          instructions: 'Rotazione esplosiva, focus obliqui. Target love handles e grasso laterale.',
          muscles: 'Obliqui, rotatori'
        }] : [])
      ]
    }
  };

  const workoutOptions = [
    { 
      key: 'petto', 
      label: userProfile.goal === 'fat-loss' ? 'Petto' : 'Petto', 
      icon: <Dumbbell className="w-4 h-4" /> 
    },
    { 
      key: 'cardio', 
      label: userProfile.goal === 'fat-loss' ? 'HIIT' : 'Cardio', 
      icon: userProfile.goal === 'fat-loss' ? <Flame className="w-4 h-4" /> : <Target className="w-4 h-4" /> 
    },
    { 
      key: 'addominali', 
      label: userProfile.goal === 'fat-loss' ? 'Addome' : 'Core', 
      icon: userProfile.goal === 'fat-loss' ? <Zap className="w-4 h-4" /> : <Target className="w-4 h-4" /> 
    }
  ];

  const workout = workouts[currentWorkout as keyof typeof workouts];

  const toggleExercise = (exerciseId: string) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const completedCount = completedExercises.length;
  const totalCount = workout.exercises.length;

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {workoutFocus.title}
        </h2>
        <p className="text-slate-600">
          {workoutFocus.subtitle}
        </p>
      </div>

      {/* Workout Selection */}
      <div className="flex space-x-2">
        {workoutOptions.map((option) => (
          <Button
            key={option.key}
            variant={currentWorkout === option.key ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentWorkout(option.key)}
            className="flex-1 flex items-center space-x-2"
          >
            {option.icon}
            <span>{option.label}</span>
          </Button>
        ))}
      </div>

      {/* Workout Overview */}
      <Card className={`p-4 bg-gradient-to-r ${workoutFocus.primaryColor} text-white`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{workout.name}</h3>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {completedCount}/{totalCount}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{workout.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span>Timer integrati</span>
          </div>
        </div>
        <div className="mt-2 text-sm opacity-90">{workout.focus}</div>
      </Card>

      {/* Exercises */}
      <div className="space-y-3">
        {workout.exercises.map((exercise, index) => (
          <Card 
            key={exercise.id}
            className={`p-4 transition-all duration-200 ${
              completedExercises.includes(exercise.id) 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white/70 backdrop-blur-sm'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{exercise.name}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                    <span><strong>Serie:</strong> {exercise.sets}</span>
                    <span><strong>Riposo:</strong> {exercise.rest}</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    <strong>Peso:</strong> {exercise.weight}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  variant={completedExercises.includes(exercise.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleExercise(exercise.id)}
                  className="flex items-center space-x-1"
                >
                  {completedExercises.includes(exercise.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>✓</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTimer(showTimer === exercise.id ? null : exercise.id)}
                  className="flex items-center space-x-1"
                >
                  <Timer className="w-4 h-4" />
                  <span>Timer</span>
                </Button>
              </div>
            </div>

            {/* Exercise Timer */}
            {showTimer === exercise.id && (
              <div className="mt-4">
                <ExerciseTimer 
                  restTime={exercise.restSeconds}
                  onComplete={() => {
                    console.log(`Timer completato per ${exercise.name}`);
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <div>
                <h5 className="text-sm font-medium text-slate-700 mb-1">Esecuzione:</h5>
                <p className="text-sm text-slate-600">{exercise.instructions}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-slate-700">Muscoli target:</h5>
                  <p className="text-sm text-slate-600">{exercise.muscles}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {exercise.sets.split(' ')[0]} serie
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Progress */}
      <Card className="p-4 bg-slate-50">
        <h3 className="font-semibold text-slate-700 mb-3">📊 Progressi Settimanali</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-lg font-bold text-blue-600">4/5</div>
            <div className="text-slate-600">Allenamenti completati</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">+2.5kg</div>
            <div className="text-slate-600">Panca piana (progressione)</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WorkoutSection;

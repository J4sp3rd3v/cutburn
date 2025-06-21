import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Target, Dumbbell, Play, Check, Timer } from 'lucide-react';
import ExerciseTimer from '@/components/ExerciseTimer';

const WorkoutSection = () => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState('petto');
  const [showTimer, setShowTimer] = useState<string | null>(null);

  const workouts = {
    petto: {
      name: 'Petto & Tricipiti',
      duration: '45 min',
      focus: 'Riduzione grasso pettorale, definizione',
      exercises: [
        {
          id: 'bench-press',
          name: 'Panca Piana con Manubri',
          sets: '4 x 8-10',
          rest: '90 sec',
          restSeconds: 90,
          weight: '12kg per braccio',
          instructions: 'Scendere lentamente, spingere esplosivamente. Focus sul centro del petto.',
          muscles: 'Pettorale maggiore, deltoidi anteriori'
        },
        {
          id: 'incline-press',
          name: 'Panca Inclinata 30°',
          sets: '3 x 10-12',
          rest: '75 sec',
          restSeconds: 75,
          weight: '10kg per braccio',
          instructions: 'Inclinazione 30°. Movimento controllato, massima contrazione in alto.',
          muscles: 'Pettorale superiore'
        },
        {
          id: 'flyes',
          name: 'Croci su Panca',
          sets: '3 x 12-15',
          rest: '60 sec',
          restSeconds: 60,
          weight: '8kg per braccio',
          instructions: 'Movimento ad arco, sentire lo stretch. Non bloccare i gomiti.',
          muscles: 'Pettorale, definizione'
        },
        {
          id: 'push-ups',
          name: 'Flessioni Diamante',
          sets: '3 x max',
          rest: '60 sec',
          restSeconds: 60,
          weight: 'Corpo libero',
          instructions: 'Mani a diamante, corpo rigido. Focus sui tricipiti.',
          muscles: 'Tricipiti, pettorale interno'
        }
      ]
    },
    cardio: {
      name: 'Cardio Brucia Grassi',
      duration: '30 min',
      focus: 'Ossidazione grassi, deficit calorico',
      exercises: [
        {
          id: 'treadmill',
          name: 'Tapis Roulant HIIT',
          sets: '5 rounds',
          rest: '60 sec recovery',
          restSeconds: 60,
          weight: 'Intensità variabile',
          instructions: '2 min a 7 km/h, 1 min a 12 km/h. Mantenere frequenza cardiaca 75-85% FCmax.',
          muscles: 'Sistema cardiovascolare'
        },
        {
          id: 'rowing',
          name: 'Vogatore',
          sets: '4 x 500m',
          rest: '90 sec',
          restSeconds: 90,
          weight: 'Resistenza media',
          instructions: 'Tecnica corretta: gambe, core, braccia. Ritmo costante.',
          muscles: 'Full body, dorso'
        }
      ]
    },
    addominali: {
      name: 'Core & Addominali',
      duration: '20 min',
      focus: 'Riduzione grasso addominale, stabilità core',
      exercises: [
        {
          id: 'plank',
          name: 'Plank Statico',
          sets: '4 x 45 sec',
          rest: '30 sec',
          restSeconds: 30,
          weight: 'Corpo libero',
          instructions: 'Corpo perfettamente allineato. Respirazione controllata.',
          muscles: 'Core, stabilizzatori'
        },
        {
          id: 'bicycle',
          name: 'Bicycle Crunches',
          sets: '4 x 20 per lato',
          rest: '45 sec',
          restSeconds: 45,
          weight: 'Corpo libero',
          instructions: 'Movimento controllato, gomito verso ginocchio opposto.',
          muscles: 'Addominali obliqui'
        },
        {
          id: 'leg-raises',
          name: 'Leg Raises',
          sets: '3 x 15',
          rest: '60 sec',
          restSeconds: 60,
          weight: 'Corpo libero',
          instructions: 'Gambe tese, movimento lento e controllato. Non toccare il suolo.',
          muscles: 'Addominali bassi'
        }
      ]
    }
  };

  const workoutOptions = [
    { key: 'petto', label: 'Petto', icon: <Dumbbell className="w-4 h-4" /> },
    { key: 'cardio', label: 'Cardio', icon: <Target className="w-4 h-4" /> },
    { key: 'addominali', label: 'Core', icon: <Target className="w-4 h-4" /> }
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
          Allenamento Mirato
        </h2>
        <p className="text-slate-600">
          Focus ginecomastia • Sovraccarico progressivo • Timer perfetti
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
      <Card className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
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

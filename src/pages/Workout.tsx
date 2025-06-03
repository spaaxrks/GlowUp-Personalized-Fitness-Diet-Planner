
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle2, Calendar, Clock, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

// Weekly workout data
const weeklyWorkouts = {
  weight_loss: [
    {
      day: 'Monday',
      title: 'Upper Body + Cardio',
      exercises: [
        { name: 'Push-Ups', sets: '3', reps: '10-12', rest: '45s' },
        { name: 'Dumbbell Shoulder Press', sets: '3', reps: '12', rest: '45s' },
        { name: 'Lat Pulldowns', sets: '3', reps: '12', rest: '45s' },
        { name: 'Cardio: 20 min Treadmill', intensity: 'Moderate', target: '65-75% max HR' },
        { name: 'Planks', sets: '3', duration: '30 sec', rest: '30s' },
      ],
      cardio: true,
      duration: '45-60 min',
      intensity: 'Moderate',
    },
    {
      day: 'Tuesday',
      title: 'Lower Body',
      exercises: [
        { name: 'Bodyweight Squats', sets: '3', reps: '15', rest: '60s' },
        { name: 'Walking Lunges', sets: '3', reps: '12 per leg', rest: '60s' },
        { name: 'Leg Press (Light weight)', sets: '3', reps: '15', rest: '60s' },
        { name: 'Standing Calf Raises', sets: '3', reps: '15', rest: '45s' },
        { name: 'Leg Curls', sets: '3', reps: '12', rest: '45s' },
      ],
      cardio: false,
      duration: '40-50 min',
      intensity: 'Moderate',
    },
    {
      day: 'Wednesday',
      title: 'Cardio Day',
      exercises: [
        { name: 'Warm Up: 5 min easy jogging', intensity: 'Light' },
        { name: 'Running Intervals: 30 sec sprint / 90 sec jog', sets: '8', rest: 'None' },
        { name: 'Jump Rope', duration: '10 min', intensity: 'Moderate' },
        { name: 'Cycling', duration: '15 min', intensity: 'Moderate-High' },
        { name: 'Cooldown: 5 min easy walk', intensity: 'Light' },
      ],
      cardio: true,
      duration: '45-50 min',
      intensity: 'High',
    },
    {
      day: 'Thursday',
      title: 'Full Body Circuit',
      exercises: [
        { name: 'Burpees', sets: '3', reps: '10', rest: '30s' },
        { name: 'Mountain Climbers', sets: '3', duration: '30 sec', rest: '30s' },
        { name: 'Jumping Jacks', sets: '3', duration: '45 sec', rest: '30s' },
        { name: 'Plank Jacks', sets: '3', duration: '30 sec', rest: '30s' },
        { name: 'High Knees', sets: '3', duration: '30 sec', rest: '30s' },
      ],
      cardio: true,
      duration: '30-40 min',
      intensity: 'High',
    },
    {
      day: 'Friday',
      title: 'Upper Body',
      exercises: [
        { name: 'Incline Push-Ups', sets: '3', reps: '12', rest: '45s' },
        { name: 'Dumbbell Rows', sets: '3', reps: '12 per arm', rest: '45s' },
        { name: 'Lateral Raises', sets: '3', reps: '12', rest: '45s' },
        { name: 'Bicep Curls', sets: '3', reps: '12', rest: '45s' },
        { name: 'Tricep Dips', sets: '3', reps: '12', rest: '45s' },
      ],
      cardio: false,
      duration: '40-50 min',
      intensity: 'Moderate',
    },
    {
      day: 'Saturday',
      title: 'HIIT Training',
      exercises: [
        { name: 'Warm Up: 5 min dynamic stretching', intensity: 'Light' },
        { name: 'Tabata Intervals (20s work/10s rest)', exercises: 'Squats, Push-ups, Mountain Climbers, Jumping Jacks', sets: '4 rounds' },
        { name: 'Box Jumps', sets: '3', reps: '10', rest: '60s' },
        { name: 'Kettlebell Swings', sets: '3', reps: '15', rest: '60s' },
        { name: 'Burpees', sets: '3', reps: '10', rest: '60s' },
      ],
      cardio: true,
      duration: '30-40 min',
      intensity: 'Very High',
    },
    {
      day: 'Sunday',
      title: 'Rest & Recovery',
      exercises: [
        { name: 'Light Walking', duration: '20-30 min', intensity: 'Very Light' },
        { name: 'Stretching Routine', duration: '15 min', focus: 'Full Body' },
        { name: 'Yoga (optional)', duration: '20 min', intensity: 'Light' },
        { name: 'Meditation', duration: '10 min', focus: 'Mindfulness' },
      ],
      cardio: false,
      duration: '30-60 min',
      intensity: 'Light',
      isRest: true,
    }
  ],
  muscle_gain: [
    {
      day: 'Monday',
      title: 'Chest & Triceps',
      exercises: [
        { name: 'Bench Press', sets: '4', reps: '8-10', rest: '90s' },
        { name: 'Incline Dumbbell Press', sets: '3', reps: '10', rest: '90s' },
        { name: 'Chest Flyes', sets: '3', reps: '12', rest: '60s' },
        { name: 'Tricep Pushdowns', sets: '3', reps: '12', rest: '60s' },
        { name: 'Overhead Tricep Extensions', sets: '3', reps: '12', rest: '60s' },
      ],
      cardio: false,
      duration: '60-70 min',
      intensity: 'High',
    },
    {
      day: 'Tuesday',
      title: 'Back & Biceps',
      exercises: [
        { name: 'Deadlifts', sets: '4', reps: '6-8', rest: '120s' },
        { name: 'Barbell Rows', sets: '3', reps: '10', rest: '90s' },
        { name: 'Pull-Ups or Lat Pulldowns', sets: '3', reps: '8-10', rest: '90s' },
        { name: 'Bicep Curls', sets: '3', reps: '12', rest: '60s' },
        { name: 'Hammer Curls', sets: '3', reps: '12', rest: '60s' },
      ],
      cardio: false,
      duration: '60-70 min',
      intensity: 'High',
    },
    {
      day: 'Wednesday',
      title: 'Rest Day',
      exercises: [
        { name: 'Light Stretching', duration: '15 min', focus: 'Full Body' },
        { name: 'Foam Rolling', duration: '15 min', focus: 'Problem Areas' },
        { name: 'Walking (optional)', duration: '20 min', intensity: 'Very Light' },
      ],
      cardio: false,
      duration: '30-50 min',
      intensity: 'Light',
      isRest: true,
    },
    {
      day: 'Thursday',
      title: 'Shoulders & Abs',
      exercises: [
        { name: 'Overhead Press', sets: '4', reps: '8-10', rest: '90s' },
        { name: 'Lateral Raises', sets: '3', reps: '12', rest: '60s' },
        { name: 'Face Pulls', sets: '3', reps: '15', rest: '60s' },
        { name: 'Hanging Leg Raises', sets: '3', reps: '12', rest: '60s' },
        { name: 'Russian Twists', sets: '3', reps: '15 per side', rest: '60s' },
      ],
      cardio: false,
      duration: '55-65 min',
      intensity: 'High',
    },
    {
      day: 'Friday',
      title: 'Legs',
      exercises: [
        { name: 'Squats', sets: '4', reps: '8-10', rest: '120s' },
        { name: 'Romanian Deadlifts', sets: '3', reps: '10', rest: '90s' },
        { name: 'Leg Press', sets: '3', reps: '12', rest: '90s' },
        { name: 'Leg Extensions', sets: '3', reps: '12', rest: '60s' },
        { name: 'Hamstring Curls', sets: '3', reps: '12', rest: '60s' },
      ],
      cardio: false,
      duration: '60-70 min',
      intensity: 'Very High',
    },
    {
      day: 'Saturday',
      title: 'Arms & Abs',
      exercises: [
        { name: 'Close-Grip Bench Press', sets: '3', reps: '10', rest: '90s' },
        { name: 'Skull Crushers', sets: '3', reps: '12', rest: '60s' },
        { name: 'Barbell Curls', sets: '3', reps: '12', rest: '60s' },
        { name: 'Ab Crunches', sets: '3', reps: '15', rest: '60s' },
        { name: 'Planks', sets: '3', duration: '45 sec', rest: '45s' },
      ],
      cardio: false,
      duration: '50-60 min',
      intensity: 'Moderate-High',
    },
    {
      day: 'Sunday',
      title: 'Rest Day',
      exercises: [
        { name: 'Light Walking', duration: '20-30 min', intensity: 'Very Light' },
        { name: 'Stretching Routine', duration: '15 min', focus: 'Full Body' },
        { name: 'Foam Rolling', duration: '15 min', focus: 'Problem Areas' },
      ],
      cardio: false,
      duration: '30-60 min',
      intensity: 'Light',
      isRest: true,
    }
  ],
  general_fitness: [
    {
      day: 'Monday',
      title: 'Full Body Strength',
      exercises: [
        { name: 'Push-Ups', sets: '3', reps: '10', rest: '60s' },
        { name: 'Bodyweight Squats', sets: '3', reps: '15', rest: '60s' },
        { name: 'Dumbbell Rows', sets: '3', reps: '12 per arm', rest: '60s' },
        { name: 'Plank', sets: '3', duration: '30 sec', rest: '30s' },
        { name: 'Lunges', sets: '2', reps: '10 per leg', rest: '60s' },
      ],
      cardio: false,
      duration: '45-55 min',
      intensity: 'Moderate',
    },
    {
      day: 'Tuesday',
      title: 'Cardio & Core',
      exercises: [
        { name: 'Jogging or Brisk Walking', duration: '20 min', intensity: 'Moderate' },
        { name: 'Mountain Climbers', sets: '3', duration: '30 sec', rest: '30s' },
        { name: 'Bicycle Crunches', sets: '3', reps: '15 per side', rest: '45s' },
        { name: 'Russian Twists', sets: '3', reps: '10 per side', rest: '45s' },
        { name: 'Leg Raises', sets: '3', reps: '12', rest: '45s' },
      ],
      cardio: true,
      duration: '40-50 min',
      intensity: 'Moderate',
    },
    {
      day: 'Wednesday',
      title: 'Active Recovery',
      exercises: [
        { name: 'Yoga Flow', duration: '20 min', focus: 'Flexibility' },
        { name: 'Light Walking', duration: '15 min', intensity: 'Light' },
        { name: 'Foam Rolling', duration: '10 min', focus: 'Full Body' },
        { name: 'Stretching', duration: '10 min', focus: 'Problem Areas' },
      ],
      cardio: false,
      duration: '40-55 min',
      intensity: 'Light',
      isRest: true,
    },
    {
      day: 'Thursday',
      title: 'Functional Fitness',
      exercises: [
        { name: 'Kettlebell Swings', sets: '3', reps: '15', rest: '60s' },
        { name: 'Box Step-Ups', sets: '3', reps: '10 per leg', rest: '60s' },
        { name: 'Medicine Ball Slams', sets: '3', reps: '12', rest: '60s' },
        { name: 'Bear Crawls', sets: '3', duration: '30 sec', rest: '45s' },
        { name: 'Battle Ropes', sets: '3', duration: '30 sec', rest: '60s' },
      ],
      cardio: true,
      duration: '45-55 min',
      intensity: 'Moderate-High',
    },
    {
      day: 'Friday',
      title: 'Upper Body Focus',
      exercises: [
        { name: 'Dumbbell Chest Press', sets: '3', reps: '12', rest: '60s' },
        { name: 'Bent-Over Rows', sets: '3', reps: '12', rest: '60s' },
        { name: 'Shoulder Press', sets: '3', reps: '10', rest: '60s' },
        { name: 'Bicep Curls', sets: '3', reps: '12', rest: '45s' },
        { name: 'Tricep Dips', sets: '3', reps: '12', rest: '45s' },
      ],
      cardio: false,
      duration: '45-55 min',
      intensity: 'Moderate',
    },
    {
      day: 'Saturday',
      title: 'Lower Body & Cardio',
      exercises: [
        { name: 'Goblet Squats', sets: '3', reps: '15', rest: '60s' },
        { name: 'Glute Bridges', sets: '3', reps: '15', rest: '45s' },
        { name: 'Calf Raises', sets: '3', reps: '20', rest: '45s' },
        { name: 'Jump Squats', sets: '3', reps: '10', rest: '60s' },
        { name: 'Cardio: 15 min bike or elliptical', intensity: 'Moderate' },
      ],
      cardio: true,
      duration: '45-55 min',
      intensity: 'Moderate-High',
    },
    {
      day: 'Sunday',
      title: 'Rest Day',
      exercises: [
        { name: 'Light Walking', duration: '20-30 min', intensity: 'Very Light' },
        { name: 'Stretching Routine', duration: '15 min', focus: 'Full Body' },
        { name: 'Meditation', duration: '10 min', focus: 'Mindfulness' },
      ],
      cardio: false,
      duration: '30-55 min',
      intensity: 'Light',
      isRest: true,
    }
  ],
  maintain: [
    {
      day: 'Monday',
      title: 'Upper Body Strength',
      exercises: [
        { name: 'Push-Ups', sets: '3', reps: '12', rest: '60s' },
        { name: 'Dumbbell Rows', sets: '3', reps: '12 per arm', rest: '60s' },
        { name: 'Shoulder Press', sets: '3', reps: '10', rest: '60s' },
        { name: 'Bicep Curls', sets: '3', reps: '12', rest: '45s' },
        { name: 'Tricep Extensions', sets: '3', reps: '12', rest: '45s' },
      ],
      cardio: false,
      duration: '45-55 min',
      intensity: 'Moderate',
    },
    {
      day: 'Tuesday',
      title: 'Cardio Session',
      exercises: [
        { name: 'Warm Up: 5 min easy jogging', intensity: 'Light' },
        { name: 'Interval Training: 1 min fast / 2 min slow', sets: '8 rounds', rest: 'None' },
        { name: 'Jump Rope', duration: '5 min', intensity: 'Moderate' },
        { name: 'Cooldown: 5 min walking', intensity: 'Light' },
      ],
      cardio: true,
      duration: '35-45 min',
      intensity: 'Moderate-High',
    },
    {
      day: 'Wednesday',
      title: 'Lower Body Focus',
      exercises: [
        { name: 'Bodyweight Squats', sets: '3', reps: '15', rest: '60s' },
        { name: 'Lunges', sets: '3', reps: '12 per leg', rest: '60s' },
        { name: 'Glute Bridges', sets: '3', reps: '15', rest: '45s' },
        { name: 'Calf Raises', sets: '3', reps: '20', rest: '45s' },
        { name: 'Wall Sit', sets: '3', duration: '30 sec', rest: '45s' },
      ],
      cardio: false,
      duration: '45-55 min',
      intensity: 'Moderate',
    },
    {
      day: 'Thursday',
      title: 'Active Recovery',
      exercises: [
        { name: 'Yoga Flow', duration: '25 min', focus: 'Flexibility' },
        { name: 'Light Walking', duration: '15 min', intensity: 'Light' },
        { name: 'Foam Rolling', duration: '10 min', focus: 'Full Body' },
        { name: 'Stretching', duration: '10 min', focus: 'Problem Areas' },
      ],
      cardio: false,
      duration: '45-60 min',
      intensity: 'Light',
      isRest: true,
    },
    {
      day: 'Friday',
      title: 'Core & Balance',
      exercises: [
        { name: 'Plank', sets: '3', duration: '45 sec', rest: '45s' },
        { name: 'Russian Twists', sets: '3', reps: '15 per side', rest: '45s' },
        { name: 'Mountain Climbers', sets: '3', duration: '30 sec', rest: '45s' },
        { name: 'Single-Leg Balance', sets: '2', duration: '30 sec per leg', rest: '30s' },
        { name: 'Bird Dogs', sets: '3', reps: '10 per side', rest: '45s' },
      ],
      cardio: false,
      duration: '40-50 min',
      intensity: 'Moderate',
    },
    {
      day: 'Saturday',
      title: 'Full Body Circuit',
      exercises: [
        { name: 'Circuit: Perform each exercise for 40 sec with 20 sec rest', sets: '3 rounds', rest: '2 min between rounds' },
        { name: 'Exercise 1: Jumping Jacks', intensity: 'Moderate' },
        { name: 'Exercise 2: Push-Ups', intensity: 'Moderate-High' },
        { name: 'Exercise 3: Bodyweight Squats', intensity: 'Moderate' },
        { name: 'Exercise 4: Plank', intensity: 'Moderate' },
        { name: 'Exercise 5: High Knees', intensity: 'High' },
      ],
      cardio: true,
      duration: '40-50 min',
      intensity: 'Moderate-High',
    },
    {
      day: 'Sunday',
      title: 'Rest Day',
      exercises: [
        { name: 'Light Walking', duration: '20-30 min', intensity: 'Very Light' },
        { name: 'Stretching Routine', duration: '15 min', focus: 'Full Body' },
        { name: 'Meditation', duration: '10 min', focus: 'Mindfulness' },
      ],
      cardio: false,
      duration: '30-55 min',
      intensity: 'Light',
      isRest: true,
    }
  ],
};

const Workout = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  if (!user) return null;
  
  // Get current day of week
  const today = new Date().getDay();
  // Convert from 0-6 (Sunday-Saturday) to our array index (Monday is 0)
  const todayIndex = today === 0 ? 6 : today - 1;
  
  const handleCompleteWorkout = () => {
    toast.success("Great job! You've completed today's workout! 💪", {
      description: "+10 points added to your profile!"
    });
  };
  
  // Get workout plan based on user's fitness goal
  const workoutPlan = weeklyWorkouts[user.fitnessGoal] || weeklyWorkouts.general_fitness;
  
  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Workout Plan</h1>
      </div>
      
      <Tabs defaultValue={todayIndex.toString()} className="mb-6">
        <TabsList className="w-full flex overflow-x-auto">
          {workoutPlan.map((workout, index) => (
            <TabsTrigger 
              key={index} 
              value={index.toString()}
              className={`flex-1 min-w-[100px] ${index === todayIndex ? 'font-bold' : ''}`}
            >
              {workout.day}
              {index === todayIndex && <span className="ml-1 text-xs">(Today)</span>}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {workoutPlan.map((workout, index) => (
          <TabsContent key={index} value={index.toString()} className="mt-4">
            <Card>
              <CardHeader className={`${workout.isRest ? 'bg-gray-50' : 'bg-fitness-primary/10'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{workout.title}</CardTitle>
                    <CardDescription>
                      {workout.day} - {user.fitnessGoal.replace('_', ' ')} plan
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-fitness-primary" />
                      <span>{workout.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-1 text-fitness-primary" />
                      <span>{workout.intensity}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {workout.exercises.map((exercise, i) => (
                  <div key={i} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{exercise.name}</div>
                      {exercise.sets && exercise.reps && (
                        <div className="text-sm text-gray-500">
                          {exercise.sets} sets × {exercise.reps}
                        </div>
                      )}
                      {exercise.sets && exercise.duration && (
                        <div className="text-sm text-gray-500">
                          {exercise.sets} sets × {exercise.duration}
                        </div>
                      )}
                      {exercise.duration && !exercise.sets && (
                        <div className="text-sm text-gray-500">
                          {exercise.duration}
                        </div>
                      )}
                    </div>
                    
                    {exercise.rest && (
                      <div className="text-sm text-gray-500">
                        Rest: {exercise.rest}
                      </div>
                    )}
                    
                    {exercise.intensity && (
                      <div className="text-sm text-gray-500">
                        Intensity: {exercise.intensity}
                      </div>
                    )}
                    
                    {exercise.focus && (
                      <div className="text-sm text-gray-500">
                        Focus: {exercise.focus}
                      </div>
                    )}
                    
                    {exercise.target && (
                      <div className="text-sm text-gray-500">
                        Target: {exercise.target}
                      </div>
                    )}
                    
                    {exercise.exercises && (
                      <div className="text-sm text-gray-500">
                        Exercises: {exercise.exercises}
                      </div>
                    )}
                  </div>
                ))}
                
                {index === todayIndex && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleCompleteWorkout} className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Workout Tips</CardTitle>
          <CardDescription>Get the most out of your fitness routine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-fitness-primary/10 rounded-lg">
              <h3 className="font-medium mb-1">Proper Form</h3>
              <p className="text-sm text-gray-600">
                Always prioritize proper form over lifting heavier weights. This reduces injury risk and ensures the right muscles are engaged.
              </p>
            </div>
            
            <div className="p-4 bg-fitness-primary/10 rounded-lg">
              <h3 className="font-medium mb-1">Progressive Overload</h3>
              <p className="text-sm text-gray-600">
                Gradually increase the weight, frequency, or number of repetitions in your workouts to continue seeing progress.
              </p>
            </div>
            
            <div className="p-4 bg-fitness-primary/10 rounded-lg">
              <h3 className="font-medium mb-1">Rest & Recovery</h3>
              <p className="text-sm text-gray-600">
                Your muscles grow during rest, not during workouts. Ensure you're getting enough sleep and taking rest days.
              </p>
            </div>
            
            <div className="p-4 bg-fitness-primary/10 rounded-lg">
              <h3 className="font-medium mb-1">Stay Hydrated</h3>
              <p className="text-sm text-gray-600">
                Drink plenty of water before, during, and after your workouts to maintain performance and aid recovery.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Workout;

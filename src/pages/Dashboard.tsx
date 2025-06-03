
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Dumbbell, Apple, TrendingUp, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, progress } = useUser();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  if (!user) return null;
  
  // Calculate BMI
  const bmi = user.weight / Math.pow(user.height / 100, 2);
  const bmiCategory = () => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };
  
  // Calculate progress towards goal
  const startWeight = user.weight;
  const goalWeight = user.targetWeight;
  const currentWeight = progress.length > 0 
    ? progress[progress.length - 1].weight 
    : startWeight;
  
  let weightProgressPercent = 0;
  
  if (startWeight !== goalWeight) {
    const totalChange = Math.abs(startWeight - goalWeight);
    const currentChange = Math.abs(startWeight - currentWeight);
    weightProgressPercent = Math.min(100, Math.round((currentChange / totalChange) * 100));
  } else {
    weightProgressPercent = 100; // Already at goal
  }
  
  // Get today's date for the workout
  const today = new Date();
  const dayOfWeek = format(today, 'EEEE');
  
  // Generate sample workout based on day and fitness goal
  const generateWorkout = () => {
    switch (dayOfWeek) {
      case 'Monday':
        return user.fitnessGoal === 'muscle_gain' 
          ? { title: 'Chest & Triceps', exercises: ['Bench Press', 'Incline Dumbbell Press', 'Chest Flyes', 'Tricep Pushdowns', 'Overhead Extensions'] }
          : { title: 'Upper Body + Cardio', exercises: ['Push-Ups', 'Shoulder Press', 'Lat Pulldowns', '20 min Treadmill', 'Planks'] };
      case 'Tuesday':
        return user.fitnessGoal === 'muscle_gain'
          ? { title: 'Back & Biceps', exercises: ['Deadlifts', 'Barbell Rows', 'Pull-Ups', 'Bicep Curls', 'Hammer Curls'] }
          : { title: 'Lower Body', exercises: ['Squats', 'Lunges', 'Leg Press', 'Calf Raises', 'Leg Curls'] };
      case 'Wednesday':
        return user.fitnessGoal === 'muscle_gain'
          ? { title: 'Rest Day', exercises: ['Light Stretching', 'Foam Rolling', '20 min Walk'] }
          : { title: 'Cardio Day', exercises: ['30 min Running', 'Jump Rope', 'Cycling', 'Stair Climber'] };
      case 'Thursday':
        return user.fitnessGoal === 'muscle_gain'
          ? { title: 'Shoulders & Abs', exercises: ['Overhead Press', 'Lateral Raises', 'Face Pulls', 'Hanging Leg Raises', 'Russian Twists'] }
          : { title: 'Full Body Circuit', exercises: ['Burpees', 'Mountain Climbers', 'Jumping Jacks', 'Plank Jacks', 'High Knees'] };
      case 'Friday':
        return user.fitnessGoal === 'muscle_gain'
          ? { title: 'Legs', exercises: ['Squats', 'Romanian Deadlifts', 'Leg Press', 'Leg Extensions', 'Hamstring Curls'] }
          : { title: 'Upper Body', exercises: ['Push-Ups', 'Dumbbell Rows', 'Shoulder Press', 'Bicep Curls', 'Tricep Dips'] };
      case 'Saturday':
        return user.fitnessGoal === 'muscle_gain'
          ? { title: 'Arms & Abs', exercises: ['Close-Grip Bench', 'Skull Crushers', 'Barbell Curls', 'Ab Crunches', 'Plank'] }
          : { title: 'HIIT Training', exercises: ['Tabata Intervals', 'Box Jumps', 'Battle Ropes', 'Kettlebell Swings', 'Burpees'] };
      default:
        return { title: 'Rest Day', exercises: ['Light Walking', 'Stretching', 'Yoga', 'Meditation'] };
    }
  };
  
  const todaysWorkout = generateWorkout();
  
  // Generate meal plan based on fitness goal
  const getMealPlan = () => {
    switch (user.fitnessGoal) {
      case 'weight_loss':
        return {
          breakfast: 'Greek yogurt with berries and a sprinkle of granola',
          lunch: 'Grilled chicken salad with olive oil dressing',
          dinner: 'Baked salmon with steamed vegetables',
          snacks: ['Apple with a small handful of almonds', 'Carrot sticks with hummus']
        };
      case 'muscle_gain':
        return {
          breakfast: 'Oatmeal with banana, protein powder and peanut butter',
          lunch: 'Turkey and avocado sandwich on whole grain bread with a side of quinoa',
          dinner: 'Steak with sweet potato and broccoli',
          snacks: ['Protein shake with banana', 'Greek yogurt with honey and nuts']
        };
      case 'maintain':
        return {
          breakfast: 'Scrambled eggs with toast and avocado',
          lunch: 'Tuna wrap with mixed greens',
          dinner: 'Chicken stir-fry with brown rice',
          snacks: ['Fruit smoothie', 'Trail mix']
        };
      default:
        return {
          breakfast: 'Overnight oats with fruit and nuts',
          lunch: 'Quinoa bowl with vegetables and chickpeas',
          dinner: 'Grilled fish with roasted vegetables',
          snacks: ['Apple and nut butter', 'Veggie sticks with hummus']
        };
    }
  };
  
  const mealPlan = getMealPlan();
  
  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Fitness Dashboard</h1>
        <div className="flex items-center">
          <span className="text-sm text-gray-500">{format(today, 'EEEE, MMMM d, yyyy')}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Level Progress</CardTitle>
            <CardDescription>Your journey so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Trophy className="h-10 w-10 text-fitness-accent mr-2" />
                <div>
                  <p className="font-bold text-xl">{user.level}</p>
                  <p className="text-sm text-gray-500">{user.points} points</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {user.level === 'Beginner' && (
                  <span>{100 - user.points} points to Intermediate</span>
                )}
                {user.level === 'Intermediate' && (
                  <span>{250 - user.points} points to Gym Rat</span>
                )}
                {user.level === 'Gym Rat' && (
                  <span>{500 - user.points} points to Gym Bro</span>
                )}
                {user.level === 'Gym Bro' && (
                  <span>{1000 - user.points} points to GYM SHARK</span>
                )}
              </div>
            </div>
            <Progress 
              value={
                user.level === 'Beginner' ? (user.points / 100) * 100 :
                user.level === 'Intermediate' ? (user.points / 250) * 100 :
                user.level === 'Gym Rat' ? (user.points / 500) * 100 :
                user.level === 'Gym Bro' ? (user.points / 1000) * 100 :
                100
              } 
              className="mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weight Goal</CardTitle>
            <CardDescription>
              {user.fitnessGoal === 'weight_loss' ? 'Weight Loss Progress' : 
               user.fitnessGoal === 'muscle_gain' ? 'Muscle Gain Progress' : 
               'Weight Maintenance'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-sm text-gray-500">Current</p>
                <p className="font-bold">{currentWeight} kg</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="font-bold text-fitness-primary">{weightProgressPercent}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Goal</p>
                <p className="font-bold">{goalWeight} kg</p>
              </div>
            </div>
            <Progress value={weightProgressPercent} className="mb-2" />
            <div className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-fitness-primary hover:text-fitness-primary/80"
                onClick={() => navigate('/progress')}
              >
                Log Progress <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Health Stats</CardTitle>
            <CardDescription>Your current measurements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-fitness-primary mr-2" />
                <span className="text-sm">BMI</span>
              </div>
              <div>
                <span className="font-bold">{bmi.toFixed(1)}</span>
                <span className={`ml-2 text-sm ${bmiCategory().color}`}>
                  {bmiCategory().label}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-fitness-primary mr-2" />
                <span className="text-sm">Age</span>
              </div>
              <span className="font-bold">{user.age} years</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="h-5 w-5 text-fitness-primary mr-2 flex items-center justify-center">↕️</span>
                <span className="text-sm">Height</span>
              </div>
              <span className="font-bold">{user.height} cm</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="workout" className="mb-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout" className="flex items-center">
            <Dumbbell className="h-4 w-4 mr-2" />
            Today's Workout
          </TabsTrigger>
          <TabsTrigger value="meal" className="flex items-center">
            <Apple className="h-4 w-4 mr-2" />
            Meal Plan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="workout" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{todaysWorkout.title} - {dayOfWeek}</CardTitle>
              <CardDescription>
                Tailored workout plan for your {user.fitnessGoal.replace('_', ' ')} goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysWorkout.exercises.map((exercise, i) => (
                  <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="bg-fitness-primary rounded-full h-8 w-8 flex items-center justify-center text-white mr-3">
                      {i + 1}
                    </div>
                    <span>{exercise}</span>
                  </div>
                ))}
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => navigate('/workout')}>
                    View Full Workout Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meal" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Daily Meal Plan</CardTitle>
              <CardDescription>
                Optimized for {user.fitnessGoal.replace('_', ' ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Breakfast</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {mealPlan.breakfast}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Lunch</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {mealPlan.lunch}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Dinner</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {mealPlan.dinner}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Snacks</h3>
                  <div className="space-y-2">
                    {mealPlan.snacks.map((snack, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        {snack}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

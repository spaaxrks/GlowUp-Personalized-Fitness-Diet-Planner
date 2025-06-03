import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format, isToday, isSameDay, isWeekend } from 'date-fns';
import { Trophy, Calendar as CalendarIcon, TrendingUp, Award, Activity } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const Dumbbell = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6.5 6.5h11"></path>
    <path d="M6.5 17.5h11"></path>
    <path d="M4 4v16"></path>
    <path d="M9 4v16"></path>
    <path d="M15 4v16"></path>
    <path d="M20 4v16"></path>
  </svg>
);

const Progress = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, progress, addProgress } = useUser();
  const [selected, setSelected] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    weight: '',
    workoutCompleted: false,
    cardioMinutes: '',
    strengthProgress: '',
  });
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  useEffect(() => {
    const existingProgress = progress.find(p => 
      p.date === format(selected, 'yyyy-MM-dd')
    );
    
    if (existingProgress) {
      setFormData({
        weight: existingProgress.weight.toString(),
        workoutCompleted: existingProgress.workoutCompleted,
        cardioMinutes: existingProgress.cardioMinutes.toString(),
        strengthProgress: existingProgress.strengthProgress,
      });
    } else {
      setFormData({
        weight: user?.weight.toString() || '',
        workoutCompleted: false,
        cardioMinutes: '',
        strengthProgress: '',
      });
    }
  }, [selected, progress, user]);
  
  if (!user) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProgress = {
      date: format(selected, 'yyyy-MM-dd'),
      weight: parseFloat(formData.weight),
      workoutCompleted: formData.workoutCompleted,
      cardioMinutes: parseInt(formData.cardioMinutes) || 0,
      strengthProgress: formData.strengthProgress,
    };
    
    addProgress(newProgress);
    toast.success("Progress updated successfully!", { 
      description: "Your fitness journey is being tracked."
    });
  };
  
  const chartData = progress
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(p => ({
      date: format(new Date(p.date), 'MMM dd'),
      weight: p.weight,
    }));
  
  const completedWorkouts = progress.filter(p => p.workoutCompleted).length;
  const totalCardioMinutes = progress.reduce((total, p) => total + p.cardioMinutes, 0);
  
  const getAchievements = () => {
    const achievements = [];
    
    if (completedWorkouts >= 5) {
      achievements.push({
        title: 'Consistent Athlete',
        description: 'Completed 5+ workouts',
        icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      });
    }
    
    if (totalCardioMinutes >= 60) {
      achievements.push({
        title: 'Cardio Champion',
        description: `Logged ${totalCardioMinutes}+ minutes of cardio`,
        icon: <Activity className="h-5 w-5 text-red-500" />,
      });
    }
    
    if (progress.length >= 7) {
      achievements.push({
        title: 'Tracking Pro',
        description: 'Logged 7+ days of progress',
        icon: <Award className="h-5 w-5 text-purple-500" />,
      });
    }
    
    if (user.fitnessGoal === 'weight_loss' && progress.length >= 2) {
      const initialWeight = progress[0].weight;
      const currentWeight = progress[progress.length - 1].weight;
      
      if (currentWeight < initialWeight) {
        achievements.push({
          title: 'Weight Loss Progress',
          description: `Lost ${(initialWeight - currentWeight).toFixed(1)} kg so far`,
          icon: <TrendingUp className="h-5 w-5 text-green-500" />,
        });
      }
    }
    
    if (user.fitnessGoal === 'muscle_gain' && progress.length >= 2) {
      const strengthLogs = progress.filter(p => p.strengthProgress.trim() !== '').length;
      
      if (strengthLogs >= 3) {
        achievements.push({
          title: 'Strength Builder',
          description: 'Logged strength progress 3+ times',
          icon: <Dumbbell className="h-5 w-5 text-blue-500" />,
        });
      }
    }
    
    return achievements;
  };
  
  const progressDates = progress.map(p => new Date(p.date));
  
  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Track Your Progress</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
            <CardDescription>Track your weight changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Start logging your weight to see progress</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Progress Stats</CardTitle>
            <CardDescription>Your fitness journey in numbers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Dumbbell className="h-5 w-5 text-fitness-primary mr-2" />
                  <span>Workouts</span>
                </div>
                <span className="font-bold">{completedWorkouts}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-fitness-primary mr-2" />
                  <span>Cardio Minutes</span>
                </div>
                <span className="font-bold">{totalCardioMinutes}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-fitness-primary mr-2" />
                  <span>Days Logged</span>
                </div>
                <span className="font-bold">{progress.length}</span>
              </div>
              
              {user.fitnessGoal === 'weight_loss' && progress.length >= 2 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-fitness-primary mr-2" />
                    <span>Weight Change</span>
                  </div>
                  <span className={cn(
                    "font-bold",
                    progress[0].weight > progress[progress.length - 1].weight 
                      ? "text-green-500" 
                      : "text-red-500"
                  )}>
                    {(progress[0].weight - progress[progress.length - 1].weight).toFixed(1)} kg
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Log progress for any day</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(date) => date && setSelected(date)}
              className="rounded-md border"
              modifiers={{
                booked: progressDates,
              }}
              modifiersClassNames={{
                booked: 'border-2 border-fitness-primary',
              }}
              components={{
                DayContent: (props) => (
                  <div className="relative">
                    <div>{props.date.getDate()}</div>
                    {progressDates.some(date => isSameDay(date, props.date)) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-fitness-primary rounded-full"></div>
                    )}
                  </div>
                ),
              }}
            />
            <p className="text-center text-sm text-gray-500 mt-4">
              {isToday(selected) ? 'Today' : format(selected, 'EEEE, MMMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Log Your Progress</CardTitle>
            <CardDescription>
              Update your stats for {format(selected, 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardioMinutes">Cardio Minutes</Label>
                  <Input
                    id="cardioMinutes"
                    name="cardioMinutes"
                    type="number"
                    value={formData.cardioMinutes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="workoutCompleted"
                    name="workoutCompleted"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-fitness-primary focus:ring-fitness-primary"
                    checked={formData.workoutCompleted}
                    onChange={handleCheckboxChange}
                  />
                  <Label htmlFor="workoutCompleted" className="ml-2">
                    I completed my workout today
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strengthProgress">Strength Notes (PR's, improvements)</Label>
                <Textarea
                  id="strengthProgress"
                  name="strengthProgress"
                  value={formData.strengthProgress}
                  onChange={handleInputChange}
                  className="resize-none"
                  placeholder="E.g., 'Increased bench press by 5kg', 'Added 2 more reps to pull-ups'"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Save Progress
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            Your Achievements
          </CardTitle>
          <CardDescription>Milestones you've reached on your fitness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {getAchievements().map((achievement, i) => (
              <div key={i} className="p-4 bg-fitness-primary/5 rounded-lg flex items-center">
                <div className="mr-3">
                  {achievement.icon}
                </div>
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
            
            {getAchievements().length === 0 && (
              <div className="p-4 bg-gray-50 rounded-lg col-span-full text-center">
                <p className="text-gray-500">Start logging your progress to earn achievements!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;

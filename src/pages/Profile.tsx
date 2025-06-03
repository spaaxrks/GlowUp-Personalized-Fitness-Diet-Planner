import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, FitnessGoal } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { User, Award, Settings, Trophy, Activity, Medal } from 'lucide-react';

// Dumbbell icon component
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

// Level thresholds and details
const levelDetails = [
  { 
    level: 'Beginner', 
    points: 0, 
    description: 'Taking your first steps on your fitness journey.',
    icon: <Activity className="h-6 w-6 text-blue-400" />,
    next: { level: 'Intermediate', points: 100 }
  },
  { 
    level: 'Intermediate', 
    points: 100, 
    description: 'You\'ve established a consistent workout routine.',
    icon: <Medal className="h-6 w-6 text-green-400" />,
    next: { level: 'Gym Rat', points: 250 }
  },
  { 
    level: 'Gym Rat', 
    points: 250, 
    description: 'You\'ve become a regular at the gym and are seeing results.',
    icon: <Award className="h-6 w-6 text-yellow-500" />,
    next: { level: 'Gym Bro', points: 500 }
  },
  { 
    level: 'Gym Bro', 
    points: 500, 
    description: 'You\'re dedicated to your fitness and inspire others.',
    icon: <Trophy className="h-6 w-6 text-orange-500" />,
    next: { level: 'GYM SHARK', points: 1000 }
  },
  { 
    level: 'GYM SHARK', 
    points: 1000, 
    description: 'You\'ve reached the pinnacle of fitness dedication!',
    icon: <Dumbbell className="h-6 w-6 text-red-500" />,
    next: null
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, setUser, logout } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    medicalCondition: '',
    fitnessGoal: '' as FitnessGoal,
    targetWeight: '',
  });
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        age: user.age.toString(),
        height: user.height.toString(),
        weight: user.weight.toString(),
        medicalCondition: user.medicalCondition,
        fitnessGoal: user.fitnessGoal,
        targetWeight: user.targetWeight.toString(),
      });
    }
  }, [user]);
  
  if (!user) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser = {
      ...user,
      name: formData.name,
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      medicalCondition: formData.medicalCondition,
      fitnessGoal: formData.fitnessGoal,
      targetWeight: parseInt(formData.targetWeight),
    };
    
    setUser(updatedUser);
    toast.success("Profile updated successfully!");
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const currentLevelDetail = levelDetails.find(l => l.level === user.level) || levelDetails[0];
  
  const calculateNextLevelProgress = () => {
    if (!currentLevelDetail.next) return 100;
    
    const currentPoints = user.points;
    const nextLevelPoints = currentLevelDetail.next.points;
    const prevLevelPoints = currentLevelDetail.points;
    
    return Math.floor(((currentPoints - prevLevelPoints) / (nextLevelPoints - prevLevelPoints)) * 100);
  };
  
  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
      </div>
      
      <Tabs defaultValue="profile" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4">
          <Card>
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                    <Select
                      value={formData.fitnessGoal}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessGoal: value as FitnessGoal }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                        <SelectItem value="maintain">Maintain Weight</SelectItem>
                        <SelectItem value="general_fitness">General Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                    <Input
                      id="targetWeight"
                      name="targetWeight"
                      type="number"
                      step="0.1"
                      value={formData.targetWeight}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicalCondition">Medical Conditions (if any)</Label>
                  <Textarea
                    id="medicalCondition"
                    name="medicalCondition"
                    value={formData.medicalCondition}
                    onChange={handleInputChange}
                    className="resize-none"
                    placeholder="Share any medical conditions we should be aware of"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={handleLogout}>
                  Logout
                </Button>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Fitness Level</CardTitle>
                  <CardDescription>Your progress and achievements</CardDescription>
                </div>
                <div className="flex items-center bg-fitness-accent/10 text-fitness-accent px-3 py-1 rounded-full">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{user.points} points</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-fitness-primary/10 flex items-center justify-center">
                    {currentLevelDetail.icon}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-fitness-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {user.level}
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-2">{currentLevelDetail.description}</p>
                
                {currentLevelDetail.next && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-1">
                      {currentLevelDetail.next.points - user.points} more points until {currentLevelDetail.next.level}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div 
                        className="bg-fitness-primary h-2.5 rounded-full" 
                        style={{ width: `${calculateNextLevelProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg mb-2">All Fitness Levels</h3>
                
                {levelDetails.map((level, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-lg flex items-center ${
                      level.level === user.level 
                        ? 'bg-fitness-primary/20 border border-fitness-primary/30' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="mr-4">
                      {level.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{level.level}</h4>
                        <span className="text-sm text-gray-500">{level.points}+ points</span>
                      </div>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-2">How to Earn Points</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span>Log your daily weight</span>
                    <span className="font-medium">+10 points</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span>Complete a workout</span>
                    <span className="font-medium">+10 points</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span>Track cardio minutes</span>
                    <span className="font-medium">+5 points</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span>Log strength progress</span>
                    <span className="font-medium">+5 points</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            App Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-500">Receive reminders for workouts and progress updates</p>
              </div>
              <Switch checked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500">Switch between light and dark themes</p>
              </div>
              <Switch checked={false} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Units</h3>
                <p className="text-sm text-gray-500">Choose between metric (kg/cm) and imperial (lb/in)</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">Metric</span>
                <Switch checked={true} />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Switch component for settings
const Switch = ({ checked = false }: { checked?: boolean }) => {
  const [isChecked, setIsChecked] = useState(checked);
  
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:ring-offset-2 ${
        isChecked ? 'bg-fitness-primary' : 'bg-gray-200'
      }`}
      onClick={() => setIsChecked(!isChecked)}
    >
      <span
        className={`${
          isChecked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
};

export default Profile;

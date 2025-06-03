
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, FitnessGoal } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useUser();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('general_fitness');
  const [targetWeight, setTargetWeight] = useState('');
  
  const [formStep, setFormStep] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);

  React.useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formStep === 1 && name) {
      setFormStep(2);
      return;
    }
    
    // Form validation for step 2
    if (!age || !height || !weight) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const userData = {
      name,
      age: parseInt(age),
      height: parseInt(height),
      weight: parseInt(weight),
      medicalCondition,
      fitnessGoal,
      targetWeight: targetWeight ? parseInt(targetWeight) : parseInt(weight),
      points: 0,
      level: 'Beginner' as const
    };
    
    login(userData);
    toast.success("Welcome to FitJourney!");
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: 'Demo User',
      age: 30,
      height: 175,
      weight: 75,
      medicalCondition: 'None',
      fitnessGoal: 'weight_loss' as FitnessGoal,
      targetWeight: 70,
      points: 50,
      level: 'Beginner' as const
    };
    
    login(demoUser);
    toast.success("Welcome to the demo account!");
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 to-yellow-100 p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center">
          <Dumbbell className="h-10 w-10 text-fitness-accent mr-2" />
          <h1 className="text-4xl font-bold text-fitness-accent">GlowUp</h1>
        </div>
        <p className="text-gray-600 mt-2">Your personalized fitness and meal planner</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isRegistering ? "Create Your Account" : "Welcome Back"}</CardTitle>
          <CardDescription>
            {isRegistering 
              ? "Set up your profile to get a personalized fitness journey" 
              : "Log in to continue your fitness journey"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {formStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name"
                    type="text" 
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">Continue</Button>
                
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={handleDemoLogin}
                    className="text-fitness-primary hover:underline text-sm"
                  >
                    Try Demo Account
                  </button>
                </div>
              </>
            )}
            
            {formStep === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age"
                      type="number" 
                      placeholder="Years" 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                      id="height"
                      type="number" 
                      placeholder="cm" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Current Weight (kg)</Label>
                    <Input 
                      id="weight"
                      type="number" 
                      placeholder="kg" 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                    <Input 
                      id="targetWeight"
                      type="number" 
                      placeholder="kg" 
                      value={targetWeight} 
                      onChange={(e) => setTargetWeight(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                  <Select
                    value={fitnessGoal}
                    onValueChange={(value) => setFitnessGoal(value as FitnessGoal)}
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
                  <Label htmlFor="medicalCondition">Medical Conditions (if any)</Label>
                  <Textarea 
                    id="medicalCondition"
                    placeholder="Share any medical conditions we should be aware of" 
                    value={medicalCondition} 
                    onChange={(e) => setMedicalCondition(e.target.value)}
                    className="resize-none"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    onClick={() => setFormStep(1)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Get Started
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;


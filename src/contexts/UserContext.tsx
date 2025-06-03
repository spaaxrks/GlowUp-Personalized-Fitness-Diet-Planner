
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types
export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'maintain' | 'general_fitness';
export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Gym Rat' | 'Gym Bro' | 'GYM SHARK';

export interface UserProfile {
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  medicalCondition: string;
  fitnessGoal: FitnessGoal;
  targetWeight: number; // in kg
  points: number;
  level: FitnessLevel;
}

interface Progress {
  date: string;
  weight: number;
  workoutCompleted: boolean;
  cardioMinutes: number;
  strengthProgress: string;
}

export interface UserContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  progress: Progress[];
  setUser: (user: UserProfile | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  addProgress: (progress: Progress) => void;
  login: (userData: Partial<UserProfile>) => void;
  logout: () => void;
}

const defaultContext: UserContextType = {
  user: null,
  isLoggedIn: false,
  progress: [],
  setUser: () => {},
  setIsLoggedIn: () => {},
  addProgress: () => {},
  login: () => {},
  logout: () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('fitnessUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('fitnessLoggedIn') === 'true';
  });
  
  const [progress, setProgress] = useState<Progress[]>(() => {
    const savedProgress = localStorage.getItem('fitnessProgress');
    return savedProgress ? JSON.parse(savedProgress) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('fitnessUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('fitnessUser');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fitnessLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('fitnessProgress', JSON.stringify(progress));
  }, [progress]);

  const addProgress = (newProgress: Progress) => {
    setProgress(prev => {
      // Check if we already have progress for this date
      const existingIndex = prev.findIndex(p => p.date === newProgress.date);
      
      if (existingIndex >= 0) {
        // Update existing progress
        const updated = [...prev];
        updated[existingIndex] = newProgress;
        return updated;
      } else {
        // Add new progress
        return [...prev, newProgress];
      }
    });
    
    // Award points for logging progress
    if (user) {
      const updatedPoints = user.points + 10;
      // Calculate level based on points
      let newLevel: FitnessLevel = user.level;
      
      if (updatedPoints >= 1000) {
        newLevel = 'GYM SHARK';
      } else if (updatedPoints >= 500) {
        newLevel = 'Gym Bro';
      } else if (updatedPoints >= 250) {
        newLevel = 'Gym Rat';
      } else if (updatedPoints >= 100) {
        newLevel = 'Intermediate';
      } else {
        newLevel = 'Beginner';
      }
      
      setUser({
        ...user,
        points: updatedPoints,
        level: newLevel
      });
    }
  };

  const login = (userData: Partial<UserProfile>) => {
    // Create a new user or update existing user
    const newUser: UserProfile = {
      name: userData.name || 'User',
      age: userData.age || 30,
      height: userData.height || 170,
      weight: userData.weight || 70,
      medicalCondition: userData.medicalCondition || 'None',
      fitnessGoal: userData.fitnessGoal || 'general_fitness',
      targetWeight: userData.targetWeight || userData.weight || 70,
      points: userData.points || 0,
      level: userData.level || 'Beginner',
    };
    
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    // We don't clear the user data so they can log back in easily
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        progress,
        setUser,
        setIsLoggedIn,
        addProgress,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

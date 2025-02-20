import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface UserData {
  credits: number;
  has_used_free_credits: boolean;
  plan_id: string | null;
}

interface UserContextType {
  credits: number;
  setCredits: (credits: number) => void;
  hasUsedFreeCredits: boolean;
  setHasUsedFreeCredits: (value: boolean) => void;
  refreshCredits: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [hasUsedFreeCredits, setHasUsedFreeCredits] = useState(false);

  const refreshCredits = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('credits, has_used_free_credits, plan_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const userData = data as UserData;
      setCredits(userData.credits);
      setHasUsedFreeCredits(userData.has_used_free_credits);
    } catch (err) {
      console.error('Error fetching user credits:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch credits whenever user changes
  useEffect(() => {
    if (user) {
      // Immediately fetch credits when user logs in
      const fetchInitialCredits = async () => {
        await refreshCredits();
      };
      fetchInitialCredits();
    } else {
      setCredits(0);
      setHasUsedFreeCredits(false);
      setLoading(false);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{
      credits,
      setCredits,
      hasUsedFreeCredits,
      setHasUsedFreeCredits,
      refreshCredits,
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/integrations/api/client';

type AppRole = 'student' | 'faculty' | 'admin';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  student_id: string | null;
  department_id: string | null;
  year_level: number | null;
  batch_year: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
  departmentId: string | null;
  batchYear: number | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: AppRole | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: AppRole) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
console.log('Fetching profile for:', userId);
const profileData = await apiClient.profiles.get(userId);
console.log('Profile API response:', profileData);
      if (profileData) {
        setProfile(profileData);
        setRole(profileData.role as AppRole || null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(parsedUser.role as AppRole);
        fetchProfile(parsedUser.id);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, requestedRole: AppRole) => {
    try {
      const { token, user: newUser } = await apiClient.auth.register(email, password, fullName, requestedRole);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setRole(newUser.role as AppRole);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user: loggedInUser } = await apiClient.auth.login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setRole(loggedInUser.role as AppRole);
      await fetchProfile(loggedInUser.id);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await apiClient.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setProfile(null);
      setRole(null);
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
};


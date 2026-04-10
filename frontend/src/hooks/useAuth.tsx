import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import apiClient, { AuthUser } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: AuthUser | null;
  profile: AuthUser | null;
  session: string | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'customer' | 'lawyer' | 'admin') => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadCurrentUser = async (tokenOverride?: string) => {
    const activeToken = tokenOverride || session;
    if (!activeToken) return;
    try {
      apiClient.setToken(activeToken);
      const me = await apiClient.getCurrentUser();
      setUser(me);
      setProfile(me);
    } catch (error) {
      console.error('Failed to fetch current user', error);
      setUser(null);
      setProfile(null);
      apiClient.setToken(null);
      setSession(null);
    }
  };

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (storedToken) {
      apiClient.setToken(storedToken);
      setSession(storedToken);
      loadCurrentUser(storedToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'customer' | 'lawyer' | 'admin') => {
    try {
      await apiClient.register(email, password, fullName, role);
      toast({
        title: 'Account created',
        description: 'Sign in with your new credentials to continue.',
      });
      return { error: null };
    } catch (err: any) {
      const message = err?.message || 'Unable to create account';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { access_token } = await apiClient.login(email, password);
      setSession(access_token);
      await loadCurrentUser(access_token);
      toast({ title: 'Signed in', description: 'Welcome back!' });
      return { error: null };
    } catch (err: any) {
      const message = err?.message || 'Unable to sign in';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    apiClient.setToken(null);
    setSession(null);
    setUser(null);
    setProfile(null);
    toast({ title: 'Signed out', description: 'You have been signed out.' });
  };

  const refreshProfile = async () => {
    await loadCurrentUser();
  };

  const updateProfile = async (_updates: Partial<AuthUser>) => {
    // Backend profile update endpoint not implemented; keep stub for API compatibility.
    const error = new Error('Profile updates are not available yet.');
    toast({ title: 'Not available', description: error.message, variant: 'destructive' });
    return { error };
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
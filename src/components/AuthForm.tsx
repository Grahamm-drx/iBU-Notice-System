import { useState, useEffect } from 'react';
import { Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type AppRole = 'student' | 'faculty' | 'admin';

interface AuthFormProps {
  mode: 'login' | 'signup';
  role: AppRole;
  colorClass: string;
  onSuccessChange?: (success: boolean) => void;
}

const AuthForm = ({ mode, role, colorClass, onSuccessChange }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate(`/${role}/dashboard`);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate, role]);

  useEffect(() => {
    if (onSuccessChange) {
      onSuccessChange(showSuccess);
    }
  }, [showSuccess, onSuccessChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          setShowSuccess(true);
        }
      } else {
        const { error } = await signUp(email, password, fullName, role);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! Please check your email to verify your account.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'faculty':
        return 'Faculty';
      case 'admin':
        return 'Admin';
      default:
        return 'Student';
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-primary/30 animate-pulse-ring" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-20 h-20 rounded-full border-2 border-primary/20 animate-pulse-ring" 
              style={{ animationDelay: '0.5s' }} 
            />
          </div>
          <div className="relative animate-success-scale">
            <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
              <defs>
                <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(204, 89%, 59%)" />
                  <stop offset="100%" stopColor="hsl(204, 89%, 45%)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle cx="40" cy="40" r="38" fill="url(#checkGrad)" filter="url(#glow)" />
              <path
                d="M24 40l10 10 22-22"
                stroke="white"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="50"
                className="animate-check-draw"
                style={{ strokeDashoffset: 50 }}
              />
            </svg>
          </div>
        </div>
        <h3 
          className="text-xl font-bold text-card-foreground mb-1 opacity-0 animate-slide-up" 
          style={{ animationDelay: '0.4s' }}
        >
          Login Successful!
        </h3>
        <p 
          className="text-sm text-muted-foreground opacity-0 animate-slide-up" 
          style={{ animationDelay: '0.6s' }}
        >
          Redirecting to {getRoleLabel()} Dashboard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === 'signup' && (
        <>
          <Label htmlFor="fullName" className="text-card-foreground font-medium block">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-12 pr-4 h-12 bg-secondary/50 border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary/50 focus:outline-none transition-all duration-300"
              required
            />
          </div>
        </>
      )}
      
      <Label htmlFor="email" className="text-card-foreground font-medium block">
        Email Address
      </Label>
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          id="email"
          type="email"
          placeholder={`${role}@bicol-u.edu.ph`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-12 pr-4 h-12 bg-secondary/50 border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary/50 focus:outline-none transition-all duration-300"
          required
        />
      </div>

      <Label htmlFor="password" className="text-card-foreground font-medium block">
        Password
      </Label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-12 pr-12 h-12 bg-secondary/50 border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary/50 focus:outline-none transition-all duration-300"
          required
          minLength={6}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-accent transition-all duration-200"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <Button
        type="submit"
        className={`w-full h-12 ${colorClass} rounded-xl font-semibold text-base shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {mode === 'login' ? 'Signing in...' : 'Creating account...'}
          </>
        ) : (
          mode === 'login' ? 'Sign In' : 'Create Account'
        )}
      </Button>
    </form>
  );

};

export default AuthForm;


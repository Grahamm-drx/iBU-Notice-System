import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingBlobsAndParticles from './FloatingBlobs-and-Particles';
import IBuLogo from './iBU-Logo';

interface AuthLayoutProps {
  children: ReactNode;
  icon: ReactNode;
  title: string;
  subtitle: string;
  iconBgClass: string;
  iconTextClass: string;
  showBackButton?: boolean;
}

const AuthLayout = ({
  children,
  icon,
  title,
  subtitle,
  iconBgClass,
  iconTextClass,
  showBackButton = true,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen box-border bg-[#3baff3] flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingBlobsAndParticles />

      <div className="w-full max-w-md relative">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[2rem] blur-xl opacity-60 animate-pulse" />
        
        <div className="relative bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in-up">
          {/* Back Button - hidden when showBackButton is false */}
          {showBackButton && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-card-foreground transition-all duration-300 mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          )}

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className={`p-4 rounded-2xl ${iconBgClass} mb-4 shadow-lg transition-transform duration-300 hover:scale-105`}>
              <div className={iconTextClass}>{icon}</div>
            </div>
            <IBuLogo />
            <h1 className="mt-4 text-2xl font-bold text-card-foreground tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;


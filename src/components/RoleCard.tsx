import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  variant: 'student' | 'faculty' | 'admin';
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, icon: Icon, to, variant }) => {
  // Exact colors from original design - matching the blue background
  const bgColor = variant === 'faculty' ? '#ff8c42' : '#3baff3';

  return (
    <Link
      to={to}
      className="group flex flex-col items-center gap-4 p-8 rounded-3xl text-white visited:text-white hover:text-white focus:text-white transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-0"
      style={{ backgroundColor: bgColor }}
    >
      <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
        <Icon className="w-10 h-10" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </Link>
  );
};

export default RoleCard;
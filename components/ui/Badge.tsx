import React from 'react';
import { X } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple' | 'amber';
  size?: 'sm' | 'md';
  onRemove?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  onRemove,
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-[#090d16] text-slate-300 border-slate-800 font-mono',
    success: 'bg-red-500/10 text-red-400 border-red-500/30 font-mono',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-mono',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30 font-mono',
    amber: 'bg-orange-500/10 text-orange-400 border-orange-500/30 font-mono',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-slate-400 hover:text-white transition-colors focus:outline-none"
          aria-label="Remove"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};

import React from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle, Clock } from 'lucide-react';
import { TrustStatus } from '../types';

interface StatusBadgeProps {
  status: TrustStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  customLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
  customLabel,
}) => {
  const normStatus = (status || 'unverified').toLowerCase();

  const getStyle = () => {
    switch (normStatus) {
      case 'verified':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: ShieldCheck,
          label: customLabel || 'Verified (demo)',
          iconColor: 'text-emerald-600',
          dotColor: 'bg-emerald-500',
        };
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: Clock,
          label: customLabel || 'Pending (demo)',
          iconColor: 'text-amber-600',
          dotColor: 'bg-amber-500',
        };
      case 'suspicious':
        return {
          bg: 'bg-red-50 text-red-900 border-red-300',
          icon: AlertTriangle,
          label: customLabel || 'Suspicious (demo)',
          iconColor: 'text-red-600',
          dotColor: 'bg-red-500',
        };
      case 'unverified':
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: HelpCircle,
          label: customLabel || 'Unverified (demo)',
          iconColor: 'text-slate-500',
          dotColor: 'bg-slate-400',
        };
    }
  };

  const style = getStyle();
  const IconComponent = style.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-bold gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap tracking-wide select-none ${style.bg} ${sizeClasses[size]} ${className}`}
    >
      {showIcon ? (
        <IconComponent size={iconSizes[size]} className={style.iconColor} />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor}`} />
      )}
      <span>{style.label}</span>
    </span>
  );
};

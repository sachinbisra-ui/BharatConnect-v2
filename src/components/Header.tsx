import React from 'react';
import {
  Mail,
  Building2,
  PhoneCall,
  Smartphone,
  Maximize2,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { TrustSealMotif } from './TrustSealMotif';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isMobileFramed: boolean;
  onToggleFrame: () => void;
  trustScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isMobileFramed,
  onToggleFrame,
  trustScore,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-7 z-20 shadow-2xs">
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FF9933] flex items-center justify-center font-bold text-white text-sm shadow-xs group-hover:scale-105 transition-transform">
            B
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-black text-xs sm:text-sm text-[#0A1F44] tracking-tight group-hover:text-amber-600 transition-colors">
                BharatConnect
              </h1>
              <span className="text-[8px] bg-amber-500/15 text-amber-900 border border-amber-400/30 px-1 py-0.2 rounded font-bold uppercase">
                Demo
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-none mt-0.5">
              Verify Once. Reuse Everywhere.
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange('bharatmail')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'bharatmail'
                ? 'bg-[#0A1F44] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="BharatMail"
          >
            <Mail size={14} />
            <span className="hidden sm:inline">Mail</span>
          </button>

          <button
            onClick={() => onTabChange('directory')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-[#0A1F44] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Institutions"
          >
            <Building2 size={14} />
            <span className="hidden sm:inline">Directory</span>
          </button>

          <button
            onClick={() => onTabChange('caller-id')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'caller-id'
                ? 'bg-[#0A1F44] text-white'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
            title="Caller ID Simulator"
          >
            <PhoneCall size={14} className="text-amber-700" />
            <span className="hidden sm:inline">Caller ID</span>
          </button>

          <button
            onClick={onToggleFrame}
            className="hidden md:flex items-center gap-1 p-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
            title={isMobileFramed ? 'Switch to Full-Width Layout' : 'Switch to Mobile Phone Frame'}
          >
            {isMobileFramed ? <Maximize2 size={13} /> : <Smartphone size={13} />}
            <span>{isMobileFramed ? 'Expanded' : 'Phone'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

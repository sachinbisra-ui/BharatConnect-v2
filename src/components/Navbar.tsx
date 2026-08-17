import React from 'react';
import {
  Home,
  MessageSquare,
  ShieldCheck,
  Lock,
  Settings,
  Mail,
  Building2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unreadMessagesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  unreadMessagesCount = 1,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ size: number; className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'trust', label: 'Trust', icon: ShieldCheck },
    { id: 'consents', label: 'Privacy', icon: Lock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg select-none shrink-0">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#0A1F44] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <IconComponent
                  size={20}
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5] text-[#0A1F44]' : 'stroke-2'
                  }`}
                />
                {tab.id === 'messages' && unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                    {unreadMessagesCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-black' : 'font-medium'}`}>
                {tab.label}
              </span>

              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A1F44] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

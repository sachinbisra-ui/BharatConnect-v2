import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  PhoneCall,
  MessageSquare,
  Mail,
  Building2,
  Lock,
  ChevronRight,
  Sparkles,
  Info,
  Layers,
  Fingerprint,
  ArrowUpRight,
  Clock,
  Key,
  Shield,
} from 'lucide-react';
import { TrustSealMotif } from './TrustSealMotif';
import { StatusBadge } from './StatusBadge';
import { ActiveTab, ActivityLogItem } from '../types';
import { MOCK_ACTIVITY_LOGS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenScoreExplainer: () => void;
  onTriggerSimulatedCall: () => void;
  trustScore: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenScoreExplainer,
  onTriggerSimulatedCall,
  trustScore,
}) => {
  const { userProfile } = useAuth();
  const [copiedToken, setCopiedToken] = useState(false);

  const handleCopyToken = () => {
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const initials = userProfile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const displayScore = userProfile.trustScore || trustScore;

  return (
    <div className="space-y-3.5 pb-20 sm:pb-6 animate-in fade-in duration-200">
      {/* 1. Identity Summary Header matching Sleek Interface */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-xs">
            <div className="w-full h-full bg-[#0A1F44]/10 flex items-center justify-center text-[#0A1F44] font-black text-sm">
              {initials}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">
              {userProfile.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#0F9D6C]" />
              <span className="text-[10px] text-[#0F9D6C] font-bold uppercase tracking-wider">
                Verified (Firestore)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyToken}
          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
          title="Copy Demo Trust Token"
        >
          <Key size={13} className="text-amber-500" />
          <span className="hidden xs:inline">{copiedToken ? 'Copied' : 'Token'}</span>
        </button>
      </div>

      {/* 2. Demo Trust Score Card with Sleek Layout & /900 scale */}
      <div className="bg-white rounded-2xl p-4.5 shadow-xs border border-slate-100 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-28 h-28 bg-[#0F9D6C]/5 rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Trust Score (Firestore)
          </p>
          <button
            onClick={onOpenScoreExplainer}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Factors</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-display font-black text-slate-800 tracking-tighter leading-none">
              {displayScore}
            </span>
            <span className="text-slate-400 text-xs mb-0.5 font-semibold">/ 900</span>
          </div>

          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
            High Trust Tier
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-[#0F9D6C] rounded-full transition-all duration-300"
            style={{ width: `${(displayScore / 900) * 100}%` }}
          />
        </div>

        <p className="text-[10px] text-slate-400 mt-2">
          Masked ID: <span className="font-mono text-slate-700 font-bold">{userProfile.maskedId || 'BC-9842-DEMO'}</span> • Phone: <span className="font-mono text-slate-600">{userProfile.phone}</span>
        </p>
      </div>

      {/* 3. Incoming Call Simulation Trigger Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-white/40 p-3.5 rounded-2xl border border-amber-300/70 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0">
            <PhoneCall size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Test Verified Caller ID
            </h3>
            <p className="text-[10px] text-slate-600">
              Simulate call with cryptographic identity handshake.
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerSimulatedCall}
          className="px-3 py-1.5 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white text-[11px] font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1"
        >
          <span>Simulate</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* 4. Sleek 3-Column Module Grid */}
      <div>
        <div className="grid grid-cols-3 gap-2">
          {/* Messaging */}
          <button
            onClick={() => onNavigate('messages')}
            className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center gap-2 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              <MessageSquare size={16} />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">
              Messaging
            </span>
          </button>

          {/* Caller ID */}
          <button
            onClick={() => onNavigate('caller-id')}
            className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center gap-2 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              <PhoneCall size={16} />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">
              Caller ID
            </span>
          </button>

          {/* BharatMail */}
          <button
            onClick={() => onNavigate('bharatmail')}
            className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center gap-2 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              <Mail size={16} />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">
              BharatMail
            </span>
          </button>

          {/* Banking / Institutions */}
          <button
            onClick={() => onNavigate('directory')}
            className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center gap-2 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              <Building2 size={16} />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">
              Institutions
            </span>
          </button>

          {/* Registry / Trust Profile */}
          <button
            onClick={() => onNavigate('trust')}
            className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center gap-2 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              <ShieldCheck size={16} />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">
              Trust Profile
            </span>
          </button>

          {/* Consent */}
          <button
            onClick={() => onNavigate('consents')}
            className="bg-[#FF9933]/5 border border-[#FF9933]/20 p-3 rounded-xl flex flex-col items-center gap-2 hover:bg-[#FF9933]/10 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 bg-[#FF9933]/20 text-[#FF9933] rounded-lg flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              <Lock size={16} />
            </div>
            <span className="text-[9px] font-bold text-[#FF9933] text-center leading-tight">
              Consent
            </span>
          </button>
        </div>
      </div>

      {/* 5. Active Verifications Card */}
      <div>
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Active Verifications
        </h4>
        <div className="space-y-1.5">
          <div className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#0F9D6C]" />
              <span className="text-xs font-medium text-slate-700">Identity Document</span>
            </div>
            <span className="text-[10px] font-bold text-[#0F9D6C]">SECURE</span>
          </div>

          <div className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#0F9D6C]" />
              <span className="text-xs font-medium text-slate-700">Biometric Face Match</span>
            </div>
            <span className="text-[10px] font-bold text-[#0F9D6C]">MATCHED</span>
          </div>

          <div className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#0F9D6C]" />
              <span className="text-xs font-medium text-slate-700">SIM Tenure Binding</span>
            </div>
            <span className="text-[10px] font-bold text-[#0F9D6C]">BOUND</span>
          </div>
        </div>
      </div>

      {/* 6. Conceptual Map */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Layers size={13} className="text-[#0A1F44]" />
            "Verify Once. Reuse Everywhere"
          </span>
          <span className="text-[9px] text-slate-400 font-medium">Flow</span>
        </div>

        <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-semibold text-slate-700">
          <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
            <Fingerprint size={14} className="text-blue-700 mx-auto mb-0.5" />
            <span className="block leading-tight font-bold">1. Signal</span>
          </div>
          <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
            <Lock size={14} className="text-amber-600 mx-auto mb-0.5" />
            <span className="block leading-tight font-bold">2. Consent</span>
          </div>
          <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
            <ShieldCheck size={14} className="text-emerald-700 mx-auto mb-0.5" />
            <span className="block leading-tight font-bold">3. Decision</span>
          </div>
          <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
            <Sparkles size={14} className="text-purple-600 mx-auto mb-0.5" />
            <span className="block leading-tight font-bold">4. Reuse</span>
          </div>
        </div>
      </div>
    </div>
  );
};


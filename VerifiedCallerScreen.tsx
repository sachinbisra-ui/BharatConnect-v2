import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  PhoneOff,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Volume2,
  Mic,
  MicOff,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { TrustSealMotif } from './TrustSealMotif';
import { TrustStatus } from '../types';

interface CallerScenario {
  id: string;
  name: string;
  number: string;
  category: string;
  status: TrustStatus;
  reason: string;
  avatar: string;
  signals: string[];
  warningAlert?: string;
  trustScore: number;
}

const SCENARIOS: CallerScenario[] = [
  {
    id: 'bank',
    name: 'State Trust Bank Official Desk (demo)',
    number: '1800-000-9842',
    category: 'Banking & Financial Services',
    status: 'verified',
    reason: 'Cryptographically Verified: Account Security & Annual Re-KYC Authorization Call',
    avatar: '🏦',
    signals: [
      'RBI License Bound: #STB-9812-DEMO (Simulated)',
      'Telecom Carrier SIM-Swap Immunity Validated',
      'BharatConnect Cryptographic Token Active',
    ],
    trustScore: 940,
  },
  {
    id: 'scam',
    name: 'MegaRewards Prize Dispatcher (demo)',
    number: '+91 80000 99999',
    category: 'Unregistered International Robocaller',
    status: 'suspicious',
    reason: 'CRITICAL WARNING: Known robocalling pool flagged by 4,200+ citizens for OTP phishing.',
    avatar: '⚠️',
    warningAlert: 'DO NOT ANSWER: Caller failed BharatConnect trust token handshake. Potential identity fraud.',
    signals: [
      'Failed Domain & Telecom Attestation',
      'Blacklisted on National Fraud Grid (Simulated)',
      'Spoofed Caller ID Signature Detected',
    ],
    trustScore: 210,
  },
  {
    id: 'courier',
    name: 'Metro Express Delivery Agent (demo)',
    number: '+91 91234 56780',
    category: 'Unverified Delivery Courier',
    status: 'unverified',
    reason: 'Unverified Personal Mobile: Courier has not bound institutional trust seal.',
    avatar: '📦',
    signals: [
      'No Institutional Organization Token',
      'Standard Carrier Number (<30 days old)',
      'No Fraud History, but Unverified',
    ],
    trustScore: 620,
  },
];

export const VerifiedCallerScreen: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [callState, setCallState] = useState<'incoming' | 'active' | 'ended'>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showSignalDetails, setShowSignalDetails] = useState(false);

  const activeScenario = SCENARIOS[selectedScenarioIndex];

  // Active call duration timer
  useEffect(() => {
    let timer: any;
    if (callState === 'active') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const handleAnswer = () => {
    setCallState('active');
  };

  const handleDecline = () => {
    setCallState('ended');
  };

  const handleReset = (index?: number) => {
    if (typeof index === 'number') {
      setSelectedScenarioIndex(index);
    }
    setCallState('incoming');
    setShowSignalDetails(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-6 animate-in fade-in duration-200">
      {/* Scenario Selector Header */}
      <div className="bg-[#0A1F44] text-white rounded-2xl p-4 border border-slate-700/60 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PhoneCall size={16} className="text-amber-400" />
            <h2 className="text-sm font-display font-bold text-white">
              Simulate Incoming Caller Scenario
            </h2>
          </div>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
            Interactive Test
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
          {SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => handleReset(idx)}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                selectedScenarioIndex === idx
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs'
                  : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
              }`}
            >
              <div className="text-base mb-0.5">{sc.avatar}</div>
              <div className="truncate text-[10px] sm:text-xs">
                {sc.status === 'verified' ? 'Verified Bank' : sc.status === 'suspicious' ? 'Scam Caller' : 'Unverified'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Full-Screen Simulated Phone UI */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-gradient-to-b from-[#0A1F44] via-[#0d2757] to-[#0A1F44] text-white min-h-[540px] flex flex-col justify-between p-6">
        {/* Top Phone Status & Trust Badge */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
            <TrustSealMotif size={14} variant={activeScenario.status === 'verified' ? 'emerald' : activeScenario.status === 'suspicious' ? 'saffron' : 'subtle'} />
            <span className="text-slate-200">BharatConnect Trust Handshake</span>
          </div>

          <StatusBadge status={activeScenario.status} size="md" className="mt-1" />
        </div>

        {/* 1. INCOMING CALL STATE */}
        {callState === 'incoming' && (
          <div className="flex flex-col items-center text-center my-auto space-y-4 animate-in fade-in zoom-in-95">
            {/* Animated Avatar / Trust Seal */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-4xl shadow-xl">
                {activeScenario.avatar}
              </div>

              {activeScenario.status === 'verified' && (
                <div className="absolute -bottom-2 -right-2 bg-[#0F9D6C] text-white p-1.5 rounded-full ring-4 ring-[#0A1F44]">
                  <ShieldCheck size={18} />
                </div>
              )}

              {activeScenario.status === 'suspicious' && (
                <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-1.5 rounded-full ring-4 ring-[#0A1F44]">
                  <AlertTriangle size={18} />
                </div>
              )}
            </div>

            {/* Caller Info */}
            <div>
              <h3 className="text-xl font-display font-extrabold text-white tracking-tight">
                {activeScenario.name}
              </h3>
              <p className="text-sm font-mono text-slate-300 mt-0.5">
                {activeScenario.number}
              </p>
              <p className="text-xs text-amber-300 font-medium mt-1">
                {activeScenario.category}
              </p>
            </div>

            {/* Call Reason / Threat Warning */}
            <div
              className={`p-3 rounded-xl border text-xs max-w-sm text-left leading-relaxed ${
                activeScenario.status === 'suspicious'
                  ? 'bg-red-500/20 border-red-400 text-red-200'
                  : 'bg-white/10 border-white/20 text-slate-200'
              }`}
            >
              <p className="font-semibold text-white mb-0.5 flex items-center gap-1.5">
                <Info size={13} className="text-amber-400 shrink-0" />
                Verified Calling Intent:
              </p>
              <p className="text-[11px] opacity-90">{activeScenario.reason}</p>
            </div>

            {/* Expandable Why Verified Drawer */}
            <div className="w-full max-w-sm">
              <button
                onClick={() => setShowSignalDetails(!showSignalDetails)}
                className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/15 rounded-lg text-[11px] font-semibold text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Inspect Cryptographic Caller Signals</span>
                {showSignalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showSignalDetails && (
                <div className="mt-2 p-3 bg-black/40 rounded-xl border border-white/10 text-[11px] text-slate-300 space-y-1.5 text-left animate-in fade-in">
                  <div className="flex justify-between font-bold text-white border-b border-white/10 pb-1">
                    <span>Attestation Signals</span>
                    <span className="text-emerald-400">Score: {activeScenario.trustScore}/1000</span>
                  </div>
                  {activeScenario.signals.map((sig, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. ACTIVE CALL STATE */}
        {callState === 'active' && (
          <div className="flex flex-col items-center text-center my-auto space-y-5 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-lg relative">
              {activeScenario.avatar}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
            </div>

            <div>
              <h3 className="text-lg font-display font-bold text-white">{activeScenario.name}</h3>
              <p className="text-sm font-mono text-emerald-400 font-bold mt-1">
                {formatTimer(callDuration)}
              </p>
              <span className="text-xs text-slate-300">
                End-to-End Cryptographically Bound Session (Simulated)
              </span>
            </div>

            {/* Simulated Audio Waveform */}
            <div className="flex items-center justify-center gap-1.5 h-10 px-6 py-2 bg-white/10 rounded-2xl border border-white/20 w-48">
              {[40, 75, 90, 60, 30, 80, 100, 50, 70, 45].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-emerald-400 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.8s',
                  }}
                />
              ))}
            </div>

            <div className="p-3 bg-white/10 rounded-xl text-xs text-slate-300 max-w-xs">
              <p className="font-semibold text-emerald-300">No sensitive data shared during call.</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Tokens automatically expire when call finishes.
              </p>
            </div>
          </div>
        )}

        {/* 3. CALL ENDED STATE */}
        {callState === 'ended' && (
          <div className="flex flex-col items-center text-center my-auto space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400">
              <PhoneOff size={28} />
            </div>

            <div>
              <h3 className="text-lg font-display font-bold text-white">Call Terminated</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated call logged in BharatConnect Security Audit.
              </p>
            </div>

            <button
              onClick={() => handleReset()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Simulate Again</span>
            </button>
          </div>
        )}

        {/* Bottom Call Action Buttons */}
        {callState === 'incoming' && (
          <div className="flex items-center justify-around w-full pt-4">
            {/* Decline Button */}
            <button
              onClick={handleDecline}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
              aria-label="Decline Call"
            >
              <PhoneOff size={24} />
              <span className="text-[9px] font-bold mt-0.5">Decline</span>
            </button>

            {/* Answer Button */}
            <button
              onClick={handleAnswer}
              className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-90 animate-pulse cursor-pointer"
              aria-label="Answer Call"
            >
              <PhoneCall size={24} />
              <span className="text-[9px] font-bold mt-0.5">Answer</span>
            </button>
          </div>
        )}

        {callState === 'active' && (
          <div className="flex items-center justify-around w-full pt-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full border transition-colors cursor-pointer ${
                isMuted ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
              aria-label="Mute microphone"
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Hang Up Button */}
            <button
              onClick={handleDecline}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
              aria-label="End call"
            >
              <PhoneOff size={24} />
            </button>

            <button
              className="p-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Speaker"
            >
              <Volume2 size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Phone,
  KeyRound,
  FileCheck2,
  ScanFace,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Info,
  Layers,
  Fingerprint,
  Users,
} from 'lucide-react';
import { TrustSealMotif } from './TrustSealMotif';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../context/AuthContext';
import { DEMO_PRESET_USERS } from '../firebase';

interface WelcomeFlowProps {
  onComplete: () => void;
}

export const WelcomeFlow: React.FC<WelcomeFlowProps> = ({ onComplete }) => {
  const {
    userProfile,
    requestPhoneOtp,
    verifyOtpCode,
    loginWithDemoUser,
    loginError,
    clearLoginError,
  } = useAuth();

  const [step, setStep] = useState<'welcome' | 'register' | 'kyc' | 'done'>('welcome');
  const [phone, setPhone] = useState('9876543210');
  const [citizenName, setCitizenName] = useState('Aarav Sharma');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [kycProgress, setKycProgress] = useState<number>(0);
  const [kycStageIndex, setKycStageIndex] = useState<number>(0);

  const kycStages = [
    { title: 'Cryptographic Key Generation', desc: 'Creating isolated browser-memory demo keypair' },
    { title: 'Zero-Knowledge Demographic Assertion', desc: 'Attestation generated without copying raw identity documents' },
    { title: 'Hardware Liveness & Enclave Handshake', desc: 'Secure enclave hardware attestation simulation' },
    { title: 'Telecom SIM & Carrier Binding', desc: 'Telecom carrier tenure & SIM-swap risk check' },
    { title: 'Minting BharatConnect Trust Token', desc: 'Issuing verifiable prototype credential to Firestore' },
  ];

  // Handle KYC animated progression
  useEffect(() => {
    if (step === 'kyc') {
      const interval = setInterval(() => {
        setKycProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('done'), 600);
            return 100;
          }
          const next = prev + 5;
          const nextStage = Math.min(Math.floor((next / 100) * kycStages.length), kycStages.length - 1);
          setKycStageIndex(nextStage);
          return next;
        });
      }, 140);

      return () => clearInterval(interval);
    }
  }, [step]);

  const handleRequestOtp = async () => {
    if (!phone || phone.length < 10) {
      setOtpError('Please enter a valid 10-digit phone number');
      return;
    }
    setIsRequestingOtp(true);
    setOtpError('');
    clearLoginError();

    try {
      const sent = await requestPhoneOtp(phone, 'recaptcha-verifier-container');
      if (sent) {
        setOtpSent(true);
      } else {
        // Fallback for fast demo mode
        setOtpSent(true);
      }
    } catch (err: any) {
      setOtpSent(true);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    clearLoginError();

    if (!otp.trim()) {
      setOtpError('Please enter the OTP code (or 123456 for instant demo login)');
      return;
    }

    try {
      const ok = await verifyOtpCode(otp.trim(), citizenName.trim() || 'Aarav Sharma');
      if (ok) {
        setStep('kyc');
      } else {
        // If simulated
        setStep('kyc');
      }
    } catch (err: any) {
      setStep('kyc');
    }
  };

  const handleQuickPresetLogin = async (presetUser: typeof DEMO_PRESET_USERS[0]) => {
    await loginWithDemoUser(presetUser);
    setCitizenName(presetUser.name);
    setPhone(presetUser.phone.replace('+91', '').trim());
    setStep('kyc');
  };

  return (
    <div className="w-full min-h-[580px] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-800">
      {/* Hidden Recaptcha Anchor */}
      <div id="recaptcha-verifier-container"></div>

      {/* 1. WELCOME STEP */}
      {step === 'welcome' && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Hero Header */}
          <div className="relative bg-[#0A1F44] text-white p-7 text-center overflow-hidden">
            {/* Background Trust Seal */}
            <div className="absolute -top-12 -right-12 opacity-15 pointer-events-none">
              <TrustSealMotif size={220} variant="emerald" animated />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-400/40 flex items-center justify-center mb-3 shadow-inner">
                <TrustSealMotif size={44} variant="emerald" />
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Bharat Digital Trust</span>
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-200 font-medium">Prototype</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
                BharatConnect
              </h1>

              <p className="text-amber-400 text-sm font-semibold mt-1">
                "Verify Once. Reuse Everywhere."
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {/* Prototype Notice Banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">DEMO / PROTOTYPE — NOT A REAL VERIFICATION</strong>
                <p className="mt-0.5 text-amber-800 leading-snug">
                  Experience a privacy-preserving consent layer where services verify your digital trust status without collecting raw ID documents.
                </p>
              </div>
            </div>

            {/* Conceptual Flow Diagram */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers size={13} className="text-[#0A1F44]" />
                Visible Trust Architecture Flow:
              </div>
              <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold text-slate-700">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                  <Fingerprint size={16} className="text-blue-700 mb-1" />
                  <span>1. Verify Signal</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                  <Lock size={16} className="text-amber-600 mb-1" />
                  <span>2. Consent Rule</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                  <ShieldCheck size={16} className="text-emerald-700 mb-1" />
                  <span>3. Trust Status</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                  <Sparkles size={16} className="text-purple-600 mb-1" />
                  <span>4. Instant App</span>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Persona Login */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Users size={12} /> Quick Persona Sign-In:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_PRESET_USERS.slice(0, 2).map((user) => (
                  <button
                    key={user.uid}
                    onClick={() => handleQuickPresetLogin(user)}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-xs text-slate-800 block">{user.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">{user.phone}</span>
                    <span className="text-[9px] text-emerald-700 font-semibold mt-0.5 block">
                      Score: {user.trustScore}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep('register')}
              className="w-full py-3.5 px-4 bg-[#0A1F44] hover:bg-[#0f2d60] text-white font-display font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:gap-3 cursor-pointer"
            >
              <span>Custom Phone OTP Login</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 2. REGISTRATION STEP */}
      {step === 'register' && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
          <div className="bg-[#0A1F44] text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Step 1 of 2</span>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">Firebase Phone Auth</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white">Citizen Registration</h2>
            <p className="text-xs text-slate-300 mt-1">
              Enter your mobile number to receive OTP or use instant demo code.
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                <strong>FIREBASE PHONE AUTH:</strong> Real OTP verification with fallback demo code <strong className="underline">123456</strong>.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Citizen Full Name
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:border-[#0A1F44]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <div className="absolute left-3 text-sm font-semibold text-slate-500 flex items-center gap-1">
                    <Phone size={14} className="text-slate-400" />
                    <span>+91</span>
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="w-full pl-16 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:border-[#0A1F44]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isRequestingOtp}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
                >
                  {isRequestingOtp ? 'Sending...' : otpSent ? 'Resend' : 'Get OTP'}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  OTP Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setOtp('123456');
                    setOtpError('');
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={12} /> Auto-fill Demo (123456)
                </button>
              </div>
              <div className="relative flex items-center">
                <KeyRound size={16} className="absolute left-3 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpError('');
                  }}
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-bold tracking-widest text-slate-800 focus:outline-hidden focus:border-[#0A1F44]"
                />
              </div>
              {(otpError || loginError) && (
                <p className="text-xs text-red-600 font-medium mt-1">{otpError || loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#0A1F44] hover:bg-[#0f2d60] text-white font-display font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Verify & Proceed to KYC Demo</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => setStep('welcome')}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Back to Overview
            </button>
          </form>
        </div>
      )}

      {/* 3. SIMULATED KYC STEP */}
      {step === 'kyc' && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
          <div className="bg-[#0A1F44] text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Step 2 of 2</span>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">Simulated KYC</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white">Minting Trust Identity</h2>
            <p className="text-xs text-slate-300 mt-1">
              DEMO ONLY — No raw Aadhaar or biometric data queried or stored.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Visual Scan Center */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/40 flex items-center justify-center relative mb-3">
                <TrustSealMotif size={56} variant="emerald" animated />
                <ScanFace size={24} className="absolute text-emerald-700" />
              </div>

              <span className="text-xs font-bold text-[#0A1F44] uppercase tracking-wider">
                Attesting Signals for {citizenName}...
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                {kycStages[kycStageIndex]?.title}
              </span>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-4">
                <div
                  className="bg-gradient-to-r from-[#0F9D6C] to-emerald-500 h-full transition-all duration-150 ease-out"
                  style={{ width: `${kycProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-bold mt-1.5">{kycProgress}% Completed</span>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs">
              {kycStages.map((stage, idx) => {
                const isPassed = idx < kycStageIndex || kycProgress === 100;
                const isCurrent = idx === kycStageIndex && kycProgress < 100;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                      isPassed
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : isCurrent
                        ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isPassed ? (
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw size={14} className="text-amber-600 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-[11px] leading-tight">{stage.title}</p>
                        <p className="text-[10px] opacity-75">{stage.desc}</p>
                      </div>
                    </div>
                    {isPassed && <StatusBadge status="verified" size="sm" customLabel="PASS (demo)" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. DONE STEP */}
      {step === 'done' && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-[#0A1F44] text-white p-7 text-center relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mb-3">
              <CheckCircle2 size={36} className="text-emerald-400" />
            </div>

            <h2 className="text-2xl font-display font-extrabold text-white">
              Trust Token Ready
            </h2>
            <p className="text-xs text-amber-300 mt-1 font-semibold">
              Verifiable Prototype Credential Active in Firestore
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <strong className="font-bold">Digital Trust Status:</strong>
                <StatusBadge status="verified" size="sm" />
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Your profile can now demonstrate verification to banks, telecom operators, and employers without exposing raw identity documents.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Citizen Name:</span>
                <span className="font-bold text-slate-800">{userProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone Number:</span>
                <span className="font-bold text-slate-800">{userProfile.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Demo Trust Score:</span>
                <span className="font-bold text-emerald-700">{userProfile.trustScore} / 900</span>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full py-3.5 px-4 bg-[#0F9D6C] hover:bg-[#0d8b5f] text-white font-display font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Enter BharatConnect Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


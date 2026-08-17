import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Key,
  Info,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Smartphone,
  Cpu,
  Layers,
  FileText,
  MapPin,
  Landmark,
} from 'lucide-react';
import { TrustSealMotif } from './TrustSealMotif';
import { StatusBadge } from './StatusBadge';
import { MOCK_VERIFICATION_SIGNALS, INITIAL_USER_PROFILE } from '../data/mockData';
import { VerificationSignal } from '../types';

export const TrustProfileScreen: React.FC = () => {
  const [expandedSignalId, setExpandedSignalId] = useState<string | null>('sig-identity');
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const getSignalIcon = (category: string) => {
    switch (category) {
      case 'Identity':
        return <ShieldCheck size={18} className="text-emerald-700" />;
      case 'Mobile':
        return <Smartphone size={18} className="text-blue-700" />;
      case 'Device':
        return <Cpu size={18} className="text-purple-700" />;
      case 'Consent':
        return <Lock size={18} className="text-amber-700" />;
      case 'Address':
        return <MapPin size={18} className="text-teal-700" />;
      case 'Tax':
        return <Landmark size={18} className="text-indigo-700" />;
      default:
        return <FileText size={18} className="text-slate-700" />;
    }
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-6 animate-in fade-in duration-200">
      {/* 1. Overall Trust Status Hero */}
      <div className="relative bg-[#0A1F44] text-white rounded-2xl p-6 shadow-md border border-slate-700/60 overflow-hidden text-center">
        {/* Background Trust Seal */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <TrustSealMotif size={280} variant="emerald" animated />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3 shadow-inner">
            <TrustSealMotif size={40} variant="emerald" />
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Cryptographic Digital Trust Profile
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
              Demo
            </span>
          </div>

          <h2 className="text-2xl font-display font-extrabold text-white">
            Verified Citizen Anchor
          </h2>

          <div className="mt-2">
            <StatusBadge status="verified" size="lg" customLabel="All 6 Signals Active (demo)" />
          </div>

          {/* Plain Language Explainer */}
          <div className="mt-4 p-3.5 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 text-xs text-slate-200 leading-relaxed max-w-md">
            <p className="font-semibold text-emerald-300 mb-1 flex items-center justify-center gap-1.5">
              <Sparkles size={14} /> Zero-Knowledge Assurance Principle
            </p>
            <p className="text-[11px] text-slate-300">
              "Verified status can be demonstrated to banks, telecom operators, and employers without displaying or storing the underlying sensitive identity number."
            </p>
          </div>
        </div>
      </div>

      {/* 2. What Gets Shared vs What Is NEVER Stored */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
          <span>Privacy Architecture Comparison</span>
          <span className="text-[10px] text-slate-400 font-medium">Safe Design</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* What Gets Shared */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 size={16} className="text-emerald-700" />
              <span>What Gets Shared (Assertions)</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-emerald-900">
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-emerald-700">•</span>
                <span>Cryptographic proof that age is ≥ 18 years</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-emerald-700">•</span>
                <span>Active mobile SIM tenure & device integrity pass</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-emerald-700">•</span>
                <span>Residential PIN code jurisdiction assertion</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-emerald-700">•</span>
                <span>Tax compliance status tier (Active Filer)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-emerald-700">•</span>
                <span>Time-bounded, revocable consent tickets</span>
              </li>
            </ul>
          </div>

          {/* What Is NEVER Stored */}
          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-rose-950 font-bold text-xs uppercase tracking-wider">
              <XCircle size={16} className="text-rose-700" />
              <span>What Is NEVER Stored / Shared</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-rose-900">
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-rose-700">•</span>
                <span>12-digit Aadhaar number string</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-rose-700">•</span>
                <span>10-character PAN number identifier</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-rose-700">•</span>
                <span>Raw biometric templates or face photograph copies</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-rose-700">•</span>
                <span>Bank account numbers or netbanking passwords</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-rose-700">•</span>
                <span>Government portal database credentials</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Verification Signals Inspector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Verification Signals ({MOCK_VERIFICATION_SIGNALS.length})
          </h3>
          <span className="text-[10px] text-slate-400">Tap to inspect zero-knowledge proof</span>
        </div>

        <div className="space-y-2">
          {MOCK_VERIFICATION_SIGNALS.map((sig) => {
            const isExpanded = expandedSignalId === sig.id;

            return (
              <div
                key={sig.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedSignalId(isExpanded ? null : sig.id)}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                      {getSignalIcon(sig.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900">{sig.name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                          {sig.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Verified by: {sig.verifiedBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={sig.status} size="sm" />
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 bg-slate-50/90 border-t border-slate-100 text-xs space-y-3 animate-in fade-in duration-150">
                    <p className="text-slate-600 leading-relaxed">{sig.description}</p>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-sans font-bold">
                        <span>Cryptographic Demo Assertion</span>
                        <span className="text-emerald-700">Valid (demo)</span>
                      </div>
                      <div className="p-1.5 bg-slate-900 text-emerald-400 rounded-md text-[10px] break-all select-all">
                        {sig.cryptographicProofDemo}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950">
                        <strong className="block text-[10px] uppercase text-emerald-800 mb-1">
                          Assertion Returned to Services:
                        </strong>
                        <span>{sig.whatGetsShared}</span>
                      </div>

                      <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-950">
                        <strong className="block text-[10px] uppercase text-rose-800 mb-1">
                          Underlying Secret Never Exposed:
                        </strong>
                        <span>{sig.whatIsNeverStored}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Last Cryptographic Check: {sig.lastVerified}</span>
                      <span>Signal Integrity: 100% (demo)</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Verification History Timeline */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Clock size={14} className="text-slate-500" />
          Simulated Verification History Timeline
        </h3>

        <div className="relative pl-4 space-y-3 border-l-2 border-slate-200 text-xs">
          <div className="relative">
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">Annual Trust Node Attestation</span>
              <span className="text-[10px] text-slate-400">14 Jan 2025</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Zero-knowledge identity token generated & registered in private keystore.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">SIM Binding & Tenure Attested</span>
              <span className="text-[10px] text-slate-400">14 Jan 2025</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Telecom consortium verified SIM stability on +91 98765 43210.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-purple-100" />
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">Hardware Enclave Binding</span>
              <span className="text-[10px] text-slate-400">12 Feb 2025</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              TEE hardware key signed with zero tamper indicators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

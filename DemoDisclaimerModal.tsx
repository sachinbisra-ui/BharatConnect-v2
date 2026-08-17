import React from 'react';
import { ShieldAlert, CheckCircle2, Lock, X, ExternalLink } from 'lucide-react';
import { TrustSealMotif } from './TrustSealMotif';

interface DemoDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoDisclaimerModal: React.FC<DemoDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0A1F44] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-400/30">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Demonstration Prototype Notice</h3>
              <p className="text-xs text-amber-300 font-medium">Safe Mock Architecture • Zero Real Data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm leading-relaxed">
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-semibold flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0" />
            <div>
              <strong className="font-bold">DEMO / PROTOTYPE — NOT A REAL VERIFICATION</strong>
              <p className="mt-0.5 font-normal text-amber-800">
                BharatConnect is an educational, interactive UI demonstration of an Indian privacy-preserving digital trust architecture.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Lock size={14} className="text-[#0A1F44]" /> Safety & Non-Integration Guarantees:
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No Real ID Integration:</strong> Does NOT connect to Aadhaar, PAN, DigiLocker, CKYC, or any government portal.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No Real Biometrics/SMS:</strong> Face-match and OTP (fixed 123456) are simulated purely in-browser memory.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Fictional Entities:</strong> All banks, telecom providers, phone numbers, and citizen names shown are illustrative mocks.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero-Storage Sandbox:</strong> All actions reset upon page refresh. No sensitive data is transmitted or stored on any server.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrustSealMotif size={16} variant="navy" /> Core Concept: "Verify Once. Reuse Everywhere."
            </h4>
            <p className="text-xs text-slate-600">
              Demonstrates how a citizen could prove identity authenticity through revocable, purpose-bound zero-knowledge tokens to banks, telecom operators, and employers without repeatedly sharing photocopies of sensitive identity numbers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            I Understand — Continue Demo
          </button>
        </div>
      </div>
    </div>
  );
};

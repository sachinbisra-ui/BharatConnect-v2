import React, { useState } from 'react';
import { X, Award, ShieldAlert, Sparkles, CheckCircle2, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { TrustSealMotif } from './TrustSealMotif';
import { StatusBadge } from './StatusBadge';
import { MOCK_TRUST_SCORE_FACTORS } from '../data/mockData';
import { TrustScoreFactor } from '../types';

interface TrustScoreExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  onScoreAdjust?: (newScore: number) => void;
}

export const TrustScoreExplainerModal: React.FC<TrustScoreExplainerModalProps> = ({
  isOpen,
  onClose,
  currentScore,
  onScoreAdjust,
}) => {
  const [factors, setFactors] = useState<TrustScoreFactor[]>(MOCK_TRUST_SCORE_FACTORS);
  const [simulatedPenalty, setSimulatedPenalty] = useState(false);

  if (!isOpen) return null;

  const toggleSimulatedTest = () => {
    const nextPenalty = !simulatedPenalty;
    setSimulatedPenalty(nextPenalty);
    if (onScoreAdjust) {
      onScoreAdjust(nextPenalty ? 730 : 880);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0A1F44] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Demo Trust Score Engine</h3>
              <p className="text-xs text-amber-300 font-medium">Illustrative Multi-Signal Prototype</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* Prototype Disclaimer */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">PROTOTYPE CALCULATION NOTICE:</strong>
              <p className="mt-0.5 text-amber-800 leading-snug">
                This is an illustrative algorithmic prototype value only. It is <strong>NOT</strong> a real-world credit score (CIBIL/Experian), government grading, or real fraud score.
              </p>
            </div>
          </div>

          {/* Current Score Hero */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Score</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-display font-extrabold text-[#0A1F44]">
                  {simulatedPenalty ? 730 : currentScore}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 900</span>
              </div>
              <StatusBadge
                status={simulatedPenalty ? 'pending' : 'verified'}
                size="sm"
                customLabel={simulatedPenalty ? 'Medium Trust (demo)' : 'High Trust (demo)'}
                className="mt-1"
              />
            </div>

            <div className="relative">
              <TrustSealMotif size={64} variant={simulatedPenalty ? 'saffron' : 'emerald'} animated />
            </div>
          </div>

          {/* Interactive Simulation Sandbox */}
          <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-700" />
                Interactive Signal Sandbox:
              </span>
              <button
                type="button"
                onClick={toggleSimulatedTest}
                className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
              >
                {simulatedPenalty ? 'Restore Normal Signals' : 'Simulate SIM Anomaly (-150 pts)'}
              </button>
            </div>
            <p className="text-[11px] text-blue-900 leading-snug">
              {simulatedPenalty
                ? 'Simulated anomaly active: Mobile tenure check flagged an unconfirmed SIM-swap event.'
                : 'Click to simulate how sudden telemetry changes (like a recent unverified SIM swap) dynamically adjust trust.'}
            </p>
          </div>

          {/* Factor Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Score Composition Signals</span>
              <span className="text-[11px] text-slate-500 font-normal">Active vs Future Placeholders</span>
            </h4>

            <div className="space-y-2.5">
              {factors.map((factor) => {
                const isDeducted = simulatedPenalty && factor.id === 'f-2';
                const factorPoints = isDeducted ? 50 : factor.currentPoints;

                return (
                  <div
                    key={factor.id}
                    className={`p-3 rounded-xl border transition-colors ${
                      !factor.connected
                        ? 'bg-slate-50/60 border-dashed border-slate-300 text-slate-500 opacity-80'
                        : isDeducted
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {factor.connected ? (
                          <CheckCircle2
                            size={16}
                            className={isDeducted ? 'text-amber-600' : 'text-emerald-600'}
                          />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[9px] font-mono">
                            -
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-xs">{factor.name}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{factor.category}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        {factor.connected ? (
                          <span className="font-mono font-bold text-xs text-slate-800">
                            +{factorPoints} / {factor.maxPoints}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                            Not Connected (Demo)
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {factor.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

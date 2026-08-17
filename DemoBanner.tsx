import React, { useState } from 'react';
import { AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { DemoDisclaimerModal } from './DemoDisclaimerModal';

export const DemoBanner: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="w-full bg-[#0A1F44] text-white border-b border-amber-500/40 px-3 py-1.5 flex items-center justify-between text-xs z-30 sticky top-0 shadow-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-sm text-[10px] uppercase tracking-wider shrink-0">
            <ShieldAlert size={11} className="stroke-[2.5]" />
            DEMO MODE
          </span>
          <span className="truncate text-slate-200 font-medium text-[11px] sm:text-xs">
            Safe Prototype • Simulated Mock Data Only
          </span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold text-[11px] px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          title="View prototype notice & non-integration details"
        >
          <Info size={13} />
          <span className="hidden xs:inline">Prototype Notice</span>
          <span className="xs:hidden">Notice</span>
        </button>
      </div>

      <DemoDisclaimerModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

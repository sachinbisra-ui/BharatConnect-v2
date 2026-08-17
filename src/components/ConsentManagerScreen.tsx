import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  X,
  Search,
  Filter,
  History,
  Building,
  Info,
  Check,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { MOCK_CONSENT_ITEMS } from '../data/mockData';
import { ConsentItem } from '../types';

export const ConsentManagerScreen: React.FC = () => {
  const [consents, setConsents] = useState<ConsentItem[]>(MOCK_CONSENT_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showRevokeAllModal, setShowRevokeAllModal] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const categories = [
    'all',
    'Account/Payment Status',
    'Mobile Verification',
    'Business Verification',
    'Government Verification',
    'Identity Verification',
    'Device Verification',
  ];

  const handleToggleConsent = (id: string) => {
    setConsents((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'active' ? 'revoked' : 'active';
          triggerToast(
            nextStatus === 'revoked'
              ? `Consent REVOKED for ${item.requesterName} (demo)`
              : `Consent GRANTED for ${item.requesterName} (demo)`
          );
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleRevokeAll = () => {
    setConsents((prev) => prev.map((item) => ({ ...item, status: 'revoked' })));
    setShowRevokeAllModal(false);
    triggerToast('All demo consents have been revoked. No third parties can query signals.');
  };

  const handleRestoreAll = () => {
    setConsents((prev) => prev.map((item) => ({ ...item, status: 'active' })));
    triggerToast('All demo consents have been restored to active status.');
  };

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const filteredConsents = consents.filter((item) => {
    const matchesSearch =
      item.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const activeCount = consents.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-4 pb-20 sm:pb-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0A1F44] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xl border border-amber-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} className="text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#0A1F44] text-white rounded-2xl p-5 border border-slate-700/60 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-purple-500/20 rounded-lg border border-purple-400/30">
                <Lock size={16} className="text-purple-300" />
              </div>
              <h2 className="text-lg font-display font-bold text-white">
                Purpose-Bound Consent Manager
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              You maintain 100% real-time control. Services query only what you actively permit.
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-display font-black text-emerald-400">
              {activeCount}
            </span>
            <span className="text-xs text-slate-400 block">/ {consents.length} Active</span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
            <Info size={12} /> Changes take effect immediately (simulated audit log)
          </span>

          <div className="flex items-center gap-2">
            {activeCount < consents.length && (
              <button
                onClick={handleRestoreAll}
                className="px-2.5 py-1 text-xs font-bold bg-white/15 hover:bg-white/25 text-white rounded-lg transition-colors cursor-pointer"
              >
                Restore Defaults
              </button>
            )}
            <button
              onClick={() => setShowRevokeAllModal(true)}
              className="px-3 py-1 text-xs font-bold bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg transition-colors cursor-pointer"
            >
              Revoke All Demo Consents
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active consents, institutions, or purposes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A1F44]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#0A1F44] text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Consents' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Consents List */}
      <div className="space-y-3">
        {filteredConsents.map((item) => {
          const isActive = item.status === 'active';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-4 border transition-all ${
                isActive
                  ? 'border-slate-200/90 shadow-2xs'
                  : 'border-slate-300 bg-slate-50/70 opacity-75'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                    {item.requesterLogo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs text-slate-900">{item.requesterName}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                        {item.requesterType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-semibold mt-0.5">
                      {item.purpose}
                    </p>
                    <span className="text-[10px] text-purple-700 font-bold block mt-0.5">
                      Category: {item.category}
                    </span>
                  </div>
                </div>

                {/* Status Toggle Switch */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <button
                    onClick={() => handleToggleConsent(item.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      isActive ? 'bg-[#0F9D6C]' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={isActive}
                    aria-label={`Toggle consent for ${item.requesterName}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span
                    className={`text-[10px] font-bold ${
                      isActive ? 'text-emerald-800' : 'text-slate-500'
                    }`}
                  >
                    {isActive ? 'Active (demo)' : 'Revoked (demo)'}
                  </span>
                </div>
              </div>

              {/* Details Box */}
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Requested Verification Signals:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.requestedSignals.map((sig, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium"
                      >
                        ✓ {sig}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                    What Result Is Returned:
                  </span>
                  <code className="text-[10px] font-mono text-[#0A1F44] bg-white px-2 py-1 rounded border border-slate-200 block">
                    {item.dataReturned}
                  </code>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Valid until: {item.validUntil}</span>
                  <span>Queried {item.accessCount} times • Last: {item.lastAccessed}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal for Revoking All */}
      {showRevokeAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-100 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Revoke All Demo Consents?</h3>
                <p className="text-xs text-slate-500">Immediate action simulation</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will switch all 6 demo institutional consents to <strong>Revoked</strong>. Verified third parties (banks, telecom, government) will no longer be able to query your trust tokens.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRevokeAllModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeAll}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Yes, Revoke All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Lock,
  Download,
  RotateCcw,
  LogOut,
  ChevronRight,
  Info,
  CheckCircle2,
  FileText,
  Key,
  Smartphone,
  Check,
  Users,
  Radio,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { TrustSealMotif } from './TrustSealMotif';
import { MOCK_ACTIVITY_LOGS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { DEMO_PRESET_USERS } from '../firebase';

interface SettingsScreenProps {
  onLogout: () => void;
  onResetSession: () => void;
  trustScore: number;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onLogout,
  onResetSession,
  trustScore,
}) => {
  const { userProfile, currentUser, loginWithDemoUser, logout } = useAuth();
  const [allowInstantKyc, setAllowInstantKyc] = useState(true);
  const [notifyOnQuery, setNotifyOnQuery] = useState(true);
  const [biometricLivenessReq, setBiometricLivenessReq] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportAudit = () => {
    const auditData = {
      user: userProfile.name,
      maskedId: userProfile.maskedId || 'BC-9842-DEMO',
      phone: userProfile.phone,
      trustScore: userProfile.trustScore || trustScore,
      status: 'VERIFIED_FIRESTORE_SANDBOX',
      firebaseUid: currentUser?.uid || 'anonymous-session',
      exportedAt: new Date().toISOString(),
      activeSignals: 6,
      note: 'DEMO PROTOTYPE AUDIT LOG — ZERO REAL SENSITIVE DATA',
      logs: MOCK_ACTIVITY_LOGS,
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BharatConnect_Audit_${userProfile.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Demo trust audit report downloaded (JSON).');
  };

  const handleSwitchUser = async (preset: typeof DEMO_PRESET_USERS[0]) => {
    await loginWithDemoUser(preset);
    triggerToast(`Switched active citizen persona to ${preset.name}`);
  };

  const handleFullLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0A1F44] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xl border border-emerald-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0A1F44] text-white rounded-2xl p-5 border border-slate-700/60 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-amber-500/20 rounded-lg border border-amber-400/30">
            <SettingsIcon size={16} className="text-amber-400" />
          </div>
          <h2 className="text-lg font-display font-bold text-white">
            Profile & Security Settings
          </h2>
        </div>
        <p className="text-xs text-slate-300">
          Manage your demo trust identity, Firebase sync, security preferences, and audit history.
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-base">
              {userProfile.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">{userProfile.name}</h3>
                <StatusBadge status="verified" size="sm" />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{userProfile.phone}</p>
            </div>
          </div>

          <TrustSealMotif size={36} variant="emerald" />
        </div>

        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Demo ID</span>
            <span className="font-mono font-bold text-[#0A1F44]">{userProfile.maskedId || 'BC-9842-DEMO'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Firestore Trust Score</span>
            <span className="font-bold text-emerald-700">{userProfile.trustScore || trustScore} / 900</span>
          </div>
        </div>

        {currentUser && (
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={13} className="text-emerald-600" />
              Firebase Auth Session Active
            </span>
            <span className="font-mono text-[10px] text-emerald-700">
              UID: {currentUser.uid.slice(0, 8)}...
            </span>
          </div>
        )}
      </div>

      {/* Switch Persona Card for Live Firestore Testing */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Users size={14} className="text-[#0A1F44]" />
            Switch Citizen Identity (Live Test)
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
            Test Multi-user Messaging
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Switch to another citizen persona to send and receive real Firestore messages and emails between profiles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {DEMO_PRESET_USERS.map((preset) => {
            const isSelected = userProfile.name === preset.name;
            return (
              <button
                key={preset.uid}
                onClick={() => handleSwitchUser(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-400 shadow-2xs ring-1 ring-blue-400/40'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{preset.name}</span>
                  {isSelected && <Check size={14} className="text-blue-700" />}
                </div>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{preset.phone}</span>
                <span className="text-[9px] text-emerald-700 font-semibold mt-1 block">
                  Trust: {preset.trustScore}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Privacy & Protocol Toggles */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Lock size={14} className="text-slate-500" />
          Zero-Knowledge Privacy Controls
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {/* Toggle 1 */}
          <div className="py-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-800 text-xs">Instant Re-KYC Query Processing</p>
              <p className="text-[11px] text-slate-500">
                Allow authorized banks to automatically verify status without prompting you each time.
              </p>
            </div>
            <button
              onClick={() => {
                setAllowInstantKyc(!allowInstantKyc);
                triggerToast(allowInstantKyc ? 'Instant Re-KYC disabled' : 'Instant Re-KYC enabled');
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                allowInstantKyc ? 'bg-[#0F9D6C]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  allowInstantKyc ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="py-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-800 text-xs">Query Notification Alerts</p>
              <p className="text-[11px] text-slate-500">
                Receive instant app push notifications whenever any institution queries your trust token.
              </p>
            </div>
            <button
              onClick={() => {
                setNotifyOnQuery(!notifyOnQuery);
                triggerToast(notifyOnQuery ? 'Query alerts silenced' : 'Query alerts activated');
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                notifyOnQuery ? 'bg-[#0F9D6C]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  notifyOnQuery ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3 */}
          <div className="py-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-800 text-xs">Hardware Enclave Liveness Enforcement</p>
              <p className="text-[11px] text-slate-500">
                Require hardware-backed biometric verification for modifying high-privilege consents.
              </p>
            </div>
            <button
              onClick={() => {
                setBiometricLivenessReq(!biometricLivenessReq);
                triggerToast(biometricLivenessReq ? 'Hardware liveness relaxed' : 'Hardware liveness enforced');
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                biometricLivenessReq ? 'bg-[#0F9D6C]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  biometricLivenessReq ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security & Activity Log */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText size={14} className="text-slate-500" />
            Security & Activity Audit Trail
          </span>
          <span className="text-[10px] text-slate-400">Simulated Ledger</span>
        </h3>

        <div className="space-y-2 text-xs">
          {MOCK_ACTIVITY_LOGS.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.event}</span>
                  <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold uppercase">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Entity: {item.institution} • {item.timestamp}
                </p>
              </div>

              <StatusBadge status="verified" size="sm" customLabel={item.statusBadge} />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleExportAudit}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Download size={16} className="text-[#0A1F44]" />
          <span>Export Demo Trust Audit (.JSON)</span>
        </button>

        <button
          onClick={onResetSession}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <RotateCcw size={16} className="text-amber-600" />
          <span>Reset Demo Sandbox Data</span>
        </button>

        <button
          onClick={handleFullLogout}
          className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>Exit Demo & Return to Welcome Screen</span>
        </button>
      </div>
    </div>
  );
};


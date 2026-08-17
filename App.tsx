/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DemoBanner } from './components/DemoBanner';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { WelcomeFlow } from './components/WelcomeFlow';
import { HomeScreen } from './components/HomeScreen';
import { TrustProfileScreen } from './components/TrustProfileScreen';
import { ConsentManagerScreen } from './components/ConsentManagerScreen';
import { InstitutionsScreen } from './components/InstitutionsScreen';
import { VerifiedMessagingScreen } from './components/VerifiedMessagingScreen';
import { VerifiedCallerScreen } from './components/VerifiedCallerScreen';
import { BharatMailScreen } from './components/BharatMailScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { TrustScoreExplainerModal } from './components/TrustScoreExplainerModal';
import { ActiveTab } from './types';
import { Shield, Sparkles, Check, Lock, ChevronRight, PhoneCall, RefreshCw } from 'lucide-react';

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [trustScore, setTrustScore] = useState(880);
  const [isMobileFramed, setIsMobileFramed] = useState(true);
  const [sideToast, setSideToast] = useState<string | null>(null);

  const triggerSideToast = (msg: string) => {
    setSideToast(msg);
    setTimeout(() => setSideToast(null), 3000);
  };

  // Handle Logout / Restart onboarding
  const handleLogout = () => {
    setHasCompletedOnboarding(false);
    setActiveTab('home');
  };

  const handleResetSession = () => {
    setTrustScore(880);
    setActiveTab('home');
    triggerSideToast('Sandbox session reset successfully.');
  };

  const handleRevokeAllConsents = () => {
    triggerSideToast('All demo consent tickets revoked.');
    setActiveTab('consents');
  };

  return (
    <div className="min-h-screen w-full sleek-grid-bg flex items-center justify-center p-0 lg:p-6 overflow-x-hidden">
      {/* Toast Notification */}
      {sideToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#0A1F44] border border-amber-400 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Check size={14} className="text-emerald-400" />
          <span>{sideToast}</span>
        </div>
      )}

      {/* Sleek Master Container */}
      <div className="w-full max-w-[1280px] bg-white/5 lg:rounded-3xl border-0 lg:border border-white/10 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row overflow-hidden min-h-screen lg:min-h-[820px]">
        
        {/* LEFT SIDEBAR: Concept & Interactive Pipeline (Visible on LG screens) */}
        <aside className="hidden lg:flex w-[290px] xl:w-[310px] border-r border-white/10 p-7 flex-col justify-between shrink-0 select-none">
          <div className="space-y-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF9933] rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-md">
                B
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight leading-tight">
                  BharatConnect
                </h1>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                  Digital Trust Infra
                </span>
              </div>
            </div>

            {/* Concept Statement */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <p className="text-[#FF9933] text-[10px] uppercase font-bold tracking-widest">
                Core Protocol
              </p>
              <h2 className="text-white text-base font-bold leading-snug">
                Verify Once.<br />Reuse Everywhere.
              </h2>
            </div>

            {/* Interactive 3-Step Trust Pipeline */}
            <div className="space-y-3 pt-1">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                Zero-Knowledge Pipeline
              </p>

              {/* Step 1 */}
              <button
                onClick={() => setActiveTab('trust')}
                className={`w-full flex items-start gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeTab === 'trust'
                    ? 'bg-white/10 border-amber-400/60 shadow-xs'
                    : 'border-white/10 hover:bg-white/5 opacity-80'
                }`}
              >
                <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-[10px] text-white font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Identity Signals</p>
                  <p className="text-white/40 text-[10px]">Aadhaar / SIM / TEE bound</p>
                </div>
              </button>

              {/* Step 2 */}
              <button
                onClick={() => setActiveTab('consents')}
                className={`w-full flex items-start gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeTab === 'consents'
                    ? 'bg-white/10 border-amber-400/60 shadow-xs'
                    : 'border-white/10 hover:bg-white/5 opacity-80'
                }`}
              >
                <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-[10px] text-white font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Consent & Tickets</p>
                  <p className="text-white/40 text-[10px]">Purpose-bound & revocable</p>
                </div>
              </button>

              {/* Step 3 */}
              <button
                onClick={() => setIsScoreModalOpen(true)}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl border border-[#0F9D6C]/40 bg-[#0F9D6C]/10 text-left transition-all cursor-pointer hover:bg-[#0F9D6C]/20"
              >
                <div className="w-6 h-6 rounded-full border border-[#0F9D6C] bg-[#0F9D6C] flex items-center justify-center text-[10px] text-white font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="text-white text-xs font-bold flex items-center gap-1">
                    <span>Trust Decision</span>
                    <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1 rounded font-normal">{trustScore}</span>
                  </p>
                  <p className="text-emerald-300/80 text-[10px]">Instant Pass / Zero Storage</p>
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Demo Safeguard Pill */}
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <p className="text-[10px] text-[#FF9933] uppercase tracking-widest font-bold">
              Demo Sandbox Active
            </p>
            <p className="text-white/70 text-[11px] leading-relaxed">
              Privacy-preserving prototype using cryptographic simulated tokens only.
            </p>
          </div>
        </aside>

        {/* CENTER COLUMN: Interactive Smartphone Device Simulation */}
        <main className="flex-1 flex flex-col items-center justify-center p-0 sm:p-4 lg:p-6 relative">
          
          {/* Subtle Blueprint Vector Lattice Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none hidden sm:block">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="0.4" strokeDasharray="2 3" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="0.4" />
              <path d="M50 8 L50 92 M8 50 L92 50" stroke="white" strokeWidth="0.2" />
            </svg>
          </div>

          {/* Device Frame */}
          <div
            className={`w-full transition-all duration-300 bg-[#F8F9FA] shadow-2xl flex flex-col relative ${
              isMobileFramed
                ? 'sm:w-[410px] sm:h-[780px] sm:rounded-[3rem] sm:border-[8px] sm:border-[#1a1a1a] overflow-hidden'
                : 'w-full max-w-2xl min-h-[780px] rounded-2xl border border-slate-300 overflow-hidden'
            }`}
          >
            {/* Top Phone Speaker / Sensor Pill (Visible on Framed view) */}
            {isMobileFramed && (
              <div className="hidden sm:flex justify-center pt-2 pb-1 bg-[#0A1F44]">
                <div className="w-20 h-3.5 bg-[#141414] rounded-full flex items-center justify-center">
                  <div className="w-8 h-1 bg-[#2e2e2e] rounded-full mr-2" />
                  <div className="w-1.5 h-1.5 bg-[#1e293b] rounded-full" />
                </div>
              </div>
            )}

            {/* 1. Persistent Top Demo Banner */}
            <DemoBanner />

            {!hasCompletedOnboarding ? (
              /* Welcome Flow */
              <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
                <WelcomeFlow onComplete={() => setHasCompletedOnboarding(true)} />
              </div>
            ) : (
              /* Core App Header + Content + Navigation */
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <Header
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  isMobileFramed={isMobileFramed}
                  onToggleFrame={() => setIsMobileFramed(!isMobileFramed)}
                  trustScore={trustScore}
                />

                {/* Scrollable Main Screen Body */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#F8F9FA]">
                  {activeTab === 'home' && (
                    <HomeScreen
                      onNavigate={setActiveTab}
                      onOpenScoreExplainer={() => setIsScoreModalOpen(true)}
                      onTriggerSimulatedCall={() => setActiveTab('caller-id')}
                      trustScore={trustScore}
                    />
                  )}

                  {activeTab === 'messages' && <VerifiedMessagingScreen />}

                  {activeTab === 'trust' && <TrustProfileScreen />}

                  {activeTab === 'consents' && <ConsentManagerScreen />}

                  {activeTab === 'directory' && <InstitutionsScreen />}

                  {activeTab === 'caller-id' && <VerifiedCallerScreen />}

                  {activeTab === 'bharatmail' && <BharatMailScreen />}

                  {activeTab === 'settings' && (
                    <SettingsScreen
                      onLogout={handleLogout}
                      onResetSession={handleResetSession}
                      trustScore={trustScore}
                    />
                  )}
                </div>

                {/* Bottom Navbar */}
                <Navbar
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  unreadMessagesCount={1}
                />
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR: Live Infrastructure Feed & Quick Actions (Visible on XL screens) */}
        <aside className="hidden xl:flex w-[270px] border-l border-white/10 p-7 flex-col justify-between shrink-0 select-none">
          <div className="space-y-5">
            <div>
              <h4 className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-3">
                Live Infrastructure Feed
              </h4>
              
              <div className="space-y-3">
                {/* Item 1 */}
                <div className="flex gap-3 items-start">
                  <div className="w-1 h-8 bg-[#0F9D6C] rounded-full shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-xs font-bold leading-snug">Consent Granted</p>
                    <p className="text-white/40 text-[10px]">Aarav S. → Indus Bank</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-3 items-start">
                  <div className="w-1 h-8 bg-[#FF9933] rounded-full shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-xs font-bold leading-snug">Status Updated</p>
                    <p className="text-white/40 text-[10px]">SIM Cryptographic Re-check</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex gap-3 items-start">
                  <div className="w-1 h-8 bg-white/20 rounded-full shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-xs font-bold leading-snug">Zero-Knowledge Query</p>
                    <p className="text-white/40 text-[10px]">No identity copies stored</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick module shortcuts */}
            <div className="pt-2">
              <h4 className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">
                Quick Shortcuts
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  onClick={() => setActiveTab('caller-id')}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-left transition-colors cursor-pointer"
                >
                  <span className="text-amber-400 block font-bold">Caller ID</span>
                  <span className="text-white/40 text-[9px]">Handshake</span>
                </button>
                <button
                  onClick={() => setActiveTab('bharatmail')}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-left transition-colors cursor-pointer"
                >
                  <span className="text-blue-300 block font-bold">BharatMail</span>
                  <span className="text-white/40 text-[9px]">DKIM Signed</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <button
              onClick={() => setActiveTab('consents')}
              className="w-full py-2.5 px-3 bg-[#FF9933] hover:bg-[#e68524] text-[#0A1F44] font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View Privacy Ledger</span>
              <ChevronRight size={14} />
            </button>
            <button
              onClick={handleRevokeAllConsents}
              className="w-full py-2 px-3 border border-white/20 hover:bg-white/10 text-white/90 font-medium rounded-xl text-xs transition-colors cursor-pointer"
            >
              Revoke All Consents
            </button>
          </div>
        </aside>

      </div>

      {/* Trust Score Explainer Modal */}
      <TrustScoreExplainerModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        currentScore={trustScore}
        onScoreAdjust={(newScore) => setTrustScore(newScore)}
      />
    </div>
  );
}


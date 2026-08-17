import React, { useState } from 'react';
import {
  Mail,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Send,
  Plus,
  X,
  Check,
  CheckCircle2,
  XCircle,
  Search,
  Lock,
  Sparkles,
  Info,
  Calendar,
  User,
  Database,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useFirestoreBharatMail } from '../hooks/useFirestoreRealtime';
import { MailItem } from '../types';

export const BharatMailScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState<boolean>(false);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Firestore real-time emails
  const { emails, loading, sendEmail, markEmailAsRead } = useFirestoreBharatMail();

  // Compose state
  const [composeTo, setComposeTo] = useState('priya.patel@bharatconnect.in');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const selectedMail = emails.find((m) => m.id === selectedMailId);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEmail = (id: string) => {
    setSelectedMailId(id);
    markEmailAsRead(id);
  };

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim() || isSending) return;

    setIsSending(true);
    try {
      const newMailId = await sendEmail({
        fromName: userProfile.name,
        fromEmail: userProfile.email,
        toEmail: composeTo.trim(),
        subject: composeSubject.trim(),
        body: composeBody.trim(),
      });

      setShowCompose(false);
      setComposeTo('priya.patel@bharatconnect.in');
      setComposeSubject('');
      setComposeBody('');
      setSelectedMailId(newMailId);
      triggerToast('Real-time BharatMail sent and synced to Firebase Firestore.');
    } catch (err) {
      console.error('Email send error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const filteredEmails = emails.filter((m) =>
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20 sm:pb-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0A1F44] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xl border border-emerald-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* When Viewing an Email */}
      {selectedMail ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-in fade-in">
          {/* Header */}
          <div className="bg-[#0A1F44] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedMailId(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Back to inbox"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 className="font-display font-bold text-sm text-white truncate max-w-[200px] sm:max-w-[320px]">
                  {selectedMail.subject}
                </h3>
                <span className="text-[11px] text-slate-300">{selectedMail.date}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCertModal(true)}
              className="p-2 bg-white/10 hover:bg-white/20 text-emerald-300 hover:text-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ShieldCheck size={14} />
              <span className="hidden sm:inline">Trust Certificate</span>
            </button>
          </div>

          {/* Suspicious Phishing Alert Banner if Flagged */}
          {selectedMail.isSuspicious && (
            <div className="p-4 bg-red-100 border-b border-red-300 text-red-950 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-red-900">
                <AlertTriangle size={18} className="text-red-700 shrink-0" />
                <span>PHISHING & SPOOFING DETECTED</span>
              </div>
              <p className="text-[11px] text-red-800 leading-snug">
                {selectedMail.suspiciousReason}
              </p>
            </div>
          )}

          {/* Email Sender Metadata */}
          <div className="p-4 border-b border-slate-100 space-y-2 bg-slate-50/50">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{selectedMail.fromName}</span>
                  <StatusBadge status={selectedMail.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  &lt;{selectedMail.fromEmail}&gt;
                </p>
              </div>

              <div className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono">
                To: {userProfile.email}
              </div>
            </div>

            {/* Cryptographic check chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
              <span
                className={`px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
                  selectedMail.securityChecks.dkim
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {selectedMail.securityChecks.dkim ? '✓ DKIM Valid' : '✗ DKIM Failed'}
              </span>
              <span
                className={`px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
                  selectedMail.securityChecks.spf
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {selectedMail.securityChecks.spf ? '✓ SPF Matched' : '✗ SPF Failed'}
              </span>
              <span
                className={`px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
                  selectedMail.securityChecks.bharatTrustToken
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {selectedMail.securityChecks.bharatTrustToken
                  ? '✓ Trust Token Handshake'
                  : '✗ No Trust Token'}
              </span>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="p-5 text-xs text-slate-800 leading-relaxed whitespace-pre-line min-h-[220px]">
            {selectedMail.body}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <Database size={12} /> Real-time Firestore Synchronized
            </span>
            <span>AES-256 Verified Envelope</span>
          </div>
        </div>
      ) : (
        /* Inbox List */
        <div className="space-y-3">
          {/* Header */}
          <div className="bg-[#0A1F44] text-white rounded-2xl p-5 border border-slate-700/60 shadow-md flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <Mail size={16} className="text-blue-300" />
                </div>
                <h2 className="text-lg font-display font-bold text-white">
                  BharatMail Inbox
                </h2>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                  <Database size={10} /> Live DB
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                {userProfile.email}
              </p>
            </div>

            <button
              onClick={() => setShowCompose(true)}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Mail</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emails by sender or keywords..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A1F44]"
              />
            </div>
          </div>

          {/* Emails List */}
          <div className="space-y-2">
            {filteredEmails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => handleOpenEmail(mail.id)}
                className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:border-[#0A1F44] hover:shadow-sm ${
                  mail.isSuspicious
                    ? 'border-red-300 bg-red-50/25'
                    : mail.read
                    ? 'border-slate-200'
                    : 'border-blue-300 bg-blue-50/20 font-semibold'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900">{mail.fromName}</span>
                        <StatusBadge status={mail.status} size="sm" />
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{mail.date}</span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-800 mt-1 truncate">
                      {mail.subject}
                    </h4>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {mail.preview}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
                      <span>{mail.fromEmail}</span>
                      {!mail.read && (
                        <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[9px] font-sans">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertModal && selectedMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Email Trust Certificate Inspector
                </h3>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Sender Entity</span>
                <span className="font-bold text-slate-900">{selectedMail.fromName}</span>
                <p className="text-[11px] text-slate-600 font-mono">{selectedMail.fromEmail}</p>
              </div>

              <div>
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 block mb-1">
                  Cryptographic Trust Proof:
                </span>
                <div className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[10px] break-all select-all">
                  {selectedMail.trustCertificateDemo}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 block">
                  Security Attestations:
                </span>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
                  <span>DKIM Cryptographic Signature:</span>
                  <span className={selectedMail.securityChecks.dkim ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                    {selectedMail.securityChecks.dkim ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
                  <span>SPF Sender Origin Match:</span>
                  <span className={selectedMail.securityChecks.spf ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                    {selectedMail.securityChecks.spf ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
                  <span>BharatConnect Institutional Trust Token:</span>
                  <span className={selectedMail.securityChecks.bharatTrustToken ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                    {selectedMail.securityChecks.bharatTrustToken ? 'PASS' : 'MISSING'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 bg-[#0A1F44] text-white text-xs font-bold rounded-xl hover:bg-[#0d2a5c] transition-colors cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus size={16} className="text-emerald-600" />
                Compose Real-time Email
              </h3>
              <button
                onClick={() => setShowCompose(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleComposeSubmit} className="space-y-3 text-xs">
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                <Database size={14} className="text-emerald-700 shrink-0" />
                <span>
                  <strong>FIREBASE CLOUD FIRESTORE:</strong> Outgoing email is cryptographically signed and instantly synchronized to the recipient.
                </span>
              </div>

              {/* Quick Select Citizen Address */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quick Select Recipient
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setComposeTo('priya.patel@bharatconnect.in')}
                    className="p-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50 cursor-pointer text-[11px]"
                  >
                    <span className="font-bold text-slate-800 block">Priya Patel</span>
                    <span className="text-slate-400 text-[10px] font-mono">priya.patel@bharatconnect.in</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposeTo('officer@statetrustbank.demo')}
                    className="p-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50 cursor-pointer text-[11px]"
                  >
                    <span className="font-bold text-slate-800 block">State Trust Bank</span>
                    <span className="text-slate-400 text-[10px] font-mono">officer@statetrustbank.demo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="e.g. priya.patel@bharatconnect.in"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0A1F44]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Verification query / inquiry..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0A1F44]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Write your email body here..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0A1F44]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {isSending ? 'Sending...' : 'Send via Firestore'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

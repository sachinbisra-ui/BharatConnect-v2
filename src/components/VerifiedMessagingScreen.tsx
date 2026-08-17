import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Send,
  ArrowLeft,
  Info,
  Check,
  Search,
  Plus,
  X,
  Sparkles,
  Lock,
  Phone,
  HelpCircle,
  Database,
  Users,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useFirestoreMessages } from '../hooks/useFirestoreRealtime';
import { MessageThread } from '../types';

export const VerifiedMessagingScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showSenderWhyModal, setShowSenderWhyModal] = useState<boolean>(false);
  const [showComposeModal, setShowComposeModal] = useState<boolean>(false);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'verified' | 'suspicious'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Firestore real-time threads and messages
  const { threads, messages, loading, sendMessage, createThread } = useFirestoreMessages(activeThreadId);

  // Compose modal state
  const [composeTo, setComposeTo] = useState('');
  const [composePhone, setComposePhone] = useState('+91 91234 56789');
  const [composeMessage, setComposeMessage] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadId || isSending) return;

    setIsSending(true);
    const text = replyText.trim();
    setReplyText('');

    try {
      await sendMessage(activeThreadId, text, userProfile.name);
      triggerToast('Message sent in real time via Firebase Firestore.');
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const newThreadId = await createThread({
        recipientName: composeTo.trim(),
        recipientPhone: composePhone.trim() || '+91 90000 12345',
        initialMessage: composeMessage.trim(),
        senderName: userProfile.name,
      });

      setShowComposeModal(false);
      setComposeTo('');
      setComposePhone('+91 91234 56789');
      setComposeMessage('');
      setActiveThreadId(newThreadId);
      triggerToast('Real-time conversation created in Firebase Firestore.');
    } catch (err) {
      console.error('Compose error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      filterTab === 'all' ||
      (filterTab === 'verified' && t.status === 'verified') ||
      (filterTab === 'suspicious' && (t.status === 'suspicious' || t.status === 'unverified'));
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-4 pb-20 sm:pb-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0A1F44] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xl border border-emerald-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* If Viewing a Specific Message Thread */}
      {activeThread ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col h-[650px] animate-in fade-in">
          {/* Thread Header */}
          <div className="bg-[#0A1F44] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveThreadId(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Back to inbox"
              >
                <ArrowLeft size={18} />
              </button>

              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${activeThread.avatarBg}`}
              >
                {activeThread.avatarText}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-white truncate max-w-[150px] sm:max-w-[220px]">
                    {activeThread.senderName}
                  </h3>
                  <StatusBadge status={activeThread.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-300 font-mono">
                  {activeThread.senderPhoneOrOrg}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSenderWhyModal(true)}
                className="p-2 bg-white/10 hover:bg-white/20 text-amber-300 hover:text-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Info size={14} />
                <span className="hidden sm:inline">Trust Proof</span>
              </button>
            </div>
          </div>

          {/* Suspicious Warning Banner if flagged */}
          {activeThread.isSuspiciousAlert && (
            <div className="p-3 bg-red-100 border-b border-red-300 text-red-900 text-xs flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-red-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">SUSPICIOUS SENDER ALERT:</strong>
                <p className="mt-0.5 text-red-800 leading-snug">{activeThread.suspiciousWarning}</p>
              </div>
            </div>
          )}

          {/* Messages Bubble Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            <div className="text-center my-2 flex items-center justify-center gap-1.5">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <Database size={10} className="text-emerald-700" />
                <span>Real-time Firebase Firestore Sync</span>
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] sm:max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-[#0A1F44] text-white rounded-br-xs'
                        : activeThread.status === 'suspicious'
                        ? 'bg-red-50 text-red-950 border border-red-200 rounded-bl-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isMe ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {isMe && <Check size={12} className="text-emerald-400" />}
                    </div>
                  </div>
                  {msg.demoTrustVerified && !isMe && (
                    <span className="text-[9px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                      <ShieldCheck size={10} /> BharatConnect Verified Sender
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${activeThread.senderName} as ${userProfile.name}...`}
              className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0A1F44]"
            />
            <button
              type="submit"
              disabled={!replyText.trim() || isSending}
              className="p-2.5 bg-[#0A1F44] hover:bg-[#0d2a5c] disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        /* Message Inbox List */
        <div className="space-y-3">
          {/* Header */}
          <div className="bg-[#0A1F44] text-white rounded-2xl p-5 border border-slate-700/60 shadow-md flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                  <MessageSquare size={16} className="text-emerald-400" />
                </div>
                <h2 className="text-lg font-display font-bold text-white">
                  Verified Messaging Inbox
                </h2>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                  <Database size={10} /> Live DB
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Spam-free communication authenticated via cryptographic trust tokens & real-time Firebase.
              </p>
            </div>

            <button
              onClick={() => setShowComposeModal(true)}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>

          {/* Search & Tabs */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations, senders, banks..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A1F44]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs overflow-x-auto pb-0.5">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterTab === 'all'
                    ? 'bg-[#0A1F44] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Chats ({threads.length})
              </button>
              <button
                onClick={() => setFilterTab('verified')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterTab === 'verified'
                    ? 'bg-[#0A1F44] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Verified Only
              </button>
              <button
                onClick={() => setFilterTab('suspicious')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterTab === 'suspicious'
                    ? 'bg-[#0A1F44] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Alerts & Unverified
              </button>
            </div>
          </div>

          {/* Thread list */}
          <div className="space-y-2">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:border-[#0A1F44] hover:shadow-sm ${
                  thread.isSuspiciousAlert
                    ? 'border-red-300 bg-red-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${thread.avatarBg}`}
                  >
                    {thread.avatarText}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {thread.senderName}
                        </h4>
                        <StatusBadge status={thread.status} size="sm" />
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {thread.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 truncate mt-1">
                      {thread.lastMessage}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px]">
                      <span className="text-slate-400 font-mono">
                        {thread.senderPhoneOrOrg}
                      </span>
                      {thread.unread && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "Why is this sender verified/suspicious?" modal */}
      {showSenderWhyModal && activeThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#0A1F44]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Sender Trust Signal Inspector
                </h3>
              </div>
              <button
                onClick={() => setShowSenderWhyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{activeThread.senderName}</span>
                  <StatusBadge status={activeThread.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  {activeThread.senderPhoneOrOrg}
                </p>
              </div>

              <div>
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 block mb-1">
                  Why this sender has this status:
                </span>
                <p className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 text-blue-950 leading-relaxed text-[11px]">
                  {activeThread.verifiedReason}
                </p>
              </div>

              <div>
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 block mb-1">
                  Attested Signals:
                </span>
                <div className="space-y-1">
                  {activeThread.signals.map((sig, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 bg-slate-50 rounded border border-slate-200 flex items-center gap-2 text-[11px]"
                    >
                      <Check size={12} className="text-emerald-600" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSenderWhyModal(false)}
                className="px-4 py-2 bg-[#0A1F44] text-white text-xs font-bold rounded-xl hover:bg-[#0d2a5c] transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Message Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus size={16} className="text-emerald-600" />
                Start Real-time Chat
              </h3>
              <button
                onClick={() => setShowComposeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleComposeSubmit} className="space-y-3 text-xs">
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                <Database size={14} className="text-emerald-700 shrink-0" />
                <span>
                  <strong>FIREBASE REALTIME DB:</strong> Message will be stored and synchronized in real-time across devices and browser sessions.
                </span>
              </div>

              {/* Quick Select Preset Recipient */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quick Select Citizen / Institution
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setComposeTo('Priya Patel');
                      setComposePhone('+91 91234 56789');
                    }}
                    className="p-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50 cursor-pointer text-[11px]"
                  >
                    <span className="font-bold text-slate-800 block">Priya Patel</span>
                    <span className="text-slate-400 text-[10px] font-mono">+91 91234 56789</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComposeTo('Vikram Malhotra');
                      setComposePhone('+91 99887 76655');
                    }}
                    className="p-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50 cursor-pointer text-[11px]"
                  >
                    <span className="font-bold text-slate-800 block">Vikram Malhotra</span>
                    <span className="text-slate-400 text-[10px] font-mono">+91 99887 76655</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="e.g. Priya Patel / QuickMart Support"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0A1F44]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient Phone Number
                </label>
                <input
                  type="text"
                  value={composePhone}
                  onChange={(e) => setComposePhone(e.target.value)}
                  placeholder="+91 91234 56789"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0A1F44] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Initial Message
                </label>
                <textarea
                  rows={3}
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0A1F44]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {isSending ? 'Sending...' : 'Start Realtime Chat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

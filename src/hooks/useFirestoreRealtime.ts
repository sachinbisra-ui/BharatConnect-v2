import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { MessageThread, MessageItem, MailItem, TrustStatus } from '../types';
import { MOCK_MESSAGE_THREADS, MOCK_EMAILS } from '../data/mockData';

// Hook for Real-time Firestore Messages
export function useFirestoreMessages(activeThreadId: string | null) {
  const [threads, setThreads] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Listen to all message threads in real time
  useEffect(() => {
    const threadsRef = collection(db, 'threads');
    const q = query(threadsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedThreads: MessageThread[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            loadedThreads.push({
              id: docSnap.id,
              senderName: data.senderName || 'Anonymous',
              senderPhoneOrOrg: data.senderPhoneOrOrg || '+91 90000 00000',
              senderType: data.senderType || 'Citizen',
              status: (data.status as TrustStatus) || 'verified',
              avatarText: data.avatarText || 'BC',
              avatarBg: data.avatarBg || 'bg-teal-700 text-white',
              lastMessage: data.lastMessage || '',
              timestamp: data.timestamp || 'Just now',
              unread: data.unread || false,
              verifiedReason: data.verifiedReason || 'Attested by BharatConnect trust token.',
              signals: data.signals || ['SIM Bound', 'Hardware Verified'],
              isSuspiciousAlert: data.isSuspiciousAlert || false,
              suspiciousWarning: data.suspiciousWarning || '',
              messages: [], // will be populated from subcollection or state
            });
          });
          setThreads(loadedThreads);
        } else {
          // Keep mock threads if firestore is still empty
          setThreads(MOCK_MESSAGE_THREADS);
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Firestore threads listener note:', error);
        setThreads(MOCK_MESSAGE_THREADS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Listen to messages for the active thread in real time
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, 'threads', activeThreadId, 'messages');
    const q = query(messagesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedMessages: MessageItem[] = [];
          snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            loadedMessages.push({
              id: docSnap.id,
              sender: d.sender || 'me',
              text: d.text || '',
              time: d.time || 'Just now',
              demoTrustVerified: d.demoTrustVerified !== undefined ? d.demoTrustVerified : true,
            });
          });
          // Sort by createdAt or id
          setMessages(loadedMessages);
        } else {
          // Fallback to thread's initial messages if available
          const found = MOCK_MESSAGE_THREADS.find((t) => t.id === activeThreadId);
          setMessages(found ? found.messages : []);
        }
      },
      (error) => {
        console.warn('Firestore active messages listener note:', error);
        const found = MOCK_MESSAGE_THREADS.find((t) => t.id === activeThreadId);
        setMessages(found ? found.messages : []);
      }
    );

    return () => unsubscribe();
  }, [activeThreadId]);

  // Send a new message to a thread
  const sendMessage = async (
    threadId: string,
    text: string,
    senderName: string = 'Aarav Sharma'
  ) => {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsgData = {
      id: messageId,
      threadId,
      sender: 'me',
      senderName,
      text: text.trim(),
      time: timeString,
      demoTrustVerified: true,
      createdAt: serverTimestamp(),
    };

    // Optimistically update state
    setMessages((prev) => [...prev, { id: messageId, sender: 'me', text: text.trim(), time: timeString, demoTrustVerified: true }]);

    try {
      // 1. Write message to Firestore subcollection
      const msgDocRef = doc(collection(db, 'threads', threadId, 'messages'), messageId);
      await setDoc(msgDocRef, newMsgData);

      // 2. Update thread lastMessage & timestamp
      const threadDocRef = doc(db, 'threads', threadId);
      await updateDoc(threadDocRef, {
        lastMessage: text.trim(),
        timestamp: timeString,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not write message to Firestore, kept in local state:', err);
    }
  };

  // Create a new thread & send first message
  const createThread = async ({
    recipientName,
    recipientPhone,
    initialMessage,
    senderName,
  }: {
    recipientName: string;
    recipientPhone: string;
    initialMessage: string;
    senderName: string;
  }): Promise<string> => {
    const threadId = `thread_${Date.now()}`;
    const initials = recipientName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'BC';
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const threadData = {
      id: threadId,
      senderName: recipientName.trim(),
      senderPhoneOrOrg: recipientPhone.trim(),
      senderType: 'Citizen',
      status: 'verified' as TrustStatus,
      avatarText: initials,
      avatarBg: 'bg-teal-700 text-white',
      lastMessage: initialMessage.trim(),
      timestamp: timeString,
      unread: false,
      verifiedReason: 'Attested direct peer connection via BharatConnect trust token.',
      signals: ['Peer Identity Match', 'SIM Tenure Validated', 'Secure Enclave Handshake'],
      isSuspiciousAlert: false,
      suspiciousWarning: '',
      updatedAt: serverTimestamp(),
    };

    // Optimistically add to threads
    setThreads((prev) => [
      {
        ...threadData,
        messages: [{ id: `msg_${Date.now()}`, sender: 'me', text: initialMessage.trim(), time: timeString, demoTrustVerified: true }],
      },
      ...prev,
    ]);

    try {
      const threadDocRef = doc(db, 'threads', threadId);
      await setDoc(threadDocRef, threadData);

      const messageId = `msg_${Date.now()}`;
      const msgDocRef = doc(collection(db, 'threads', threadId, 'messages'), messageId);
      await setDoc(msgDocRef, {
        id: messageId,
        threadId,
        sender: 'me',
        senderName,
        text: initialMessage.trim(),
        time: timeString,
        demoTrustVerified: true,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not create Firestore thread, created in local memory:', err);
    }

    return threadId;
  };

  return {
    threads,
    messages,
    loading,
    sendMessage,
    createThread,
  };
}

// Hook for Real-time Firestore BharatMail
export function useFirestoreBharatMail() {
  const [emails, setEmails] = useState<MailItem[]>(MOCK_EMAILS);
  const [loading, setLoading] = useState(true);

  // Listen to emails collection in real time
  useEffect(() => {
    const emailsRef = collection(db, 'emails');
    const q = query(emailsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedEmails: MailItem[] = [];
          snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            loadedEmails.push({
              id: docSnap.id,
              fromName: d.fromName || 'Citizen',
              fromEmail: d.fromEmail || 'unknown@bharatconnect.in',
              subject: d.subject || '(No Subject)',
              preview: d.preview || (d.body ? d.body.slice(0, 70) + '...' : ''),
              body: d.body || '',
              date: d.date || 'Just now',
              status: (d.status as TrustStatus) || 'verified',
              isSuspicious: d.isSuspicious || false,
              suspiciousReason: d.suspiciousReason || '',
              trustCertificateDemo: d.trustCertificateDemo || 'SIGNATURE_DKIM_VERIFIED_ED25519',
              securityChecks: d.securityChecks || {
                dkim: true,
                spf: true,
                bharatTrustToken: true,
                domainMatch: true,
              },
              read: d.read || false,
            });
          });
          setEmails(loadedEmails);
        } else {
          setEmails(MOCK_EMAILS);
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Firestore BharatMail listener note:', error);
        setEmails(MOCK_EMAILS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Send a new BharatMail
  const sendEmail = async ({
    fromName,
    fromEmail,
    toEmail,
    subject,
    body,
  }: {
    fromName: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    body: string;
  }): Promise<string> => {
    const emailId = `mail_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date();
    const dateString = `${now.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newMail: MailItem = {
      id: emailId,
      fromName: `${fromName} (You)`,
      fromEmail,
      subject: subject.trim(),
      preview: body.trim().slice(0, 70) + '...',
      body: body.trim(),
      date: dateString,
      status: 'verified',
      isSuspicious: false,
      trustCertificateDemo: `SIGNATURE_${fromName.toUpperCase().replace(/\s+/g, '_')}_ED25519_PASS`,
      securityChecks: {
        dkim: true,
        spf: true,
        bharatTrustToken: true,
        domainMatch: true,
      },
      read: true,
    };

    // Optimistic local update
    setEmails((prev) => [newMail, ...prev]);

    try {
      const emailDocRef = doc(db, 'emails', emailId);
      await setDoc(emailDocRef, {
        id: emailId,
        fromName: `${fromName} (You)`,
        fromEmail,
        toEmail: toEmail.trim(),
        subject: subject.trim(),
        preview: body.trim().slice(0, 70) + '...',
        body: body.trim(),
        date: dateString,
        status: 'verified',
        isSuspicious: false,
        trustCertificateDemo: `SIGNATURE_${fromName.toUpperCase().replace(/\s+/g, '_')}_ED25519_PASS`,
        securityChecks: {
          dkim: true,
          spf: true,
          bharatTrustToken: true,
          domainMatch: true,
        },
        read: true,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not write email to Firestore, saved in local state:', err);
    }

    return emailId;
  };

  // Mark an email as read
  const markEmailAsRead = async (emailId: string) => {
    setEmails((prev) =>
      prev.map((item) => (item.id === emailId ? { ...item, read: true } : item))
    );

    try {
      const emailDocRef = doc(db, 'emails', emailId);
      await updateDoc(emailDocRef, { read: true });
    } catch (err) {
      console.warn('Could not update email read status in Firestore:', err);
    }
  };

  return {
    emails,
    loading,
    sendEmail,
    markEmailAsRead,
  };
}

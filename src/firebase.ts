import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  where,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { MessageThread, MessageItem, MailItem, TrustStatus } from './types';
import { MOCK_MESSAGE_THREADS, MOCK_EMAILS, INITIAL_USER_PROFILE } from './data/mockData';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with custom database ID if specified
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// User Profile in Firestore
export interface BharatUserProfile {
  uid: string;
  name: string;
  phone: string;
  email: string;
  maskedId: string;
  trustScore: number;
  avatarBg: string;
  avatarText: string;
  status: TrustStatus;
  createdAt: any;
  lastActive: any;
}

// Preset Quick Demo Citizens for easy testing
export const DEMO_PRESET_USERS: BharatUserProfile[] = [
  {
    uid: 'demo_aarav_sharma',
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@bharatconnect.in',
    maskedId: 'XXXX-XXXX-9842',
    trustScore: 880,
    avatarBg: 'bg-emerald-700 text-white',
    avatarText: 'AS',
    status: 'verified',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    uid: 'demo_priya_patel',
    name: 'Priya Patel',
    phone: '+91 91234 56789',
    email: 'priya.patel@bharatconnect.in',
    maskedId: 'XXXX-XXXX-5521',
    trustScore: 865,
    avatarBg: 'bg-blue-700 text-white',
    avatarText: 'PP',
    status: 'verified',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    uid: 'demo_vikram_malhotra',
    name: 'Vikram Malhotra',
    phone: '+91 99887 76655',
    email: 'vikram.m@bharatconnect.in',
    maskedId: 'XXXX-XXXX-1108',
    trustScore: 890,
    avatarBg: 'bg-purple-700 text-white',
    avatarText: 'VM',
    status: 'verified',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
];

// Helper: Setup invisible RecaptchaVerifier
export function initRecaptcha(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
  // Clear any existing verifier on window if needed
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      console.warn('Clearing previous recaptcha:', e);
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA expired');
    },
  });

  (window as any).recaptchaVerifier = verifier;
  return verifier;
}

// Request real SMS OTP
export async function sendOtpToPhone(
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

// Save or sync user profile in Firestore
export async function syncUserProfile(profile: Partial<BharatUserProfile> & { uid: string }): Promise<BharatUserProfile> {
  const userRef = doc(db, 'users', profile.uid);
  const snap = await getDoc(userRef);

  const defaultProfile: BharatUserProfile = {
    uid: profile.uid,
    name: profile.name || 'Bharat Citizen',
    phone: profile.phone || '+91 98765 43210',
    email: profile.email || `${(profile.name || 'citizen').toLowerCase().replace(/\s+/g, '.')}@bharatconnect.in`,
    maskedId: profile.maskedId || `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
    trustScore: profile.trustScore || 880,
    avatarBg: profile.avatarBg || 'bg-emerald-700 text-white',
    avatarText: profile.avatarText || (profile.name ? profile.name.slice(0, 2).toUpperCase() : 'BC'),
    status: profile.status || 'verified',
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  };

  if (snap.exists()) {
    const existing = snap.data() as BharatUserProfile;
    const merged = {
      ...existing,
      ...profile,
      lastActive: serverTimestamp(),
    };
    await updateDoc(userRef, merged as any);
    return { ...existing, ...profile };
  } else {
    await setDoc(userRef, defaultProfile as any);
    return defaultProfile;
  }
}

// Seed initial default Firestore threads and emails if database is empty
export async function seedInitialFirestoreData() {
  try {
    const threadsRef = collection(db, 'threads');
    const threadSnap = await getDocs(threadsRef);
    if (threadSnap.empty) {
      console.log('Seeding initial threads to Firestore...');
      for (const t of MOCK_MESSAGE_THREADS) {
        const threadDoc = doc(threadsRef, t.id);
        await setDoc(threadDoc, {
          id: t.id,
          senderName: t.senderName,
          senderPhoneOrOrg: t.senderPhoneOrOrg,
          senderType: t.senderType,
          status: t.status,
          avatarText: t.avatarText,
          avatarBg: t.avatarBg,
          lastMessage: t.lastMessage,
          timestamp: t.timestamp,
          unread: t.unread,
          verifiedReason: t.verifiedReason,
          signals: t.signals,
          isSuspiciousAlert: t.isSuspiciousAlert || false,
          suspiciousWarning: t.suspiciousWarning || '',
          updatedAt: serverTimestamp(),
        });

        // Add subcollection messages
        for (const msg of t.messages) {
          const msgDoc = doc(collection(db, 'threads', t.id, 'messages'), msg.id);
          await setDoc(msgDoc, {
            id: msg.id,
            threadId: t.id,
            sender: msg.sender,
            text: msg.text,
            time: msg.time,
            demoTrustVerified: msg.demoTrustVerified || false,
            createdAt: serverTimestamp(),
          });
        }
      }
    }

    const emailsRef = collection(db, 'emails');
    const emailSnap = await getDocs(emailsRef);
    if (emailSnap.empty) {
      console.log('Seeding initial BharatMail to Firestore...');
      for (const mail of MOCK_EMAILS) {
        const mailDoc = doc(emailsRef, mail.id);
        await setDoc(mailDoc, {
          id: mail.id,
          fromName: mail.fromName,
          fromEmail: mail.fromEmail,
          toEmail: 'aarav.sharma@bharatconnect.in',
          subject: mail.subject,
          preview: mail.preview,
          body: mail.body,
          date: mail.date,
          status: mail.status,
          isSuspicious: mail.isSuspicious,
          suspiciousReason: mail.suspiciousReason || '',
          trustCertificateDemo: mail.trustCertificateDemo,
          securityChecks: mail.securityChecks,
          read: mail.read,
          createdAt: serverTimestamp(),
        });
      }
    }
  } catch (err) {
    console.warn('Firestore seeding skipped or restricted by security rules:', err);
  }
}

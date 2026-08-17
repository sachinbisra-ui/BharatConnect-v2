import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
  ConfirmationResult,
  signInAnonymously,
} from 'firebase/auth';
import {
  auth,
  db,
  BharatUserProfile,
  syncUserProfile,
  initRecaptcha,
  sendOtpToPhone,
  DEMO_PRESET_USERS,
  seedInitialFirestoreData,
} from '../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: BharatUserProfile;
  isLoading: boolean;
  confirmationResult: ConfirmationResult | null;
  loginError: string | null;
  requestPhoneOtp: (phoneNumber: string, containerId?: string) => Promise<boolean>;
  verifyOtpCode: (code: string, customName?: string) => Promise<boolean>;
  loginWithDemoUser: (presetUser: BharatUserProfile) => Promise<void>;
  updateUserTrustScore: (newScore: number) => Promise<void>;
  logout: () => Promise<void>;
  clearLoginError: () => void;
}

const defaultProfile: BharatUserProfile = DEMO_PRESET_USERS[0];

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: defaultProfile,
  isLoading: true,
  confirmationResult: null,
  loginError: null,
  requestPhoneOtp: async () => false,
  verifyOtpCode: async () => false,
  loginWithDemoUser: async () => {},
  updateUserTrustScore: async () => {},
  logout: async () => {},
  clearLoginError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<BharatUserProfile>(() => {
    const saved = localStorage.getItem('bc_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultProfile;
      }
    }
    return defaultProfile;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Initialize Firestore seed data on boot
  useEffect(() => {
    seedInitialFirestoreData().catch((e) => console.warn('Seed notice:', e));
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync Firestore User profile
        const phone = user.phoneNumber || userProfile.phone || '+91 98765 43210';
        const name = user.displayName || userProfile.name || 'Aarav Sharma';
        
        try {
          const synced = await syncUserProfile({
            uid: user.uid,
            name,
            phone,
            trustScore: userProfile.trustScore || 880,
            status: 'verified',
          });
          setUserProfile(synced);
          localStorage.setItem('bc_user_profile', JSON.stringify(synced));
        } catch (err) {
          console.warn('Could not sync user profile with firestore:', err);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to real-time user doc updates if logged in
  useEffect(() => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubDoc = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as BharatUserProfile;
        setUserProfile((prev) => ({
          ...prev,
          ...data,
        }));
        localStorage.setItem('bc_user_profile', JSON.stringify({ ...userProfile, ...data }));
      }
    });

    return () => unsubDoc();
  }, [currentUser]);

  // Request Phone OTP
  const requestPhoneOtp = async (phoneNumber: string, containerId: string = 'recaptcha-container'): Promise<boolean> => {
    setLoginError(null);
    try {
      // Ensure phone has country code
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const appVerifier = initRecaptcha(containerId);
      const confResult = await sendOtpToPhone(formattedPhone, appVerifier);
      setConfirmationResult(confResult);
      return true;
    } catch (err: any) {
      console.error('Phone OTP request failed:', err);
      // If Recaptcha/SMS quota has issues, inform the user clearly
      setLoginError(err.message || 'Failed to send SMS OTP. You can use the quick demo accounts.');
      return false;
    }
  };

  // Verify OTP code
  const verifyOtpCode = async (code: string, customName: string = 'Verified Citizen'): Promise<boolean> => {
    setLoginError(null);
    try {
      if (confirmationResult) {
        const userCredential = await confirmationResult.confirm(code);
        if (userCredential.user) {
          const phone = userCredential.user.phoneNumber || '+91 98765 43210';
          const synced = await syncUserProfile({
            uid: userCredential.user.uid,
            name: customName,
            phone,
            trustScore: 880,
            status: 'verified',
          });
          setUserProfile(synced);
          localStorage.setItem('bc_user_profile', JSON.stringify(synced));
          return true;
        }
      } else {
        // Fallback for simulated phone login / offline testing
        if (code === '123456' || code.trim().length >= 4) {
          const anonUser = await signInAnonymously(auth);
          const synced = await syncUserProfile({
            uid: anonUser.user.uid,
            name: customName || 'Aarav Sharma',
            phone: '+91 98765 43210',
            trustScore: 880,
            status: 'verified',
          });
          setUserProfile(synced);
          localStorage.setItem('bc_user_profile', JSON.stringify(synced));
          return true;
        } else {
          setLoginError('Invalid OTP code. Please enter the 6-digit code (or 123456 for demo).');
          return false;
        }
      }
      return false;
    } catch (err: any) {
      console.error('OTP Verification failed:', err);
      setLoginError(err.message || 'OTP verification failed. Please check the code.');
      return false;
    }
  };

  // Quick Demo User Login
  const loginWithDemoUser = async (presetUser: BharatUserProfile) => {
    setLoginError(null);
    try {
      // Create or sign in anonymous session in Firebase Auth to ensure real auth token
      const cred = await signInAnonymously(auth);
      const synced = await syncUserProfile({
        ...presetUser,
        uid: cred.user.uid,
      });
      setUserProfile(synced);
      localStorage.setItem('bc_user_profile', JSON.stringify(synced));
    } catch (err: any) {
      console.warn('Anonymous auth note:', err);
      // Fallback local persistence
      setUserProfile(presetUser);
      localStorage.setItem('bc_user_profile', JSON.stringify(presetUser));
    }
  };

  // Adjust trust score
  const updateUserTrustScore = async (newScore: number) => {
    setUserProfile((prev) => {
      const updated = { ...prev, trustScore: newScore };
      localStorage.setItem('bc_user_profile', JSON.stringify(updated));
      return updated;
    });

    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { trustScore: newScore });
      } catch (e) {
        console.warn('Could not update score in firestore:', e);
      }
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout error:', e);
    }
    setConfirmationResult(null);
    localStorage.removeItem('bc_user_profile');
    setUserProfile(defaultProfile);
  };

  const clearLoginError = () => setLoginError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        confirmationResult,
        loginError,
        requestPhoneOtp,
        verifyOtpCode,
        loginWithDemoUser,
        updateUserTrustScore,
        logout,
        clearLoginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

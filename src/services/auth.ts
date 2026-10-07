import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile } from '../types/resume';

const ADMIN_EMAIL = 'zakatushrchitral@gmail.com';

export async function loginWithGoogle(): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  return await syncUserProfile(user);
}

export async function registerWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<UserProfile> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  if (displayName) {
    await updateProfile(user, { displayName });
  }
  return await syncUserProfile(user, displayName);
}

export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return await syncUserProfile(result.user);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function syncUserProfile(user: FirebaseUser, fallbackName?: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();

  const defaultProfile: UserProfile = {
    userId: user.uid,
    email: user.email || '',
    displayName: user.displayName || fallbackName || (user.email ? user.email.split('@')[0] : 'User'),
    photoURL: user.photoURL || undefined,
    role: user.email === ADMIN_EMAIL ? 'admin' : 'user',
    subscription: 'free',
    createdAt: now,
    updatedAt: now,
  };
  
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      // Auto-assign admin if email matches
      if (user.email === ADMIN_EMAIL && data.role !== 'admin') {
        try {
          await updateDoc(userRef, { role: 'admin' });
        } catch (err) {
          console.warn('Could not update admin role in offline mode:', err);
        }
        data.role = 'admin';
      }
      return data;
    } else {
      try {
        await setDoc(userRef, defaultProfile);
      } catch (err) {
        console.warn('Could not persist initial user profile (offline mode):', err);
      }
      return defaultProfile;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn('Firestore sync failed (offline or network delay):', errorMsg);
    // If it's a security rule permission failure, follow skill directive
    if (errorMsg.toLowerCase().includes('permission')) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    }
    // Return valid profile so user is not blocked
    return defaultProfile;
  }
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

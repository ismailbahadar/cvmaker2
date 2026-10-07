import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { ResumeData, CoverLetterData } from '../types/resume';

function getLocalResumes(userId: string): ResumeData[] {
  try {
    const raw = localStorage.getItem(`apex_resumes_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalResumes(userId: string, list: ResumeData[]) {
  try {
    localStorage.setItem(`apex_resumes_${userId}`, JSON.stringify(list));
  } catch (err) {
    console.warn('Could not cache resumes to localStorage:', err);
  }
}

function getLocalCoverLetters(userId: string): CoverLetterData[] {
  try {
    const raw = localStorage.getItem(`apex_cls_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCoverLetters(userId: string, list: CoverLetterData[]) {
  try {
    localStorage.setItem(`apex_cls_${userId}`, JSON.stringify(list));
  } catch (err) {
    console.warn('Could not cache cover letters to localStorage:', err);
  }
}

export function calculateCompletion(resume: Partial<ResumeData>): number {
  let score = 0;
  if (resume.personalInfo?.fullName && resume.personalInfo?.email && resume.personalInfo?.phone) {
    score += 25;
  } else if (resume.personalInfo?.fullName) {
    score += 15;
  }

  if (resume.summary && resume.summary.trim().length > 30) {
    score += 15;
  }

  if (resume.experience && resume.experience.length > 0) {
    score += 20;
  }

  if (resume.education && resume.education.length > 0) {
    score += 20;
  }

  if (resume.skills && resume.skills.length >= 3) {
    score += 10;
  } else if (resume.skills && resume.skills.length > 0) {
    score += 5;
  }

  if ((resume.languages && resume.languages.length > 0) || (resume.certifications && resume.certifications.length > 0)) {
    score += 10;
  }

  return Math.min(score, 100);
}

export async function saveResume(resume: ResumeData): Promise<void> {
  const path = `users/${resume.userId}/resumes/${resume.id}`;
  const now = new Date().toISOString();
  const completion = calculateCompletion(resume);

  const payload: ResumeData = {
    ...resume,
    completionPercentage: completion,
    updatedAt: now,
  };

  // Update local cache immediately
  const existing = getLocalResumes(resume.userId).filter((r) => r.id !== resume.id);
  setLocalResumes(resume.userId, [payload, ...existing]);

  try {
    await setDoc(doc(db, 'users', resume.userId, 'resumes', resume.id), payload);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('permission')) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    console.warn('Could not sync resume to Firestore (saved locally):', msg);
  }
}

export async function getUserResumes(userId: string): Promise<ResumeData[]> {
  const path = `users/${userId}/resumes`;
  try {
    const collRef = collection(db, 'users', userId, 'resumes');
    const q = query(collRef);
    const snap = await getDocs(q);
    const list: ResumeData[] = [];
    snap.forEach((d) => {
      list.push(d.data() as ResumeData);
    });
    // Sort in memory by updatedAt descending
    const sorted = list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    if (sorted.length > 0) {
      setLocalResumes(userId, sorted);
      return sorted;
    }
    return getLocalResumes(userId);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('permission')) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
    console.warn('Firestore offline in getUserResumes, reading local cache:', msg);
    return getLocalResumes(userId);
  }
}

export async function getResumeById(userId: string, resumeId: string): Promise<ResumeData | null> {
  const path = `users/${userId}/resumes/${resumeId}`;
  try {
    const d = await getDoc(doc(db, 'users', userId, 'resumes', resumeId));
    if (d.exists()) {
      return d.data() as ResumeData;
    }
    return getLocalResumes(userId).find((r) => r.id === resumeId) || null;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('permission')) {
      handleFirestoreError(error, OperationType.GET, path);
    }
    console.warn('Firestore offline in getResumeById, fallback to local cache:', msg);
    return getLocalResumes(userId).find((r) => r.id === resumeId) || null;
  }
}

export async function deleteResume(userId: string, resumeId: string): Promise<void> {
  const path = `users/${userId}/resumes/${resumeId}`;
  const list = getLocalResumes(userId).filter((r) => r.id !== resumeId);
  setLocalResumes(userId, list);

  try {
    await deleteDoc(doc(db, 'users', userId, 'resumes', resumeId));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('permission')) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
    console.warn('Could not delete resume from Firestore (deleted locally):', msg);
  }
}

export async function duplicateResume(userId: string, original: ResumeData): Promise<ResumeData> {
  const newId = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const duplicate: ResumeData = {
    ...original,
    id: newId,
    title: `${original.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };
  await saveResume(duplicate);
  return duplicate;
}

// Cover Letter Services
export async function saveCoverLetter(cl: CoverLetterData): Promise<void> {
  const path = `users/${cl.userId}/coverLetters/${cl.id}`;
  const existing = getLocalCoverLetters(cl.userId).filter((c) => c.id !== cl.id);
  setLocalCoverLetters(cl.userId, [cl, ...existing]);

  try {
    await setDoc(doc(db, 'users', cl.userId, 'coverLetters', cl.id), cl);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('permission')) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    console.warn('Could not save cover letter to Firestore (saved locally):', msg);
  }
}

export async function getUserCoverLetters(userId: string): Promise<CoverLetterData[]> {
  const path = `users/${userId}/coverLetters`;
  try {
    const collRef = collection(db, 'users', userId, 'coverLetters');
    const snap = await getDocs(collRef);
    const list: CoverLetterData[] = [];
    snap.forEach((d) => list.push(d.data() as CoverLetterData));
    const sorted = list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    if (sorted.length > 0) {
      setLocalCoverLetters(userId, sorted);
      return sorted;
    }
    return getLocalCoverLetters(userId);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('permission')) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
    console.warn('Firestore offline in getUserCoverLetters, reading local cache:', msg);
    return getLocalCoverLetters(userId);
  }
}

export async function deleteCoverLetter(userId: string, clId: string): Promise<void> {
  const path = `users/${userId}/coverLetters/${clId}`;
  const list = getLocalCoverLetters(userId).filter((c) => c.id !== clId);
  setLocalCoverLetters(userId, list);

  try {
    await deleteDoc(doc(db, 'users', userId, 'coverLetters', clId));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('permission')) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
    console.warn('Could not delete cover letter from Firestore (deleted locally):', msg);
  }
}

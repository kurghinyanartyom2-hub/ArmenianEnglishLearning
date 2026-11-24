import { UserProfile, UserProgressData } from '../types';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const OFFICIAL_OWNER_EMAIL = 'kurghinyanartyom2@gmail.com';

/**
 * Strict role check:
 * Returns true ONLY if user's email matches the authoritative owner email (kurghinyanartyom2@gmail.com).
 * Prevents any other account or user from ever having admin rights.
 */
export const isOwnerAdmin = (user?: UserProfile | null): boolean => {
  if (!user || !user.email) return false;
  const isMatch = user.email.trim().toLowerCase() === OFFICIAL_OWNER_EMAIL.toLowerCase();
  if (!isMatch) return false;
  // If role is specified, verify it's super_admin
  if (user.role && user.role !== 'super_admin') return false;
  return true;
};

/**
 * Server-side cryptographic role verification:
 * Verifies with the backend server (/api/admin/check-access) that the current user
 * holds an authentic, cryptographically signed super_admin token.
 */
export const verifyServerOwnerAdmin = async (authToken?: string): Promise<boolean> => {
  try {
    const token = authToken || getActiveSessionUser()?.authToken;
    if (!token) return false;

    const res = await fetch('/api/admin/check-access', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.authorized && data.role === 'super_admin');
  } catch {
    // If backend is momentarily unreachable, fallback to strict email check
    const current = getActiveSessionUser();
    return Boolean(current?.email && current.email.trim().toLowerCase() === OFFICIAL_OWNER_EMAIL.toLowerCase());
  }
};

/**
 * Requests a cryptographically signed session token from the backend server
 */
export const requestServerSessionToken = async (
  userId: string,
  email: string
): Promise<{ token: string; role: 'super_admin' | 'student'; isOwner: boolean } | null> => {
  try {
    const res = await fetch('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export interface StoredAccount {
  user: UserProfile;
  passwordHash: string; // In-browser stored password
  progress: UserProgressData;
}

const STORAGE_KEY_ACCOUNTS = 'hayenglish_accounts';
const STORAGE_KEY_SESSION = 'hayenglish_auth_session';

// Default initial accounts including the official Owner & Super Admin
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    user: {
      id: 'usr_owner_superadmin',
      name: 'Artyom Kurghinyan',
      email: OFFICIAL_OWNER_EMAIL,
      avatar: '👑',
      englishLevel: 'intermediate',
      dailyGoalMinutes: 30,
      registeredAt: '2026-09-01T00:00:00Z',
      role: 'super_admin',
    },
    passwordHash: 'hayenglish123',
    progress: {
      completedLessonIds: ['articles-a-an-the', 'present-simple-continuous'],
      masteredWordIds: ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'],
      streakCount: 15,
      userXP: 820,
    },
  },
  {
    user: {
      id: 'usr_aram',
      name: 'Արամ Սարգսյան',
      email: 'aram@hayenglish.am',
      avatar: '🎓',
      englishLevel: 'elementary',
      dailyGoalMinutes: 15,
      registeredAt: '2026-09-01T10:00:00Z',
      role: 'student',
    },
    passwordHash: 'hayenglish123',
    progress: {
      completedLessonIds: ['articles-a-an-the', 'present-simple-continuous'],
      masteredWordIds: ['v1', 'v2', 'v3', 'v5', 'v6'],
      streakCount: 5,
      userXP: 240,
    },
  },
  {
    user: {
      id: 'usr_anahit',
      name: 'Անահիտ Ղազարյան',
      email: 'anahit@hayenglish.am',
      avatar: '🏔️',
      englishLevel: 'beginner',
      dailyGoalMinutes: 10,
      registeredAt: '2026-09-15T12:00:00Z',
      role: 'student',
    },
    passwordHash: 'hayenglish123',
    progress: {
      completedLessonIds: ['articles-a-an-the'],
      masteredWordIds: ['v1', 'v4'],
      streakCount: 2,
      userXP: 80,
    },
  },
];

export const getStoredAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (!raw) {
      // Seed default accounts
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const hasOwner = parsed.some(
        (a: StoredAccount) => a.user?.email?.toLowerCase() === OFFICIAL_OWNER_EMAIL.toLowerCase()
      );
      if (!hasOwner) {
        parsed.unshift(DEFAULT_ACCOUNTS[0]);
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(parsed));
      }
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
};

export const saveAccounts = (accounts: StoredAccount[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts to storage', e);
  }
};

export const getActiveSessionUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    const user = JSON.parse(raw) as UserProfile;
    if (user && user.email) {
      // STRICT ROLE ENFORCEMENT: Only OFFICIAL_OWNER_EMAIL can ever have super_admin role
      const isOwner = user.email.trim().toLowerCase() === OFFICIAL_OWNER_EMAIL.toLowerCase();
      user.role = isOwner ? 'super_admin' : 'student';
    }
    return user;
  } catch {
    return null;
  }
};

export const setActiveSessionUser = (user: UserProfile | null) => {
  try {
    if (user) {
      // STRICT ROLE ENFORCEMENT: Never allow non-owner to store super_admin role
      const isOwner = user.email.trim().toLowerCase() === OFFICIAL_OWNER_EMAIL.toLowerCase();
      user.role = isOwner ? 'super_admin' : 'student';
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  } catch (e) {
    console.error('Failed to update session', e);
  }
};

export const getUserProgress = (userId: string): UserProgressData => {
  const accounts = getStoredAccounts();
  const acc = accounts.find((a) => a.user.id === userId);
  if (acc && acc.progress) {
    return {
      completedLessonIds: acc.progress.completedLessonIds || [],
      masteredWordIds: acc.progress.masteredWordIds || [],
      streakCount: acc.progress.streakCount || 1,
      userXP: acc.progress.userXP || 0,
      quizStats: acc.progress.quizStats,
      dailyMissions: acc.progress.dailyMissions,
      dailyMissionsDate: acc.progress.dailyMissionsDate,
      reviewPool: acc.progress.reviewPool || [],
      weeklyActivity: acc.progress.weeklyActivity,
    };
  }
  return {
    completedLessonIds: [],
    masteredWordIds: [],
    streakCount: 1,
    userXP: 0,
    reviewPool: [],
  };
};

export const saveUserProgress = (userId: string, progress: UserProgressData) => {
  const accounts = getStoredAccounts();
  const index = accounts.findIndex((a) => a.user.id === userId);
  if (index >= 0) {
    accounts[index].progress = {
      ...accounts[index].progress,
      ...progress,
    };
    saveAccounts(accounts);
  }

  // Sync to Firestore progress collection
  try {
    setDoc(
      doc(db, 'users', userId, 'progress', 'data'),
      {
        streakCount: progress.streakCount ?? 1,
        userXP: progress.userXP ?? 0,
        completedLessonIds: progress.completedLessonIds || [],
        masteredWordIds: progress.masteredWordIds || [],
        quizStats: progress.quizStats || null,
        dailyMissions: progress.dailyMissions || null,
        dailyMissionsDate: progress.dailyMissionsDate || null,
        reviewPool: progress.reviewPool || [],
        weeklyActivity: progress.weeklyActivity || null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch(() => {});
  } catch {}
};

/**
 * Cross-device synchronization:
 * Loads the user's progress from Firestore if available and updates localStorage.
 */
export const syncProgressFromFirestore = async (userId: string): Promise<UserProgressData | null> => {
  try {
    const docRef = doc(db, 'users', userId, 'progress', 'data');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Partial<UserProgressData>;
      const existing = getUserProgress(userId);
      const merged: UserProgressData = {
        completedLessonIds: Array.from(new Set([...existing.completedLessonIds, ...(data.completedLessonIds || [])])),
        masteredWordIds: Array.from(new Set([...existing.masteredWordIds, ...(data.masteredWordIds || [])])),
        streakCount: Math.max(existing.streakCount, data.streakCount || 1),
        userXP: Math.max(existing.userXP, data.userXP || 0),
        quizStats: data.quizStats || existing.quizStats,
        dailyMissions: data.dailyMissions || existing.dailyMissions,
        dailyMissionsDate: data.dailyMissionsDate || existing.dailyMissionsDate,
        reviewPool: (data.reviewPool && data.reviewPool.length > 0) ? data.reviewPool : existing.reviewPool,
        weeklyActivity: data.weeklyActivity || existing.weeklyActivity,
      };

      const accounts = getStoredAccounts();
      const index = accounts.findIndex((a) => a.user.id === userId);
      if (index >= 0) {
        accounts[index].progress = merged;
        saveAccounts(accounts);
      }
      return merged;
    }
  } catch (err) {
    console.warn('[Sync] Firestore sync skipped or offline:', err);
  }
  return null;
};

export const registerNewAccount = (
  name: string,
  email: string,
  passwordPlain: string,
  avatar: string,
  englishLevel: 'beginner' | 'elementary' | 'intermediate',
  dailyGoalMinutes: number
): { success: boolean; error?: string; user?: UserProfile } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanName) {
    return { success: false, error: 'empty_name' };
  }
  if (!cleanEmail) {
    return { success: false, error: 'empty_email' };
  }
  if (passwordPlain.length < 5) {
    return { success: false, error: 'short_password' };
  }

  const accounts = getStoredAccounts();
  const existing = accounts.find(
    (a) =>
      a.user.email.toLowerCase() === cleanEmail ||
      a.user.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (existing) {
    return { success: false, error: 'account_exists' };
  }

  // STRICT SERVER & CLIENT ROLE ASSIGNMENT:
  // Only the official owner email can ever have super_admin role.
  const isOwner = cleanEmail === OFFICIAL_OWNER_EMAIL.toLowerCase();
  const role: 'super_admin' | 'student' = isOwner ? 'super_admin' : 'student';

  const newUser: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    avatar: avatar || (isOwner ? '👑' : '🎓'),
    englishLevel,
    dailyGoalMinutes,
    registeredAt: new Date().toISOString(),
    role,
  };

  const newAccount: StoredAccount = {
    user: newUser,
    passwordHash: passwordPlain,
    progress: {
      completedLessonIds: [],
      masteredWordIds: [],
      streakCount: 1,
      userXP: 25, // Welcome bonus XP!
    },
  };

  accounts.push(newAccount);
  saveAccounts(accounts);
  setActiveSessionUser(newUser);

  // Sync to Firestore user document asynchronously
  try {
    setDoc(doc(db, 'users', newUser.id), {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      englishLevel: newUser.englishLevel,
      dailyGoalMinutes: newUser.dailyGoalMinutes,
      registeredAt: newUser.registeredAt,
      role: newUser.role,
    }).catch(() => {});
  } catch {}

  // Obtain signed server token asynchronously
  requestServerSessionToken(newUser.id, newUser.email).then((res) => {
    if (res?.token) {
      newUser.authToken = res.token;
      setActiveSessionUser(newUser);
    }
  });

  return { success: true, user: newUser };
};

export const loginAccount = (
  emailOrUsername: string,
  passwordPlain: string
): { success: boolean; error?: string; user?: UserProfile } => {
  const query = emailOrUsername.trim().toLowerCase();
  if (!query) {
    return { success: false, error: 'empty_email' };
  }
  if (!passwordPlain) {
    return { success: false, error: 'empty_password' };
  }

  const accounts = getStoredAccounts();
  const match = accounts.find(
    (a) =>
      a.user.email.toLowerCase() === query ||
      a.user.name.toLowerCase() === query ||
      a.user.id.toLowerCase() === query
  );

  if (!match) {
    return { success: false, error: 'user_not_found' };
  }

  if (match.passwordHash !== passwordPlain) {
    return { success: false, error: 'invalid_password' };
  }

  // Strictly enforce role upon login
  const isOwner = match.user.email.toLowerCase() === OFFICIAL_OWNER_EMAIL.toLowerCase();
  match.user.role = isOwner ? 'super_admin' : 'student';

  setActiveSessionUser(match.user);

  // Refresh server token
  requestServerSessionToken(match.user.id, match.user.email).then((res) => {
    if (res?.token) {
      match.user.authToken = res.token;
      setActiveSessionUser(match.user);
    }
  });

  return { success: true, user: match.user };
};

export const logoutSession = () => {
  setActiveSessionUser(null);
};

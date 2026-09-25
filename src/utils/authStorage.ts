import { UserProfile, UserProgressData } from '../types';

export const OFFICIAL_OWNER_EMAIL = 'kurghinyanartyom2@gmail.com';

export const isOwnerAdmin = (user?: UserProfile | null): boolean => {
  if (!user || !user.email) return false;
  return user.email.trim().toLowerCase() === OFFICIAL_OWNER_EMAIL.toLowerCase();
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
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
};

export const setActiveSessionUser = (user: UserProfile | null) => {
  try {
    if (user) {
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
    return acc.progress;
  }
  return {
    completedLessonIds: [],
    masteredWordIds: [],
    streakCount: 1,
    userXP: 0,
  };
};

export const saveUserProgress = (userId: string, progress: UserProgressData) => {
  const accounts = getStoredAccounts();
  const index = accounts.findIndex((a) => a.user.id === userId);
  if (index >= 0) {
    accounts[index].progress = progress;
    saveAccounts(accounts);
  }
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

  const newUser: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    avatar: avatar || '🎓',
    englishLevel,
    dailyGoalMinutes,
    registeredAt: new Date().toISOString(),
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

  setActiveSessionUser(match.user);
  return { success: true, user: match.user };
};

export const logoutSession = () => {
  setActiveSessionUser(null);
};

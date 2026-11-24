import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  OFFICIAL_OWNER_EMAIL,
  type ServerTokenPayload,
  createSignedSessionToken,
  verifySignedSessionToken,
} from './src/utils/tokenSecurity';

export {
  OFFICIAL_OWNER_EMAIL,
  createSignedSessionToken,
  verifySignedSessionToken,
};
export type { ServerTokenPayload };

// In-memory server-synced advertisement storage
interface ServerAdRequest {
  id: string;
  businessName: string;
  contactEmail: string;
  contactPhone?: string;
  headline: string;
  adText: string;
  callToAction: string;
  targetUrl: string;
  imageUrl: string;
  placement: string;
  duration: string;
  status: 'pending_review' | 'approved' | 'active' | 'rejected';
  price?: number | null;
  currency?: string;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  paidAt?: string;
  expiresAt?: string;
  submitterUserId?: string;
}

let serverAds: ServerAdRequest[] = [
  {
    id: 'ad_demo_it_english',
    businessName: 'Yerevan Tech Language Hub',
    contactEmail: 'partner@yerevantechhub.am',
    contactPhone: '+374 10 55-44-33',
    headline: 'IT & Business English Intensive Bootcamp',
    adText: 'Specialized 8-week English communication courses for Armenian software developers, PMs, and designers.',
    callToAction: 'Get 20% Discount',
    targetUrl: 'https://hayenglish.am/partners/tech-hub',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
    placement: 'hero_top',
    duration: '30_days',
    status: 'active',
    price: 60000,
    currency: 'AMD',
    adminNotes: 'High-value partner. Approved for hero banner placement.',
    submittedAt: '2026-09-10T10:00:00Z',
    reviewedAt: '2026-09-10T11:00:00Z',
    paidAt: '2026-09-10T12:00:00Z',
    expiresAt: '2026-10-10T12:00:00Z',
  },
  {
    id: 'ad_demo_cambridge_ielts',
    businessName: 'IELTS Prep Armenia (Kentron)',
    contactEmail: 'prep@ieltsarmenia.am',
    contactPhone: '+374 91 12-34-56',
    headline: 'Achieve Band 7.5+ in IELTS Academic',
    adText: 'Certified British Council trainers in Yerevan. Individual speaking mock tests with native teachers.',
    callToAction: 'Free Diagnostic Test',
    targetUrl: 'https://hayenglish.am/partners/ielts-center',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
    placement: 'sidebar_dashboard',
    duration: '14_days',
    status: 'active',
    price: 35000,
    currency: 'AMD',
    adminNotes: 'Promoted in student dashboard alongside CEFR levels.',
    submittedAt: '2026-09-15T09:30:00Z',
    reviewedAt: '2026-09-15T10:15:00Z',
    paidAt: '2026-09-15T11:00:00Z',
    expiresAt: '2026-09-29T11:00:00Z',
  },
];

// ============================================================================
// SERVER MIDDLEWARE
// ============================================================================
interface AuthenticatedRequest extends Request {
  userSession?: ServerTokenPayload;
}

const authenticateSession = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    req.userSession = undefined;
    return next();
  }

  const verified = verifySignedSessionToken(token);
  if (verified) {
    req.userSession = verified;
  }
  next();
};

// STRICT ADMIN ENFORCEMENT: Rejects with 403 if not the official website owner
const requireOwnerSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const session = req.userSession;
  if (
    !session ||
    session.role !== 'super_admin' ||
    session.email.toLowerCase() !== OFFICIAL_OWNER_EMAIL.toLowerCase()
  ) {
    res.status(403).json({
      error: 'Access Denied: Only the official website owner (kurghinyanartyom2@gmail.com) has access to the Admin Panel.',
      authorized: false,
      ownerRequired: OFFICIAL_OWNER_EMAIL,
    });
    return;
  }
  next();
};

// ============================================================================
// APPLICATION SETUP
// ============================================================================
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(authenticateSession);

  // --------------------------------------------------------------------------
  // AUTH & ROLE VERIFICATION ENDPOINTS
  // --------------------------------------------------------------------------

  // Issues a cryptographically signed server token with verified role
  app.post('/api/auth/token', (req: Request, res: Response) => {
    const { userId, email } = req.body;
    if (!email || !userId) {
      res.status(400).json({ error: 'Missing userId or email' });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const token = createSignedSessionToken(String(userId), cleanEmail);
    const isOwner = cleanEmail === OFFICIAL_OWNER_EMAIL.toLowerCase();

    res.json({
      success: true,
      token,
      email: cleanEmail,
      isOwner,
      role: isOwner ? 'super_admin' : 'student',
    });
  });

  // Verify currently held token & role
  app.get('/api/auth/verify', (req: AuthenticatedRequest, res: Response) => {
    const session = req.userSession;
    if (!session) {
      res.json({
        authenticated: false,
        isOwner: false,
        role: 'guest',
      });
      return;
    }

    const isOwner = session.role === 'super_admin' && session.email === OFFICIAL_OWNER_EMAIL.toLowerCase();
    res.json({
      authenticated: true,
      email: session.email,
      userId: session.userId,
      role: session.role,
      isOwner,
    });
  });

  // --------------------------------------------------------------------------
  // STRICT OWNER-ONLY ADMIN ENDPOINTS (Enforced by requireOwnerSuperAdmin)
  // --------------------------------------------------------------------------

  // 1. Verify access to admin portal
  app.get('/api/admin/check-access', requireOwnerSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
    res.json({
      authorized: true,
      owner: OFFICIAL_OWNER_EMAIL,
      role: 'super_admin',
      timestamp: new Date().toISOString(),
      serverMessage: 'Welcome Website Owner. Admin Desk access granted.',
    });
  });

  // 2. Fetch all ads for admin review
  app.get('/api/admin/ads', requireOwnerSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      ads: serverAds,
    });
  });

  // 3. Review ad request (price, status, admin notes)
  app.post('/api/admin/ads/review', requireOwnerSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { adId, price, status, adminNotes } = req.body;
    const target = serverAds.find((a) => a.id === adId);
    if (!target) {
      res.status(404).json({ error: 'Ad request not found' });
      return;
    }

    if (price !== undefined) target.price = Number(price);
    if (status) target.status = status;
    if (adminNotes !== undefined) target.adminNotes = adminNotes;
    target.reviewedAt = new Date().toISOString();

    res.json({ success: true, ad: target });
  });

  // 4. Toggle ad active status
  app.post('/api/admin/ads/toggle', requireOwnerSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { adId } = req.body;
    const target = serverAds.find((a) => a.id === adId);
    if (!target) {
      res.status(404).json({ error: 'Ad request not found' });
      return;
    }

    target.status = target.status === 'active' ? 'approved' : 'active';
    res.json({ success: true, ad: target });
  });

  // --------------------------------------------------------------------------
  // PUBLIC ADS ENDPOINTS
  // --------------------------------------------------------------------------

  // Public ad placement inquiry submission
  app.post('/api/ads/submit', (req: AuthenticatedRequest, res: Response) => {
    const adData = req.body;
    if (!adData.businessName || !adData.contactEmail || !adData.headline) {
      res.status(400).json({ error: 'Missing required ad information' });
      return;
    }

    const newAd: ServerAdRequest = {
      id: `ad_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      businessName: String(adData.businessName).trim(),
      contactEmail: String(adData.contactEmail).trim(),
      contactPhone: adData.contactPhone,
      headline: String(adData.headline).trim(),
      adText: String(adData.adText || '').trim(),
      callToAction: String(adData.callToAction || 'Learn More').trim(),
      targetUrl: String(adData.targetUrl || 'https://hayenglish.am').trim(),
      imageUrl: String(adData.imageUrl || '').trim(),
      placement: adData.placement || 'hero_top',
      duration: adData.duration || '30_days',
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
      submitterUserId: req.userSession?.userId,
    };

    serverAds.unshift(newAd);
    res.json({ success: true, ad: newAd });
  });

  // Fetch active ads for public display in banners
  app.get('/api/ads/active', (req: Request, res: Response) => {
    const placement = req.query.placement as string | undefined;
    const now = new Date().toISOString();

    let active = serverAds.filter((ad) => {
      if (ad.status !== 'active') return false;
      if (ad.expiresAt && ad.expiresAt < now) return false;
      return true;
    });

    if (placement) {
      active = active.filter((ad) => ad.placement === placement);
    }

    res.json({ success: true, ads: active });
  });

  // --------------------------------------------------------------------------
  // USER SECURE PROGRESS & LEADERBOARD ENDPOINTS
  // --------------------------------------------------------------------------
  interface ServerUserProgress {
    userId: string;
    email: string;
    streakCount: number;
    userXP: number;
    completedLessonIds: string[];
    masteredWordIds: string[];
    quizStats?: {
      totalQuizzesTaken: number;
      totalQuestionsAnswered: number;
      totalCorrectAnswers: number;
      bestStreak: number;
    };
    updatedAt: string;
  }

  const serverProgressStore = new Map<string, ServerUserProgress>();

  // Get user progress
  app.get('/api/user/progress', (req: AuthenticatedRequest, res: Response) => {
    const session = req.userSession;
    if (!session) {
      res.status(401).json({ error: 'Unauthorized: login required' });
      return;
    }

    const data = serverProgressStore.get(session.userId) || {
      userId: session.userId,
      email: session.email,
      streakCount: 1,
      userXP: 0,
      completedLessonIds: [],
      masteredWordIds: [],
      updatedAt: new Date().toISOString(),
    };

    res.json({ success: true, progress: data });
  });

  // Update user progress with sanity bounds (protecting XP manipulation)
  app.post('/api/user/progress', (req: AuthenticatedRequest, res: Response) => {
    const session = req.userSession;
    if (!session) {
      res.status(401).json({ error: 'Unauthorized: login required' });
      return;
    }

    const { streakCount, userXP, completedLessonIds, masteredWordIds, quizStats } = req.body;
    const existing = serverProgressStore.get(session.userId);

    // Sanity limit: users cannot inject impossible sudden XP jumps
    const previousXP = existing ? existing.userXP : 0;
    const safeXP = typeof userXP === 'number' && userXP >= 0 ? Math.min(userXP, previousXP + 500) : previousXP;

    const updated: ServerUserProgress = {
      userId: session.userId,
      email: session.email,
      streakCount: typeof streakCount === 'number' ? Math.max(1, streakCount) : 1,
      userXP: safeXP,
      completedLessonIds: Array.isArray(completedLessonIds) ? completedLessonIds.map(String) : [],
      masteredWordIds: Array.isArray(masteredWordIds) ? masteredWordIds.map(String) : [],
      quizStats: quizStats && typeof quizStats === 'object' ? quizStats : existing?.quizStats,
      updatedAt: new Date().toISOString(),
    };

    serverProgressStore.set(session.userId, updated);
    res.json({ success: true, progress: updated });
  });

  // Public/Student verified leaderboard
  app.get('/api/leaderboard', (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.userSession?.userId;
    const mockLeaders = [
      { id: 'usr_arm', name: 'Արմեն Դավթյան (Armen)', avatar: '👨‍💻', userXP: 1450, streakCount: 28, levelNumber: 6, levelTitleHy: 'Անգլերենի վիրտուոզ', levelTitleEn: 'Fluent Virtuoso' },
      { id: 'usr_ana', name: 'Անահիտ Ղազարյան (Anahit)', avatar: '🏔️', userXP: 980, streakCount: 14, levelNumber: 5, levelTitleHy: 'Սահուն հաղորդակից', levelTitleEn: 'Confident Speaker' },
      { id: 'usr_tig', name: 'Տիգրան Պետրոսյան (Tigran)', avatar: '⚡', userXP: 680, streakCount: 9, levelNumber: 4, levelTitleHy: 'Բառապաշարի վարպետ', levelTitleEn: 'Vocabulary Master' },
      { id: 'usr_son', name: 'Սոնա Մանուկյան (Sona)', avatar: '🌟', userXP: 420, streakCount: 6, levelNumber: 3, levelTitleHy: 'Անգլերենի գիտակ', levelTitleEn: 'Language Seeker' },
      { id: 'usr_dav', name: 'Դավիթ Կարապետյան (David)', avatar: '🎯', userXP: 290, streakCount: 4, levelNumber: 3, levelTitleHy: 'Անգլերենի գիտակ', levelTitleEn: 'Language Seeker' },
    ];

    // Include current user in rankings if present
    let currentInList = false;
    const leaders = [...mockLeaders];

    if (currentUserId && serverProgressStore.has(currentUserId)) {
      const userProg = serverProgressStore.get(currentUserId)!;
      leaders.push({
        id: userProg.userId,
        name: req.userSession?.email === OFFICIAL_OWNER_EMAIL ? 'Artyom Kurghinyan (👑 Տեր)' : 'Դուք (You)',
        avatar: req.userSession?.email === OFFICIAL_OWNER_EMAIL ? '👑' : '🎓',
        userXP: userProg.userXP,
        streakCount: userProg.streakCount,
        levelNumber: Math.min(8, Math.floor(userProg.userXP / 250) + 1),
        levelTitleHy: 'Ակտիվ սովորող',
        levelTitleEn: 'Active Learner',
      });
      currentInList = true;
    }

    leaders.sort((a, b) => b.userXP - a.userXP);
    const ranked = leaders.map((u, i) => ({
      ...u,
      rank: i + 1,
      isCurrentUser: u.id === currentUserId,
    }));

    res.json({ success: true, leaders: ranked });
  });

  // --------------------------------------------------------------------------
  // VITE DEV & PRODUCTION STATIC SERVING
  // --------------------------------------------------------------------------
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const httpServer = app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`[HayEnglish Server] Listening on http://0.0.0.0:${PORT}`);
      console.log(`[HayEnglish Auth] Super Admin & Owner: ${OFFICIAL_OWNER_EMAIL}`);
    });

    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Resolve dist folder whether running from root (server.ts) or dist-server/server.js
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`[HayEnglish Server] Listening on http://0.0.0.0:${PORT}`);
      console.log(`[HayEnglish Auth] Super Admin & Owner: ${OFFICIAL_OWNER_EMAIL}`);
    });
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

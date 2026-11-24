// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var OFFICIAL_OWNER_EMAIL = "kurghinyanartyom2@gmail.com";
var SERVER_SECRET = process.env.SESSION_SECRET || "hayenglish_secure_owner_hmac_secret_2026_x89f";
var serverAds = [
  {
    id: "ad_demo_it_english",
    businessName: "Yerevan Tech Language Hub",
    contactEmail: "partner@yerevantechhub.am",
    contactPhone: "+374 10 55-44-33",
    headline: "IT & Business English Intensive Bootcamp",
    adText: "Specialized 8-week English communication courses for Armenian software developers, PMs, and designers.",
    callToAction: "Get 20% Discount",
    targetUrl: "https://hayenglish.am/partners/tech-hub",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
    placement: "hero_top",
    duration: "30_days",
    status: "active",
    price: 6e4,
    currency: "AMD",
    adminNotes: "High-value partner. Approved for hero banner placement.",
    submittedAt: "2026-09-10T10:00:00Z",
    reviewedAt: "2026-09-10T11:00:00Z",
    paidAt: "2026-09-10T12:00:00Z",
    expiresAt: "2026-10-10T12:00:00Z"
  },
  {
    id: "ad_demo_cambridge_ielts",
    businessName: "IELTS Prep Armenia (Kentron)",
    contactEmail: "prep@ieltsarmenia.am",
    contactPhone: "+374 91 12-34-56",
    headline: "Achieve Band 7.5+ in IELTS Academic",
    adText: "Certified British Council trainers in Yerevan. Individual speaking mock tests with native teachers.",
    callToAction: "Free Diagnostic Test",
    targetUrl: "https://hayenglish.am/partners/ielts-center",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
    placement: "sidebar_dashboard",
    duration: "14_days",
    status: "active",
    price: 35e3,
    currency: "AMD",
    adminNotes: "Promoted in student dashboard alongside CEFR levels.",
    submittedAt: "2026-09-15T09:30:00Z",
    reviewedAt: "2026-09-15T10:15:00Z",
    paidAt: "2026-09-15T11:00:00Z",
    expiresAt: "2026-09-29T11:00:00Z"
  }
];
function createSignedSessionToken(userId, email) {
  const cleanEmail = email.trim().toLowerCase();
  const isOwner = cleanEmail === OFFICIAL_OWNER_EMAIL.toLowerCase();
  const role = isOwner ? "super_admin" : "student";
  const payload = {
    userId,
    email: cleanEmail,
    role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1e3
    // 30 days
  };
  const payloadJson = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadJson).toString("base64url");
  const signature = crypto.createHmac("sha256", SERVER_SECRET).update(payloadBase64).digest("base64url");
  return `${payloadBase64}.${signature}`;
}
function verifySignedSessionToken(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadBase64, providedSignature] = parts;
    const expectedSignature = crypto.createHmac("sha256", SERVER_SECRET).update(payloadBase64).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature))) {
      return null;
    }
    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    if (Date.now() > payload.expiresAt) {
      return null;
    }
    if (payload.role === "super_admin" && payload.email.toLowerCase() !== OFFICIAL_OWNER_EMAIL.toLowerCase()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
var authenticateSession = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    req.userSession = void 0;
    return next();
  }
  const verified = verifySignedSessionToken(token);
  if (verified) {
    req.userSession = verified;
  }
  next();
};
var requireOwnerSuperAdmin = (req, res, next) => {
  const session = req.userSession;
  if (!session || session.role !== "super_admin" || session.email.toLowerCase() !== OFFICIAL_OWNER_EMAIL.toLowerCase()) {
    res.status(403).json({
      error: "Access Denied: Only the official website owner (kurghinyanartyom2@gmail.com) has access to the Admin Panel.",
      authorized: false,
      ownerRequired: OFFICIAL_OWNER_EMAIL
    });
    return;
  }
  next();
};
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3e3;
  app.use(express.json());
  app.use(authenticateSession);
  app.post("/api/auth/token", (req, res) => {
    const { userId, email } = req.body;
    if (!email || !userId) {
      res.status(400).json({ error: "Missing userId or email" });
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
      role: isOwner ? "super_admin" : "student"
    });
  });
  app.get("/api/auth/verify", (req, res) => {
    const session = req.userSession;
    if (!session) {
      res.json({
        authenticated: false,
        isOwner: false,
        role: "guest"
      });
      return;
    }
    const isOwner = session.role === "super_admin" && session.email === OFFICIAL_OWNER_EMAIL.toLowerCase();
    res.json({
      authenticated: true,
      email: session.email,
      userId: session.userId,
      role: session.role,
      isOwner
    });
  });
  app.get("/api/admin/check-access", requireOwnerSuperAdmin, (req, res) => {
    res.json({
      authorized: true,
      owner: OFFICIAL_OWNER_EMAIL,
      role: "super_admin",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      serverMessage: "Welcome Website Owner. Admin Desk access granted."
    });
  });
  app.get("/api/admin/ads", requireOwnerSuperAdmin, (req, res) => {
    res.json({
      success: true,
      ads: serverAds
    });
  });
  app.post("/api/admin/ads/review", requireOwnerSuperAdmin, (req, res) => {
    const { adId, price, status, adminNotes } = req.body;
    const target = serverAds.find((a) => a.id === adId);
    if (!target) {
      res.status(404).json({ error: "Ad request not found" });
      return;
    }
    if (price !== void 0) target.price = Number(price);
    if (status) target.status = status;
    if (adminNotes !== void 0) target.adminNotes = adminNotes;
    target.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
    res.json({ success: true, ad: target });
  });
  app.post("/api/admin/ads/toggle", requireOwnerSuperAdmin, (req, res) => {
    const { adId } = req.body;
    const target = serverAds.find((a) => a.id === adId);
    if (!target) {
      res.status(404).json({ error: "Ad request not found" });
      return;
    }
    target.status = target.status === "active" ? "approved" : "active";
    res.json({ success: true, ad: target });
  });
  app.post("/api/ads/submit", (req, res) => {
    const adData = req.body;
    if (!adData.businessName || !adData.contactEmail || !adData.headline) {
      res.status(400).json({ error: "Missing required ad information" });
      return;
    }
    const newAd = {
      id: `ad_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      businessName: String(adData.businessName).trim(),
      contactEmail: String(adData.contactEmail).trim(),
      contactPhone: adData.contactPhone,
      headline: String(adData.headline).trim(),
      adText: String(adData.adText || "").trim(),
      callToAction: String(adData.callToAction || "Learn More").trim(),
      targetUrl: String(adData.targetUrl || "https://hayenglish.am").trim(),
      imageUrl: String(adData.imageUrl || "").trim(),
      placement: adData.placement || "hero_top",
      duration: adData.duration || "30_days",
      status: "pending_review",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
      submitterUserId: req.userSession?.userId
    };
    serverAds.unshift(newAd);
    res.json({ success: true, ad: newAd });
  });
  app.get("/api/ads/active", (req, res) => {
    const placement = req.query.placement;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    let active = serverAds.filter((ad) => {
      if (ad.status !== "active") return false;
      if (ad.expiresAt && ad.expiresAt < now) return false;
      return true;
    });
    if (placement) {
      active = active.filter((ad) => ad.placement === placement);
    }
    res.json({ success: true, ads: active });
  });
  const serverProgressStore = /* @__PURE__ */ new Map();
  app.get("/api/user/progress", (req, res) => {
    const session = req.userSession;
    if (!session) {
      res.status(401).json({ error: "Unauthorized: login required" });
      return;
    }
    const data = serverProgressStore.get(session.userId) || {
      userId: session.userId,
      email: session.email,
      streakCount: 1,
      userXP: 0,
      completedLessonIds: [],
      masteredWordIds: [],
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    res.json({ success: true, progress: data });
  });
  app.post("/api/user/progress", (req, res) => {
    const session = req.userSession;
    if (!session) {
      res.status(401).json({ error: "Unauthorized: login required" });
      return;
    }
    const { streakCount, userXP, completedLessonIds, masteredWordIds, quizStats } = req.body;
    const existing = serverProgressStore.get(session.userId);
    const previousXP = existing ? existing.userXP : 0;
    const safeXP = typeof userXP === "number" && userXP >= 0 ? Math.min(userXP, previousXP + 500) : previousXP;
    const updated = {
      userId: session.userId,
      email: session.email,
      streakCount: typeof streakCount === "number" ? Math.max(1, streakCount) : 1,
      userXP: safeXP,
      completedLessonIds: Array.isArray(completedLessonIds) ? completedLessonIds.map(String) : [],
      masteredWordIds: Array.isArray(masteredWordIds) ? masteredWordIds.map(String) : [],
      quizStats: quizStats && typeof quizStats === "object" ? quizStats : existing?.quizStats,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    serverProgressStore.set(session.userId, updated);
    res.json({ success: true, progress: updated });
  });
  app.get("/api/leaderboard", (req, res) => {
    const currentUserId = req.userSession?.userId;
    const mockLeaders = [
      { id: "usr_arm", name: "\u0531\u0580\u0574\u0565\u0576 \u0534\u0561\u057E\u0569\u0575\u0561\u0576 (Armen)", avatar: "\u{1F468}\u200D\u{1F4BB}", userXP: 1450, streakCount: 28, levelNumber: 6, levelTitleHy: "\u0531\u0576\u0563\u056C\u0565\u0580\u0565\u0576\u056B \u057E\u056B\u0580\u057F\u0578\u0582\u0578\u0566", levelTitleEn: "Fluent Virtuoso" },
      { id: "usr_ana", name: "\u0531\u0576\u0561\u0570\u056B\u057F \u0542\u0561\u0566\u0561\u0580\u0575\u0561\u0576 (Anahit)", avatar: "\u{1F3D4}\uFE0F", userXP: 980, streakCount: 14, levelNumber: 5, levelTitleHy: "\u054D\u0561\u0570\u0578\u0582\u0576 \u0570\u0561\u0572\u0578\u0580\u0564\u0561\u056F\u056B\u0581", levelTitleEn: "Confident Speaker" },
      { id: "usr_tig", name: "\u054F\u056B\u0563\u0580\u0561\u0576 \u054A\u0565\u057F\u0580\u0578\u057D\u0575\u0561\u0576 (Tigran)", avatar: "\u26A1", userXP: 680, streakCount: 9, levelNumber: 4, levelTitleHy: "\u0532\u0561\u057C\u0561\u057A\u0561\u0577\u0561\u0580\u056B \u057E\u0561\u0580\u057A\u0565\u057F", levelTitleEn: "Vocabulary Master" },
      { id: "usr_son", name: "\u054D\u0578\u0576\u0561 \u0544\u0561\u0576\u0578\u0582\u056F\u0575\u0561\u0576 (Sona)", avatar: "\u{1F31F}", userXP: 420, streakCount: 6, levelNumber: 3, levelTitleHy: "\u0531\u0576\u0563\u056C\u0565\u0580\u0565\u0576\u056B \u0563\u056B\u057F\u0561\u056F", levelTitleEn: "Language Seeker" },
      { id: "usr_dav", name: "\u0534\u0561\u057E\u056B\u0569 \u053F\u0561\u0580\u0561\u057A\u0565\u057F\u0575\u0561\u0576 (David)", avatar: "\u{1F3AF}", userXP: 290, streakCount: 4, levelNumber: 3, levelTitleHy: "\u0531\u0576\u0563\u056C\u0565\u0580\u0565\u0576\u056B \u0563\u056B\u057F\u0561\u056F", levelTitleEn: "Language Seeker" }
    ];
    let currentInList = false;
    const leaders = [...mockLeaders];
    if (currentUserId && serverProgressStore.has(currentUserId)) {
      const userProg = serverProgressStore.get(currentUserId);
      leaders.push({
        id: userProg.userId,
        name: req.userSession?.email === OFFICIAL_OWNER_EMAIL ? "Artyom Kurghinyan (\u{1F451} \u054F\u0565\u0580)" : "\u0534\u0578\u0582\u0584 (You)",
        avatar: req.userSession?.email === OFFICIAL_OWNER_EMAIL ? "\u{1F451}" : "\u{1F393}",
        userXP: userProg.userXP,
        streakCount: userProg.streakCount,
        levelNumber: Math.min(8, Math.floor(userProg.userXP / 250) + 1),
        levelTitleHy: "\u0531\u056F\u057F\u056B\u057E \u057D\u0578\u057E\u0578\u0580\u0578\u0572",
        levelTitleEn: "Active Learner"
      });
      currentInList = true;
    }
    leaders.sort((a, b) => b.userXP - a.userXP);
    const ranked = leaders.map((u, i) => ({
      ...u,
      rank: i + 1,
      isCurrentUser: u.id === currentUserId
    }));
    res.json({ success: true, leaders: ranked });
  });
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    const httpServer = app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`[HayEnglish Server] Listening on http://0.0.0.0:${PORT}`);
      console.log(`[HayEnglish Auth] Super Admin & Owner: ${OFFICIAL_OWNER_EMAIL}`);
    });
    const isHmrDisabled = process.env.DISABLE_HMR === "true";
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer }
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`[HayEnglish Server] Listening on http://0.0.0.0:${PORT}`);
      console.log(`[HayEnglish Auth] Super Admin & Owner: ${OFFICIAL_OWNER_EMAIL}`);
    });
  }
}
if (process.env.NODE_ENV !== "test") {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}
export {
  OFFICIAL_OWNER_EMAIL,
  createSignedSessionToken,
  verifySignedSessionToken
};

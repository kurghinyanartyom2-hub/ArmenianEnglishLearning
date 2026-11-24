import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  OFFICIAL_OWNER_EMAIL,
  createSignedSessionToken,
  verifySignedSessionToken,
} from '../src/utils/tokenSecurity';
import {
  calculateLevel,
  calculateAccuracy,
  getOrCreateDailyMissions,
  recordMissionAction,
  addMistakeToReviewPool,
  recordReviewAttempt,
  recordQuizCompletion,
  LEVEL_TIERS,
} from '../src/utils/gamification';
import { VOCABULARY_DATA } from '../src/data/vocabularyData';
import { LISTENING_EXERCISES } from '../src/data/listeningData';

describe('HayEnglish Security & Authorization Tests', () => {
  it('enforces that only OFFICIAL_OWNER_EMAIL receives super_admin role', () => {
    const ownerToken = createSignedSessionToken('usr_123', OFFICIAL_OWNER_EMAIL);
    const ownerSession = verifySignedSessionToken(ownerToken);

    assert.ok(ownerSession, 'Owner session should verify');
    assert.strictEqual(ownerSession?.role, 'super_admin');
    assert.strictEqual(ownerSession?.email, OFFICIAL_OWNER_EMAIL.toLowerCase());

    const normalUserToken = createSignedSessionToken('usr_456', 'hacker@example.com');
    const normalSession = verifySignedSessionToken(normalUserToken);

    assert.ok(normalSession, 'Student session should verify');
    assert.strictEqual(normalSession?.role, 'student', 'Non-owner must NEVER get super_admin');
  });

  it('rejects tampered tokens or forged signatures', () => {
    const validToken = createSignedSessionToken('usr_789', 'student@hayenglish.am');
    const parts = validToken.split('.');
    assert.strictEqual(parts.length, 2);

    // Tamper with payload
    const forgedPayload = Buffer.from(
      JSON.stringify({
        userId: 'usr_789',
        email: OFFICIAL_OWNER_EMAIL,
        role: 'super_admin',
        issuedAt: Date.now(),
        expiresAt: Date.now() + 100000,
      })
    ).toString('base64url');

    const forgedToken = `${forgedPayload}.${parts[1]}`;
    const forgedResult = verifySignedSessionToken(forgedToken);
    assert.strictEqual(forgedResult, null, 'Tampered token must be rejected');

    // Tamper with signature
    const corruptToken = `${parts[0]}.invalid_signature`;
    const corruptResult = verifySignedSessionToken(corruptToken);
    assert.strictEqual(corruptResult, null, 'Corrupt signature must be rejected');
  });
});

describe('HayEnglish Gamification & Level System Tests', () => {
  it('correctly calculates student level tiers and XP progression', () => {
    // 0 XP -> Level 1
    const l1 = calculateLevel(0);
    assert.strictEqual(l1.currentLevel.levelNumber, 1);
    assert.strictEqual(l1.currentLevel.cefrEquivalent, 'A1 Intro');
    assert.strictEqual(l1.progressPercent, 0);

    // 150 XP -> Level 2
    const l2 = calculateLevel(150);
    assert.strictEqual(l2.currentLevel.levelNumber, 2);
    assert.ok(l2.nextLevel !== null);
    assert.strictEqual(l2.nextLevel?.levelNumber, 3);
    assert.ok(l2.progressPercent > 0 && l2.progressPercent < 100);

    // 2500 XP -> Level 8 (Polyglot Legend)
    const l8 = calculateLevel(2500);
    assert.strictEqual(l8.currentLevel.levelNumber, 8);
    assert.strictEqual(l8.currentLevel.cefrEquivalent, 'C2 Master');
  });

  it('computes quiz accuracy percentage accurately', () => {
    const stats = recordQuizCompletion(undefined, 10, 8);
    assert.strictEqual(stats.totalQuizzesTaken, 1);
    assert.strictEqual(stats.totalQuestionsAnswered, 10);
    assert.strictEqual(stats.totalCorrectAnswers, 8);
    assert.strictEqual(calculateAccuracy(stats), 80);

    const stats2 = recordQuizCompletion(stats, 10, 10);
    assert.strictEqual(stats2.totalQuizzesTaken, 2);
    assert.strictEqual(stats2.totalQuestionsAnswered, 20);
    assert.strictEqual(stats2.totalCorrectAnswers, 18);
    assert.strictEqual(calculateAccuracy(stats2), 90);
  });
});

describe('HayEnglish Daily Missions Tests', () => {
  it('generates 4 daily missions with targets and XP rewards', () => {
    const { missions } = getOrCreateDailyMissions();
    assert.strictEqual(missions.length, 4);
    assert.ok(missions.every((m) => m.target > 0 && m.xpReward > 0));
  });

  it('progresses missions and marks them completed upon target reach', () => {
    const { missions } = getOrCreateDailyMissions();
    const { updatedMissions, newlyCompleted } = recordMissionAction(missions, 'lessons', 1);

    const lessonMission = updatedMissions.find((m) => m.category === 'lessons');
    assert.ok(lessonMission);
    assert.strictEqual(lessonMission.completed, true);
    assert.strictEqual(newlyCompleted.length, 1);
    assert.strictEqual(newlyCompleted[0].category, 'lessons');
  });
});

describe('HayEnglish Personalized Spaced Review System Tests', () => {
  it('adds mistakes to review pool and tracks mistake counts', () => {
    const pool1 = addMistakeToReviewPool([], {
      id: 'word_v1',
      type: 'word',
      promptEn: 'Opportunity',
      promptHy: 'Հնարավորություն',
      answer: 'Opportunity',
      explanationHy: 'Շեշտը tu վանկի վրա է',
      explanationEn: 'Stress is on tu',
    });

    assert.strictEqual(pool1.length, 1);
    assert.strictEqual(pool1[0].mistakeCount, 1);
    assert.strictEqual(pool1[0].correctConsecutive, 0);

    // Repeated mistake on the same item increases mistakeCount
    const pool2 = addMistakeToReviewPool(pool1, {
      id: 'word_v1',
      type: 'word',
      promptEn: 'Opportunity',
      promptHy: 'Հնարավորություն',
      answer: 'Opportunity',
      explanationHy: 'Շեշտը tu վանկի վրա է',
      explanationEn: 'Stress is on tu',
    });

    assert.strictEqual(pool2.length, 1);
    assert.strictEqual(pool2[0].mistakeCount, 2);
  });

  it('graduates words from review pool after 2 consecutive correct answers', () => {
    const initialPool = [
      {
        id: 'word_v2',
        type: 'word' as const,
        promptEn: 'Collaboration',
        promptHy: 'Համագործակցություն',
        answer: 'Collaboration',
        explanationHy: 'tion = շըն',
        explanationEn: 'tion = shən',
        mistakeCount: 1,
        correctConsecutive: 0,
        lastReviewedAt: new Date().toISOString(),
      },
    ];

    // First correct answer: increments correctConsecutive to 1
    const step1 = recordReviewAttempt(initialPool, 'word_v2', true);
    assert.strictEqual(step1.graduated, false);
    assert.strictEqual(step1.updatedPool[0].correctConsecutive, 1);

    // Second consecutive correct answer: graduates and removes from pool!
    const step2 = recordReviewAttempt(step1.updatedPool, 'word_v2', true);
    assert.strictEqual(step2.graduated, true);
    assert.strictEqual(step2.updatedPool.length, 0, 'Word must graduate after 2 consecutive correct answers');
  });
});

describe('HayEnglish Vocabulary & Listening Data Quality Tests', () => {
  it('ensures vocabulary words have complete translations and phonetic hints for Armenians', () => {
    assert.ok(VOCABULARY_DATA.length >= 10);
    VOCABULARY_DATA.forEach((word) => {
      assert.ok(word.english, 'Missing English');
      assert.ok(word.armenian, 'Missing Armenian');
      assert.ok(word.phonetic, 'Missing IPA phonetic');
      assert.ok(word.armenianPhonetic, 'Missing Armenian phonetic spelling');
      assert.ok(word.exampleEn, 'Missing exampleEn');
      assert.ok(word.exampleHy, 'Missing exampleHy');
    });
  });

  it('ensures listening exercises have audio transcription and focus sound', () => {
    assert.ok(LISTENING_EXERCISES.length >= 5);
    LISTENING_EXERCISES.forEach((ex) => {
      assert.ok(ex.phraseEn);
      assert.ok(ex.translationHy);
      assert.ok(ex.phonetic);
      assert.ok(ex.focusSound);
      assert.ok(ex.tipHy);
    });
  });
});

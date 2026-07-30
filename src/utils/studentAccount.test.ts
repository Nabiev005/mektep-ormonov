import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { User } from 'firebase/auth';
import { recordStudentCourseProgress } from './studentAccount';

const setDocMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock('../firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'doc-ref'),
  setDoc: setDocMock,
  increment: vi.fn((n: number) => ({ __increment: n })),
  serverTimestamp: vi.fn(() => '__server_timestamp__'),
}));

const user = { uid: 'u1', displayName: 'Асан', email: 'asan@test.kg', photoURL: '' } as User;

describe('recordStudentCourseProgress', () => {
  beforeEach(() => {
    setDocMock.mockClear();
  });

  it('does nothing when user is missing', async () => {
    await recordStudentCourseProgress(null, { source: 'python', title: 'Python', progressPercent: 50 });
    expect(setDocMock).not.toHaveBeenCalled();
  });

  it('clamps progressPercent into 0-100 range', async () => {
    await recordStudentCourseProgress(user, { source: 'python', title: 'Python', progressPercent: 150 });
    const payload = setDocMock.mock.calls[0][1];
    expect(payload['courses.python'].progressPercent).toBe(100);

    await recordStudentCourseProgress(user, { source: 'python', title: 'Python', progressPercent: -20 });
    const payload2 = setDocMock.mock.calls[1][1];
    expect(payload2['courses.python'].progressPercent).toBe(0);
  });

  it('marks certificate eligible once progress reaches 100%', async () => {
    await recordStudentCourseProgress(user, { source: 'python', title: 'Python', progressPercent: 100 });
    const payload = setDocMock.mock.calls[0][1];
    expect(payload['courses.python'].certificateEligible).toBe(true);
    expect(payload['certificates.python_completed']).toBeDefined();
  });

  it('marks certificate eligible for a language course high score even below 100%', async () => {
    await recordStudentCourseProgress(user, {
      source: 'english_language',
      title: 'English',
      progressPercent: 40,
      score: 80,
    });
    const payload = setDocMock.mock.calls[0][1];
    expect(payload['courses.english_language'].certificateEligible).toBe(true);
    expect(payload['certificates.english_language_record']).toBeDefined();
  });

  it('does not grant a certificate for a low language score below 100%', async () => {
    await recordStudentCourseProgress(user, {
      source: 'english_language',
      title: 'English',
      progressPercent: 40,
      score: 10,
    });
    const payload = setDocMock.mock.calls[0][1];
    expect(payload['courses.english_language'].certificateEligible).toBe(false);
    expect(payload['certificates.english_language_record']).toBeUndefined();
  });

  it('keeps the highest record score seen so far', async () => {
    await recordStudentCourseProgress(user, {
      source: 'python',
      title: 'Python',
      progressPercent: 30,
      score: 20,
      record: 90,
    });
    const payload = setDocMock.mock.calls[0][1];
    expect(payload['courses.python'].record).toBe(90);
  });
});

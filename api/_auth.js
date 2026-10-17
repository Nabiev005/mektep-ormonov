// Firebase ID токенин текшерүүчү жардамчы. Файлдын аты "_" менен башталгандыктан Vercel аны API маршрут катары ачпайт.
// firebase-admin жана service account керек эмес: токендин колтамгасы Google'дун ачык сертификаттары менен текшерилет.
import { createPublicKey, createVerify } from 'node:crypto';

const FIREBASE_PROJECT_ID = 'mektep-admin';
const CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let cachedCerts = null;
let certsExpireAt = 0;

const getCerts = async () => {
  if (cachedCerts && Date.now() < certsExpireAt) return cachedCerts;
  const response = await fetch(CERTS_URL);
  if (!response.ok) throw new Error('Google сертификаттарын алуу мүмкүн болгон жок.');
  const maxAge = Number(/max-age=(\d+)/.exec(response.headers.get('cache-control') || '')?.[1] || 3600);
  cachedCerts = await response.json();
  certsExpireAt = Date.now() + maxAge * 1000;
  return cachedCerts;
};

const decodeSegment = (segment) => JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));

/** Токен туура болсо колдонуучунун uid'ин, болбосо null кайтарат. */
export const verifyFirebaseToken = async (req) => {
  const match = /^Bearer (.+)$/.exec(req.headers.authorization || '');
  if (!match) return null;

  const token = match[1];
  const [headerB64, payloadB64, signatureB64] = token.split('.');
  if (!headerB64 || !payloadB64 || !signatureB64) return null;

  try {
    const header = decodeSegment(headerB64);
    const payload = decodeSegment(payloadB64);
    const now = Math.floor(Date.now() / 1000);

    if (header.alg !== 'RS256') return null;
    if (payload.aud !== FIREBASE_PROJECT_ID) return null;
    if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) return null;
    if (typeof payload.sub !== 'string' || !payload.sub) return null;
    if (payload.exp <= now || payload.iat > now + 300) return null;

    const certs = await getCerts();
    const cert = certs[header.kid];
    if (!cert) return null;

    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${headerB64}.${payloadB64}`);
    const valid = verifier.verify(createPublicKey(cert), Buffer.from(signatureB64, 'base64url'));
    return valid ? { uid: payload.sub, token } : null;
  } catch {
    return null;
  }
};

/** Колдонуучунун admins коллекциясында бар экенин анын өз токени менен текшерет (Firestore эрежелери ээсине окууга уруксат берет). */
export const isFirebaseAdmin = async ({ uid, token }) => {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/admins/${encodeURIComponent(uid)}`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  return response.ok;
};

// Жөнөкөй эс тутумдагы чектөө: бир инстанция ичинде бир колдонуучу мүнөтүнө белгилүү сандан ашык суроо жөнөтө албайт.
const requestLog = new Map();

export const isRateLimited = (uid, maxPerMinute) => {
  const now = Date.now();
  const recent = (requestLog.get(uid) || []).filter((time) => now - time < 60_000);
  if (recent.length >= maxPerMinute) {
    requestLog.set(uid, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(uid, recent);
  return false;
};

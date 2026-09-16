if (!process.env.TEST_DATABASE_URL || !new URL(process.env.TEST_DATABASE_URL).pathname.endsWith('_test')) {
  throw new Error('Use TEST_DATABASE_URL pointing to a disposable _test database');
}
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { once } = require('node:events');

process.env.JWT_SECRET = 'test-only-jwt-secret-do-not-use-in-production';
process.env.OTP_SECRET = 'test-only-otp-secret-do-not-use-in-production';
process.env.RESEND_API_KEY = 'test-key';
process.env.EMAIL_FROM = 'Test <test@example.com>';
process.env.GOOGLE_CLIENT_ID = 'test-client';
process.env.GOOGLE_CLIENT_SECRET = 'test-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost/callback';
process.env.TRUST_PROXY_HOPS = '1';
process.env.NODE_ENV = 'test';
const prisma = require('../dist/lib/prisma').default;
const app = require('../dist/app').default;
const { verifySessionToken, generateToken } = require('../dist/lib/jwt');
const { initializeWebSocket, sendToUser } = require('../dist/websocket/websocket.server');
const { WebSocket } = require('ws');
const bcrypt = require('bcryptjs');
const nativeFetch = global.fetch;
const emails = new Set();
const rateKeys = new Set();
const mail = new Map();
let deliveryFails = false;
let server, base, ip = 0;
const password = 'a-safe-test-password';
const address = () => { const email = `${randomUUID()}@example.com`; emails.add(email); return email; };

global.fetch = async (url, options) => {
  if (url === 'https://api.resend.com/emails') {
    const body = JSON.parse(options.body);
    mail.set(body.to[0], body.text.match(/is (\d{6})\./)[1]);
    return { ok: !deliveryFails };
  }
  return nativeFetch(url, options);
};
async function api(path, body, cookie) {
  const bucket = ['/signup', '/otp/request', '/forgot-password'].includes(path) ? 'otp-send' :
    path === '/signin' ? 'password-login' : 'otp-verify';
  rateKeys.add(require('node:crypto').createHash('sha256').update(`${bucket}:198.18.0.${ip}`).digest('hex'));
  const response = await nativeFetch(`${base}/api/auth${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': `198.18.0.${ip}`, ...(cookie ? { Cookie: cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0], retry: response.headers.get('retry-after') };
}
async function request(path, email, extra = {}) {
  const result = await api(path, { email, ...extra });
  assert.equal(result.status, 202, JSON.stringify(result.body));
  assert.equal(result.cookie, undefined);
  assert.equal(result.body.code, undefined);
  return { email, challengeId: result.body.challengeId, code: mail.get(email) };
}
async function register() {
  const email = address();
  const data = await request('/signup', email, { name: 'Test User', password });
  const result = await api('/signup/verify', data);
  assert.equal(result.status, 201);
  return { email, ...result };
}
async function allowResend(email, purpose) {
  await prisma.emailOtp.update({ where: { email_purpose: { email, purpose } }, data: { lastSentAt: new Date(Date.now() - 61000) } });
}
before(async () => {
  server = app.listen(0, '127.0.0.1');
  initializeWebSocket(server);
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});
beforeEach(() => { ip++; deliveryFails = false; });
after(async () => {
  global.fetch = nativeFetch;
  await prisma.emailOtp.deleteMany({ where: { email: { in: [...emails] } } });
  await prisma.user.deleteMany({ where: { email: { in: [...emails] } } });
  await prisma.authRateLimit.deleteMany({ where: { key: { in: [...rateKeys] } } });
  await prisma.$disconnect();
  await new Promise(resolve => server.close(resolve));
});

test('signup stays pending; normalization, hash storage, wrong code, creation and replay', async () => {
  const email = address();
  const data = await request('/signup', ` ${email.toUpperCase()} `, { name: 'Test User', password });
  data.email = email; data.code = mail.get(email);
  assert.equal(await prisma.user.findUnique({ where: { email } }), null);
  const pending = await prisma.emailOtp.findUnique({ where: { email_purpose: { email, purpose: 'SIGNUP' } } });
  assert.notEqual(pending.codeHash, data.code);
  assert.notEqual(pending.passwordHash, password);
  assert.equal((await api('/signup/verify', { ...data, code: data.code === '000000' ? '111111' : '000000' })).status, 400);
  const verified = await api('/signup/verify', data);
  assert.equal(verified.status, 201);
  assert.ok(verified.cookie);
  assert.equal(verified.body.user.password, undefined);
  assert.equal((await api('/me', undefined, verified.cookie)).status, 200);
  assert.equal((await api('/signup/verify', data)).status, 400);
  assert.equal((await api('/signin', { email, password })).status, 200);
});

test('invalid input and bcrypt byte limit return 400, not server errors', async () => {
  assert.equal((await api('/signup', { email: 'bad', name: 'X', password: 'short' })).status, 400);
  assert.equal((await api('/signup', { email: address(), name: 'Test', password: '😀'.repeat(30) })).status, 400);
  assert.equal((await api('/otp/verify', { email: address(), challengeId: randomUUID(), code: '123' })).status, 400);
});

test('five wrong attempts lock code; expiry and purpose isolation', async () => {
  const { email } = await register();
  const data = await request('/otp/request', email);
  const wrong = data.code === '000000' ? '111111' : '000000';
  for (let i = 0; i < 5; i++) assert.equal((await api('/otp/verify', { ...data, code: wrong })).status, 400);
  assert.equal((await api('/otp/verify', data)).status, 400);
  await allowResend(email, 'LOGIN');
  const next = await request('/otp/request', email);
  assert.equal((await api('/reset-password', { ...next, password })).status, 400);
  await prisma.emailOtp.update({ where: { email_purpose: { email, purpose: 'LOGIN' } }, data: { expiresAt: new Date(Date.now() - 1000) } });
  assert.equal((await api('/otp/verify', next)).status, 400);
});

test('resend invalidates previous challenge; cooldown and hourly limits survive consumption', async () => {
  const { email } = await register();
  const first = await request('/otp/request', email);
  const limited = await api('/otp/request', { email });
  assert.equal(limited.status, 429); assert.ok(Number(limited.retry) > 0);
  await allowResend(email, 'LOGIN');
  const next = await request('/otp/request', email);
  assert.equal((await api('/otp/verify', first)).status, 400);
  assert.equal((await api('/otp/verify', next)).status, 200);
  await prisma.emailOtp.update({ where: { email_purpose: { email, purpose: 'LOGIN' } }, data: { sendCount: 5, lastSentAt: new Date(Date.now() - 61000) } });
  assert.equal((await api('/otp/request', { email })).status, 429);
});

test('concurrent verification creates exactly one user/session', async () => {
  const email = address();
  const data = await request('/signup', email, { name: 'Test User', password });
  const results = await Promise.all([api('/signup/verify', data), api('/signup/verify', data)]);
  assert.deepEqual(results.map(r => r.status).sort(), [201, 400]);
  assert.equal(await prisma.user.count({ where: { email } }), 1);
});

test('concurrent requests send only one valid challenge', async () => {
  const email = address();
  const results = await Promise.all([api('/signup', { email, name: 'Test', password }), api('/signup', { email, name: 'Test', password })]);
  assert.deepEqual(results.map(r => r.status).sort(), [202, 429]);
});

test('password reset revokes HTTP and WebSocket sessions and all outstanding codes', async () => {
  const { email, cookie, body } = await register();
  const socket = new WebSocket(base.replace('http:', 'ws:'), { headers: { Cookie: cookie } });
  await once(socket, 'message');
  const login = await request('/otp/request', email);
  const reset = await request('/forgot-password', email);
  const result = await api('/reset-password', { ...reset, password: 'a-new-safe-password' });
  assert.equal(result.status, 200);
  assert.equal((await api('/me', undefined, cookie)).status, 401);
  await assert.rejects(verifySessionToken(cookie.slice(6)));
  const closed = once(socket, 'close');
  sendToUser(body.user.id, 'test', {});
  assert.equal((await closed)[0], 1008);
  assert.equal((await api('/signin', { email, password })).status, 400);
  assert.equal((await api('/signin', { email, password: 'a-new-safe-password' })).status, 200);
  assert.equal((await api('/reset-password', { ...reset, password })).status, 400);
  assert.equal((await api('/otp/verify', login)).status, 400);
});

test('legacy unverified account requires ownership and cannot retain an unverified password', async () => {
  const email = address();
  const user = await prisma.user.create({ data: { email, name: 'Legacy', password: await bcrypt.hash(password, 4) } });
  assert.equal((await api('/signin', { email, password })).status, 403);
  await assert.rejects(verifySessionToken(generateToken({ userId: user.id, role: user.role, tokenVersion: 0 })));
  const data = await request('/otp/request', email);
  assert.equal((await api('/otp/verify', data)).status, 200);
  const updated = await prisma.user.findUnique({ where: { email } });
  assert.ok(updated.emailVerifiedAt); assert.equal(updated.password, null);
});

test('unknown email receives generic response without user creation or email', async () => {
  const email = address();
  const result = await request('/forgot-password', email);
  assert.equal(mail.has(email), false);
  assert.equal(await prisma.user.findUnique({ where: { email } }), null);
  assert.equal((await api('/reset-password', { ...result, code: '123456', password })).status, 400);
});

test('email delivery failure invalidates challenge without creating an account', async () => {
  const email = address(); deliveryFails = true;
  assert.equal((await api('/signup', { email, name: 'Test', password })).status, 503);
  const pending = await prisma.emailOtp.findUnique({ where: { email_purpose: { email, purpose: 'SIGNUP' } } });
  assert.equal(pending.codeHash, null); assert.equal(pending.passwordHash, null);
  assert.equal(await prisma.user.findUnique({ where: { email } }), null);
});

test('IP request limit permits exactly 20 requests and supplies Retry-After', async () => {
  for (let i = 0; i < 20; i++) assert.equal((await api('/otp/request', { email: 'invalid' })).status, 400);
  const result = await api('/otp/request', { email: 'invalid' });
  assert.equal(result.status, 429); assert.ok(Number(result.retry) > 0);
});

test('Google rejects unverified email and accepts verified ownership safely', async () => {
  const strategy = require('../dist/config/passport').default._strategy('google');
  function google(email, verified) {
    return new Promise((resolve, reject) => strategy._verify('', '', {
      displayName: 'Google User', emails: [{ value: email }], _json: { email_verified: verified },
    }, (error, user) => error ? reject(error) : resolve(user)));
  }
  const email = address();
  await assert.rejects(google(email, false));
  assert.equal(await prisma.user.findUnique({ where: { email } }), null);
  const result = await google(email, true);
  assert.ok(result.userId);
  assert.ok((await prisma.user.findUnique({ where: { email } })).emailVerifiedAt);
  const legacy = address();
  await prisma.user.create({ data: { email: legacy, name: 'Legacy', password: 'untrusted-hash' } });
  await google(legacy, true);
  assert.equal((await prisma.user.findUnique({ where: { email: legacy } })).password, null);
});

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { bootstrapAdmin, currentUser, login, logout, registerInvestor } from './auth-routes';
import { getSession, requireRole } from './session-auth';
import { db } from './db';

const PORT = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === 'production';

type Json = Record<string, unknown>;

function send(res: ServerResponse, status: number, body: Json, extra: Record<string, string> = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...extra });
  res.end(JSON.stringify(body));
}

function parseCookies(req: IncomingMessage) {
  const out: Record<string, string> = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key) out[key] = decodeURIComponent(rest.join('='));
  }
  return out;
}

async function readJson(req: IncomingMessage): Promise<Json> {
  let data = '';
  for await (const chunk of req) {
    data += chunk;
    if (data.length > 100_000) throw new Error('Request too large.');
  }
  return data ? JSON.parse(data) : {};
}

function sessionCookie(id: string) {
  return `fundora_session=${encodeURIComponent(id)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${isProduction ? '; Secure' : ''}`;
}

function clearSessionCookie() {
  return `fundora_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProduction ? '; Secure' : ''}`;
}

async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': req.headers.origin || '*', 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Methods': 'GET,POST' });
    return res.end();
  }
  res.setHeader('Cache-Control', 'no-store');
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const cookies = parseCookies(req);

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true });

    if (req.method === 'POST' && url.pathname === '/api/auth/register') {
      const body = await readJson(req);
      const user = await registerInvestor(String(body.email || ''), String(body.password || ''));
      return send(res, 201, { user });
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      const body = await readJson(req);
      const role = body.role === 'admin' ? 'admin' : 'investor';
      const session = await login(String(body.email || ''), String(body.password || ''), role);
      return send(res, 200, { user: session.user }, { 'set-cookie': sessionCookie(session.id) });
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
      await logout(cookies.fundora_session);
      return send(res, 200, { ok: true }, { 'set-cookie': clearSessionCookie() });
    }

    if (req.method === 'GET' && url.pathname === '/api/auth/me') {
      const user = await currentUser(cookies.fundora_session);
      return send(res, user ? 200 : 401, user ? { user } : { error: 'Not authenticated.' });
    }

    if (req.method === 'GET' && url.pathname === '/api/admin/dashboard') {
      const admin = await requireRole(cookies.fundora_session, 'admin');
      const [users, deposits, withdrawals, investments] = await Promise.all([
        db.query("select count(*)::int as count from users where role='investor'"),
        db.query("select count(*)::int as count from deposits where status='pending'"),
        db.query("select count(*)::int as count from withdrawals where status='pending'"),
        db.query("select coalesce(sum(amount),0) as total from investments where status in ('pending','active')")
      ]);
      return send(res, 200, { admin, metrics: { investors: users.rows[0].count, pendingDeposits: deposits.rows[0].count, pendingWithdrawals: withdrawals.rows[0].count, investedAmount: investments.rows[0].total } });
    }

    if (req.method === 'POST' && url.pathname === '/api/admin/bootstrap') {
      // Deliberately disabled unless BOOTSTRAP_ADMIN=true is set server-side.
      if (process.env.BOOTSTRAP_ADMIN !== 'true') return send(res, 404, { error: 'Not found.' });
      await bootstrapAdmin();
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { error: 'Not found.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error.';
    const status = message === 'Unauthorized' || message === 'Invalid credentials.' ? 401 : 400;
    return send(res, status, { error: message });
  }
}

createServer(handler).listen(PORT, () => console.log(`Fundora API listening on :${PORT}`));

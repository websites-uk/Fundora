import { useState } from 'react';

type Props = { onSuccess?: () => void };

export default function AdminLogin({ onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Production note: replace this UI-only gate with server-side authentication.
    if (!email || !password) return setError('Enter your admin credentials.');
    onSuccess?.();
  };

  return <main className="admin-login"><div className="admin-login-card"><div className="admin-logo">F</div><p className="eyebrow">Fundora administration</p><h1>Admin sign in</h1><p>Authorized administrators only.</p><form onSubmit={submit}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" /></label>{error && <div className="login-error">{error}</div>}<button className="primary wide">Sign in to admin</button></form></div></main>;
}

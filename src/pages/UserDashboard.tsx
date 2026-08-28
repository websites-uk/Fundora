import { useState } from 'react';
import CopyButton from '../components/CopyButton';
import ThemeToggle from '../components/ThemeToggle';
import { bankDetails } from '../config/bank';

const plans = [
  { name: 'Starter', amount: 10000, duration: '21 days' },
  { name: 'Bronze', amount: 25000, duration: '21 days' },
  { name: 'Silver', amount: 40000, duration: '21 days' },
  { name: 'Premium', amount: 55000, duration: '21 days' },
];
const money = (n: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);

export default function UserDashboard() {
  const [selected, setSelected] = useState<number | null>(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);

  if (!loggedIn) return <main className="auth-shell"><section className="auth-card"><div className="fundora-mark">F</div><p className="eyebrow">Fundora</p><h1>Welcome back</h1><p>Sign in to access your investor dashboard.</p><input placeholder="Email address" type="email"/><input placeholder="Password" type="password"/><button className="primary wide" onClick={()=>setLoggedIn(true)}>Sign in</button><button className="link-btn">Create account</button></section></main>;

  return <main className="user-shell">
    <ThemeToggle />
    <header className="user-top"><div className="brand"><span className="fundora-mark">F</span><div><strong>FUNDORA</strong><small>Investor</small></div></div><button className="logout" onClick={()=>setLoggedIn(false)}>Log out</button></header>
    <section className="hero-banner"><div><span className="hero-kicker">SMARTER MONEY. CLEARER FUTURE.</span><h1>Build your financial future with confidence.</h1><p>Explore investment options, track your portfolio and manage your account from one secure dashboard.</p></div><div className="hero-orb">F</div></section>
    <section className="balance-grid"><article><span>Available balance</span><strong>{money(500000)}</strong><small>Sample account figure</small></article><article><span>Total invested</span><strong>{money(55000)}</strong><small>Portfolio value</small></article></section>
    <section className="section-head"><div><p className="eyebrow">Opportunities</p><h2>Choose an investment plan</h2></div></section>
    <section className="plans">{plans.map((p,i)=><button className={`plan-card ${selected===i?'selected':''}`} key={p.name} onClick={()=>{setSelected(i);setShowDeposit(true)}}><div><span>{p.name}</span><strong>{money(p.amount)}</strong></div><div><small>{p.duration}</small><b>View deposit</b></div></button>)}</section>
    {showDeposit && selected !== null && <section className="deposit-panel"><div className="panel-head"><div><p className="eyebrow">Deposit</p><h2>{plans[selected].name} · {money(plans[selected].amount)}</h2></div><button className="close" onClick={()=>setShowDeposit(false)}>Close</button></div><p>Use the account details below to make your bank transfer. Keep your transfer reference for submission.</p><div className="bank-card"><BankRow label="Account number" value={bankDetails.accountNumber}/><BankRow label="Currency" value={bankDetails.currency}/><BankRow label="Bank name" value={bankDetails.bankName}/><BankRow label="Account name" value={bankDetails.accountName}/></div><label className="reference-field">Transfer reference<input placeholder="Enter transfer reference"/></label><button className="primary wide">Submit deposit for review</button></section>}
    <section className="feature-strip"><div><b>Secure account access</b><span>Sign in and out whenever you need.</span></div><div><b>Simple tracking</b><span>Keep your portfolio information organized.</span></div><div><b>Clear deposit instructions</b><span>Bank-transfer details are shown in one place.</span></div></section>
    <footer>© 2026 Fundora · Investment values and returns are subject to applicable terms and conditions.</footer>
  </main>;
}
function BankRow({label,value}:{label:string,value:string}){return <div className="bank-row"><div><span>{label}</span><strong>{value}</strong></div><CopyButton value={value}/></div>}

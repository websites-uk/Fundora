import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const plans = [
  ['Starter', 10000, '3 weeks'],
  ['Bronze', 25000, '3 weeks'],
  ['Silver', 40000, '3 weeks'],
  ['Premium', 55000, '3 weeks'],
];

function UserDashboard() {
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);
  const [ref, setRef] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectPlan = (plan) => {
    setSelected(plan);
    setSubmitted(false);
    setPage('deposit');
  };

  return (
    <div className="app">
      <header>
        <div className="logo">F</div>
        <div><b>Fundora</b><small>Investor portal</small></div>
        <div className="secure-pill">Secure</div>
      </header>
      <main>
        {page === 'home' && <>
          <section className="hero">
            <span>INVESTOR DASHBOARD</span>
            <h1>Welcome back.</h1>
            <p>View your account, explore available plans and submit funding requests from one mobile workspace.</p>
            <div className="balance"><small>Account balance</small><strong>₦500,000</strong><em>Sample account figure</em></div>
          </section>
          <section className="quick"><div><small>Invested</small><b>₦55,000</b></div><div><small>Available</small><b>₦445,000</b></div></section>
          <section>
            <div className="title"><small>INVESTMENT PLANS</small><h2>Choose a plan</h2></div>
            <div className="plans">{plans.map((p) => <article key={p[1]}><span>{p[0]}</span><h3>₦{p[1].toLocaleString()}</h3><p>{p[2]} · Review all terms and risks before investing.</p><button onClick={() => selectPlan(p)}>View plan</button></article>)}</div>
          </section>
        </>}
        {page === 'deposit' && <section className="page">
          <button className="back" onClick={() => setPage('home')}>← Dashboard</button><small>DEPOSIT</small><h2>Fund your investment</h2>
          <p>Selected plan: <b>{selected?.[0]}</b> — ₦{selected?.[1].toLocaleString()}</p>
          <div className="bank"><b>Bank transfer details</b><span>Bank details will appear here</span><span>Account name will appear here</span><span>Account number will appear here</span></div>
          <label className="field-label">Transfer reference</label><input placeholder="Enter your transfer reference" value={ref} onChange={e => setRef(e.target.value)} />
          <button className="primary" onClick={() => setSubmitted(true)}>Submit deposit</button>
          {submitted && <div className="success">Deposit request received for review.</div>}
        </section>}
        {page === 'activity' && <section className="page"><small>ACTIVITY</small><h2>Transactions</h2><div className="activity-card"><span>Portfolio funding</span><b>₦55,000</b><small>Pending verification</small></div><div className="activity-card"><span>Account created</span><b>Completed</b><small>Investor account</small></div></section>}
      </main>
      <nav><button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}>Home</button><button onClick={() => setPage('home')}>Invest</button><button className={page === 'deposit' ? 'active' : ''} onClick={() => setPage('deposit')}>Deposit</button><button className={page === 'activity' ? 'active' : ''} onClick={() => setPage('activity')}>Activity</button></nav>
    </div>
  );
}

function App() {
  return <UserDashboard />;
}

createRoot(document.getElementById('root')).render(<App />);

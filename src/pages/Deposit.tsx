import CopyButton from '../components/CopyButton';
import { bankDetails } from '../config/bank';

type Props = { amount?: number };

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });

export default function Deposit({ amount = 0 }: Props) {
  const fields = [
    ['Bank name', bankDetails.bankName],
    ['Account name', bankDetails.accountName],
    ['Account number', bankDetails.accountNumber],
    ['Narration', bankDetails.narration],
  ];

  return <main className="deposit-page">
    <header><p className="eyebrow">Fundora</p><h1>Make a deposit</h1><p>Transfer the selected amount to the account below, then submit your transfer reference for review.</p></header>
    {amount > 0 && <div className="deposit-amount"><span>Selected investment</span><strong>{naira.format(amount)}</strong></div>}
    <section className="bank-card">
      <h2>Bank transfer details</h2>
      {fields.map(([label, value]) => <div className="bank-row" key={label}><div><span>{label}</span><strong>{value}</strong></div><CopyButton value={value} /></div>)}
    </section>
    <label className="reference-field">Transfer reference<input placeholder="Enter your transfer reference" /></label>
    <button className="primary wide" type="button">Submit deposit</button>
  </main>;
}

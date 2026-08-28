export default function AdminDashboard() {
  const metrics = [
    ['Platform balance', '₦500,000'],
    ['Invested amount', '₦55,000'],
    ['Registered investors', '0'],
    ['Pending deposits', '0'],
  ];
  return <main className="admin-page"><header className="admin-header"><div><p className="eyebrow">Fundora administration</p><h1>Admin dashboard</h1><p>Manage investor operations, verification and platform settings.</p></div><span className="admin-badge">ADMIN</span></header><section className="admin-metrics">{metrics.map(([label,value])=><article className="admin-metric" key={label}><span>{label}</span><strong>{value}</strong></article>)}</section><section className="admin-controls"><h2>Operations</h2><div className="admin-actions"><button>Users</button><button>Deposits</button><button>Withdrawals</button><button>Investments</button><button>KYC review</button><button>Bank settings</button><button>Transactions</button><button>Audit logs</button></div></section><div className="admin-warning">Administrative access must be enforced by server-side authentication and role-based authorization before production use.</div></main>;
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStatsAPI } from '../../api/adminApi';
import { FiUsers, FiFileText, FiClock, FiDownload } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStatsAPI().then(({ data }) => setStats(data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}><div className="skeleton" style={{ height: 300 }}/></div>;

  const cards = [
    { icon: <FiUsers size={24}/>, label: 'Total Users', value: stats?.stats?.totalUsers || 0, color: 'var(--primary-light)' },
    { icon: <FiFileText size={24}/>, label: 'Total Notes', value: stats?.stats?.totalNotes || 0, color: 'var(--accent)' },
    { icon: <FiClock size={24}/>, label: 'Pending Review', value: stats?.stats?.pendingNotes || 0, color: 'var(--warning)' },
    { icon: <FiDownload size={24}/>, label: 'Total Downloads', value: stats?.stats?.totalDownloads || 0, color: 'var(--success)' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 32 }}>Admin <span className="gradient-text">Dashboard</span></h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 36 }}>
        {cards.map((c, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
            <div><div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{c.value}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.label}</div></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <Link to="/admin/moderate" className="btn-primary" style={{ borderRadius: 50 }}>Moderate Notes ({stats?.stats?.pendingNotes || 0})</Link>
        <Link to="/admin/users" className="btn-secondary" style={{ borderRadius: 50 }}>Manage Users</Link>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Recent Notes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stats?.recentNotes?.map((n) => (
            <Link key={n._id} to={`/notes/${n._id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)', textDecoration: 'none', border: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>by {n.author?.name} — {n.subject}</p>
              </div>
              <span className={`badge badge-${n.status}`}>{n.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

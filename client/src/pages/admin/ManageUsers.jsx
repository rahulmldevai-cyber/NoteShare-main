import { useState, useEffect } from 'react';
import { getAdminUsersAPI, toggleUserStatusAPI } from '../../api/adminApi';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = (q) => {
    setLoading(true);
    getAdminUsersAPI({ search: q, limit: 50 }).then(({ data }) => setUsers(data.data.users)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(''); }, []);

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleUserStatusAPI(id);
      setUsers(users.map((u) => u._id === id ? { ...u, isActive: data.data.user.isActive } : u));
      toast.success(data.message);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 24 }}>Manage <span className="gradient-text">Users</span></h1>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
        <input className="input-field" style={{ paddingLeft: 42 }} placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); fetchUsers(e.target.value); }}/>
      </div>

      {loading ? <div className="skeleton" style={{ height: 300 }}/> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Action'].map((h) => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>{u.name?.charAt(0)}</div>
                    {u.name}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px' }}><span className={`badge ${u.role === 'admin' ? 'badge-approved' : 'badge-pending'}`}>{u.role}</span></td>
                  <td style={{ padding: '14px 16px' }}><span className={`badge ${u.isActive ? 'badge-approved' : 'badge-rejected'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {u.role !== 'admin' && <button onClick={() => handleToggle(u._id)} style={{ padding: '6px 16px', borderRadius: 20, border: 'none', background: u.isActive ? 'var(--danger)' : 'var(--success)', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>{u.isActive ? 'Deactivate' : 'Activate'}</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

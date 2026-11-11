import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMyNotesAPI } from '../api/noteApi';
import NoteCard from '../components/notes/NoteCard';
import { FiUpload, FiFileText, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await getMyNotesAPI({ status: filter || undefined, limit: 50 });
        setNotes(data.data.notes);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchNotes();
  }, [filter]);

  const stats = [
    { icon: <FiFileText size={24} />, label: 'Total Notes', value: notes.length, color: 'var(--primary-light)' },
    { icon: <FiCheckCircle size={24} />, label: 'Approved', value: notes.filter((n) => n.status === 'approved').length, color: 'var(--success)' },
    { icon: <FiClock size={24} />, label: 'Pending', value: notes.filter((n) => n.status === 'pending').length, color: 'var(--warning)' },
    { icon: <FiXCircle size={24} />, label: 'Rejected', value: notes.filter((n) => n.status === 'rejected').length, color: 'var(--danger)' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome back, <span className="gradient-text">{user?.name}</span></h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage your uploaded notes</p>
        </div>
        <Link to="/upload" className="btn-primary" style={{ borderRadius: 50 }}><FiUpload size={18} /> Upload Note</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['', 'approved', 'pending', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 20px', borderRadius: 50, border: `1px solid ${filter === f ? 'var(--primary)' : 'var(--border)'}`, background: filter === f ? 'var(--primary)' : 'transparent', color: filter === f ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'var(--transition)' }}>
            {f ? f.charAt(0).toUpperCase() + f.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 320 }} />)}
        </div>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>📝</p>
          <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No notes yet</p>
          <p style={{ fontSize: '0.9rem', marginBottom: 24 }}>Upload your first note to get started</p>
          <Link to="/upload" className="btn-primary" style={{ borderRadius: 50 }}>Upload Note</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {notes.map((note) => <NoteCard key={note._id} note={note} />)}
        </div>
      )}
    </div>
  );
}

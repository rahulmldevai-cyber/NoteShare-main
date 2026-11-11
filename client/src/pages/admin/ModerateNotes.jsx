import { useState, useEffect } from 'react';
import { getPendingNotesAPI, approveNoteAPI, rejectNoteAPI } from '../../api/adminApi';
import { FiCheck, FiX, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ModerateNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    getPendingNotesAPI({ limit: 50 }).then(({ data }) => setNotes(data.data.notes)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveNoteAPI(id);
      setNotes(notes.filter((n) => n._id !== id));
      toast.success('Note approved!');
    } catch { toast.error('Failed'); }
  };

  const handleReject = async () => {
    if (!reason.trim()) return toast.error('Please provide a reason');
    try {
      await rejectNoteAPI(rejectId, reason);
      setNotes(notes.filter((n) => n._id !== rejectId));
      setRejectId(null); setReason('');
      toast.success('Note rejected');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}><div className="skeleton" style={{ height: 400 }}/></div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 32 }}>Moderate <span className="gradient-text">Notes</span></h1>

      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>✅</p><p>No pending notes to review!</p>
        </div>
      ) : notes.map((n) => (
        <div key={n._id} className="card" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{n.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{n.subject} • {n.course} • Sem {n.semester}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>By {n.author?.name} ({n.author?.email})</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href={n.fileUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}><FiExternalLink size={14}/> View</a>
            <button onClick={() => handleApprove(n._id)} className="btn-success" style={{ padding: '8px 14px', fontSize: '0.8rem' }}><FiCheck size={14}/> Approve</button>
            <button onClick={() => setRejectId(n._id)} className="btn-danger" style={{ padding: '8px 14px', fontSize: '0.8rem' }}><FiX size={14}/> Reject</button>
          </div>
        </div>
      ))}

      {/* Reject Modal */}
      {rejectId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }} onClick={() => setRejectId(null)}>
          <div className="card" style={{ maxWidth: 440, width: '100%', padding: 28 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Rejection Reason</h3>
            <textarea className="input-field" rows={3} placeholder="Why is this note being rejected?" value={reason} onChange={(e) => setReason(e.target.value)} style={{ marginBottom: 16 }}/>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectId(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleReject} className="btn-danger">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

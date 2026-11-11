import { useState, useEffect } from 'react';
import { getBookmarksAPI } from '../api/noteApi';
import NoteCard from '../components/notes/NoteCard';

export default function Bookmarks() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookmarksAPI({ limit: 50 }).then(({ data }) => setNotes(data.data.notes)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>My <span className="gradient-text">Bookmarks</span></h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Notes you've saved for later</p>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 320 }}/>)}
        </div>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🔖</p>
          <p>No bookmarks yet. Save notes you want to revisit!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {notes.map((n) => <NoteCard key={n._id} note={n}/>)}
        </div>
      )}
    </div>
  );
}

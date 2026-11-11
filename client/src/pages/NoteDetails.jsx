import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getNoteAPI, getCommentsAPI, addCommentAPI, downloadNoteAPI, rateNoteAPI, getRatingsAPI, toggleBookmarkAPI, checkBookmarkAPI } from '../api/noteApi';
import StarRating from '../components/notes/StarRating';
import { FiDownload, FiBookmark, FiEye, FiCalendar, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function NoteDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const [note, setNote] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [nr, cr] = await Promise.all([getNoteAPI(id), getCommentsAPI(id, { limit: 30 })]);
        setNote(nr.data.data.note);
        setComments(cr.data.data.comments);
        if (isAuthenticated) {
          const [rr, br] = await Promise.all([getRatingsAPI(id), checkBookmarkAPI(id)]);
          setUserRating(rr.data.data.userRating || 0);
          setBookmarked(br.data.data.bookmarked);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [id, isAuthenticated]);

  const handleDownload = async () => {
    try {
      const { data } = await downloadNoteAPI(id);
      window.open(data.data.downloadUrl, '_blank');
    } catch { toast.error('Download failed'); }
  };

  const handleRate = async (v) => {
    if (!isAuthenticated) return toast.error('Login to rate');
    try { await rateNoteAPI(id, v); setUserRating(v); toast.success('Rated!'); } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) return toast.error('Login to bookmark');
    try { const { data } = await toggleBookmarkAPI(id); setBookmarked(data.data.bookmarked); } catch { toast.error('Failed'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await addCommentAPI(id, { content: newComment });
      setComments([data.data.comment, ...comments]);
      setNewComment('');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}><div className="skeleton" style={{ height: 400 }} /></div>;
  if (!note) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>Note not found</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <div className="animate-fade-in-up">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <span className="badge badge-approved">{note.subject}</span>
          <span style={{ padding: '4px 14px', borderRadius: 20, background: 'rgba(0,206,201,0.15)', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>{note.course} - Sem {note.semester}</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>{note.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {note.author && <span>By <strong style={{ color: 'var(--text-primary)' }}>{note.author.name}</strong></span>}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiCalendar size={14}/> {new Date(note.createdAt).toLocaleDateString()}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiEye size={14}/> {note.viewCount} views</span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={handleDownload} className="btn-primary" style={{ borderRadius: 50 }}><FiDownload size={18}/> Download ({note.downloadCount || 0})</button>
          <button onClick={handleBookmark} className="btn-secondary" style={{ borderRadius: 50, color: bookmarked ? 'var(--warning)' : undefined, borderColor: bookmarked ? 'var(--warning)' : undefined }}><FiBookmark size={18}/> {bookmarked ? 'Saved' : 'Save'}</button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarRating rating={userRating || Math.round(note.averageRating)} onRate={handleRate} size={22} readonly={!isAuthenticated}/>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({note.totalRatings})</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Description</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{note.description}</p>
          {note.tags?.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>{note.tags.map((t,i) => <span key={i} style={{ padding: '4px 12px', borderRadius: 20, background: 'var(--bg-primary)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>#{t}</span>)}</div>}
        </div>

        {note.fileType === 'pdf' && <div className="card" style={{ marginBottom: 32 }}><iframe src={note.fileUrl} style={{ width: '100%', height: 500, border: 'none', borderRadius: 'var(--radius)' }} title="Preview"/></div>}
        {note.fileType === 'image' && <div className="card" style={{ marginBottom: 32, textAlign: 'center' }}><img src={note.fileUrl} alt={note.title} style={{ maxWidth: '100%', borderRadius: 'var(--radius)' }}/></div>}

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Comments ({comments.length})</h3>
          {isAuthenticated && <form onSubmit={handleComment} style={{ display: 'flex', gap: 12, marginBottom: 24 }}><input className="input-field" placeholder="Write a comment..." value={newComment} onChange={(e)=>setNewComment(e.target.value)} style={{ flex: 1 }}/><button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: 50 }}><FiSend size={16}/></button></form>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comments.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>No comments yet</p> : comments.map((c) => (
              <div key={c._id} style={{ padding: 16, background: 'var(--bg-primary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>{c.author?.name?.charAt(0)}</div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.author?.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

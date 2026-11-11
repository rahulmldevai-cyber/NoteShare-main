import { Link } from 'react-router-dom';
import { FiDownload, FiEye, FiBookmark } from 'react-icons/fi';
import StarRating from './StarRating';

export default function NoteCard({ note }) {
  const fileIcon = note.fileType === 'pdf' ? '📄' : note.fileType === 'image' ? '🖼️' : '📝';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
      {/* Status badge */}
      {note.status && note.status !== 'approved' && (
        <span className={`badge badge-${note.status}`} style={{ position: 'absolute', top: 16, right: 16 }}>{note.status}</span>
      )}

      {/* Thumbnail / Icon */}
      <Link to={`/notes/${note._id}`} style={{ textDecoration: 'none' }}>
        <div style={{ height: 140, borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, rgba(108,92,231,0.1) 0%, rgba(0,206,201,0.1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, marginBottom: 4 }}>
          {note.thumbnailUrl ? (
            <img src={note.thumbnailUrl} alt={note.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
          ) : fileIcon}
        </div>

        {/* Content */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{note.title}</h3>
      </Link>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(108,92,231,0.15)', color: 'var(--primary-light)', fontSize: '0.75rem', fontWeight: 600 }}>{note.subject}</span>
        <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(0,206,201,0.15)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600 }}>Sem {note.semester}</span>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{note.description}</p>

      {/* Stats Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <StarRating rating={Math.round(note.averageRating)} readonly size={14} />
        <div style={{ display: 'flex', gap: 12, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiEye size={14} /> {note.viewCount || 0}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiDownload size={14} /> {note.downloadCount || 0}</span>
        </div>
      </div>

      {/* Author */}
      {note.author && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 700 }}>
            {note.author.name?.charAt(0).toUpperCase()}
          </div>
          {note.author.name}
        </div>
      )}
    </div>
  );
}

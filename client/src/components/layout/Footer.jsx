export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>📚</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Note<span style={{ color: 'var(--primary-light)' }}>Share</span></span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Share knowledge, ace your exams.</p>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="/search" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Browse Notes</a>
              <a href="/upload" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Upload Notes</a>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Privacy Policy</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Terms of Service</span>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', textAlign: 'center', paddingTop: 20, borderTop: '1px solid var(--border)', marginTop: 10 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>© {new Date().getFullYear()} NoteShare. Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
}

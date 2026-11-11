import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUpload, FiSearch, FiStar, FiShield, FiDownload, FiUsers } from 'react-icons/fi';

export default function Home() {
  const { isAuthenticated } = useSelector((s) => s.auth);

  const features = [
    { icon: <FiUpload size={28} />, title: 'Upload & Share', desc: 'Share your lecture notes, summaries, and study guides with students across your university.' },
    { icon: <FiSearch size={28} />, title: 'Smart Search', desc: 'Find notes by subject, course, semester, or keywords with our powerful search engine.' },
    { icon: <FiStar size={28} />, title: 'Rate & Review', desc: 'Help the community by rating notes and leaving helpful comments for fellow students.' },
    { icon: <FiShield size={28} />, title: 'Quality Assured', desc: 'All notes are reviewed by admin moderators to ensure high-quality, accurate content.' },
    { icon: <FiDownload size={28} />, title: 'Easy Downloads', desc: 'Download PDFs, images, and documents instantly. Access notes anytime, anywhere.' },
    { icon: <FiUsers size={28} />, title: 'Community Driven', desc: 'Join thousands of students collaborating and sharing knowledge across courses.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', top: -200, left: -200, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -200, right: -200, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,206,201,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="animate-fade-in-up" style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 50, background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.2)', marginBottom: 28, fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 600 }}>
            🎓 Built for College Students
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            Share Notes,<br /><span className="gradient-text">Ace Your Exams</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
            The ultimate platform for college students to upload, discover, and download academic notes. Collaborate, rate, and build a knowledge library together.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem', borderRadius: 50 }}>Go to Dashboard</Link>
                <Link to="/search" className="btn-secondary" style={{ padding: '14px 36px', fontSize: '1rem', borderRadius: 50 }}>Browse Notes</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem', borderRadius: 50 }}>Get Started Free</Link>
                <Link to="/search" className="btn-secondary" style={{ padding: '14px 36px', fontSize: '1rem', borderRadius: 50 }}>Browse Notes</Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 64, flexWrap: 'wrap' }}>
            {[{ value: '10K+', label: 'Notes Shared' }, { value: '5K+', label: 'Students' }, { value: '500+', label: 'Courses' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 900 }}>{s.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Why <span className="gradient-text">NoteShare</span>?</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48, maxWidth: 500, margin: '0 auto 48px' }}>Everything you need to supercharge your studies</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, animationDelay: `${i * 0.1}s` }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(108,92,231,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Ready to <span className="gradient-text">get started</span>?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Join the community and start sharing knowledge today.</p>
          <Link to={isAuthenticated ? '/upload' : '/register'} className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.05rem', borderRadius: 50 }}>
            {isAuthenticated ? 'Upload Your First Note' : 'Create Free Account'}
          </Link>
        </div>
      </section>
    </div>
  );
}

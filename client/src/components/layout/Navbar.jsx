import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { FiSearch, FiBell, FiMenu, FiX, FiUpload, FiUser, FiLogOut, FiBookmark, FiShield } from 'react-icons/fi';
import { getNotificationsAPI, markNotificationsReadAPI } from '../../api/noteApi';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      getNotificationsAPI({ limit: 5 }).then(({ data }) => {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMenuOpen(false);
  };

  const markRead = async () => {
    await markNotificationsReadAPI([]);
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(15, 15, 35, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📚</div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>Note<span style={{ color: 'var(--primary-light)' }}>Share</span></span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480, margin: '0 32px', display: 'flex' }} className="search-form-desktop">
          <div style={{ position: 'relative', width: '100%' }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
            <input type="text" placeholder="Search notes, subjects, courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field" style={{ paddingLeft: 42, borderRadius: 50, height: 44, fontSize: '0.9rem' }} />
          </div>
        </form>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isAuthenticated ? (
            <>
              <Link to="/upload" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem', borderRadius: 50 }}>
                <FiUpload size={16} /> Upload
              </Link>

              {/* Notifications */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markRead(); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 8, position: 'relative' }}>
                  <FiBell size={22} />
                  {unreadCount > 0 && <span style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'var(--danger)', color: 'white', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unreadCount}</span>}
                </button>
                {notifOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, width: 340, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.95rem' }}>Notifications</div>
                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>No notifications</div>
                      ) : notifications.map((n) => (
                        <Link key={n._id} to={n.note ? `/notes/${n.note}` : '#'} onClick={() => setNotifOpen(false)} style={{ display: 'block', padding: '12px 20px', borderBottom: '1px solid var(--border)', background: n.isRead ? 'transparent' : 'rgba(108,92,231,0.05)', textDecoration: 'none', transition: 'var(--transition)' }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{n.message}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                        </Link>
                      ))}
                    </div>
                    <Link to="/notifications" onClick={() => setNotifOpen(false)} style={{ display: 'block', padding: '12px 20px', textAlign: 'center', fontSize: '0.85rem', borderTop: '1px solid var(--border)' }}>View all</Link>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
                {menuOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, width: 220, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}><FiUser size={16} /> Dashboard</Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}><FiUser size={16} /> Profile</Link>
                    <Link to="/bookmarks" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}><FiBookmark size={16} /> Bookmarks</Link>
                    {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}><FiShield size={16} /> Admin Panel</Link>}
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', color: 'var(--danger)', background: 'none', border: 'none', borderTop: '1px solid var(--border)', width: '100%', cursor: 'pointer', fontSize: '0.9rem' }}><FiLogOut size={16} /> Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', borderRadius: 50 }}>Sign Up</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 8 }} className="mobile-menu-btn">
            {mobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

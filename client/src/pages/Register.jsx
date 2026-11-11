import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerAction, clearError } from '../store/authSlice';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBook } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', university: '' });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(registerAction(form));
    if (registerAction.fulfilled.match(result)) toast.success('Account created!');
    else toast.error(result.payload || 'Registration failed');
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: <FiUser />, placeholder: 'Rahul Kumar', required: true },
    { name: 'email', label: 'Email', type: 'email', icon: <FiMail />, placeholder: 'you@university.edu', required: true },
    { name: 'university', label: 'University (Optional)', type: 'text', icon: <FiBook />, placeholder: 'Your University', required: false },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 24 }}>
            <span style={{ fontSize: 32 }}>📚</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Note<span style={{ color: 'var(--primary-light)' }}>Share</span></span>
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join the student community</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {fields.map((f) => (
              <div key={f.name}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{f.icon}</span>
                  <input type={f.type} required={f.required} className="input-field" style={{ paddingLeft: 42 }} placeholder={f.placeholder} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                </div>
              </div>
            ))}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} required className="input-field" style={{ paddingLeft: 42, paddingRight: 42 }} placeholder="Min. 8 characters (Aa1)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>Must include uppercase, lowercase, and a number</p>
            </div>

            {error && <div style={{ padding: '10px 16px', borderRadius: 'var(--radius)', background: 'rgba(225,112,85,0.1)', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: 14, borderRadius: 'var(--radius)', opacity: loading ? 0.7 : 1, fontSize: '1rem' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

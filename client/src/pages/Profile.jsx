import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../store/authSlice';
import { updateProfileAPI, changePasswordAPI } from '../api/noteApi';
import { FiUser, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', university: user?.university || '', bio: user?.bio || '', courses: user?.courses?.join(', ') || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('profile');

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileAPI({ ...form, courses: form.courses.split(',').map((c) => c.trim()).filter(Boolean) });
      dispatch(loadUser());
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSaving(false);
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await changePasswordAPI(passForm);
      toast.success('Password changed!');
      setPassForm({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{user?.name?.charAt(0)}</div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['profile', 'password'].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 50, border: `1px solid ${tab === t ? 'var(--primary)' : 'var(--border)'}`, background: tab === t ? 'var(--primary)' : 'transparent', color: tab === t ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>{t === 'profile' ? 'Edit Profile' : 'Change Password'}</button>
        ))}
      </div>

      {tab === 'profile' ? (
        <form onSubmit={handleProfile} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 28 }}>
          {[{ name: 'name', label: 'Full Name' }, { name: 'university', label: 'University' }, { name: 'courses', label: 'Courses (comma separated)' }].map((f) => (
            <div key={f.name}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>{f.label}</label>
              <input className="input-field" value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Bio</label>
            <textarea className="input-field" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn-primary" disabled={saving} style={{ borderRadius: 'var(--radius)' }}><FiSave size={16}/> {saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      ) : (
        <form onSubmit={handlePassword} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 28 }}>
          <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Current Password</label><input type="password" className="input-field" required value={passForm.currentPassword} onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}/></div>
          <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>New Password</label><input type="password" className="input-field" required value={passForm.newPassword} onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}/><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>Min 8 chars, uppercase + lowercase + number</p></div>
          <button type="submit" className="btn-primary" style={{ borderRadius: 'var(--radius)' }}>Change Password</button>
        </form>
      )}
    </div>
  );
}

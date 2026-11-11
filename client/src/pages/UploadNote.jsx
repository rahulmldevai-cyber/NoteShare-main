import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createNoteAPI } from '../api/noteApi';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UploadNote() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', subject: '', course: '', semester: '', university: user?.university || '', tags: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png', '.webp'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    onDrop: (accepted) => { if (accepted.length) setFile(accepted[0]); },
    onDropRejected: (rejected) => {
      const err = rejected[0]?.errors[0];
      toast.error(err?.message || 'File rejected');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please upload a file');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append('file', file);
      await createNoteAPI(formData);
      toast.success('Note uploaded! Pending admin approval.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
    setLoading(false);
  };

  const fields = [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'e.g., Data Structures Unit 1 Notes', required: true },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g., Data Structures', required: true },
    { name: 'course', label: 'Course', type: 'text', placeholder: 'e.g., B.Tech CSE', required: true },
    { name: 'semester', label: 'Semester', type: 'number', placeholder: '1-8', required: true },
    { name: 'university', label: 'University', type: 'text', placeholder: 'Your university', required: false },
    { name: 'tags', label: 'Tags (comma separated)', type: 'text', placeholder: 'algorithms, trees, sorting', required: false },
  ];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Upload <span className="gradient-text">Notes</span></h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Share your knowledge with fellow students</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Dropzone */}
        <div {...getRootProps()} style={{ padding: 40, border: `2px dashed ${isDragActive ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', textAlign: 'center', cursor: 'pointer', background: isDragActive ? 'rgba(108,92,231,0.05)' : 'var(--bg-card)', transition: 'var(--transition)' }}>
          <input {...getInputProps()} />
          {file ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <FiFile size={24} style={{ color: 'var(--primary-light)' }} />
              <div>
                <p style={{ fontWeight: 600 }}>{file.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
          ) : (
            <>
              <FiUploadCloud size={40} style={{ color: 'var(--primary-light)', marginBottom: 12 }} />
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Drag & drop your file here</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>PDF, Images, DOCX — Max 10MB</p>
            </>
          )}
        </div>

        {/* Form Fields */}
        {fields.map((f) => (
          <div key={f.name}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>{f.label}</label>
            <input type={f.type} className="input-field" placeholder={f.placeholder} required={f.required} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} min={f.type === 'number' ? 1 : undefined} max={f.type === 'number' ? 8 : undefined} />
          </div>
        ))}

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Description</label>
          <textarea className="input-field" rows={4} required placeholder="Describe the content of your notes..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: 14, borderRadius: 'var(--radius)', opacity: loading ? 0.7 : 1, fontSize: '1rem' }}>
          {loading ? 'Uploading...' : 'Upload Note'}
        </button>
      </form>
    </div>
  );
}

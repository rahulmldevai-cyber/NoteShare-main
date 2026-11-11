import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, setFilters } from '../store/noteSlice';
import NoteCard from '../components/notes/NoteCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function SearchResults() {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const { notes, pagination, loading, filters } = useSelector((s) => s.notes);
  const [showFilters, setShowFilters] = useState(false);
  const q = params.get('q') || '';

  useEffect(() => {
    dispatch(setFilters({ search: q }));
    dispatch(fetchNotes({ ...filters, search: q }));
  }, [q]);

  const handleFilter = () => {
    dispatch(fetchNotes(filters));
    setShowFilters(false);
  };

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Electronics', 'English', 'Data Structures', 'Algorithms', 'DBMS', 'OS'];
  const sorts = [{ value: 'latest', label: 'Latest' }, { value: 'popular', label: 'Most Downloaded' }, { value: 'rating', label: 'Highest Rated' }];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{q ? <>Results for "<span className="gradient-text">{q}</span>"</> : 'Browse Notes'}</h1>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}><FiFilter size={16}/> Filters</button>
      </div>

      {showFilters && (
        <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Subject</label>
            <select className="input-field" value={filters.subject} onChange={(e) => dispatch(setFilters({ subject: e.target.value }))}>
              <option value="">All Subjects</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Semester</label>
            <select className="input-field" value={filters.semester} onChange={(e) => dispatch(setFilters({ semester: e.target.value }))}>
              <option value="">All</option>
              {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Sort By</label>
            <select className="input-field" value={filters.sort} onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}>
              {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <button onClick={handleFilter} className="btn-primary" style={{ padding: '12px 24px' }}>Apply</button>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton" style={{ height: 320 }}/>)}
        </div>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
          <p style={{ fontSize: '1.1rem' }}>No notes found</p>
          <p style={{ fontSize: '0.9rem', marginTop: 8 }}>Try different search terms or filters</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.9rem' }}>{pagination?.total || notes.length} notes found</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {notes.map((n) => <NoteCard key={n._id} note={n}/>)}
          </div>
          {pagination && pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} onClick={() => dispatch(fetchNotes({ ...filters, page: i + 1 }))} style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${pagination.page === i + 1 ? 'var(--primary)' : 'var(--border)'}`, background: pagination.page === i + 1 ? 'var(--primary)' : 'transparent', color: pagination.page === i + 1 ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, transition: 'var(--transition)' }}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

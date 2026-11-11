import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} /></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
}

export function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

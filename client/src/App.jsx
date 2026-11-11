import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './store/authSlice';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadNote from './pages/UploadNote';
import NoteDetails from './pages/NoteDetails';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/admin/AdminDashboard';
import ModerateNotes from './pages/admin/ModerateNotes';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) dispatch(loadUser());
    else dispatch({ type: 'auth/loadUser/rejected' });
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A2E', color: '#E8E8F0', border: '1px solid #2A2A4A' } }} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/notes/:id" element={<NoteDetails />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadNote /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/moderate" element={<AdminRoute><ModerateNotes /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        </Route>
        <Route path="*" element={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}><h1 style={{ fontSize: '4rem', fontWeight: 900 }} className="gradient-text">404</h1><p style={{ color: 'var(--text-muted)' }}>Page not found</p></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

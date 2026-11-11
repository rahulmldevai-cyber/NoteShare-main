import API from './axiosInstance';

export const getAdminStatsAPI = () => API.get('/admin/stats');
export const getPendingNotesAPI = (params) => API.get('/admin/notes/pending', { params });
export const approveNoteAPI = (id) => API.put(`/admin/notes/${id}/approve`);
export const rejectNoteAPI = (id, reason) => API.put(`/admin/notes/${id}/reject`, { reason });
export const forceDeleteNoteAPI = (id) => API.delete(`/admin/notes/${id}`);
export const getAdminUsersAPI = (params) => API.get('/admin/users', { params });
export const toggleUserStatusAPI = (id) => API.put(`/admin/users/${id}/toggle`);

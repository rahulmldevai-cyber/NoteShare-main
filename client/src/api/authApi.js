import API from './axiosInstance';

export const loginAPI = (data) => API.post('/auth/login', data);
export const registerAPI = (data) => API.post('/auth/register', data);
export const logoutAPI = () => API.post('/auth/logout');
export const getMeAPI = () => API.get('/auth/me');
export const refreshTokenAPI = () => API.post('/auth/refresh');

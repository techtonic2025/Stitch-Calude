import axios from 'axios';

const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || ''}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }).then((r) => r.data),
};

export const coursesApi = {
  list: (params?: { category?: string; level?: string; search?: string }) =>
    api.get('/courses', { params }).then((r) => r.data),
  get: (slug: string) => api.get(`/courses/${slug}`).then((r) => r.data),
};

export const usersApi = {
  me: () => api.get('/users/me').then((r) => r.data),
  myEnrollments: () => api.get('/users/me/enrollments').then((r) => r.data),
};

export const paymentsApi = {
  checkout: (courseId: string) =>
    api.post('/payments/checkout', { courseId }).then((r) => r.data),
  confirm: (courseId: string) =>
    api.post('/payments/confirm', { courseId }).then((r) => r.data),
};

export default api;

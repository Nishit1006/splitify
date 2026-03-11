import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — redirect on 401
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            const skipRedirect = [
                '/users/login',
                '/users/register',
                '/users/verify-email-otp',
                '/users/me',
                '/invitations/accept',
                '/invitations/reject',
            ].some((path) => error.config.url?.includes(path));
            if (!skipRedirect) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

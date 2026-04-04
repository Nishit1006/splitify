import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Make sure we don't try to refresh if the refresh itself failed, or if it's a login attempt
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== '/users/login' &&
            originalRequest.url !== '/users/refresh-token'
        ) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/users/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
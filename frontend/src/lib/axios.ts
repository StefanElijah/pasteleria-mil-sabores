import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(undefined);
    });
    failedQueue = [];
};

api.interceptors.request.use((config) => config);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequest | undefined;
        const url = originalRequest?.url || '';

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/me')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
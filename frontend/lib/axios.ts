import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  console.log('🟢 Axios request interceptor – token:', token);
    if (token) {
      if (!config.headers) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config.headers = {} as any;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Detailed logging for debugging
    console.error('🔴 Axios intercept error:', {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response?.data,
    });

    // Detect network errors (no response received)
    if (!error.response) {
      console.warn('Network error – check your connection or server.');
    } else if (error.response?.status === 401) {
      // Unauthorized – clear stored token
      localStorage.removeItem('token');
      // Redirect to login page for re-authentication
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Simple one‑time retry for transient failures
    const config = error.config;
    if (config && !config.__retry) {
      config.__retry = true;
      return axiosInstance.request(config);
    }

    return Promise.reject(error);
  }
);

export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
};

export default axiosInstance;
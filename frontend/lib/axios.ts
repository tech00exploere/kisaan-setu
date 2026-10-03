import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        try {
          const authStore = localStorage.getItem("super-mandi-auth");
          if (authStore) {
            const parsed = JSON.parse(authStore);
            token = parsed?.state?.token || null;
          }
        } catch {
          // Ignore parsing errors
        }
      }

      if (token) {
        if (!config.headers) {
          config.headers = {} as any;
        }
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
    console.error("🔴 Axios intercept error:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });

    if (!error.response) {
      console.warn("Network error – check connection or Spring Boot server.");
    } else if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const getUserRole = (): string | null => {
  if (typeof window === "undefined") return null;
  let token = localStorage.getItem("token") || localStorage.getItem("authToken");
  if (!token) {
    try {
      const authStore = localStorage.getItem("super-mandi-auth");
      if (authStore) {
        const parsed = JSON.parse(authStore);
        token = parsed?.state?.token || null;
      }
    } catch {
      return null;
    }
  }
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
};

export default axiosInstance;
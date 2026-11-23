import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ═══════════════════════════════════════════════════════════
//  CONSTANTES
// ═══════════════════════════════════════════════════════════

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const ACCESS_TOKEN_KEY = "rrhh_access_token";
const REFRESH_TOKEN_KEY = "rrhh_refresh_token";

// ═══════════════════════════════════════════════════════════
//  HELPERS DE TOKEN
// ═══════════════════════════════════════════════════════════

export const tokenStorage = {
  getAccess: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefresh: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  set: (access: string, refresh: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// ═══════════════════════════════════════════════════════════
//  INSTANCIA DE AXIOS
// ═══════════════════════════════════════════════════════════

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// ═══════════════════════════════════════════════════════════
//  INTERCEPTOR DE REQUEST: inyectar token
// ═══════════════════════════════════════════════════════════

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccess();

    // Endpoints que NO deben llevar Authorization
    const url = config.url || "";
    const isAuthEndpoint =
      url.includes("/auth/login/") ||
      url.includes("/auth/refresh/") ||
      url.includes("/auth/verify/") ||
      url.includes("/auth/logout/");

    if (token && config.headers && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ═══════════════════════════════════════════════════════════
//  INTERCEPTOR DE RESPONSE: refresh automático
// ═══════════════════════════════════════════════════════════

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const url = original.url || "";
    const isAuthEndpoint =
      url.includes("/auth/login/") ||
      url.includes("/auth/refresh/") ||
      url.includes("/auth/verify/") ||
      url.includes("/auth/logout/");

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      if (typeof window === "undefined") return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (original.headers) {
            original.headers.Authorization = `Bearer ${token}`;
          }
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refresh = tokenStorage.getRefresh();
        if (!refresh) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh,
        });

        const newAccess = data.access;
        const newRefresh = data.refresh || refresh;

        tokenStorage.set(newAccess, newRefresh);
        processQueue(null, newAccess);

        if (original.headers) {
          original.headers.Authorization = `Bearer ${newAccess}`;
        }
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ═══════════════════════════════════════════════════════════
//  EXTRACTOR DE MENSAJES DE ERROR
// ═══════════════════════════════════════════════════════════

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;

    if (!data) return error.message;

    if (typeof data.detail === "string") return data.detail;

    // DRF: { "campo": ["error1", "error2"] }
    const firstKey = Object.keys(data)[0];
    const firstValue = data[firstKey];
    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return `${firstKey}: ${firstValue[0]}`;
    }
    if (typeof firstValue === "string") {
      return `${firstKey}: ${firstValue}`;
    }

    return "Error en la solicitud.";
  }

  if (error instanceof Error) return error.message;
  return "Error desconocido.";
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
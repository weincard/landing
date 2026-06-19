import axios from "axios";

const TOKEN_KEY = "wc_access_token";

// .trim() guards against stray whitespace in the env value (a trailing space or
// inline comment in .env would otherwise corrupt every request URL).
export const honoClient = axios.create({
  baseURL: (
    import.meta.env.VITE_HONO_API_BASE_URL ??
    "https://i44j0udx07.execute-api.us-east-2.amazonaws.com"
  ).trim(),
});

honoClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

honoClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.replace("/registro");
    }
    return Promise.reject(err);
  }
);

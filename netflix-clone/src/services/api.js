import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const INDIA = "IN";
export const US = "US";

export const DEFAULT_LANGUAGE = "en-US";

export const INDIAN_LANGUAGES =
  "hi|kn|ta|te|ml|bn|mr|gu|pa";

const EMPTY_RESPONSE = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

/* =========================================================
   AXIOS
========================================================= */

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15000,

  headers: {
    Accept: "application/json",
  },
});

/* =========================================================
   API KEY CHECK
========================================================= */

if (!TMDB_API_KEY) {
  console.error(
    "TMDB API key is missing. Add VITE_TMDB_API_KEY to .env"
  );
}

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

api.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,

      api_key: TMDB_API_KEY,
    };

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    if (import.meta.env.DEV) {
      console.error("TMDB API ERROR:", {
        status,
        message:
          data?.status_message ||
          error.message,
        url: error?.config?.url,
        method:
          error?.config?.method?.toUpperCase(),
      });
    }

    if (status === 401) {
      error.userMessage =
        "TMDB authentication failed. Check your API key.";
    } else if (status === 403) {
      error.userMessage =
        "TMDB denied access to this resource.";
    } else if (status === 404) {
      error.userMessage =
        "The requested movie or TV show was not found.";
    } else if (status === 429) {
      error.userMessage =
        "Too many requests. Please try again later.";
    } else if (status >= 500) {
      error.userMessage =
        "TMDB is temporarily unavailable.";
    } else if (
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT"
    ) {
      error.userMessage =
        "TMDB request timed out.";
    } else if (!error.response) {
      error.userMessage =
        "Network error. Check your internet connection.";
    } else {
      error.userMessage =
        data?.status_message ||
        error.message ||
        "Something went wrong.";
    }

    return Promise.reject(error);
  }
);

export default api;
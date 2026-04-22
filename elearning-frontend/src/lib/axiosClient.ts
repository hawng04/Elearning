import axios from "axios";

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in the headers
axiosClient.interceptors.request.use(
  (config) => {
    let token = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosClient.interceptors.response.use(
    (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
// setupAxios.ts
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:18080';
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

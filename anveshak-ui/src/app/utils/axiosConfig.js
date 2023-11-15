import axios from 'axios';

let apiBaseURL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:6776/api/'

const instance = axios.create({
    baseURL: apiBaseURL,
});
instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default instance;

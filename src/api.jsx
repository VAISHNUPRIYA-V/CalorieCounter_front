import axios from 'axios';
const backend_url = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = `${backend_url}/api`; 

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized. Redirecting to login...');
            localStorage.removeItem('jwt_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export const auth = {
    register: (userData) => api.post('/auth/register', userData),
    login: ({ username, password }) =>
        api.post('/auth/login', {
            userName: username,
            password: password,
        }),
};


export const foods = {
    getAll: () => api.get('/foods'),
    getById: (id) => api.get(`/foods/${id}`),
    add: (foodData) => api.post('/foods', foodData),
};


export const meals = {
    log: (mealData) => api.post('/meals', mealData),
    getDaily: (date) => api.get(`/meals/daily/${date}`),
    update: (id, mealData) => api.put(`/meals/${id}`, mealData),
    delete: (id) => api.delete(`/meals/${id}`),
};

export default api;

import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials)
};

// Task API
export const taskAPI = {
    getAllTasks: () => api.get('/tasks'),
    getTasksByStatus: (status) => api.get(`/tasks?status=${status}`),
    getTasksByPriority: (priority) => api.get(`/tasks?priority=${priority}`),
    createTask: (taskData) => api.post('/tasks', taskData),
    updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
    toggleTask: (id) => api.patch(`/tasks/${id}/toggle`),
    deleteTask: (id) => api.delete(`/tasks/${id}`)
};

export default api;

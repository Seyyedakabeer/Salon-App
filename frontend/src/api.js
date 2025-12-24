import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

export const login = (data) => api.post('/login', data);
export const signup = (data) => api.post('/signup', data);
export const getSlots = () => api.get('/get_slots');
export const bookAppointment = (data) => api.post('/book_appointment', data);
export const getMyBookings = (userId) => api.get(`/mybookings/${userId}`);
export const getDashboardStats = (userId) => api.get(`/user_dashboard/${userId}`);
export const getAdminData = () => api.get('/admin_dashboard');
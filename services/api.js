import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from '../services/authStorge'; 


const API_BASE_URL = 'http://172.20.10.2:3000/students';  

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("API Instance:", api);

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');  // Retrieve the token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Attach token to the Authorization header
    }
    console.log('Request:', config.url);  // Debug log
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  response => {
    console.log('Response:', response.data);  // Debug log
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export const studentAPI = {

  getQuizzes: async (page = 1, limit = 10) => {
    try {
      const response = await api.post('/getAvailableQuizzes', { page, limit });
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },

  getQuizDetails: async (id_quiz) => {
    try {
      const response = await api.post('/getQuizDetails', { id_quiz });
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      throw error;
    }
  },

  startAttempt: async (id_quiz) => {
    try {
      const response = await api.post('/startAttempt', { id_quiz });
      return response.data;
    } catch (error) {
      console.error('Error starting attempt:', error);
      throw error;
    }
  },

  getAttemptById: async (id_attempt) => {
    try {
      const response = await api.post('/getAttemptById', { id_attempt });
      return response.data;
    } catch (error) {
      console.error('Error fetching attempt:', error);
      throw error;
    }
  },


  submitAnswers: async (attemptId, answers) => {
    try {
      const response = await api.post('/submitAnswers', { id_attempt: attemptId, answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting answers:', error);
      throw error;
    }
  },

  getQuizResults: async (attemptId) => {
    try {
      const response = await api.post('/getQuizResults', { id_attempt: attemptId });
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      throw error;
    }
  },

  getHistory: async () => {
    try {
      const response = await api.post('/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.post('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
};

export default api;
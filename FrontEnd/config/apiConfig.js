// Create a new file: c:\Hmn\FrontEnd\config\apiConfig.js
// apiConfig.js - Central configuration for API endpoints
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeModules } from 'react-native';

const getBaseUrl = () => {
    // Check if running on Xiaomi device with HyperOS (Android 15)
    const isXiaomiHyperOS = Platform.OS === 'android' && 
                            Platform.Version >= 34 && 
                            NativeModules.PlatformConstants?.Brand?.toLowerCase().includes('xiaomi');
    
    if (Platform.OS === 'web') return 'http://192.168.128.118:3000';
    if (Platform.OS === 'ios') {
        // For iOS simulator use localhost, for real device use your computer's IP
        return 'http://192.168.128.118:3000'; // Change to your IP when testing on real device
    }
    
    // For Xiaomi HyperOS devices, use the actual IP address instead of 10.0.2.2
    if (isXiaomiHyperOS) {
        return 'http://192.168.128.118:3000'; // Replace with your actual computer's IP address
    }
    
    return 'http://192.168.128.118:3000'; // Standard Android emulator IP
};

export const API_BASE_URL = getBaseUrl();

// Common API endpoints
export const API_ENDPOINTS = {
    API_BASE_URL,
    LOGIN: `${API_BASE_URL}/auth/login`,
    STUDENT_PROFILE: `${API_BASE_URL}/students/studentProfile`,
    AVAILABLE_QUIZZES: `${API_BASE_URL}/students/getAvailableQuizzes`,
    QUIZ_DETAILS: `${API_BASE_URL}/students/getQuizDetails`,
    QUIZ_RESULTS: `${API_BASE_URL}/students/getQuizResults`,
    HISTORY: `${API_BASE_URL}/students/history`,
    SUBMIT_QUIZ: `${API_BASE_URL}/students/submitQuiz`,
    START_QUIZ: `${API_BASE_URL}/students/startQuiz`,
    START_ATTEMPT: `${API_BASE_URL}/students/startAttempt`,
    SAVE_ANSWER: `${API_BASE_URL}/students/saveAnswer`,
    GET_SAVED_ANSWERS: `${API_BASE_URL}/students/getSavedAnswers`
};

// Helper function to add authentication headers
export const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
    };
};

// Create an axios instance with default config
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for better error handling
apiClient.interceptors.request.use(
    async (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout. Server might be slow or unreachable.');
        } else if (!error.response) {
            console.error('Network error. Check your internet connection or server status.');
        } else {
            console.error(`Server responded with status: ${error.response.status}`);
        }
        return Promise.reject(error);
    }
);

// Helper function for API requests with error handling
export const apiRequest = async (method, endpoint, data = null, params = null) => {
    try {
        const headers = await getAuthHeaders();
        const config = {
            method,
            headers,
            url: endpoint,
            ...(data && { data }),
            ...(params && { params })
        };
        
        console.log(`Making ${method.toUpperCase()} request to ${endpoint}`, {
            data,
            params,
            headers: { ...headers, Authorization: headers.Authorization ? 'Bearer [REDACTED]' : '' }
        });
        
        const response = await axios(config);
        return response.data; // Return just the data part of the response
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error.response?.data || error.message);
        
        // Add more detailed logging
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        } else if (error.request) {
            console.error('No response received from server');
        }
        
        throw error; // Re-throw to allow component-level handling
    }
};

// Simplified API request functions for common operations
export const apiGet = async (endpoint, params = null) => {
    return apiRequest('get', endpoint, null, params);
};

export const apiPost = async (endpoint, data = null) => {
    return apiRequest('post', endpoint, data);
};

export const apiPut = async (endpoint, data = null) => {
    return apiRequest('put', endpoint, data);
};

export const apiDelete = async (endpoint, params = null) => {
    return apiRequest('delete', endpoint, null, params);
};

// Remove everything from line 151 to the end of the file
// DELETE THE FOLLOWING SECTION:
// // Increase the default timeout for all requests
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000, // Increase timeout to 30 seconds
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// 
// // Add request interceptor for better error handling
// apiClient.interceptors.request.use(
//   config => {
//     console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
//     return config;
//   },
//   error => {
//     console.error('Request error:', error);
//     return Promise.reject(error);
//   }
// );
// 
// // Add response interceptor for better error handling
// apiClient.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     if (error.code === 'ECONNABORTED') {
//       console.error('Request timeout. Server might be slow or unreachable.');
//     } else if (!error.response) {
//       console.error('Network error. Check your internet connection or server status.');
//     } else {
//       console.error(`Server responded with status: ${error.response.status}`);
//     }
//     return Promise.reject(error);
//   }
// );
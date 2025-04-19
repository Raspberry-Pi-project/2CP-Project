import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (email, password, role) => {
  const res = await API.post('/auth/login', { email, password, role });

  // Save role + ID for session usage
  await AsyncStorage.setItem('role', res.data.role);
  await AsyncStorage.setItem('userId', res.data.userId.toString());

  return res.data;
};

export const registerUser = async (userData) => {
  const res = await API.post('/auth/register', userData);
  return res.data;
};

export const logoutUser = async () => {
  await API.post('/auth/logout');
  await AsyncStorage.clear();
};

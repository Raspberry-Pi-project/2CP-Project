import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('@auth_token', token);
  } catch (e) {
    console.error('Failed to save token', e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('@auth_token');
  } catch (e) {
    console.error('Failed to fetch token', e);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('@auth_token');
  } catch (e) {
    console.error('Failed to remove token', e);
  }
};
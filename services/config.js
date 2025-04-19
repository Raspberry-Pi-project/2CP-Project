// Change this to your actual backend URL
export const API_URL = 'http://172.20.10.2:3000';

// For development, use your local IP address if running on a physical device
// For emulators, you might need to use special addresses:
// - Android Emulator: 10.0.2.2
// - iOS Simulator: localhost

export const getApiConfig = () => {
  return {
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
};
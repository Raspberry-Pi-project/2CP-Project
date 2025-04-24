import { Platform } from "react-native";

// Get the appropriate API URL based on the platform
const getApiUrl = () => {
  
  // For physical device, use your computer's IP address
  return "http://192.168.223.46:3000";
};

export const API_URL = getApiUrl();

// For development:
// - Android Emulator: 10.0.2.2
// - iOS Simulator: localhost
// - Physical Device: Your computer's IP address (e.g., 192.168.1.x)

export const getApiConfig = () => {
  return {
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
};

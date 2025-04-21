import { Platform } from 'react-native';

// Animation configuration that works across all platforms
export const animationConfig = {
  useNativeDriver: false, // Explicitly disable native driver for web compatibility
};

// Helper function for creating animation configurations
export const createAnimationConfig = (options = {}) => {
  return {
    ...options,
    useNativeDriver: false, // Always disable native driver for web
  };
};
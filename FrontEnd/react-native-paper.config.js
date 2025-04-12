import { DefaultTheme } from 'react-native-paper';

// Configure react-native-paper to not use native drivers
const theme = {
  ...DefaultTheme,
  animation: {
    scale: 1.0,
    defaultConfig: {
      useNativeDriver: false
    }
  }
};

export default theme;
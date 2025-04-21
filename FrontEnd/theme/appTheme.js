import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Centralized theme colors
export const COLORS = {
  primary: '#6a5acd', // Purple color from TRIVIO logo
  secondary: '#4fc3f7', // Light blue accent
  accent: 'rgb(144 169 193)', // Blue-gray accent color used in many components
  background: '#f8f5ff',
  cardBackground: '#ffffff',
  text: {
    dark: '#333333',
    medium: '#666666',
    light: '#888888',
    white: '#ffffff'
  },
  error: '#d32f2f',
  errorBackground: '#ffebee',
  divider: '#f0f0f0',
  success: '#4caf50',
  warning: '#ff9800',
  // Additional colors for better mobile compatibility
  mobileHighlight: '#8a7ddf', // Lighter shade of primary for mobile touch states
  mobileBackground: '#f0ebff', // Softer background for mobile screens
  mobileBorder: '#d4cfed' // Subtle border color for mobile elements
};

// Centralized typography
export const TYPOGRAPHY = {
  fontFamily: Platform.select({
    web: 'Roboto, Arial, sans-serif',
    ios: 'System',
    android: 'Roboto',
    default: 'System'
  }),
  sizes: {
    xs: 10,
    small: 12,
    medium: 14,
    regular: 16,
    large: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30
  },
  weights: {
    normal: Platform.select({ web: '400', native: 'normal', default: 'normal' }),
    medium: Platform.select({ web: '500', native: '500', default: '500' }),
    bold: Platform.select({ web: '700', native: 'bold', default: 'bold' })
  }
};

// Centralized spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 30,
  xxl: 40
};

// Centralized shadows
export const SHADOWS = Platform.select({
  web: {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
  },
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  android: {
    elevation: 4
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4
  }
});

// Responsive sizing helper
export const responsiveSize = (size) => {
  const isSmallDevice = width < 375;
  return isSmallDevice ? size * 0.9 : size;
};

// Platform-specific styles
export const PLATFORM_STYLES = {
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : Platform.OS === 'android' ? 30 : 0,
    backgroundColor: COLORS.mobileBackground
  },
  tabBar: {
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    backgroundColor: COLORS.primary,
    borderTopWidth: 1,
    borderTopColor: COLORS.mobileBorder
  },
  touchableHighlight: {
    android: {
      rippleColor: COLORS.mobileHighlight,
      borderless: true
    },
    ios: {
      activeOpacity: 0.7
    }
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.mobileBackground
  }
};

// Common button styles
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48, // Minimum touch target size
    ...Platform.select({
      ios: {
        ...SHADOWS.ios,
        shadowOpacity: 0.2
      },
      android: {
        elevation: 3
      }
    })
  },
  secondary: {
    backgroundColor: COLORS.accent,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48,
    marginVertical: SPACING.sm,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4
      },
      android: {
        elevation: 3
      }
    })
  },
  outline: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    color: COLORS.text.white,
    fontFamily: TYPOGRAPHY.fontFamily,
    fontSize: TYPOGRAPHY.sizes.regular,
    fontWeight: TYPOGRAPHY.weights.medium
  }
};

// Common card styles
export const CARD_STYLES = {
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: Platform.select({
      ios: SPACING.lg,
      android: SPACING.md
    }),
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8
      },
      android: {
        elevation: 4,
        borderWidth: 1,
        borderColor: COLORS.mobileBorder
      }
    })
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.large,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    fontFamily: TYPOGRAPHY.fontFamily
  }
};

// Export a combined theme object
export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  SHADOWS,
  PLATFORM_STYLES,
  BUTTON_STYLES,
  CARD_STYLES,
  responsiveSize
};
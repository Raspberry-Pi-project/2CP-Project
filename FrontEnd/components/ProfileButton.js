import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Check if this path is correct
import { colors, borderRadius, shadows } from '../styles/theme';

const ProfileButton = ({ onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Icon name="account" size={20} color={colors.white} style={styles.icon} />
        <Text style={styles.text}>View Profile</Text>
    </TouchableOpacity>
);

// Replace shadow properties with boxShadow
// For example, if you have something like:
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.small,
    ...shadows.small,
    // For the ProfileButton component, replace shadow* properties with boxShadow
    // Around line 14
    
    // Instead of something like:
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    
    // Use this single boxShadow property:
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    
    // Keep other styles
  }
});

export default ProfileButton;
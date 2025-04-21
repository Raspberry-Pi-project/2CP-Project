import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { UserContext } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_ENDPOINTS, apiClient, getAuthHeaders } from '../config/apiConfig';

const { width } = Dimensions.get('window');

// Centralized theme colors
const COLORS = {
  primary: '#6a5acd', // Purple color from TRIVIO logo
  secondary: '#4fc3f7', // Light blue accent
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
  divider: '#f0f0f0'
};

// Centralized typography
const TYPOGRAPHY = {
  fontFamily: Platform.select({
    web: 'Roboto, Arial, sans-serif',
    ios: 'System',
    android: 'Roboto'
  }),
  sizes: {
    small: 12,
    medium: 14,
    regular: 16,
    large: 18,
    xlarge: 24
  },
  weights: {
    normal: Platform.select({ web: '400', native: 'normal' }),
    medium: Platform.select({ web: '500', native: '500' }),
    bold: Platform.select({ web: '700', native: 'bold' })
  }
};

// Centralized spacing
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 30
};

// Centralized shadows
const SHADOWS = Platform.select({
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

const MyProfile = () => {
    const { userData } = useContext(UserContext);
    const [profileData, setProfileData] = useState({
        id_student: '',
        first_name: '',
        last_name: '',
        annee: '',
        groupe_student: '',
        email: userData?.email || ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('personal'); // For tab navigation

    useEffect(() => {
        if (userData) {
            fetchProfile();
        } else {
            setError("You are not logged in. Please log in to view your profile.");
            setLoading(false);
        }
    }, [userData]);

    const fetchProfile = async () => {
        if (userData?.email && userData?.id_student) {
            try {
                const token = await AsyncStorage.getItem('token');
                
                if (token) {
                    console.log('Token found:', token.substring(0, 10) + '...');
                } else {
                    console.log('No token found in AsyncStorage');
                }
                
                // Use the centralized API configuration
                const response = await apiClient.get(API_ENDPOINTS.STUDENT_PROFILE, {
                    params: {
                        id_student: parseInt(userData.id_student),
                        email: userData.email
                    },
                    withCredentials: true
                });
                
                // Alternative approach using apiRequest helper
                // const response = await apiRequest(
                //     'get',
                //     API_ENDPOINTS.STUDENT_PROFILE,
                //     null,
                //     {
                //         id_student: parseInt(userData.id_student),
                //         email: userData.email
                //     }
                // );
                
                if (response.data) {
                    console.log('Profile data received successfully');
                    setProfileData({
                        id_student: response.data.id_student || '',
                        first_name: response.data.first_name || '',
                        last_name: response.data.last_name || '',
                        annee: response.data.annee || '',
                        groupe_student: response.data.groupe_student || '',
                        email: response.data.email || userData.email,
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Profile fetch error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                
                setProfileData({
                    ...profileData,
                    id_student: userData.id_student || '',
                    email: userData.email || ''
                });
                
                setError(`Failed to load profile: ${error.response?.data?.message || error.message}`);
                setLoading(false);
            }
        } else {
            const missingFields = [];
            if (!userData?.email) missingFields.push('email');
            if (!userData?.id_student) missingFields.push('student ID');
            
            setError(`User data incomplete: Missing ${missingFields.join(' and ')}`);
            setLoading(false);
        }
    };

    // Get initials for avatar
    const getInitials = () => {
        const first = profileData.first_name ? profileData.first_name.charAt(0).toUpperCase() : '';
        const last = profileData.last_name ? profileData.last_name.charAt(0).toUpperCase() : '';
        return first + last;
    };

    // Tab navigation handler
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading your profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.errorCard}>
                    <Icon name="alert-circle-outline" size={50} color={COLORS.error} />
                    <Text style={styles.error}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Avatar.Text 
                        size={80} 
                        label={getInitials()} 
                        backgroundColor={COLORS.primary} 
                        color={COLORS.text.white}
                        style={styles.avatar}
                    />
                </View>
                <Text style={styles.name}>{profileData.first_name} {profileData.last_name}</Text>
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Student</Text>
                    </View>
                </View>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'personal' && styles.activeTab]} 
                    onPress={() => handleTabChange('personal')}
                >
                    <Icon 
                        name="account-details" 
                        size={20} 
                        color={activeTab === 'personal' ? COLORS.primary : COLORS.text.medium} 
                    />
                    <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
                        Personal
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'academic' && styles.activeTab]} 
                    onPress={() => handleTabChange('academic')}
                >
                    <Icon 
                        name="school" 
                        size={20} 
                        color={activeTab === 'academic' ? COLORS.primary : COLORS.text.medium} 
                    />
                    <Text style={[styles.tabText, activeTab === 'academic' && styles.activeTabText]}>
                        Academic
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Profile Info Cards */}
            <View style={styles.cardsContainer}>
                {activeTab === 'personal' && (
                    <Card style={styles.card}>
                        <Card.Title 
                            title="Personal Information" 
                            titleStyle={styles.cardTitle}
                            left={(props) => <Icon name="account-details" size={24} color={COLORS.primary} />}
                        />
                        <Card.Content>
                            <View style={styles.infoRow}>
                                <Icon name="account" size={20} color={COLORS.text.medium} style={styles.infoIcon} />
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Full Name</Text>
                                    <Text style={styles.infoValue}>{profileData.first_name} {profileData.last_name}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.infoRow}>
                                <Icon name="email" size={20} color={COLORS.text.medium} style={styles.infoIcon} />
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>{profileData.email || 'Not provided'}</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                )}

                {activeTab === 'academic' && (
                    <Card style={styles.card}>
                        <Card.Title 
                            title="Academic Information" 
                            titleStyle={styles.cardTitle}
                            left={(props) => <Icon name="school" size={24} color={COLORS.primary} />}
                        />
                        <Card.Content>
                            <View style={styles.infoRow}>
                                <Icon name="calendar-clock" size={20} color={COLORS.text.medium} style={styles.infoIcon} />
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Year</Text>
                                    <Text style={styles.infoValue}>{profileData.annee || 'Not provided'}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.infoRow}>
                                <Icon name="account-group" size={20} color={COLORS.text.medium} style={styles.infoIcon} />
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Student Group</Text>
                                    <Text style={styles.infoValue}>{profileData.groupe_student || 'Not provided'}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.infoRow}>
                                <Icon name="identifier" size={20} color={COLORS.text.medium} style={styles.infoIcon} />
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Student ID</Text>
                                    <Text style={styles.infoValue}>{profileData.id_student || 'Not provided'}</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>TRIVIO</Text>
                <Text style={styles.footerSubtext}>Learn, Compare, Repeat</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // Container styles
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    contentContainer: {
        paddingBottom: SPACING.xl,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    
    // Header styles
    header: {
        alignItems: 'center',
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...SHADOWS,
    },
    avatarContainer: {
        marginBottom: SPACING.md,
    },
    avatar: {
        ...(Platform.OS === 'android' ? { elevation: 5 } : {}),
        ...(Platform.OS === 'ios' ? { 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
        } : {}),
        ...(Platform.OS === 'web' ? { 
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)'
        } : {}),
    },
    name: {
        fontSize: TYPOGRAPHY.sizes.xlarge,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.text.white,
        marginBottom: SPACING.xs,
        fontFamily: TYPOGRAPHY.fontFamily,
    },
    badgeContainer: {
        flexDirection: 'row',
        marginTop: SPACING.xs,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 20,
    },
    badgeText: {
        color: COLORS.text.white,
        fontWeight: TYPOGRAPHY.weights.medium,
        fontFamily: TYPOGRAPHY.fontFamily,
    },
    
    // Tab navigation styles
    tabContainer: {
        flexDirection: 'row',
        marginTop: SPACING.md,
        marginHorizontal: SPACING.md,
        borderRadius: 10,
        backgroundColor: COLORS.cardBackground,
        ...SHADOWS,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        marginLeft: SPACING.xs,
        color: COLORS.text.medium,
        fontFamily: TYPOGRAPHY.fontFamily,
        fontSize: TYPOGRAPHY.sizes.medium,
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: TYPOGRAPHY.weights.medium,
    },
    
    // Card styles
    cardsContainer: {
        padding: SPACING.md,
    },
    card: {
        marginBottom: SPACING.md,
        borderRadius: 12,
        backgroundColor: COLORS.cardBackground,
        ...SHADOWS,
    },
    cardTitle: {
        fontSize: TYPOGRAPHY.sizes.large,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fontFamily,
    },
    
    // Info row styles
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    infoIcon: {
        marginRight: SPACING.md,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: TYPOGRAPHY.sizes.medium,
        color: COLORS.text.medium,
        marginBottom: 2,
        fontFamily: TYPOGRAPHY.fontFamily,
    },
    infoValue: {
        fontSize: TYPOGRAPHY.sizes.regular,
        color: COLORS.text.dark,
        fontWeight: TYPOGRAPHY.weights.medium,
        fontFamily: TYPOGRAPHY.fontFamily,
    },
    
    // Error styles
    errorCard: {
        backgroundColor: COLORS.errorBackground,
        padding: SPACING.lg,
        borderRadius: 12,
        alignItems: 'center',
        margin: SPACING.md,
        ...SHADOWS,
    },
    error: {
        color: COLORS.error,
        fontSize: TYPOGRAPHY.sizes.regular,
        textAlign: 'center',
        marginTop: SPACING.sm,
        fontFamily: TYPOGRAPHY.fontFamily,
    },
    
    // Footer styles
    footer: {
        alignItems: 'center',
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    footerText: {
        fontSize: TYPOGRAPHY.sizes.regular,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fontFamily,
    },
    footerSubtext: {
        fontSize: TYPOGRAPHY.sizes.small,
        color: COLORS.text.light,
        marginTop: 2,
        fontFamily: TYPOGRAPHY.fontFamily,
    },
    
    // Loading text style
    loadingText: {
        marginTop: SPACING.sm,
        fontSize: TYPOGRAPHY.sizes.regular,
        color: COLORS.text.medium,
        fontFamily: TYPOGRAPHY.fontFamily,
    },
});

export default MyProfile;
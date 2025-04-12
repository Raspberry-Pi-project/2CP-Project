import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { UserContext } from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyProfile = () => {
    const { userData } = useContext(UserContext);
    const [profileData, setProfileData] = useState({
        id_student: '',
        first_name: '',
        last_name: '',
        annee: '',
        groupe_student: '',
        email: userData?.email || '' // Use optional chaining to safely access email
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only fetch profile if userData exists
        if (userData) {
            fetchProfile();
        } else {
            setError("You are not logged in. Please log in to view your profile.");
            setLoading(false);
        }
    }, [userData]); // Add userData as dependency to refetch when it changes

    const fetchProfile = async () => {
        if (userData?.email && userData?.id_student) {
            try {
                // Get the authentication token from AsyncStorage
                const token = await AsyncStorage.getItem('token');
                
                // Log token for debugging (only first few characters)
                if (token) {
                    console.log('Token found:', token.substring(0, 10) + '...');
                } else {
                    console.log('No token found in AsyncStorage');
                }
                
                const response = await axios.get('http://localhost:3000/students/studentProfile', {
                    params: {
                        id_student: parseInt(userData.id_student), // Ensure id_student is a number
                        email: userData.email
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Removed Cookie header which causes browser security errors
                    },
                    withCredentials: true // Keep this for CORS cookies if needed
                });
                
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
                
                // Try to use userData as fallback if API call fails
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

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    // Define profile fields to display in a structured way
    const profileFields = [
        { label: 'First Name', value: profileData.first_name },
        { label: 'Last Name', value: profileData.last_name },
        { label: 'Year', value: profileData.annee },
        { label: 'Student Group', value: profileData.groupe_student },
        { label: 'Email', value: profileData.email },
        //{ label: 'Student ID', value: profileData.id_student },
    ];

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>TRIVIO QUIZ: My Profile</Text>
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerText}>{profileData.first_name} {profileData.last_name}</Text>
                    </View>
                    
                    <View style={styles.tableContainer}>
                        {profileFields.map((field, index) => (
                            <View key={index} style={[
                                styles.tableRow, 
                                index % 2 === 0 ? styles.evenRow : styles.oddRow,
                                index === profileFields.length - 1 ? styles.lastRow : null
                            ]}>
                                <View style={styles.tableCell}>
                                    <Text style={styles.label}>{field.label}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text style={styles.value}>{field.value || 'Not provided'}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f2f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerRow: {
        backgroundColor: '#4a6da7',
        padding: 15,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
    },
    tableContainer: {
        width: '100%',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
    },
    oddRow: {
        backgroundColor: '#ffffff',
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    tableCell: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    error: {
        color: '#d32f2f',
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
        backgroundColor: '#ffebee',
        borderRadius: 8,
        width: '100%',
    },
});

export default MyProfile;
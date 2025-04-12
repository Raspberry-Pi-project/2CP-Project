import React, { useEffect, useContext, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { UserContext } from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = ({ navigation }) => {
    const { setUserData } = useContext(UserContext);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const performLogout = async () => {
            try {
                // Get token before removing it (for the API call)
                const token = await AsyncStorage.getItem('token');
                
                // Call the logout API endpoint with the token in Authorization header
                await axios.post('http://localhost:3000/auth/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true // Important for cookie-based auth
                });
                
                // Clear token from AsyncStorage
                await AsyncStorage.removeItem('token');
                
                // Clear user data from context
                setUserData(null);
                
                // Navigate to Login screen
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'SignIn' }],
                    });
                }, 1000);
            } catch (error) {
                console.error('Logout error:', error.response?.data || error.message);
                setError('Failed to logout. Please try again.');
                
                // Even if API call fails, still clear local data and redirect
                await AsyncStorage.removeItem('token');
                setUserData(null);
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'SignIn' }],
                    });
                }, 2000);
            }
        };
        
        performLogout();
    }, [navigation, setUserData]);
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 20 }}>
                {error ? error : 'Logging out...'}
            </Text>
        </View>
    );
};

export default LogoutScreen;
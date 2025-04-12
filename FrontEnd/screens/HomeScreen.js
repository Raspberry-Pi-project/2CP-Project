import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import ProfileButton from '../components/ProfileButton';
import { UserContext, NavigationRef } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const { userData, setUserData } = useContext(UserContext);
    const navigationRef = useContext(NavigationRef);

    // Handle logout with proper cleanup
    const handleLogout = async () => {
        try {
            // Clear token from AsyncStorage
            await AsyncStorage.removeItem('token');
            
            // Clear user data from context
            setUserData(null);
            
            // Clear from localStorage
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('token');
            
            // Instead of using navigation.reset, use the navigation ref
            if (navigationRef.current) {
              // Navigate to SignIn screen
              navigationRef.current.navigate('SignIn');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Trivio: Quiz on lessons learned</Text>
            <Image
                style={styles.image}
                source={require('../assets/home.png')}
            />
            <Text style={styles.text}>TRIVIO Evaluation Students.</Text>
            <ProfileButton onPress={() => navigation.navigate('MyProfile')} />
            
            {/* Use the handleLogout function directly */}
            <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

// Styles remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    image: {
        width: 200,
        height: 200,
        margin: 15,
    },
    text: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    // Add styles for the logout button
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff6347',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
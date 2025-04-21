import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Image, Dimensions, SafeAreaView } from 'react-native';
import ProfileButton from '../components/ProfileButton';
import { UserContext, NavigationRef } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>TRIVIO</Text>
                    <Text style={styles.version}>Version 1.0</Text>
                </View>
                
                <View style={styles.imageContainer}>
                    <Image 
                        source={require('../assets/accueil.png')} 
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
                
                <View style={styles.cardsContainer}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icon name="information-outline" size={24} color="rgb(144 169 193)" />
                            <Text style={styles.cardTitle}>About TRIVIO</Text>
                        </View>
                        
                        <Text style={styles.description}>
                            A Mobile Application designed for university students to answer quizzes prepared by their teachers.
                        </Text>
                        
                        <Text style={styles.infoText}>
                            Part of a platform developed by students at the Ecole Nationale Supérieure d'Informatique under the Algerian Ministry of Higher Education and Scientific Research.
                        </Text>
                    </View>
                    
                    <TouchableOpacity 
                        onPress={() => Linking.openURL('http://quizzes.esi.dz')}
                        style={styles.linkButton}
                    >
                        <Icon name="web" size={18} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.linkText}>Visit quizzes.esi.dz</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('MyProfile')}
                        >
                            <Icon name="account" size={24} color="#fff" />
                            <Text style={styles.actionButtonText}>My Profile</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.logoutButton]}
                            onPress={handleLogout}
                        >
                            <Icon name="logout" size={24} color="#fff" />
                            <Text style={styles.actionButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>TRIVIO QUIZ</Text>
                <Text style={styles.footerSubtext}>Learning made interactive</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f5ff', // Light violet background matching History screen
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 20,
        backgroundColor: '#6a5acd', // Violet from logo
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    version: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 5,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    image: {
        width: width * 0.6,
        height: width * 0.6,
        maxWidth: 250,
        maxHeight: 250,
    },
    cardsContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6a5acd', // Violet from logo
        marginLeft: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#34495e',
        marginBottom: 15,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#7f8c8d',
    },
    linkButton: {
        backgroundColor: '#4CAF50', // Green accent color
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    buttonIcon: {
        marginRight: 10,
    },
    linkText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#6a5acd', // Violet from logo
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    logoutButton: {
        backgroundColor: '#ff6347',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 5,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(106, 90, 205, 0.2)', // Violet with opacity
        backgroundColor: 'rgba(106, 90, 205, 0.1)', // Light violet background
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6a5acd', // Violet from logo
    },
    footerSubtext: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
});

export default HomeScreen;
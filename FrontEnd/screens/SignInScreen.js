import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Image, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { UserContext } from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
    const { setUserData } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignIn = async () => {
        if (!email || !password) {
            setErrorMessage('Veuillez entrer un email et un mot de passe');
            return;
        }
        
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            console.log('Attempting login with:', { email, password, role });
            
            const response = await axios.post('http://localhost:3000/auth/login', {
                email,
                password,
                role
            });
            
            if (response.data) {
                console.log('Login response:', response.data);
                
                // Save the token to AsyncStorage
                if (response.data.token) {
                    await AsyncStorage.setItem('token', response.data.token);
                    console.log('Token saved to AsyncStorage');
                } else {
                    console.warn('No token received from server');
                }
                
                // Make sure these fields exist in the response
                const userData = {
                    email: response.data.email || email,
                    id_student: response.data.id_student || response.data.userId || '',
                    role: response.data.role || role
                };
                
                console.log('Setting user data to:', userData);
                
                // Set the userData in context
                setUserData(userData);
                
                // Store in localStorage for persistence
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Navigate to main screen
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }], // Changed from 'Main' to 'MainTabs' to match App.js
                });
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setErrorMessage(
                error.response?.data?.error || 
                'Connexion échouée. Veuillez vérifier vos identifiants ou votre connexion reseau.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Add the icon in the top left corner */}
            <View style={styles.iconContainer}>
                <Image 
                    source={require('../assets/icon.png')} 
                    style={styles.icon} 
                    resizeMode="contain"
                />
            </View>
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>TRIVIO</Text>
                        <Text style={styles.subtitle}>Plateforme d'apprentissage</Text>
                    </View>
                    
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Connexion</Text>
                        
                        {errorMessage ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            </View>
                        ) : null}
                        
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Entrez votre email"
                                onChangeText={setEmail}
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Mot de passe</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Entrez votre mot de passe"
                                secureTextEntry={true}
                                onChangeText={setPassword}
                                value={password}
                            />
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.loginButton} 
                            onPress={handleSignIn}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.loginButtonText}>Se connecter</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    keyboardAvoid: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4a6da7',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 6,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    loginButton: {
        backgroundColor: '#4a6da7',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Add these new styles for the icon
    iconContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    icon: {
        width: 40,
        height: 40,
    },
});

export default SignInScreen;
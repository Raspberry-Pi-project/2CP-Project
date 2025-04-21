import React, { useState, useContext } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    ActivityIndicator, 
    Image, 
    KeyboardAvoidingView, 
    Platform, 
    SafeAreaView,
    StatusBar,
    Dimensions
} from 'react-native';
import { UserContext } from '../App';
import { API_ENDPOINTS, apiClient, apiRequest } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Theme colors based on app branding
const COLORS = {
    primary: '#6a5acd', // Violet from logo
    secondary: '#4CAF50', // Green accent
    background: '#f8f5ff', // Light violet background
    cardBackground: '#ffffff',
    text: {
        dark: '#333333',
        medium: '#666666',
        light: '#888888',
        white: '#ffffff'
    },
    error: '#d32f2f',
    errorBackground: '#ffebee'
};

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
            
            // Use the centralized API configuration
            const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
                role
            });
            
            // Alternative approach using apiRequest helper
            // const response = await apiRequest(
            //     'post',
            //     API_ENDPOINTS.LOGIN,
            //     {
            //         email,
            //         password,
            //         role
            //     }
            // );
            
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
                
                // Store in AsyncStorage for persistence
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                
                // Navigate to main screen - use navigate instead of reset
                //navigation.navigate('MainTabs');
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
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            
            {/* Gradient Header */}
            <LinearGradient
                colors={[COLORS.primary, '#8677e0']} 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 0}} 
                style={styles.gradientHeader}
            >
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../assets/logoimage.png')} 
                        style={styles.logo} 
                        resizeMode="contain"
                    />
                   {/*<Text style={styles.appName}>Student TRIVIO connexion</Text>*/}
                </View>
            </LinearGradient>
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <View style={styles.container}>
                    <View style={styles.formContainer}>
                        <View style={styles.formHeader}>
                            <Icon name="login" size={30} color={COLORS.primary} />
                            <Text style={styles.formTitle}>Connexion</Text>
                        </View>
                        
                        {errorMessage ? (
                            <View style={styles.errorContainer}>
                                <Icon name="alert-circle-outline" size={20} color={COLORS.error} />
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            </View>
                        ) : null}
                        
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="email-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Entrez votre email"
                                    onChangeText={setEmail}
                                    value={email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholderTextColor={COLORS.text.light}
                                />
                            </View>
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Mot de passe</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="lock-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Entrez votre mot de passe"
                                    secureTextEntry={true}
                                    onChangeText={setPassword}
                                    value={password}
                                    placeholderTextColor={COLORS.text.light}
                                />
                            </View>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.loginButton} 
                            onPress={handleSignIn}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <LinearGradient
                                    colors={[COLORS.secondary, '#66bb6a']} 
                                    start={{x: 0, y: 0}} 
                                    end={{x: 1, y: 0}} 
                                    style={styles.buttonGradient}
                                >
                                    <Icon name="login" size={20} color="#fff" style={styles.buttonIcon} />
                                    <Text style={styles.loginButtonText}>Se connecter</Text>
                                </LinearGradient>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
            
            <View style={styles.footer}>
                <LinearGradient
                    colors={[COLORS.primary, '#8677e0']} 
                    start={{x: 0, y: 0}} 
                    end={{x: 1, y: 0}} 
                    style={styles.footerGradient}
                >
                    <Text style={styles.footerText}>TRIVIO QUIZ</Text>
                    <Text style={styles.footerSubtext}>Learning made interactive</Text>
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    gradientHeader: {
        width: '100%',
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    logoContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 0,
    },
    logo: {
        width: 100,
        height: 30,
        margin: 0,
    },
    appName: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    logo: {
        width: 100,
        height: 30,
        marginRight: 0,
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text.white,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 15,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(106, 90, 205, 0.1)',
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.primary,
        marginLeft: 10,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    errorContainer: {
        backgroundColor: COLORS.errorBackground,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.error,
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text.medium,
        marginBottom: 8,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(106, 90, 205, 0.3)',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: COLORS.text.dark,
        paddingRight: 15,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    loginButton: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonGradient: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    buttonIcon: {
        marginRight: 8,
    },
    loginButtonText: {
        color: COLORS.text.white,
        fontSize: 16,
        fontWeight: '600',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    footer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? 20 : 10,
        overflow: 'hidden',
    },
    footerGradient: {
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text.white,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    footerSubtext: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    }
});

export default SignInScreen;
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { UserContext } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../theme/appTheme';
const Logout = ({ navigation }) => {
    const { setUserData } = useContext(UserContext);

    const performLogout = async () => {
        try {
            // Clear AsyncStorage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userData');
            
            // Clear user context
            setUserData(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgb(144 169 193)', COLORS.primary]}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Déconnexion</Text>
                <Text style={styles.headerSubtitle}>
                Until next time!
                </Text>
            </LinearGradient>

            <View style={styles.contentContainer}>
                <View style={styles.card}>
                    <Icon name="logout" size={80} color="rgb(144 169 193)" style={styles.logoutIcon} />
                    <Text style={styles.title}>Are you sure?</Text>
                    <Text style={styles.subtitle}>
                    You are about to log out of your account.
                    </Text>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.logoutButton]} 
                            onPress={performLogout}
                        >
                            <Icon name="logout" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, styles.cancelButton]} 
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="close" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>TRIVIO QUIZ</Text>
                <Text style={styles.footerSubtext}>Learning made interactive</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f5ff',
        // Add platform-specific padding for status bar
        paddingTop: Platform.OS === 'ios' ? 50 : 0,
    },
    header: {
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
        paddingBottom: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 16,
        // Cross-platform shadow implementation
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.15,
                shadowRadius: 5,
            },
            android: {
                elevation: 5,
            },
            default: {
                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.15)'
            }
        }),
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false, // Helps with text alignment issues
            }
        }),
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 8,
        opacity: 0.9,
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 25,
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        // Cross-platform shadow implementation
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 4,
            },
            default: {
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
            }
        }),
    },
    logoutIcon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
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
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        minWidth: 140,
    },
    buttonIcon: {
        marginRight: 8,
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        boxShadow: '0px 2px 4px rgba(231, 76, 60, 0.3)',
    },
    cancelButton: {
        backgroundColor: 'rgb(144 169 193)',
        boxShadow: '0px 2px 4px rgba(144, 169, 193, 0.3)',
    },
    buttonText: {
        color: '#fff',
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
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgb(144 169 193)',
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
        color: '#888',
        marginTop: 4,
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

export default Logout;
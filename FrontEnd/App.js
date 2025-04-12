import React, { useState, createContext, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './react-native-paper.config';

// Importation des différents écrans
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import History from './screens/History';
import ResultsQuiz from './screens/ResultsQuiz';
import TakeQuiz from './screens/TakeQuiz';
import MyProfile from './screens/MyProfile';
import Logout from './screens/LogoutScreen';
import StartResponse from './screens/StartResponse';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const UserContext = createContext();
export const NavigationRef = React.createContext();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'TakeQuiz') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'MyProfile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Logout') {
                        iconName = focused ? 'log-out' : 'log-out-outline';
                    }
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007bff',
                tabBarInactiveTintColor: 'gray',
                headerShown: true,
            })}
        >
           <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
           <Tab.Screen name="History" component={History} options={{ title: 'Historique' }} />
           <Tab.Screen name="TakeQuiz" component={TakeQuiz} options={{ title: 'Quiz' }} />
           <Tab.Screen name="MyProfile" component={MyProfile} options={{ title: 'Profil' }} />
           <Tab.Screen name="Logout" component={Logout} options={{ title: 'Déconnexion' }} />
        </Tab.Navigator>
    );
};

export default function App() {
    // Initialize userData from localStorage if available
    const [userData, setUserData] = useState(() => {
        const savedUserData = localStorage.getItem('userData');
        return savedUserData ? JSON.parse(savedUserData) : null;
    });
    
    // Create a navigation reference that can be used for navigation actions outside of components
    const navigationRef = useRef(null);
    
    // Log the initial userData for debugging
    console.log('Initial userData in App:', userData);
    
    return (
        <PaperProvider theme={theme}>
            <UserContext.Provider value={{ userData, setUserData }}>
                <NavigationRef.Provider value={navigationRef}>
                    <NavigationContainer ref={navigationRef}>
                        <Stack.Navigator>
                            {!userData ? (
                                // Auth screens
                                <Stack.Screen 
                                            name="SignIn" 
                                            component={SignInScreen} 
                                            options={{ 
                                                title: 'Application Quiz',
                                                headerLeft: () => (
                                                    <Image 
                                                        source={require('./assets/icon.png')}
                                                        style={{ width: 100, height: 30, marginLeft: 10 }}
                                                    />
                                                )
                                            }} 
                                        />
                            ) : (
                                // Main app screens
                                <>
                                    <Stack.Screen 
                                        name="MainTabs" 
                                        component={MainTabs} 
                                        options={{ 
                                            headerShown: false,
                                            gestureEnabled: false // Prevent going back to login
                                        }} 
                                    />
                                    <Stack.Screen name="ResultsQuiz" component={ResultsQuiz} options={{ title: 'Résultats du Quiz' }} />
                                    <Stack.Screen name="StartResponse" component={StartResponse} options={{ title: 'Répondre au Quiz' }} />
                                    <Stack.Screen name="LogoutScreen" component={Logout} options={{ title: 'Déconnexion' }} />
                                </>
                            )}
                        </Stack.Navigator>
                    </NavigationContainer>
                </NavigationRef.Provider>
            </UserContext.Provider>
        </PaperProvider>
    );
}
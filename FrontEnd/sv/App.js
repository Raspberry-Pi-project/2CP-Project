import React, { useState, createContext, useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, LogBox, TouchableOpacity, Platform, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from './react-native-paper.config';
import { COLORS, PLATFORM_STYLES } from './theme/appTheme';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Asyncstorage has been extracted',
  'VirtualizedLists should never be nested'
]);

// Import screens
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import History from './screens/History';
import ResultsQuiz from './screens/ResultsQuiz';
import TakeQuiz from './screens/TakeQuiz';
import MyProfile from './screens/MyProfile';
import Logout from './screens/LogoutScreen';
import StartResponse from './screens/StartResponse';

export const UserContext = createContext();
export const NavigationRef = createContext();
export const ThemeContext = createContext();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.text.medium,
                headerShown: true,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: Platform.OS === 'web' ? COLORS.primary : COLORS.cardBackground,
                },
                headerTintColor: Platform.OS === 'web' ? COLORS.text.white : COLORS.primary,
                tabBarStyle: {
                    ...Platform.select({
                        ios: {
                            paddingBottom: 10,
                            height: 90
                        },
                        android: {
                            paddingBottom: 5,
                            height: 60
                        },
                        web: {
                            paddingBottom: 0,
                            height: 50
                        }
                    })
                }
            })}
        >
           <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ 
                    title: 'Accueil',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                    )
                }} 
            />
           <Tab.Screen 
                name="History" 
                component={History} 
                options={{ 
                    title: 'History',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'time' : 'time-outline'} size={size} color={color} />
                    )
                }} 
            />
           <Tab.Screen 
                name="TakeQuiz" 
                component={TakeQuiz} 
                options={{ 
                    title: 'Quiz',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={color} />
                    )
                }} 
            />
           <Tab.Screen 
                name="MyProfile" 
                component={MyProfile} 
                options={{ 
                    title: 'Profil',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
                    )
                }} 
            />
           <Tab.Screen 
                name="Logout" 
                component={Logout} 
                options={{ 
                    title: 'Déconnexion',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'log-out' : 'log-out-outline'} size={size} color={color} />
                    )
                }} 
            />
        </Tab.Navigator>
    );
};

export default function App() {
    const [userData, setUserData] = useState(null);
    const [appTheme, setAppTheme] = useState('light'); // For future dark mode support
    const navigationRef = useRef(null);
    
    // Load user data from AsyncStorage on app start
    useEffect(() => {
      const loadUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('userData');
          if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            console.log('Initial userData in App:', parsedUserData);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };
      
      loadUserData();
    }, []);
  
    return (
      <PaperProvider theme={theme}>
        <StatusBar 
          backgroundColor={COLORS.primary} 
          barStyle="light-content" 
        />
        <ThemeContext.Provider value={{ theme: appTheme, setTheme: setAppTheme }}>
          <UserContext.Provider value={{ 
            userData, 
            setUserData: async (data) => {
              setUserData(data);
              try {
                if (data) {
                  await AsyncStorage.setItem('userData', JSON.stringify(data));
                } else {
                  await AsyncStorage.removeItem('userData');
                }
              } catch (error) {
                console.error('Error saving user data:', error);
              }
            } 
          }}>
            <NavigationRef.Provider value={navigationRef}>
              <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: COLORS.primary,
                    },
                    headerTintColor: COLORS.text.white,
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                >
                  {!userData ? (
                    // Auth screens when not logged in
                    <Stack.Screen 
                      name="SignIn" 
                      component={SignInScreen} 
                      options={{ 
                        title: 'TRIVIO Quiz',
                        headerShown: Platform.OS !== 'web',
                      }} 
                    />
                  ) : (
                    // Main app screens when logged in
                    <>
                      <Stack.Screen 
                        name="MainTabs" 
                        component={MainTabs} 
                        options={{ 
                          headerShown: false,
                          gestureEnabled: false
                        }} 
                      />
                      <Stack.Screen 
                         name="ResultsQuiz" 
                         component={ResultsQuiz} 
                           options={{ 
                               title: 'Résultats du Quiz',
                           }} 
                      />
                      <Stack.Screen 
                           name="StartResponse" 
                            component={StartResponse} 
                                   options={({ navigation }) => ({ 
                                              title: 'Answer the Quiz',
                                  })} 
                       />
                    </>
                  )}
                </Stack.Navigator>
              </NavigationContainer>
            </NavigationRef.Provider>
          </UserContext.Provider>
        </ThemeContext.Provider>
      </PaperProvider>
    );
}

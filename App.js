import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
 import HomeScreen from './src/screens/HomeScreen';


//import LanguageQuizScreen from './screens/LanguageQuizScreen';
import AboutScreen from './src/screens/AboutScreen';
import QuizScreen from './src/screens/QuizScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CreateQuizScreen from './src/screens/CreateQuizScreen';
import ContactScreen from './src/screens/ContactScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: { backgroundColor: '#F2FBFF' }, // Light blue background
          headerStyle: { backgroundColor: '#800080' }, // Purple header
          headerTintColor: '#fff', // White text in header
          drawerActiveBackgroundColor: '#800080', // Orange for active item
          drawerActiveTintColor: '#fff', // White text for active item
          drawerInactiveTintColor: '#1E1E6F', // Dark blue inactive text
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen name="Quiz" component={QuizScreen} />
        <Drawer.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="Create Quiz" component={CreateQuizScreen} />
        <Drawer.Screen name="Contact Us" component={ContactScreen} />
      </Drawer.Navigator>

      {/* <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LanguageQuiz" component={LanguageQuizScreen} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}

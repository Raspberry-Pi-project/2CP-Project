"use client"

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useState, useEffect } from "react"
import FirstScreen from "./screens/FirstScreen"
import LoginScreen from "./screens/LoginScreen"
import HomeScreen from "./screens/HomeScreen"
import QuizletScreen from "./screens/QuizletScreen"
import QuizletScreen2 from "./screens/QuizletScreen2"
import QuizScreen from "./screens/QuizScreen"
import QuizScoreScreen from "./screens/QuizScoreScreen"
import ProfileScreen from "./screens/ProfileScreen"
import QuizInfoScreen from "./screens/QuizInfoScreen"
import FeedbackScreen from "./screens/FeedbackScreen"
import StudentPrivateChartScreen from "./screens/StudentPrivateChartScreen"
import notificationManager, { NotificationManager } from "./components/NotificationManager"
import { LogBox } from "react-native"

// Ignore specific warnings that might be causing issues
LogBox.ignoreLogs([
  "Animated: `useNativeDriver` was not specified",
  "VirtualizedLists should never be nested",
  "Can't perform a React state update on an unmounted component",
])

const Stack = createNativeStackNavigator()

export default function App() {
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Show notification after a short delay to ensure app is fully loaded
    const timer = setTimeout(() => {
      // Using the advanced notification manager
      notificationManager.show("A new Physics quiz is now available!", "NEW_QUIZ", 5000)

      // After a delay, show another type of notification as a demo
      setTimeout(() => {
        notificationManager.show("You've completed 5 quizzes!", "ACHIEVEMENT", 5000)
      }, 6000)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="First" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="First" component={FirstScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="QuizInfo" component={QuizInfoScreen} />
          <Stack.Screen name="Quizlet" component={QuizletScreen} />
          <Stack.Screen name="Quizlet2" component={QuizletScreen2} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="QuizScore" component={QuizScoreScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="StudentPrivateChart" component={StudentPrivateChartScreen} />
        </Stack.Navigator>

        {/* Advanced Notification Manager with ref */}
        <NotificationManager ref={notificationManager.ref} />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

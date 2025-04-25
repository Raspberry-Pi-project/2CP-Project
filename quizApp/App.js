"use client"

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useState, useEffect, createContext } from "react"
import FirstScreen from "./screens/FirstScreen"
import LoginScreen from "./screens/LoginScreen"
import HomeScreen from "./screens/HomeScreen"
import QuizletScreen from "./screens/QuizletScreen"
import QuizletScreen2 from "./screens/QuizletScreen2"
import QuizScreen from "./screens/QuizScreen"
import QuizScoreScreen from "./screens/QuizScoreScreen"
import ProfileScreen from "./screens/ProfileScreen"
import QuizInfoScreen from "./screens/QuizInfoScreen"
import QuizHistoryScreen from "./screens/QuizHistoryScreen"
import FeedbackScreen from "./screens/FeedbackScreen"
import StudentPrivateChartScreen from "./screens/StudentPrivateChartScreen"
import notificationManager, { NotificationManager } from "./components/NotificationManager"
import { LogBox } from "react-native"
import ReviewQuestionScreen from "./screens/ReviewQuestionScreen"
import ReviewQuestionHistory from "./screens/ReviewQuestionHistory"
import QuizScreenForHistory from "./screens/QuizScreenForHistory"

// Ignore specific warnings that might be causing issues
LogBox.ignoreLogs([
  "Animated: `useNativeDriver` was not specified",
  "VirtualizedLists should never be nested",
  "Can't perform a React state update on an unmounted component",
])

const Stack = createNativeStackNavigator()

// Create UserContext for global user data
export const UserContext = createContext(null);

export default function App() {
  const [showNotification, setShowNotification] = useState(false)
  const [userData, setUserData] = useState(null)

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
    <UserContext.Provider value={{ userData, setUserData }}>
      <SafeAreaProvider>
        {/* Temporarily disabled OfflineOnly component to work online */}
        <>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator 
              initialRouteName="First" 
              screenOptions={{ headerShown: false }}
              screenListeners={{
                // This will handle the navigation to intercept ResultsQuiz navigation
                beforeRemove: (e) => {
                  // We don't do anything on beforeRemove, this is just a placeholder
                },
              }}
            >
              <Stack.Screen name="First" component={FirstScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="QuizInfo" component={QuizInfoScreen} />
              <Stack.Screen name="QuizHistoryScreen" component={QuizHistoryScreen} />
              <Stack.Screen name="Quizlet" component={QuizletScreen} />
              <Stack.Screen name="Quizlet2" component={QuizletScreen2} />
              <Stack.Screen 
                name="Quiz" 
                component={QuizScreen} 
                options={({ route }) => ({
                  headerShown: false,
                  gestureEnabled: false, // Disable swipe back
                  // Only return to the specific screen if not prevented
                  presentation: route.params?.quizResults?.preventBackNavigation ? 'modal' : 'card',
                })}
              />
              <Stack.Screen name="QuizScore" component={QuizScoreScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Feedback" component={FeedbackScreen} />
              <Stack.Screen name="StudentPrivateChart" component={StudentPrivateChartScreen} />
              <Stack.Screen name="ReviewQuestion" component={ReviewQuestionScreen} />
              <Stack.Screen name="ReviewQuestionHistory" component={ReviewQuestionHistory} />
              <Stack.Screen name="QuizScreenForHistory" component={QuizScreenForHistory} />
              <Stack.Screen 
                name="ResultsQuiz" 
                component={QuizHistoryScreen}
                options={{
                  headerShown: false
                }}
                initialParams={{
                  fromHistory: true
                }}
              />
            </Stack.Navigator>

            {/* Advanced Notification Manager with ref */}
            <NotificationManager ref={notificationManager.ref} />
          </NavigationContainer>
        </>
      </SafeAreaProvider>
    </UserContext.Provider>
  )
}
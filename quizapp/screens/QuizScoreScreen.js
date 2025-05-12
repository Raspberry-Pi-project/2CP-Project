"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Easing, 
  Dimensions,
  FlatList,
  StatusBar,
  Alert,
  ActivityIndicator
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Circle, Path } from "react-native-svg"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors } from "../constants/colors"
import { Feather as Icon } from "@expo/vector-icons"
import axios from "axios"
import { API_URL } from "../services/config"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width, height } = Dimensions.get("window")

// Floating bubbles component
const FloatingBubbles = () => {
  const bubbles = [
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 120,
      position: { top: "5%", left: "10%" },
      opacity: 0.15,
      duration: 15000,
    },
    // ... other bubble configurations
  ]

  useEffect(() => {
    bubbles.forEach((bubble) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubble.ref, {
            toValue: 1,
            duration: bubble.duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bubble.ref, {
            toValue: 0,
            duration: bubble.duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start()
    })

    return () => {
      bubbles.forEach(bubble => bubble.ref.stopAnimation())
    }
  }, [])

  return (
    <>
      {bubbles.map((bubble, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bubble,
            {
              ...bubble.position,
              width: bubble.size,
              height: bubble.size,
              opacity: bubble.opacity,
              transform: [
                {
                  translateY: bubble.ref.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, index % 2 === 0 ? 15 : -15, 0],
                  }),
                },
                {
                  translateX: bubble.ref.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, index % 3 === 0 ? 10 : -10, 0],
                  }),
                },
                {
                  scale: bubble.ref.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.05, 1],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </>
  )
}

// Score circle component

const ScoreCircle = ({ score, total }) => {
  //const scorePercentage = Math.min(100, Math.max(0, score));

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score / 100,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()
  }, [score])

  const radius = 50
  const circleCircumference = 2 * Math.PI * radius
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circleCircumference, 0],
  })


  return (
    <View style={styles.scoreCircleContainer}>
      <Svg width="120" height="120" viewBox="0 0 120 120">
        <Circle cx="60" cy="60" r={radius} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="10" fill="transparent" />
        <AnimatedCircle
          cx="60"
          cy="60"
          r={radius}
          stroke="#4ADE80"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circleCircumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin="60, 60"
        />
      </Svg>
      <View style={styles.scoreTextContainer}>
        <Text style={styles.scorePercentage}>{Math.round(score)}%</Text>
    </View>
    </View>
  )
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

// Question item component
const QuestionItem = ({ attempt, index, onPress, animationDelay = 0 , totalScore}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  
  useEffect(() => {
    const delay = animationDelay + index * 100;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      })
    ]).start();

    return () => {
      fadeAnim.stopAnimation();
      slideAnim.stopAnimation();
    }
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return "Unknown date";
    }
  };


  return (
    <Animated.View 
      style={[
        styles.attemptItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.attemptItemContent}
        onPress={() => onPress(attempt)}
        activeOpacity={0.7}
      >
        <View style={styles.attemptItemLeft}>
          <Text style={styles.attemptText}>Attempt {index + 1}</Text>
          <Text style={styles.attemptDate}>{formatDate(attempt.attempt_at)}</Text>
        </View>
        <View style={styles.scoreDisplay}>
          <Text style={[
            styles.scoreValue, 
            { color: (attempt.score / totalScore)*100  >= 50 ? '#4ADE80' : '#FF5252' }
          ]}>
            {Math.round((attempt.score / totalScore)*100)}%
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function QuizScoreScreen({ navigation, route }) {
  const headerAnim = useRef(new Animated.Value(0)).current
  const contentAnim = useRef(new Animated.Value(0)).current

  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')


  const { id_quiz, score , totalQuestions = 10, timeSpent = 0 } = route.params || {}


  // Calculate average score whenever attempts change
 /* useEffect(() => {
    if (attempts.length > 0) {
     // const sum = attempts.reduce((acc, attempt) => acc + attempt.score, 0);
     const sum = attempts.reduce((acc, attempt) => {
      // Ensure the score is a number
      const attemptScore = Number(attempt.score) || 0;
      return acc + attemptScore;
    }, 0);

     const avg = sum / attempts.length;
      setAverageScore(avg);
      
      const questionsPerAttempt = totalQuestions || 10;

      const totalQuestionsCount = attempts.reduce((acc, attempt) => {
        // If the attempt has correct_answers and total_questions fields, use them
        if (attempt.correct_answers && attempt.total_questions) {
          return acc + attempt.total_questions;
        }
        // Otherwise use the totalQuestions from route params for each attempt
        return acc + (totalQuestions || 10);
      }, 0);
    
      
      setTotalQuestionsAttempted(totalQuestionsCount);
    } else if (score) {
      // If no attempts but we have a score parameter (from the last quiz), use that
      setAverageScore(Number(score) || 0);
      setTotalQuestionsAttempted(totalQuestions || 0);
    } else {
      // Default values if no data
      setAverageScore(0);
      setTotalQuestionsAttempted(0);
    }
  }, [attempts, score, totalQuestions]); */

  const [averageScore, setAverageScore] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  useEffect(() => {
    if (attempts.length > 0) {
      const validAttempts = attempts.filter(attempt => !isNaN(Number(attempt.score)));
      
      if (validAttempts.length > 0) {
        const totalScore = validAttempts.reduce((sum, attempt) => sum + Number(attempt.score), 0);        const avg = totalScore / validAttempts.length;
        const avgScore = totalScore / validAttempts.length;
      
        console.log("Calculated average:", avgScore); // Debug log
        setAverageScore(avgScore);
      } else {
        setAverageScore(0);
      }

      setAttemptsCount(attempts.length);

    } else if (score > 0) {
      setAverageScore(parseFloat(score));
      setAttemptsCount(1);
    } else {
      setAverageScore(0);
      setAttemptsCount(0);
    }
  }, [attempts, score]);


  // Fetch quiz attempts with proper error handling


  const fetchAttempts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const quizId = id_quiz || route.params?.id_quiz;
      if (!quizId) {
        throw new Error("No quiz ID provided");
      }

      const token = await AsyncStorage.getItem("token");

      const studentID = await AsyncStorage.getItem("userId");
      
      const response = await axios.get(`${API_URL}/students/getQuizAttempts/${quizId}`,
        {id_student: parseInt(studentID)},
      
      {

        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.data) {
        throw new Error("No data received");
      }

      //const fetchedAttempts = response.data.attempts || response.data || [];
      //setAttempts(fetchedAttempts);

      const fetchedAttempts = (response.data.attempts || response.data || []).map(attempt => ({
        ...attempt,
        score: parseFloat(attempt.score) || 0, // Ensure score is a number
        // Remove correct/total questions if not needed
      }));
      
      console.log("Fetched attempts:", fetchedAttempts); // Debug log
      setAttempts(fetchedAttempts);
      
    } catch (err) {
      console.error("API Error:", err);
      setError('Failed to load attempts. Please try again.');
   
    } finally {
      setLoading(false);
    }
  }, [id_quiz, route.params?.id_quiz]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const getFilteredAttempts = useCallback(() => {
    switch(filterStatus) {
      case 'passed': return attempts.filter(item => (item.score/score) *100 >= 50);
      case 'failed': return attempts.filter(item => (item.score/score) *100 < 50);
      default: return attempts;
    }
  }, [filterStatus, attempts]);

  const filteredAttempts = getFilteredAttempts();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  const goToHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    StatusBar.setHidden(true);
    
    const animationSequence = Animated.stagger(300, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);
    
    animationSequence.start();

    return () => {
      StatusBar.setHidden(false);
      animationSequence.stop?.();
      headerAnim.stopAnimation();
      contentAnim.stopAnimation();
    }
  }, []);

  const keyExtractor = useCallback((item) => 
    item.id_attempt?.toString() || Math.random().toString(), []);

  const handleAttemptPress = useCallback(async (attempt) => {
    try {
      setLoading(true);

      console.log("Attempt ID:", attempt.id_attempt);  // This will log the attempt ID for verification
      console.log("Quiz ID:", attempt.id_quiz);  // Log quiz ID for debugging

      if (!attempt.id_attempt || !attempt.id_quiz) {
        throw new Error('Missing necessary information to proceed.');
      }

      // 1. First navigate to the history screen immediately
      navigation.navigate("QuizScreenForHistory", {
        attemptId: attempt.id_attempt,
        quizId: attempt.id_quiz, // Make sure this is passed
      });
      
    } catch (error) {
      Alert.alert("Error", "Failed to navigate to attempt details");
      console.error("Error navigating to attempt details:", error);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  const renderItem = useCallback(({ item, index }) => (
    <QuestionItem
      attempt={item}
      index={index}
      totalScore={score}
      onPress={handleAttemptPress}
      animationDelay={500}
    />
  ), [handleAttemptPress]);

  const renderFilterOptions = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>Filter by:</Text>
      <View style={styles.filterButtonsRow}>
        {['all', 'passed', 'failed'].map((status) => (
          <TouchableOpacity 
            key={status}
            style={[
              styles.filterButton, 
              filterStatus === status && styles.filterButtonActive
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Icon 
              name={
                status === 'all' ? 'list' : 
                status === 'passed' ? 'check-circle' : 'x-circle'
              } 
              size={16} 
              color={filterStatus === status ? 'white' : '#666'} 
            />
            <Text style={[
              styles.filterButtonText, 
              filterStatus === status && styles.filterButtonTextActive
            ]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#7B5CFF" />
      <Text style={styles.loadingText}>Loading attempts...</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Icon name="alert-triangle" size={50} color="#FF5252" />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={fetchAttempts}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="inbox" size={50} color="#7B5CFF" />
      <Text style={styles.emptyText}>No attempts found</Text>
      <Text style={styles.emptySubtext}>Complete a quiz to see results here</Text>
    </View>
  );


  


  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            })}],
          },
        ]}
      >
        <LinearGradient
          colors={["#A42FC1", "#7B5CFF"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FloatingBubbles />

          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={[styles.navButton, styles.homeButton]}
              onPress={goToHome}
            >
              <Icon name="home" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navButton, styles.backButton]}
              onPress={goBack}
            >
              <Icon name="arrow-left" size={24} color="white" />
            </TouchableOpacity>

            <ScoreCircle 

              score={(attempts?.reduce((total,item) => total + item.score ,0) / (score*attempts.length)) * 100 } 
              total={totalQuestions} 

            />

            {timeSpent > 0 && (
              <View style={styles.timeContainer}>
                <Icon name="clock" size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.timeText}>Time: {formatTime(timeSpent)}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: contentAnim,
            transform: [{ translateY: contentAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            })}],
          },
        ]}
      >
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>Attempts</Text>
          <Text style={styles.contentSubtitle}>View your quiz attempt history</Text>
        </View>

        {renderFilterOptions()}

        {loading ? renderLoading() : 
         error ? renderError() : 
         filteredAttempts.length === 0 ? renderEmpty() : (
          <FlatList
            data={filteredAttempts}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.questionsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    height: height * 0.55, // Take up about half the screen
    width: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingTop: 0, // Remove top padding
    overflow: 'hidden', // Clip bubbles to the header
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  navButton: {
    position: 'absolute',
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  homeButton: {
    right: 20,
  },
  backButton: {
    left: 20,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'white',
  },
  scoreCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scorePercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 10,
    zIndex: 2,
  },
  contentHeader: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  contentSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  questionsList: {
    paddingBottom: 20,
  },
  attemptItem: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 5,
  },
  attemptItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  attemptItemLeft: {
    flex: 1,
  },
  attemptText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  attemptDate: {
    fontSize: 13,
    color: '#888',
  },
  scoreDisplay: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 245, 250, 0.8)',
  },
  scoreValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  filterContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  filterButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f7',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#7B5CFF',
    transform: [{ scale: 1.05 }],
    borderColor: '#7B5CFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  // New styles for loading, error and empty states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#7B5CFF',
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  scoreSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  attemptItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  scoreDisplay: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 245, 250, 0.8)',
    minWidth: 60,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
  }
})
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
import axios from "axios"  // Make sure to have axios installed
import { API_URL } from "../services/config"  // Create this file with your API URL


const { width, height } = Dimensions.get("window")

// Floating bubbles component (unchanged)
const FloatingBubbles = () => {
  const bubbles = [
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 120,
      position: { top: "5%", left: "10%" },
      opacity: 0.15,
      duration: 15000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 80,
      position: { top: "20%", right: "5%" },
      opacity: 0.1,
      duration: 18000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 150,
      position: { bottom: "40%", left: "0%" },
      opacity: 0.08,
      duration: 20000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 100,
      position: { bottom: "10%", right: "15%" },
      opacity: 0.12,
      duration: 25000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 60,
      position: { top: "40%", left: "30%" },
      opacity: 0.1,
      duration: 22000,
    },

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

// Score circle component - updated to handle proper score percentage
const ScoreCircle = ({ score, total }) => {
  // Ensure the score is properly calculated as a percentage between 0-100
  const scorePercentage = Math.min(100, Math.max(0, score));
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: scorePercentage / 100,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()
  }, [scorePercentage])

  const radius = 50
  const circleCircumference = 2 * Math.PI * radius
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circleCircumference, 0],
  })

  return (
    <View style={styles.scoreCircleContainer}>
      <Svg width="120" height="120" viewBox="0 0 120 120">
        {/* Background circle */}
        <Circle cx="60" cy="60" r={radius} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="10" fill="transparent" />
        {/* Progress circle */}
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
        <Text style={styles.scorePercentage}>{Math.round(scorePercentage)}%</Text>
        <Text style={styles.scoreText}>
          {total ? `${Math.round((scorePercentage / 100) * total)}/${total}` : `${scorePercentage}%`}
        </Text>
      </View>
    </View>
  )
}

// Animated Circle component for SVG
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

// Question item component - updated to correctly display the score from backend
const QuestionItem = ({ attempt, index, onPress, animationDelay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  
  // Get the score directly from the backend
  const scorePercentage = attempt.score; // The backend already provides the score as a percentage
  
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
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
            { color: attempt.score >= 50 ? '#4ADE80' : '#FF5252' }
          ]}>
            {Math.round(attempt.score)}%
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function QuizScoreScreen({ navigation, route }) {
  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current
  const contentAnim = useRef(new Animated.Value(0)).current

  // State for attempts data
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Add filter state
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'passed', 'failed'

  // Extract params or use defaults
  const { 
    id_quiz, // this should be passed from the previous screen
    score = 0, 
    totalQuestions = 10, 
    timeSpent = 0 
  } = route.params || {}

  // Fetch quiz attempts from backend
  useEffect(() => {
    const fetchAttempts = async () => {
      setLoading(true);
      try {
        // Use either the quiz ID from route params or a fallback
        const id = id_quiz || route.params?.id_quiz;
        
        if (!id) {
          throw new Error("No quiz ID provided");
        }
        
        const response = await axios.get(`${API_URL}/students/getQuizAttempts/${id}`);
        
        if (response.data && response.data.attempts) {
          // Store the attempts directly from the API response
          setAttempts(response.data.attempts);
        } else {
          setAttempts([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch attempts:", err);
        setError("Failed to load quiz attempts. Please try again.");
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [id_quiz, route.params?.id_quiz]);

  // Filter attempts based on status
  const getFilteredAttempts = useCallback(() => {
    if (filterStatus === 'all') return attempts;
    if (filterStatus === 'passed') return attempts.filter(item => item.score >= 50);
    if (filterStatus === 'failed') return attempts.filter(item => item.score < 50);
    return attempts;
  }, [filterStatus, attempts]);

  const filteredAttempts = getFilteredAttempts();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
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
    // Hide status bar
    StatusBar.setHidden(true);
    
    // Animate header and content with sequence
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
      // Show status bar when unmounting
      StatusBar.setHidden(false);
      
      if (animationSequence.stop) {
        animationSequence.stop();
      }
      headerAnim.stopAnimation();
      contentAnim.stopAnimation();
    }
  }, []);

  // Item extractor for FlatList to prevent re-renders
  const keyExtractor = useCallback((item, index) =>
    item.id_attempt ? item.id_attempt.toString() : `attempt-${index}`, []);

  // Helper function to navigate to quiz history with proper parameters
  const navigateToQuizHistory = useCallback((quizDetails, attemptDetails) => {
    // Calculate correct answers based on student_answers if available
    let correctCount = 0;
    const totalQuestions = quizDetails?.questions?.length || 10;
    
    if (attemptDetails?.student_answers) {
      // If we have student_answers, count correct ones
      correctCount = attemptDetails.student_answers.filter(answer => answer.is_correct).length;
    } else if (attemptDetails?.corrected) {
      // If we have a corrected count from backend, use it
      correctCount = attemptDetails.corrected;
    } else {
      // Fallback calculation from score percentage
      correctCount = Math.round((attemptDetails?.score / 100) * totalQuestions);
    }
    
    // Calculate score percentage based on correct answers
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    const quizResults = {
      score: correctCount,                    // Number of correct answers
      totalQuestions,                         // Total number of questions
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      questions: quizDetails?.questions || [],
      timeSpent: attemptDetails?.time_spent || 0,
      id_quiz: quizDetails?.id_quiz,
      originalQuiz: quizDetails,
      attemptInfo: {
        date: new Date(attemptDetails?.attempt_at || Date.now()).toLocaleDateString(),
        score: scorePercentage,
        corrected: attemptDetails?.corrected || correctCount
      }
    };

    navigation.navigate("QuizScreenForHistory", {
      quizResults,
      attemptId: attemptDetails?.id_attempt,
      id_quiz: quizDetails?.id_quiz,
      quizTitle: quizDetails?.title,
      quizDescription: quizDetails?.description || "Quiz Review"
    });
  }, [navigation]);

  const handleAttemptPress = useCallback(async (attemptData) => {
    try {
      setLoading(true);
      
      // Fetch attempt details
      const attemptResponse = await axios.post(`${API_URL}/students/getAttemptById`, {
        id_attempt: attemptData.id_attempt
      });
      const attemptDetails = attemptResponse.data?.data || attemptData;
  
      // Fetch quiz details
      const quizResponse = await axios.post(`${API_URL}/students/getQuizDetails`, {
        id_quiz: attemptDetails.id_quiz
      });
      const quizDetails = quizResponse.data?.quiz || {};
  
      // Pass the actual corrected value from the backend
      navigateToQuizHistory(quizDetails, {
        ...attemptDetails,
        // Only override if not already present
        corrected: attemptDetails.corrected !== undefined ? attemptDetails.corrected : null
      });
  
    } catch (error) {
      console.error("Error handling attempt press:", error);
      Alert.alert(
        "Error", 
        "Failed to load attempt details",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  }, [navigateToQuizHistory]);

  // Render item function for FlatList
  const renderItem = useCallback(({ item, index }) => (
    <QuestionItem
      attempt={item}
      index={index}
      onPress={handleAttemptPress}
      animationDelay={500} // Start after main animations
    />
  ), [handleAttemptPress]);

  // Render filter options
  const renderFilterOptions = () => {
    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by:</Text>
        <View style={styles.filterButtonsRow}>
          <TouchableOpacity 
            style={[styles.filterButton, filterStatus === 'all' && styles.filterButtonActive]}
            onPress={() => setFilterStatus('all')}
          >
            <Icon name="list" size={16} color={filterStatus === 'all' ? 'white' : '#666'} />
            <Text style={[styles.filterButtonText, filterStatus === 'all' && styles.filterButtonTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filterStatus === 'passed' && styles.filterButtonActive]}
            onPress={() => setFilterStatus('passed')}
          >
            <Icon name="check-circle" size={16} color={filterStatus === 'passed' ? 'white' : '#666'} />
            <Text style={[styles.filterButtonText, filterStatus === 'passed' && styles.filterButtonTextActive]}>
              Passed
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filterStatus === 'failed' && styles.filterButtonActive]}
            onPress={() => setFilterStatus('failed')}
          >
            <Icon name="x-circle" size={16} color={filterStatus === 'failed' ? 'white' : '#666'} />
            <Text style={[styles.filterButtonText, filterStatus === 'failed' && styles.filterButtonTextActive]}>
              Failed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render loading state
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#7B5CFF" />
      <Text style={styles.loadingText}>Loading attempts...</Text>
    </View>
  );

  // Render error state
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Icon name="alert-triangle" size={50} color="#FF5252" />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={() => {
          // Trigger a refetch by updating the state
          setLoading(true);
          // This will re-run the useEffect
          setAttempts([]);
        }}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="inbox" size={50} color="#7B5CFF" />
      <Text style={styles.emptyText}>No attempts found</Text>
      <Text style={styles.emptySubtext}>Take a quiz to see your results here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Purple header section with gradient */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
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
            {/* Home button */}
            <TouchableOpacity 
              style={[styles.navButton, styles.homeButton]}
              onPress={goToHome}
            >
              <Icon name="home" size={24} color="white" />
            </TouchableOpacity>
            
            {/* Back button */}
            <TouchableOpacity 
              style={[styles.navButton, styles.backButton]}
              onPress={goBack}
            >
              <Icon name="arrow-left" size={24} color="white" />
            </TouchableOpacity>

            {/* Score circle - use the most recent attempt score if available */}
            <ScoreCircle 
              score={attempts.length > 0 ? attempts[0].score : score} 
              total={totalQuestions} 
            />

            {/* Time spent if available */}
            {timeSpent > 0 && (
              <View style={styles.timeContainer}>
                <Icon name="clock" size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.timeText}>Time: {formatTime(timeSpent)}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Questions list section */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>Attempts</Text>
          <Text style={styles.contentSubtitle}>View your quiz attempt history</Text>
        </View>

        {/* Add filter component */}
        {renderFilterOptions()}

        {/* Conditional rendering based on loading/error/empty states */}
        {loading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : filteredAttempts.length === 0 ? (
          renderEmpty()
        ) : (
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
  }
})
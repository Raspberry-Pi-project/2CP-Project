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
  Alert
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Circle, Path } from "react-native-svg"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors } from "../constants/colors"
import { Feather as Icon } from "@expo/vector-icons"
// Remove problematic import and use only fallback
// import { QUIZ_DATA } from "../data/quizData"

// Define fallback quiz data to use directly
const HISTORY_QUIZ = {
  id: "5",
  title: "History Quiz",
  subtitle: "World History • 10 questions",
  icon: "book",
  description: "Test your knowledge of historical events, figures, and periods.",
  questions: [
    {
      id: 1,
      text: "In which year did World War II end?",
      options: ["1943", "1945", "1947", "1950"],
      correctAnswer: 1,
    },
    {
      id: 2,
      text: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
      correctAnswer: 2,
    },
    {
      id: 3,
      text: "The ancient city of Rome was founded in which year?",
      options: ["753 BC", "500 BC", "323 BC", "1 AD"],
      correctAnswer: 0,
    },
    {
      id: 4,
      text: "Which empire was ruled by Genghis Khan?",
      options: ["Ottoman Empire", "Roman Empire", "Mongol Empire", "Byzantine Empire"],
      correctAnswer: 2,
    },
    {
      id: 5,
      text: "The French Revolution began in which year?",
      options: ["1789", "1776", "1804", "1812"],
      correctAnswer: 0,
    },
    {
      id: 6,
      text: "Who wrote 'The Communist Manifesto'?",
      options: ["Vladimir Lenin", "Joseph Stalin", "Karl Marx and Friedrich Engels", "Leon Trotsky"],
      correctAnswer: 2,
    },
    {
      id: 7,
      text: "Which ancient wonder was located in Alexandria, Egypt?",
      options: ["Hanging Gardens", "Colossus of Rhodes", "The Great Pyramid", "The Lighthouse (Pharos)"],
      correctAnswer: 3,
    },
    {
      id: 8,
      text: "Which country was NOT involved in the Triple Alliance during World War I?",
      options: ["Germany", "Italy", "Austria-Hungary", "France"],
      correctAnswer: 3,
    },
    {
      id: 9, 
      text: "Who was the leader of the Soviet Union during most of World War II?",
      options: ["Vladimir Lenin", "Joseph Stalin", "Nikita Khrushchev", "Leon Trotsky"],
      correctAnswer: 1,
    },
    {
      id: 10,
      text: "The Renaissance period began in which country?",
      options: ["France", "England", "Italy", "Spain"],
      correctAnswer: 2,
    },
  ],
}

const { width, height } = Dimensions.get("window")

// Floating bubbles component (matches QuizScreen)
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

// Score circle component matching QuizScreen
const ScoreCircle = ({ score, total }) => {
  const animatedValue = useRef(new Animated.Value(0)).current
  const scorePercentage = (score / total) * 100

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: scorePercentage / 100,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()

    return () => {
      animatedValue.stopAnimation()
    }
  }, [])

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
        <Text style={styles.scoreText}>{score}/{total}</Text>
      </View>
    </View>
  )
}

// Animated Circle component for SVG
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

// Attempt item component with neutral styling and enhanced shadow
const QuestionItem = ({ question, index, isCorrect, onPress, animationDelay = 0 }) => {
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
        onPress={() => onPress(question)}
        activeOpacity={0.7}
      >
        <View style={styles.attemptItemLeft}>
          <Text style={styles.attemptText}>{question.text}</Text>
          <Text style={styles.attemptDate}>{question.date}</Text>
        </View>
        <View style={styles.scoreDisplay}>
          <Text style={[
            styles.scoreValue, 
            { color: question.score >= 50 ? '#4ADE80' : '#FF5252' }
          ]}>
            {question.score}%
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function QuizScoreScreen({ navigation, route }) {
  // Remove insets reference as we're not using SafeAreaView
  
  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current
  const contentAnim = useRef(new Animated.Value(0)).current

  // Add filter state
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'passed', 'failed'

  // Extract params or use defaults
  const { 
    score = 0, 
    totalQuestions = 10, 
    timeSpent = 0 
  } = route.params || {}

  // Calculate correct and incorrect answers
  const correctAnswers = score || 0
  const incorrectAnswers = totalQuestions - correctAnswers

  // Sample question results (should ideally come from route.params)
  const allAttempts = Array.from({ length: totalQuestions }, (_, i) => ({
    id: i + 1,
    text: `Attempt ${i + 1}`,
    date: `${new Date().toLocaleDateString()}`,
    isCorrect: i < correctAnswers,
    originalIndex: i,
    score: Math.floor(Math.random() * 100) // Random score for demonstration
  }))

  // Filter attempts based on status
  const getFilteredAttempts = useCallback(() => {
    if (filterStatus === 'all') return allAttempts;
    if (filterStatus === 'passed') return allAttempts.filter(item => item.score >= 50);
    if (filterStatus === 'failed') return allAttempts.filter(item => item.score < 50);
    return allAttempts;
  }, [filterStatus, allAttempts]);

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
  const keyExtractor = useCallback((item) => item.id.toString(), []);
  
  // Render item function for FlatList
  const renderItem = useCallback(({ item, index }) => (
    <QuestionItem
      question={item}
      index={index}
      isCorrect={item.isCorrect}
      onPress={(attemptData) => {
        // Use the direct HISTORY_QUIZ constant - no need for try/catch anymore
        const historyQuiz = HISTORY_QUIZ;
        
        // Take questions from the quiz
        const realQuestions = historyQuiz.questions.slice(0, totalQuestions);
        
        // Generate mock user answers - correct for half the questions
        const userAnswers = realQuestions.map((question, idx) => {
          const correctAnswer = question.correctAnswer;
          // For even-indexed questions, select the correct answer
          // For odd-indexed questions, select an incorrect answer
          const selectedOption = idx % 2 === 0 
            ? correctAnswer 
            : (correctAnswer + 1) % question.options.length;
          
          return {
            id: question.id,
            // Use "Question X" format instead of actual question text
            text: `Question ${idx + 1}`,
            isCorrect: idx % 2 === 0, // Even questions are correct
            selections: [selectedOption], // What the user selected
            answer: selectedOption, // For backward compatibility
            originalIndex: idx // IMPORTANT: Index in the quiz questions array
          };
        });
        
        // Navigate to the dedicated history review screen instead of the regular Quiz screen
        navigation.navigate("QuizScreenForHistory", {
          quizResults: {
            // Basic score information
            score: attemptData.score,
            total: totalQuestions,
            correctCount: Math.round((attemptData.score / 100) * totalQuestions),
            incorrectCount: totalQuestions - Math.round((attemptData.score / 100) * totalQuestions),
            timeSpent: 300, // Mock time spent in seconds
            
            // Questions to display
            questions: userAnswers,
            
            // Original quiz data for reference
            originalQuiz: historyQuiz,
            
            // Quiz ID for reference
            quizId: historyQuiz.id,
            
            // Include attempt info
            attemptInfo: {
              date: attemptData.date
            }
          }
        });
      }}
      animationDelay={500} // Start after main animations
    />
  ), [navigation, totalQuestions]);

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

            {/* Score circle */}
            <ScoreCircle score={correctAnswers} total={totalQuestions} />

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

        <FlatList
          data={filteredAttempts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.questionsList}
          showsVerticalScrollIndicator={false}
        />
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
})

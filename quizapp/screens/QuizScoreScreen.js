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

// Define fallback quiz data to use as backup if API fails
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

// Score circle component (unchanged)
const ScoreCircle = ({ score , totalQuestions  }) => {
  const animatedValue = useRef(new Animated.Value(0)).current
  const scorePercentage = (score / totalQuestions) * 100

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
        <Text style={styles.scoreText}>{score}/{totalQuestions}</Text>
      </View>
    </View>
  )
}

// Animated Circle component for SVG
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

// Attempt item component (updated to use actual attempt data)
const QuestionItem = ({ attempt, index, onPress, animationDelay = 0 }) => {
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

  // TO BE CHANGED 
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

  // Calculate correct and incorrect answers
  const correctAnswers = score || 0
  const incorrectAnswers = totalQuestions - correctAnswers

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
          setAttempts(response.data.attempts);
        } else {
          setAttempts([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch attempts:", err);
        setError("Failed to load quiz attempts. Please try again.");
        // If API fails, we could use mock data as fallback
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


  /*const handleAttemptPress = useCallback(async (attemptData) => {
    try {
      // Start by showing a loading indicator
      setLoading(true);
      
      let attemptDetails = null;
      let quizDetails = null;
      
      // Step 1: Try to get attempt details
      try {
        const response = await axios.post(`${API_URL}/students/getAttemptById`, {
          id_attempt: attemptData.id_attempt
        });
        
        if (response.data && response.data.data) {
          attemptDetails = response.data.data;
        }
      } catch (err) {
        console.log("Error fetching attempt details:", err);
        // Create fallback attempt details
        attemptDetails = {
          id_attempt: attemptData.id_attempt || "fallback-attempt",
          id_quiz: attemptData.id_quiz || id_quiz || "5",
          score: attemptData.score || 0,
          date: attemptData.attempt_at || new Date().toISOString()
        };
      }

      try {
        const quizResponse = await axios.post(`${API_URL}/students/getQuizDetails`, {
          id_quiz: attemptDetails.id_quiz
        });
        
        if (quizResponse.data && quizResponse.data.quiz) {
          quizDetails = quizResponse.data.quiz;
        }
      } catch (err) {
        console.log("Error fetching quiz details:", err);
        // Use fallback quiz data
        quizDetails = HISTORY_QUIZ;
      }

      if (!attemptDetails && !quizDetails) {
        Alert.alert(
          "Connection Error",
          "Could not connect to the server. Would you like to view a local copy of the quiz?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "View Offline",
              onPress: () => navigateToQuizHistory(HISTORY_QUIZ, attemptData)
            }
          ]
        );
        return;
      }

      navigateToQuizHistory(quizDetails, attemptDetails);
      
    } catch (error) {
      console.error("Error navigating to attempt details:", error);
      Alert.alert(
        "Error", 
        "Failed to load attempt details. Would you like to try offline mode?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },

          {
            text: "Use Offline Mode",
            onPress: () => navigateToQuizHistory(HISTORY_QUIZ, attemptData)
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  }, [id_quiz, navigation]); */

   // Helper function to navigate to quiz history with proper parameters
   const navigateToQuizHistory = useCallback((quizDetails, attemptDetails) => {
    // Ensure we have questions
    const questions = (quizDetails?.questions || []).map((q, index) => ({
      ...q,
      originalIndex: index,
      isCorrect: Math.random() > 0.5 // Fallback random correctness if not available
    }));

    const totalQuestions = questions.length || 10;
    const scorePercentage = attemptDetails?.score || 0;
    const correctCount = Math.floor((scorePercentage / 100) * totalQuestions);
    const incorrectCount = totalQuestions - correctCount;



     const quizResults = {
      /*score: attemptDetails?.score || 0,
      correctCount: Math.round((attemptDetails?.score || 0) / 10), // Approximate
      //incorrectCount: 10 - Math.round((attemptDetails?.score || 0) / 10), // Approximate
      incorrectCount: (questions.length || 10) - Math.floor(((attemptDetails?.score || 0) / 100) * (questions.length || 10)),
      total: questions.length || 10,
      questions: questions,
      timeSpent: attemptDetails?.time_spent || 0,
      quizId: quizDetails?.id || "5",
      originalQuiz: quizDetails || HISTORY_QUIZ,
      attemptInfo: {
        date: new Date(attemptDetails?.attempt_at || Date.now()).toLocaleDateString(),
        score: attemptDetails?.score || 0
      } */
        score: scorePercentage,
        correctCount: correctCount,
        incorrectCount: incorrectCount,
        total: questions.length, // Changed 'total' to 'totalQuestions'
        questions: questions,
        timeSpent: attemptDetails?.time_spent || 0,
        quizId: quizDetails?.id || "5",
        originalQuiz: quizDetails || HISTORY_QUIZ,
        attemptInfo: {
          date: new Date(attemptDetails?.attempt_at || Date.now()).toLocaleDateString(),
          score: scorePercentage
        }
      
    };

    navigation.navigate("QuizScreenForHistory", {
      quizResults: quizResults,
      attemptId: attemptDetails?.id_attempt || "fallback",
      id_quiz: quizDetails?.id || "5",
      quizTitle: quizDetails?.title || "History Quiz",
      quizDescription: quizDetails?.description || "Test your knowledge of history"
    });
  }, [navigation]);
    
/*
  const handleAttemptPress = useCallback(async (attemptData) => {
    try {
      // Start by showing a loading indicator
      setLoading(true);
      
      let attemptDetails = null;
      //let quizDetails = null;

      const quizResponse = await axios.post(`${API_URL}/students/getQuizDetails`, {
        id_quiz: attemptData.id_quiz || id_quiz
      });
      
      const quizDetails = quizResponse.data?.quiz || HISTORY_QUIZ;
      
      // Step 1: Try to get attempt details
      try {
        console.log("Getting attempt details for ID:", attemptData.id_attempt);
        const response = await axios.post(`${API_URL}/students/getAttemptById`, {
          id_attempt: attemptData.id_attempt
        });

        console.log("Attempt details response:", response.data);

        
        if (response.data && response.data.data) {
          attemptDetails = response.data.data;
        } else {
          throw new Error("No data returned from attempt details API");
        }
      } catch (err) {
        console.log("Error fetching attempt details:", err);
        // Create fallback attempt details
        attemptDetails = {
          id_attempt: attemptData.id_attempt || "fallback-attempt",
          id_quiz: attemptData.id_quiz || id_quiz || "5",
          score: attemptData.score || 0,
          attempt_at: attemptData.attempt_at || new Date().toISOString()
        };
      }

       // Step 2: Try to get quiz details
    try {
      console.log("Getting quiz details for ID:", attemptDetails.id_quiz);
      const quizResponse = await axios.post(`${API_URL}/students/getQuizDetails`, {
        id_quiz: attemptDetails.id_quiz
      });
      
      console.log("Quiz details response:", quizResponse.data);

      if (quizResponse.data && quizResponse.data.quiz) {
        quizDetails = quizResponse.data.quiz;
      } else {
        console.log("No quiz data in response");
        throw new Error("No data returned from quiz details API");
      }
    } catch (err) {
      console.log("Error fetching quiz details:", err);
      // Use fallback quiz data
      quizDetails = HISTORY_QUIZ;
      console.log("Using fallback quiz data");
    }

      // Step 3: Navigate with whatever data we have
      console.log("Navigating to quiz history with data:", { 
        quizDetails: quizDetails ? "available" : "null", 
        attemptDetails: attemptDetails ? "available" : "null" 
      });
      navigateToQuizHistory(quizDetails, attemptDetails);
    
    } catch (error) {
      console.error("Error handling attempt press:", error);
      Alert.alert(
        "Error", 
        "Failed to load attempt details. Would you like to try offline mode?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Use Offline Mode",
            onPress: () => navigateToQuizHistory(HISTORY_QUIZ, attemptData)
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  }, [id_quiz, navigateToQuizHistory]);  */


const handleAttemptPress = useCallback(async (attemptData) => {
  try {
    setLoading(true);
    
    // Get the quiz details first (you might already have this)
    const quizResponse = await axios.post(`${API_URL}/students/getQuizDetails`, {
      id_quiz: attemptData.id_quiz || id_quiz
    });
    
    const quizDetails = quizResponse.data?.quiz || HISTORY_QUIZ;

    // Then get the specific attempt details
    const attemptResponse = await axios.post(`${API_URL}/students/getAttemptById`, {
      id_attempt: attemptData.id_attempt
    });

    const attemptDetails = attemptResponse.data?.data || {
      id_attempt: attemptData.id_attempt,
      id_quiz: attemptData.id_quiz,
      score: attemptData.score,
      attempt_at: attemptData.attempt_at,
      time_spent: attemptData.time_spent || 0
      // Add any other necessary attempt details
    };

    // Prepare the quiz results object that QuizScreenForHistory expects
    /*const quizResults = {
      score: attemptDetails.score,
      total: quizDetails.questions?.length || 10,
      questions: quizDetails.questions?.map((q, index) => ({
        ...q,
        originalIndex: index,
        isCorrect: false // This should be determined from attempt data
      })) || [],
      correctCount: Math.round((attemptDetails.score / 100) * (quizDetails.questions?.length || 10)),
      incorrectCount: (quizDetails.questions?.length || 10) - Math.round((attemptDetails.score / 100) * (quizDetails.questions?.length || 10)),
      timeSpent: attemptDetails.time_spent || 0,
      quizId: quizDetails.id,
      originalQuiz: quizDetails,
      attemptInfo: {
        date: new Date(attemptDetails.attempt_at).toLocaleDateString(),
        score: attemptDetails.score
      }
    }; */


    // 3. Prepare navigation params
    const navigationParams = {
      quizResults: {
        score: attemptDetails.score,
        total: quizDetails.questions?.length || 10,
        questions: quizDetails.questions?.map((q, index) => ({
          ...q,
          originalIndex: index,
          isCorrect: false // This should come from attempt data if available
        })) || [],
        correctCount: Math.round((attemptDetails.score / 100) * (quizDetails.questions?.length || 10)),
        incorrectCount: (quizDetails.questions?.length || 10) - Math.round((attemptDetails.score / 100) * (quizDetails.questions?.length || 10)),
        timeSpent: attemptDetails.time_spent || 0,
        quizId: quizDetails.id,
        originalQuiz: quizDetails,
        attemptInfo: {
          date: new Date(attemptDetails.attempt_at).toLocaleDateString(),
          score: attemptDetails.score
        }
      }
    };

    console.log("Navigating to QuizScreenForHistory with:", navigationParams);



    // Navigate to QuizScreenForHistory with all the required data
    
        navigation.navigate("QuizScreenForHistory", navigationParams);


  } catch (error) {
    console.error("Error loading attempt details:", error);
    Alert.alert(
      "Error",
      "Could not load attempt details. Would you like to view offline data?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "View Offline", 
          onPress: () => navigation.navigate("QuizScreenForHistory", {
            quizResults: {
              ...HISTORY_QUIZ,
              score: attemptData.score || 0,
              total: HISTORY_QUIZ.questions.length,
              questions: HISTORY_QUIZ.questions.map((q, i) => ({
                ...q,
                originalIndex: i,
                isCorrect: Math.random() > 0.5 // Random for fallback
              })),
              correctCount: Math.round((attemptData.score / 100) * HISTORY_QUIZ.questions.length),
              incorrectCount: HISTORY_QUIZ.questions.length - Math.round((attemptData.score / 100) * HISTORY_QUIZ.questions.length),
              timeSpent: 0,
              quizId: "history-quiz",
              originalQuiz: HISTORY_QUIZ,
              attemptInfo: {
                date: new Date(attemptData.attempt_at).toLocaleDateString(),
                score: attemptData.score
              }
            }
          })
        }
      ]
    );
  } finally {
    setLoading(false);
  }
}, [id_quiz, navigation]);



  // Render item function for FlatList
  const renderItem = useCallback(({ item, index }) => (
    <QuestionItem
      attempt={item}
      index={index}
      onPress={ handleAttemptPress }
        animationDelay={500} // Start after main animations
    />
   ), [handleAttemptPress]);
      
        /*try {
          // First get the attempt details to ensure we have the correct data
          const response = await axios.post(`${API_URL}/students/getAttemptById`, {
            id_attempt: attemptData.id_attempt
          });
          
          if (response.data && response.data.data) {
            const attemptDetails = response.data.data;
            
            // Now get the quiz details for this attempt
            const quizResponse = await axios.post(`${API_URL}/students/getQuizDetails`, {
              id_quiz: attemptDetails.id_quiz
            });
            
            if (quizResponse.data && quizResponse.data.quiz) {
              const quizDetails = quizResponse.data.quiz;
              
              // Navigate to the quiz results screen with all the data
              navigation.navigate("QuizScreenForHistory", {
                attemptId: attemptDetails.id_attempt,
                id_quiz: attemptDetails.id_quiz,
                score: attemptDetails.score,
                // Add any other necessary data
                quizTitle: quizDetails.title,
                quizDescription: quizDetails.description
              });
            } else {
              Alert.alert("Error", "Could not fetch quiz details.");
            }
          } else {
            Alert.alert("Error", "Could not fetch attempt details.");
          }
        } catch (error) {
          console.error("Error navigating to attempt details:", error);
          Alert.alert("Error", "Failed to load attempt details. Please try again.");
        }  
      }}
      animationDelay={500} // Start after main animations
    />
  ), [navigation]);  */

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

            {/* Score circle - using the most recent attempt score if available */}
            <ScoreCircle 
              score={attempts.length > 0 ? Math.round(attempts[0].score / totalQuestions) : correctAnswers} 
              totalQuestions={totalQuestions} 
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
// Updated QuizletScreen2.js with styles from QuizletScreen.js
"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  FlatList,
  Alert,
  Easing,
  Platform,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Circle, Path } from "react-native-svg"
import { QUIZ_DATA } from "../data/quizData"
import QuizBackground from "../components/QuizBackground"

const { width, height } = Dimensions.get("window")
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export default function QuizletScreen2({ navigation, route }) {
  // Check if quiz data exists in route params
  useEffect(() => {
    if (!route.params || !route.params.quiz) {
      Alert.alert("Error", "No quiz data found. Please select a quiz from the home screen.", [
        { text: "Go Back", onPress: () => navigation.goBack() },
      ])
    }
  }, [])

  // Get physics quiz data from route params or use default
  const physicsQuiz = route.params?.quiz ||
    QUIZ_DATA.find((quiz) => quiz.id === "4") || {
      title: "Physics Quiz",
      questions: [],
    }

  const [currentView, setCurrentView] = useState("list") // 'list' or 'question'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current
  const questionAnim = useRef(new Animated.Value(0)).current
  const timerAnim = useRef(new Animated.Value(1)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const nextButtonAnim = useRef(new Animated.Value(0)).current
  const optionsAnim = useRef(
    Array(4)
      .fill()
      .map(() => new Animated.Value(0)),
  ).current

  // Timer settings
  const timerRadius = 25
  const timerStroke = 4
  const timerCircumference = 2 * Math.PI * timerRadius

  // Format time in MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Timer effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerInterval)
          // Time's up, navigate to results
          navigateToResults()
          return 0
        }

        // Pulse animation when time is running low (last 30 seconds)
        if (prev <= 30) {
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start()
        }

        // Update timer animation
        Animated.timing(timerAnim, {
          toValue: prev / 300, // Normalize from 0 to 1
          duration: 1000,
          useNativeDriver: false,
        }).start()

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [])

  // Animation for switching between list and question views
  useEffect(() => {
    if (currentView === "question") {
      // Reset animations for question view
      optionsAnim.forEach((anim) => anim.setValue(0))
      questionAnim.setValue(0)
      nextButtonAnim.setValue(0)

      // Fade out list view, then fade in question view
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(questionAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      // Animate options with staggered effect
      Animated.stagger(
        100,
        optionsAnim.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
        ),
      ).start()

      // Animate next button
      Animated.timing(nextButtonAnim, {
        toValue: 1,
        duration: 500,
        delay: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }).start()
    } else {
      // Fade in list view
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [currentView, currentQuestion])

  const handleSelectQuestion = (index) => {
    setCurrentQuestion(index)
    setSelectedAnswer(answers[index]?.answer !== undefined ? answers[index].answer : null)
    setCurrentView("question")
  }

  const handleAnswer = (index) => {
    setSelectedAnswer(index)
    const isCorrect = index === physicsQuiz.questions[currentQuestion].correctAnswer

    // Update score and correct/incorrect counts
    if (isCorrect) {
      setScore((prev) => prev + 1)
      setCorrectCount((prev) => prev + 1)
    } else {
      setIncorrectCount((prev) => prev + 1)
    }

    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: { answer: index, isCorrect },
    }))
  }

  const navigateToResults = () => {
    // Calculate the number of correct and incorrect answers
    const answeredQuestions = Object.values(answers);
    const correctCount = answeredQuestions.filter(a => a.isCorrect).length;
    const incorrectCount = answeredQuestions.filter(a => !a.isCorrect).length;
    
    // Navigate to "Quiz" with the correct parameters
    navigation.navigate("Quiz", {
      quizResults: {
        score: correctCount,
        total: physicsQuiz.questions.length,
        correctCount: correctCount,
        incorrectCount: incorrectCount,
        questions: physicsQuiz.questions.map((q, index) => ({
          id: index + 1,
          text: `Question ${index + 1}`, // Use generic question text
          isCorrect: answers[index]?.isCorrect || false,
        })),
      },
    })
  }

  // Progress bar component
  const ProgressBar = () => {
    const progressAnim = useRef(new Animated.Value(0)).current
    
    useEffect(() => {
      Animated.timing(progressAnim, {
        toValue: (currentQuestion + 1) / physicsQuiz.questions.length,
        duration: 500,
        useNativeDriver: false,
      }).start()
    }, [currentQuestion])

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1}/{physicsQuiz.questions.length}
        </Text>
      </View>
    )
  }

  // Question item component for the list view
  const renderQuestionItem = ({ item, index }) => {
    const questionNumber = index + 1
    const isAnswered = answers[index] !== undefined

    return (
      <TouchableOpacity
        style={[
          styles.questionListItem,
        ]}
        onPress={() => handleSelectQuestion(index)}
      >
        <Text style={styles.questionListNumber}>Question {questionNumber}</Text>
        <View style={styles.questionRightContent}>
          <Text style={styles.questionListText} numberOfLines={2}>
            {item.text}
          </Text>
          {isAnswered && (
            <View style={styles.answeredIndicator}>
              <Text style={styles.answeredText}>Answered</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const renderListView = () => {
    return (
      <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          
          <ProgressBar />

          <Animated.View
            style={[
              styles.timerContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </Animated.View>
        </View>

        <Text style={styles.headerTitle}>{physicsQuiz.title}</Text>
        <Text style={styles.headerSubtitle}>Select a question to begin</Text>

        <FlatList
          data={physicsQuiz.questions}
          renderItem={renderQuestionItem}
          keyExtractor={(item, index) => `question-${index}`}
          contentContainerStyle={styles.questionsListContent}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.checkResultsButton} onPress={navigateToResults}>
          <LinearGradient colors={["#A42FC1", "#8B27A3"]} style={styles.checkResultsGradient}>
            <Text style={styles.checkResultsText}>Check Results</Text>
            <Icon name="check-circle" size={18} color="white" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const renderQuestionView = () => {
    const question = physicsQuiz.questions[currentQuestion]

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Purple Header - Only for Question Section */}
          <View style={styles.purpleHeader}>
            <LinearGradient colors={["#A42FC1", "#8B27A3"]} style={styles.headerGradient}>
              <QuizBackground />

              <View style={styles.headerControls}>
                <TouchableOpacity onPress={() => setCurrentView("list")} style={styles.backButton}>
                  <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>

                {/* Timer Circle */}
                <Animated.View
                  style={[
                    styles.timerContainer,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <Svg width={timerRadius * 2 + timerStroke} height={timerRadius * 2 + timerStroke}>
                    <Circle
                      cx={timerRadius + timerStroke / 2}
                      cy={timerRadius + timerStroke / 2}
                      r={timerRadius}
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth={timerStroke}
                      fill="white"
                    />
                    <AnimatedCircle
                      cx={timerRadius + timerStroke / 2}
                      cy={timerRadius + timerStroke / 2}
                      r={timerRadius}
                      stroke="#7B5CFF"
                      strokeWidth={timerStroke}
                      fill="transparent"
                      strokeDasharray={timerCircumference}
                      strokeDashoffset={timerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [timerCircumference, 0],
                      })}
                      strokeLinecap="round"
                    />
                  </Svg>
                  <Text style={styles.timerText}>{formatTime(timeLeft).split(":")[1]}</Text>
                </Animated.View>
              </View>

              {/* Question Counter */}
              <View style={styles.questionCounterContainer}>
                <Text style={styles.questionCounter}>
                  Question {currentQuestion + 1}/{physicsQuiz.questions.length}
                </Text>
              </View>

              {/* Question Text */}
              <Animated.View
                style={[
                  styles.questionTextContainer,
                  {
                    opacity: questionAnim,
                    transform: [
                      {
                        translateY: questionAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.questionText}>{question.text}</Text>
              </Animated.View>
            </LinearGradient>
          </View>

          {/* Options (on white background) */}
          <View style={styles.optionsWrapper}>
            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <Animated.View
                  key={index}
                  style={{
                    opacity: optionsAnim[index],
                    transform: [
                      {
                        translateY: optionsAnim[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.option,
                      selectedAnswer === index && styles.selectedOption
                    ]}
                    onPress={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, selectedAnswer === index && styles.selectedOptionText]}>
                      {option}
                    </Text>

                    {selectedAnswer === index && (
                      <View style={styles.selectionIndicator}>
                        <Svg width={20} height={20} viewBox="0 0 24 24">
                          <Path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                            fill="#A42FC1"
                          />
                          <Path
                            d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                            fill="#A42FC1"
                          />
                        </Svg>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navigationButtons}>
              <Animated.View
                style={{
                  width: "100%",
                  opacity: nextButtonAnim,
                  transform: [
                    {
                      translateY: nextButtonAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  disabled={selectedAnswer === null}
                  onPress={() => {
                    if (selectedAnswer !== null) {
                      setCurrentView("list")
                    }
                  }}
                >
                  <Text style={styles.navButtonText}>Submit</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {currentView === "list" ? (
        <>
          <LinearGradient colors={["#A42FC1", "#8B27A3"]} style={StyleSheet.absoluteFill} />
          <QuizBackground />
          {renderListView()}
        </>
      ) : (
        renderQuestionView()
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Light background color for the main container
  },
  content: {
    flex: 1,
  },
  // List View Styles
  listContainer: {
    flex: 1,
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    marginRight: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
  },
  progressText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 30,
  },
  questionsListContent: {
    paddingBottom: 100,
  },
  questionListItem: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 18,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#E1E1E1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionListNumber: {
    fontSize: 14,
    color: "#A42FC1",
    fontWeight: "500",
    marginBottom: 5,
  },
  questionRightContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  questionListText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  answeredIndicator: {
    backgroundColor: 'rgba(164, 47, 193, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 10,
  },
  answeredText: {
    color: '#A42FC1',
    fontSize: 12,
    fontWeight: '500',
  },
  checkResultsButton: {
    position: "absolute",
    bottom: 20,
    left: "20%",
    right: "20%",
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  checkResultsGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  checkResultsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Question View Styles (from QuizletScreen)
  purpleHeader: {
    height: 220, // Adjusted height to only contain the question
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingBottom: 20,
  },
  headerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  timerContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    position: "absolute",
    color: "#333333",
    fontSize: 18,
    fontWeight: "bold",
  },
  questionCounterContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  questionCounter: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  questionTextContainer: {
    marginTop: 10,
    backgroundColor: "transparent",
  },
  questionText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
  },
  optionsWrapper: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Light background color for options
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 80, // Space for navigation buttons
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A42FC1",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: "#A42FC1",
    backgroundColor: "rgba(164, 47, 193, 0.05)",
    transform: [{ scale: 1.02 }],
  },
  optionText: {
    fontSize: 16,
    color: "#333333",
  },
  selectedOptionText: {
    fontWeight: "500",
    color: "#A42FC1",
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationButtons: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  navButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    backgroundColor: "#A42FC1",
  },
  navButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
})
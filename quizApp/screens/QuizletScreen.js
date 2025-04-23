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
  Easing,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  TextInput,
  AppState,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import QuizBackground from "../components/QuizBackground"
import Svg, { Circle, Path } from "react-native-svg"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export default function QuizletScreen({ navigation, route }) {
  // AppState reference to track app state changes
  const appState = useRef(AppState.currentState);

  // Check if quiz data exists in route params
  useEffect(() => {
    if (!route.params || !route.params.quiz) {
      Alert.alert("Error", "No quiz data found. Please select a quiz from the home screen.", [
        { text: "Go Back", onPress: () => navigation.goBack() },
      ])
    }
  }, [])

  // Get quiz data from route params or use a default quiz
  const quiz = route.params?.quiz || {
    title: "Sample Quiz",
    questions: [
      {
        id: 1,
        text: "Sample question",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 0,
      },
    ],
  }

  // Ensure questions array exists
  const questions = quiz.questions || []

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [customAnswer, setCustomAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [timeLeft, setTimeLeft] = useState(15)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(5) // Example starting values
  const [incorrectAnswers, setIncorrectAnswers] = useState(7)
  const [timerActive, setTimerActive] = useState(true)
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill([]))

  // Animation refs
  const progressAnim = useRef(new Animated.Value(0)).current
  const questionAnim = useRef(new Animated.Value(0)).current
  const timerProgress = useRef(new Animated.Value(1)).current
  const timerOpacity = useRef(new Animated.Value(1)).current
  const shakeAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const customInputAnim = useRef(new Animated.Value(0)).current
  const nextButtonAnim = useRef(new Animated.Value(0)).current

  // Create option animations for each question
  const optionsAnim = useRef(
    Array(5)
      .fill()
      .map(() => new Animated.Value(0)),
  ).current

  // Reset quiz function to be called when app returns to foreground
  const resetQuiz = () => {
    // Reset all quiz state
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setCustomAnswer("")
    setScore(0)
    setAnswers(Array(questions.length).fill(null))
    setTimeLeft(15)
    setShowCustomInput(false)
    setCorrectAnswers(5)
    setIncorrectAnswers(7)
    setTimerActive(true)
    setSelectedAnswers(Array(questions.length).fill([]))
    
    // Reset animations
    questionAnim.setValue(0)
    timerProgress.setValue(1)
    timerOpacity.setValue(1)
    pulseAnim.setValue(1)
    nextButtonAnim.setValue(0)
    progressAnim.setValue(0)
    optionsAnim.forEach(anim => anim.setValue(0))
    customInputAnim.setValue(0)
    shakeAnim.setValue(0)
    
    // Start animations for first question
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: 1 / questions.length,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(questionAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start()
    
    // Animate options with staggered effect
    const numOptions = questions[0]?.options?.length + 1 || 1
    Animated.stagger(
      100,
      optionsAnim.slice(0, numOptions).map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ),
    ).start()
    
    // Alert user that quiz has been reset
    Alert.alert(
      "Quiz Reset",
      "Your quiz progress was lost because you left the app. Please start over.",
      [{ text: "OK" }]
    )
  }

  // Listen for AppState changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      // If app goes from background to active, reset quiz
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === "active"
      ) {
        resetQuiz();
      }
      
      // Update app state reference
      appState.current = nextAppState;
    });
    
    return () => {
      subscription.remove();
    };
  }, [questions]);

  // Timer settings
  const timerRadius = 25
  const timerStroke = 4
  const timerCircumference = 2 * Math.PI * timerRadius

  useEffect(() => {
    // Reset animations for new question
    optionsAnim.forEach((anim) => anim.setValue(0))
    questionAnim.setValue(0)
    nextButtonAnim.setValue(0)

    // Animate progress and question
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: (currentQuestion + 1) / questions.length,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(questionAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start()

    // Animate options with staggered effect
    const currentOptions = questions[currentQuestion]?.options || []
    const numOptions = currentOptions.length + 1 // +1 for "Other" option

    Animated.stagger(
      100,
      optionsAnim.slice(0, numOptions).map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
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

    // Reset custom input state
    setShowCustomInput(false)
    setCustomAnswer("")
    customInputAnim.setValue(0)

    // Always reset timer to 15 when changing questions
    setTimeLeft(15)
    timerProgress.setValue(1)
    timerOpacity.setValue(1)
    setTimerActive(true)
  }, [currentQuestion])

  useEffect(() => {
    // Timer animation
    let timerInterval

    if (timerActive) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            handleNext()
            return 15 // Reset to 15 when timer hits 0
          }
          const newTime = prev - 1

          Animated.timing(timerProgress, {
            toValue: newTime / 15,
            duration: 1000,
            useNativeDriver: true,
          }).start()

          // Pulse animation when time is running low
          if (newTime <= 5) {
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

          if (newTime === 0) {
            Animated.timing(timerOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start()
          }

          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(timerInterval)
  }, [currentQuestion, timerActive])

  useEffect(() => {
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true)
    })
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false)
    })

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const handleAnswer = (index) => {
    // If "Other" option is selected
    if (index === (questions[currentQuestion]?.options?.length || 0)) {
      setShowCustomInput(true)
      setTimerActive(false) // Pause timer when custom input is shown
      Animated.timing(customInputAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
      return
    }

    // Animate the selection
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    // Multiple selection logic
    const newSelectedAnswers = [...selectedAnswers]
    const currentSelections = [...(newSelectedAnswers[currentQuestion] || [])]
    
    // Toggle selection - if already selected, remove it; if not, add it
    const selectionIndex = currentSelections.indexOf(index)
    if (selectionIndex >= 0) {
      currentSelections.splice(selectionIndex, 1)
    } else {
      currentSelections.push(index)
    }
    
    newSelectedAnswers[currentQuestion] = currentSelections
    setSelectedAnswers(newSelectedAnswers)
    
    // For backward compatibility, set the most recent selection
    setSelectedAnswer(index)
    
    // Update the answers array for scoring
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = currentSelections
    setAnswers(newAnswers)
  }

  const handleCustomAnswer = () => {
    if (customAnswer.trim()) {
      const index = -1 // Special index for custom answer
      setSelectedAnswer(index)
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = { custom: customAnswer }
      setAnswers(newAnswers)
      Keyboard.dismiss()

      // Move to next question after submitting custom answer
      handleNext()
    } else {
      // Shake animation for empty input
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      // Reset animations for next question
      questionAnim.setValue(0)
      timerProgress.setValue(1)
      timerOpacity.setValue(1)
      pulseAnim.setValue(1)
      nextButtonAnim.setValue(0)

      // Move to next question
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(15) // Reset timer
      setTimerActive(true) // Ensure timer is active for next question
    } else {
      // Quiz is complete - calculate score based on selected answers
      const finalScore = questions.reduce((totalScore, question, idx) => {
        const userAnswers = selectedAnswers[idx] || [];
        const correctAnswer = question.correctAnswer;
        
        // If there's only one correct answer
        if (typeof correctAnswer === 'number') {
          return userAnswers.includes(correctAnswer) ? totalScore + 1 : totalScore;
        } 
        // If there are multiple correct answers (assuming correctAnswer is an array)
        else if (Array.isArray(correctAnswer)) {
          // Check if user selected all correct answers and only correct answers
          const allCorrectSelected = correctAnswer.every(ans => userAnswers.includes(ans));
          const onlyCorrectSelected = userAnswers.every(ans => correctAnswer.includes(ans));
          return (allCorrectSelected && onlyCorrectSelected) ? totalScore + 1 : totalScore;
        }
        
        return totalScore;
      }, 0);
      
      // Navigate to results screen with updated data
      navigation.navigate("Quiz", {
        quizResults: {
          score: finalScore,
          total: questions.length,
          correctCount: finalScore,
          incorrectCount: questions.length - finalScore,
          questions: questions.map((q, index) => ({
            id: q.id || index + 1,
            text: `Question ${index + 1}`,
            isCorrect: selectedAnswers[index]?.includes(q.correctAnswer) || false,
          })),
        },
      });
    }
  }

  // Ensure we have a current question to display
  const currentQuestionData = questions[currentQuestion] || {
    text: "Loading question...",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Background */}
        <View style={styles.content}>
          {/* Purple Header - Only for Question Section */}
          <View style={styles.purpleHeader}>
            <LinearGradient colors={["#A42FC1", "#8B27A3"]} style={styles.headerGradient}>
              <QuizBackground />

              <View style={styles.headerControls}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>

                {/* Score Circle */}
                <Animated.View
                  style={[
                    styles.timerContainer,
                    {
                      opacity: timerOpacity,
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
                      strokeDashoffset={timerProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [timerCircumference, 0],
                      })}
                      strokeLinecap="round"
                    />
                  </Svg>
                  <Text style={[styles.timerText, timeLeft < 6 && styles.timerTextRed]}>{timeLeft}</Text>
                </Animated.View>
              </View>

              {/* Question Counter */}
              <View style={styles.questionCounterContainer}>
                <Text style={styles.questionCounter}>Question {currentQuestion + 1}/20</Text>
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
                <Text style={styles.questionText}>{currentQuestionData.text}</Text>
              </Animated.View>
            </LinearGradient>
          </View>

          {/* Options (on white background) - Now completely separate from purple header */}
          <View style={styles.optionsWrapper}>
            <View style={styles.optionsContainer}>
              {showCustomInput ? (
                <Animated.View
                  style={[
                    styles.customInputContainer,
                    {
                      opacity: customInputAnim,
                      transform: [
                        {
                          translateY: customInputAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                        {
                          translateX: shakeAnim,
                        },
                      ],
                    },
                  ]}
                >
                  <TextInput
                    style={styles.customInput}
                    placeholder="Enter your answer..."
                    value={customAnswer}
                    onChangeText={setCustomAnswer}
                    autoFocus
                    multiline
                  />
                  <TouchableOpacity style={styles.submitButton} onPress={handleCustomAnswer}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                (currentQuestionData.options || []).map(
                  (option, index) =>
                    (
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
                        selectedAnswers[currentQuestion]?.includes(index) && styles.selectedOption
                      ]}
                      onPress={() => handleAnswer(index)}
                      disabled={showCustomInput}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText, 
                        selectedAnswers[currentQuestion]?.includes(index) && styles.selectedOptionText
                      ]}>
                        {option}
                      </Text>

                      {selectedAnswers[currentQuestion]?.includes(index) && (
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
                    ),
                )
              )}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={handleNext}
                disabled={
                  selectedAnswers[currentQuestion]?.length === 0 && 
                  !customAnswer.trim() && 
                  !showCustomInput
                }
              >
                <Text style={styles.navButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
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
  timerTextRed: {
    color: "#FF5252",
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
  customInputContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A42FC1",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  customInput: {
    minHeight: 80,
    fontSize: 16,
    color: "#333333",
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#A42FC1",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
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

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
  TextInput,
  Easing,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import QuizBackground from "../components/QuizBackground"
import Svg, { Circle, Path } from "react-native-svg"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export default function QuizletScreen({ navigation, route }) {
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
  }, [currentQuestion])

  useEffect(() => {
    // Timer animation
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleNext()
          return 0
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

    return () => clearInterval(timerInterval)
  }, [currentQuestion])

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
      Animated.timing(customInputAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
      return
    }

    setSelectedAnswer(index)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = index
    setAnswers(newAnswers)

    if (index === questions[currentQuestion]?.correctAnswer) {
      setScore((prev) => prev + 1)
    }
  }

  const handleCustomAnswer = () => {
    if (customAnswer.trim()) {
      const index = -1 // Special index for custom answer
      setSelectedAnswer(index)
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = { custom: customAnswer }
      setAnswers(newAnswers)
      Keyboard.dismiss()
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
      setTimeLeft(15)
    } else {
      // Quiz is complete - navigate directly to results without delay
      navigation.navigate("Quiz", {
        quizResults: {
          score: score,
          total: questions.length,
          correctCount: score,
          incorrectCount: questions.length - score,
          questions: questions.map((q, index) => ({
            id: q.id || index + 1,
            text: `Question ${index + 1}`,
            isCorrect: answers[index] === q.correctAnswer,
          })),
        },
      })
    }
  }

  // Progress bar component
  const ProgressBar = () => {
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
          {currentQuestion + 1}/{questions.length}
        </Text>
      </View>
    )
  }

  // Ensure we have a current question to display
  const currentQuestionData = questions[currentQuestion] || {
    text: "Loading question...",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#A42FC1", "#8B27A3"]} style={StyleSheet.absoluteFill} />
        <QuizBackground />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <ProgressBar />
        </View>

        <View style={[styles.contentContainer, isKeyboardVisible && styles.keyboardAdjustedContent]}>
          <Animated.View
            style={[
              styles.questionBox,
              {
                opacity: questionAnim,
                transform: [
                  {
                    translateY: questionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
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
                  stroke="rgba(123, 92, 255, 0.2)"
                  strokeWidth={timerStroke}
                  fill="transparent"
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
              <Text style={[styles.timerText, timeLeft < 6 && styles.timerTextRed]}>{timeLeft}s</Text>
            </Animated.View>

            <View style={styles.questionContent}>
              <Text style={styles.questionText}>{currentQuestionData.text}</Text>
              <Text style={styles.remainingText}>{questions.length - currentQuestion - 1} questions remaining</Text>
            </View>
          </Animated.View>

          <View style={styles.optionsContainer}>
            {(currentQuestionData.options || []).map((option, index) => (
              <Animated.View
                key={index}
                style={{
                  opacity: optionsAnim[index],
                  transform: [
                    {
                      translateX: optionsAnim[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={[styles.option, selectedAnswer === index && styles.selectedOption]}
                  onPress={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null || showCustomInput}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, selectedAnswer === index && styles.selectedOptionText]}>
                    {option}
                  </Text>
                  {selectedAnswer === index && (
                    <View style={styles.checkmark}>
                      <Svg width={20} height={20} viewBox="0 0 24 24">
                        <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#7B5CFF" />
                      </Svg>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}

            {/* "Other" option */}
            <Animated.View
              style={{
                opacity: optionsAnim[(currentQuestionData.options || []).length],
                transform: [
                  {
                    translateX: optionsAnim[(currentQuestionData.options || []).length].interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={[styles.option, styles.otherOption, selectedAnswer === -1 && styles.selectedOption]}
                onPress={() => handleAnswer((currentQuestionData.options || []).length)}
                disabled={selectedAnswer !== null || showCustomInput}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, styles.otherOptionText]}>Other (specify)</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Custom answer input */}
            {showCustomInput && (
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
                  placeholder="Type your answer here..."
                  value={customAnswer}
                  onChangeText={setCustomAnswer}
                  autoFocus
                  multiline
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleCustomAnswer}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          <Animated.View
            style={[
              styles.nextButtonContainer,
              {
                opacity: nextButtonAnim,
                transform: [
                  {
                    translateY: nextButtonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.nextButton,
                (selectedAnswer === null && !showCustomInput) || (showCustomInput && !customAnswer.trim())
                  ? styles.disabledButton
                  : null,
              ]}
              onPress={handleNext}
              disabled={(selectedAnswer === null && !showCustomInput) || (showCustomInput && !customAnswer.trim())}
            >
              <LinearGradient
                colors={["#7B5CFF", "#6A4DE0"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                </Text>
                <Icon name="arrow-right" size={20} color="white" style={styles.nextIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    justifyContent: "space-between",
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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 15,
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  keyboardAdjustedContent: {
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  questionBox: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    padding: 25,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timerContainer: {
    alignSelf: "center",
    marginBottom: 10,
    position: "relative",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    position: "absolute",
    color: "#7B5CFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  timerTextRed: {
    color: "#FF5252",
  },
  questionContent: {
    marginTop: 20,
  },
  questionText: {
    color: "#333",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24,
  },
  remainingText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic",
  },
  optionsContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  option: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 18,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#E1E1E1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedOption: {
    borderColor: "#7B5CFF",
    backgroundColor: "rgba(123, 92, 255, 0.05)",
  },
  optionText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#7B5CFF",
    fontWeight: "600",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(123, 92, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  otherOption: {
    borderStyle: "dashed",
    borderColor: "#7B5CFF",
    backgroundColor: "rgba(123, 92, 255, 0.05)",
  },
  otherOptionText: {
    color: "#7B5CFF",
    fontStyle: "italic",
  },
  customInputContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customInput: {
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#7B5CFF",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButtonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  nextButton: {
    width: "60%",
    borderRadius: 25,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  nextIcon: {
    marginLeft: 8,
  },
})

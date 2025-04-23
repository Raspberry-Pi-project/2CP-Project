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
  Platform,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Circle, Path } from "react-native-svg"
import { QUIZ_DATA } from "../data/quizData"

const { width, height } = Dimensions.get("window")
const PhysicsStack = createNativeStackNavigator()
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

// Get physics quiz data
const physicsQuiz = QUIZ_DATA.find((quiz) => quiz.id === "4") || {
  title: "Physics Quiz",
  questions: [],
}

// Floating bubbles animation component
const FloatingBubbles = () => {
  const bubbles = [
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 80,
      position: { top: 20, left: 30 },
      opacity: 0.2,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 60,
      position: { top: 80, right: 20 },
      opacity: 0.15,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 100,
      position: { top: 150, left: 0 },
      opacity: 0.1,
    },
  ]

  useEffect(() => {
    bubbles.forEach((bubble, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubble.ref, {
            toValue: 1,
            duration: 3000 + index * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble.ref, {
            toValue: 0,
            duration: 3000 + index * 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    })

    return () => {
      bubbles.forEach((bubble) => {
        bubble.ref.stopAnimation()
      })
    }
  }, [])

  return (
    <View style={StyleSheet.absoluteFill}>
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
              ],
            },
          ]}
        />
      ))}
    </View>
  )
}

// Quiz Question List Screen
function QuestionListScreen({ navigation, route }) {
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const timerAnim = useRef(new Animated.Value(1)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

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
          const correctCount = Object.values(answers).filter((a) => a.isCorrect).length
          navigation.navigate("PhysicsResults", {
            score: correctCount,
            total: physicsQuiz.questions.length,
            correctCount,
            incorrectCount: Object.keys(answers).length - correctCount,
          })
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

  const handleCheckResults = () => {
    // Calculate score
    const correctCount = Object.values(answers).filter((a) => a.isCorrect).length

    navigation.navigate("PhysicsResults", {
      score: correctCount,
      total: physicsQuiz.questions.length,
      correctCount,
      incorrectCount: Object.keys(answers).length - correctCount,
    })
  }

  // Question item component
  const renderQuestionItem = ({ item, index }) => {
    const questionNumber = index + 1
    const isAnswered = answers[questionNumber] !== undefined

    return (
      <TouchableOpacity
        style={[
          styles.questionListItem,
          isAnswered && answers[questionNumber].isCorrect ? styles.correctItem : null,
          isAnswered && !answers[questionNumber].isCorrect ? styles.incorrectItem : null,
        ]}
        onPress={() =>
          navigation.navigate("PhysicsQuestion", {
            questionNumber,
            onAnswer: (answer, isCorrect) => {
              setAnswers((prev) => ({
                ...prev,
                [questionNumber]: { answer, isCorrect },
              }))
            },
          })
        }
      >
        <Text style={styles.questionListNumber}>Question {questionNumber}</Text>
        <View style={styles.questionRightContent}>
          <Text style={styles.questionListText} numberOfLines={1}>
            {item.text}
          </Text>
          {isAnswered && (
            <View
              style={[
                styles.statusIndicator,
                answers[questionNumber].isCorrect ? styles.correctIndicator : styles.incorrectIndicator,
              ]}
            >
              {answers[questionNumber].isCorrect ? (
                <Svg width="14" height="14" viewBox="0 0 24 24">
                  <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
                </Svg>
              ) : (
                <Svg width="14" height="14" viewBox="0 0 24 24">
                  <Path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                    fill="white"
                  />
                </Svg>
              )}
            </View>
          )}
          <Icon name="chevron-right" size={18} color="#A42FC1" />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Purple Header */}
      <View style={styles.physicsHeader}>
        <LinearGradient colors={["#A42FC1", "#8B27A3"]} style={styles.headerGradient}>
          <FloatingBubbles />

          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
              <Icon name="home" size={24} color="white" />
            </TouchableOpacity>

            {/* Timer */}
            <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Svg width={60} height={60} viewBox="0 0 60 60">
                <Circle cx="30" cy="30" r="25" stroke="rgba(255,255,255,0.3)" strokeWidth="5" fill="transparent" />
                <AnimatedCircle
                  cx="30"
                  cy="30"
                  r="25"
                  stroke="white"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 25}
                  strokeDashoffset={timerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2 * Math.PI * 25, 0],
                  })}
                  strokeLinecap="round"
                  transform="rotate(-90, 30, 30)"
                />
              </Svg>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </Animated.View>
          </View>

          <Text style={styles.headerTitle}>Physics Quiz</Text>
          <Text style={styles.headerSubtitle}>Select a question to answer</Text>
        </LinearGradient>
      </View>

      {/* Questions List */}
      <View style={styles.questionsListContainer}>
        <FlatList
          data={physicsQuiz.questions}
          renderItem={renderQuestionItem}
          keyExtractor={(item, index) => `question-${index}`}
          contentContainerStyle={styles.questionsListContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Check Results Button */}
        <TouchableOpacity style={styles.checkResultsButton} onPress={handleCheckResults}>
          <LinearGradient
            colors={["#7B5CFF", "#A42FC1"]}
            style={styles.checkResultsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.checkResultsText}>Check Results</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

// Individual Question Screen
function QuestionScreen({ navigation, route }) {
  const { questionNumber, onAnswer } = route.params
  const questionIndex = questionNumber - 1
  const question = physicsQuiz.questions[questionIndex] || {
    text: "Question not found",
    options: [],
    correctAnswer: 0,
  }

  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const optionsAnim = useRef(question.options.map(() => new Animated.Value(0))).current

  useEffect(() => {
    // Entrance animations
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()

    // Staggered options animation
    Animated.stagger(
      100,
      optionsAnim.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ),
    ).start()
  }, [])

  const handleAnswer = (index) => {
    setSelectedAnswer(index)
    const isCorrect = index === question.correctAnswer

    // Pass answer back to parent screen
    onAnswer(index, isCorrect)

    // Show feedback briefly before returning
    setTimeout(() => {
      navigation.goBack()
    }, 1000)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Purple Header */}
      <View style={styles.purpleHeader}>
        <LinearGradient colors={["#A42FC1", "#8B27A3"]} style={styles.headerGradient}>
          <FloatingBubbles />

          <View style={styles.headerControls}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuButton}>
              <Icon name="arrow-left" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.questionBadge}>
              <Text style={styles.questionBadgeText}>
                Question {questionNumber}/{physicsQuiz.questions.length}
              </Text>
            </View>
          </View>

          {/* Question Text */}
          <Animated.View
            style={[
              styles.questionTextContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
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

      {/* Options */}
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
                selectedAnswer === index && styles.selectedOption,
                selectedAnswer === index && index === question.correctAnswer && styles.correctOption,
                selectedAnswer === index && index !== question.correctAnswer && styles.incorrectOption,
              ]}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.optionText}>{option}</Text>

              {selectedAnswer === index && index === question.correctAnswer && (
                <View style={styles.checkmark}>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#4ADE80" />
                  </Svg>
                </View>
              )}

              {selectedAnswer === index && index !== question.correctAnswer && (
                <View style={styles.crossmark}>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                      fill="#FF5252"
                    />
                  </Svg>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </SafeAreaView>
  )
}

// Results Screen
function PhysicsResultsScreen({ navigation, route }) {
  const { score, total, correctCount, incorrectCount } = route.params
  const headerAnim = useRef(new Animated.Value(0)).current
  const scoreAnim = useRef(new Animated.Value(0)).current
  const detailsAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animate elements sequentially
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(detailsAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const goToHome = () => {
    navigation.navigate("Home")
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with gradient */}
      <Animated.View
        style={[
          styles.resultsHeader,
          {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }],
          },
        ]}
      >
        <LinearGradient colors={["#A42FC1", "#7B5CFF"]} style={styles.resultsHeaderGradient}>
          <FloatingBubbles />
          <Text style={styles.resultsTitle}>Quiz Complete!</Text>
        </LinearGradient>
      </Animated.View>

      {/* Score Circle */}
      <Animated.View
        style={[
          styles.scoreCircleWrapper,
          {
            opacity: scoreAnim,
            transform: [{ scale: scoreAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1.1, 1] }) }],
          },
        ]}
      >
        <View style={styles.scoreCircle}>
          <Text style={styles.scorePercentage}>{Math.round((score / total) * 100)}%</Text>
          <Text style={styles.scoreValue}>
            {score}/{total}
          </Text>
        </View>
      </Animated.View>

      {/* Details */}
      <Animated.View
        style={[
          styles.resultsDetails,
          {
            opacity: detailsAnim,
            transform: [{ translateY: detailsAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
          },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Correct Answers</Text>
          <Text style={[styles.statValue, { color: "#4ADE80" }]}>{correctCount}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Incorrect Answers</Text>
          <Text style={[styles.statValue, { color: "#FF5252" }]}>{incorrectCount}</Text>
        </View>
      </Animated.View>

      {/* Home Button */}
      <TouchableOpacity style={styles.homeButton} onPress={goToHome}>
        <LinearGradient
          colors={["#7B5CFF", "#A42FC1"]}
          style={styles.homeButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.homeButtonText}>Go to Home</Text>
          <Icon name="home" size={20} color="white" style={styles.homeIcon} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

// Main Physics Quiz Navigator
export default function PhysicsQuizScreen() {
  return (
    <PhysicsStack.Navigator screenOptions={{ headerShown: false }}>
      <PhysicsStack.Screen name="PhysicsQuestions" component={QuestionListScreen} />
      <PhysicsStack.Screen name="PhysicsQuestion" component={QuestionScreen} />
      <PhysicsStack.Screen name="PhysicsResults" component={PhysicsResultsScreen} />
    </PhysicsStack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  physicsHeader: {
    height: 200,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
  },
  purpleHeader: {
    height: 240,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 5,
  },
  timerContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  timerText: {
    position: "absolute",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  questionBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  questionBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  questionTextContainer: {
    marginTop: 10,
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
  questionText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
  },
  questionsListContainer: {
    flex: 1,
    paddingBottom: 80, // Space for the button
  },
  questionsListContent: {
    padding: 20,
    paddingTop: 30,
  },
  questionListItem: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  correctItem: {
    borderColor: "#4ADE80",
    borderWidth: 1,
  },
  incorrectItem: {
    borderColor: "#FF5252",
    borderWidth: 1,
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
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  correctIndicator: {
    backgroundColor: "#4ADE80",
  },
  incorrectIndicator: {
    backgroundColor: "#FF5252",
  },
  checkResultsButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  checkResultsGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  checkResultsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#A42FC1",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: "rgba(164, 47, 193, 0.05)",
  },
  correctOption: {
    borderColor: "#4ADE80",
  },
  incorrectOption: {
    borderColor: "#FF5252",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  crossmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 82, 82, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Results screen styles
  resultsHeader: {
    height: 200,
    overflow: "hidden",
  },
  resultsHeaderGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  scoreCircleWrapper: {
    alignItems: "center",
    marginTop: -60,
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 5,
    borderColor: "#A42FC1",
  },
  scorePercentage: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#A42FC1",
  },
  scoreValue: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  resultsDetails: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statLabel: {
    fontSize: 16,
    color: "#333",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  homeButton: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 30,
  },
  homeButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  homeIcon: {
    marginLeft: 8,
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
})

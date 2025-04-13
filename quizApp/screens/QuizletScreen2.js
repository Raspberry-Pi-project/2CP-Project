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
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Circle, Path } from "react-native-svg"
import { QUIZ_DATA } from "../data/quizData"

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
            easing: Animated.Easing.out(Animated.Easing.back(1.5)),
            useNativeDriver: true,
          }),
        ),
      ).start()
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

    // Show feedback briefly before returning to list
    setTimeout(() => {
      setCurrentView("list")
    }, 1000)
  }

  const navigateToResults = () => {
    navigation.navigate("Quiz", {
      quizResults: {
        score: score,
        total: physicsQuiz.questions.length,
        correctCount: correctCount,
        incorrectCount: incorrectCount,
        questions: physicsQuiz.questions.map((q, index) => ({
          id: q.id || index + 1,
          text: q.text,
          isCorrect: answers[index]?.isCorrect || false,
        })),
      },
    })
  }

  // Question item component for the list view
  const renderQuestionItem = ({ item, index }) => {
    const questionNumber = index + 1
    const isAnswered = answers[index] !== undefined

    return (
      <TouchableOpacity
        style={[
          styles.questionListItem,
          isAnswered && answers[index].isCorrect ? styles.correctItem : null,
          isAnswered && !answers[index].isCorrect ? styles.incorrectItem : null,
        ]}
        onPress={() => handleSelectQuestion(index)}
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
                answers[index].isCorrect ? styles.correctIndicator : styles.incorrectIndicator,
              ]}
            >
              {answers[index].isCorrect ? (
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

  // List View
  const renderListView = () => {
    return (
      <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
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

        <Text style={styles.headerTitle}>{physicsQuiz.title}</Text>
        <Text style={styles.headerSubtitle}>Select a question to answer</Text>

        <FlatList
          data={physicsQuiz.questions}
          renderItem={renderQuestionItem}
          keyExtractor={(item, index) => `question-${index}`}
          contentContainerStyle={styles.questionsListContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Check Results Button */}
        <TouchableOpacity style={styles.checkResultsButton} onPress={navigateToResults}>
          <LinearGradient
            colors={["#7B5CFF", "#A42FC1"]}
            style={styles.checkResultsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.checkResultsText}>Check Results</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  // Question View
  const renderQuestionView = () => {
    const question = physicsQuiz.questions[currentQuestion] || {
      text: "Question not found",
      options: [],
      correctAnswer: 0,
    }

    return (
      <Animated.View
        style={[
          styles.questionContainer,
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
        {/* Header */}
        <View style={styles.questionHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentView("list")}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.scoreContainer}>
            <View style={styles.scoreIndicator}>
              <Text style={[styles.scoreText, { color: "#4CAF50" }]}>
                {correctCount < 10 ? "0" : ""}
                {correctCount}
              </Text>
              <View style={styles.scoreBarContainer}>
                <View
                  style={[
                    styles.scoreBar,
                    { backgroundColor: "#4CAF50", width: `${(correctCount / physicsQuiz.questions.length) * 100}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.timerCircle}>
              <Text style={styles.timerValue}>{score}</Text>
            </View>

            <View style={styles.scoreIndicator}>
              <Text style={[styles.scoreText, { color: "#FF9800" }]}>
                {incorrectCount < 10 ? "0" : ""}
                {incorrectCount}
              </Text>
              <View style={styles.scoreBarContainer}>
                <View
                  style={[
                    styles.scoreBar,
                    { backgroundColor: "#FF9800", width: `${(incorrectCount / physicsQuiz.questions.length) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Question Counter */}
        <Text style={styles.questionCounter}>
          Question {currentQuestion + 1}/{physicsQuiz.questions.length}
        </Text>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.text}</Text>
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

                {selectedAnswer === index && (
                  <View
                    style={[
                      styles.statusIcon,
                      index === question.correctAnswer ? styles.correctIcon : styles.incorrectIcon,
                    ]}
                  >
                    {index === question.correctAnswer ? (
                      <Svg width="20" height="20" viewBox="0 0 24 24">
                        <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
                      </Svg>
                    ) : (
                      <Svg width="20" height="20" viewBox="0 0 24 24">
                        <Path
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                          fill="white"
                        />
                      </Svg>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1)
                setSelectedAnswer(
                  answers[currentQuestion - 1]?.answer !== undefined ? answers[currentQuestion - 1].answer : null,
                )
              }
            }}
            disabled={currentQuestion === 0}
          >
            <Text style={styles.navButtonText}>previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={() => {
              if (currentQuestion < physicsQuiz.questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1)
                setSelectedAnswer(
                  answers[currentQuestion + 1]?.answer !== undefined ? answers[currentQuestion + 1].answer : null,
                )
              } else {
                setCurrentView("list")
              }
            }}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#A42FC1", "#8B27A3"]} style={StyleSheet.absoluteFill} />

      {currentView === "list" ? renderListView() : renderQuestionView()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A42FC1",
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
  timerContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    position: "absolute",
    color: "white",
    fontSize: 16,
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
    paddingBottom: 100, // Space for the button
  },
  questionListItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  correctItem: {
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  incorrectItem: {
    borderLeftWidth: 5,
    borderLeftColor: "#FF5252",
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
    backgroundColor: "#4CAF50",
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
  // Question View Styles
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    marginLeft: 20,
  },
  scoreIndicator: {
    alignItems: "center",
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  scoreBarContainer: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  scoreBar: {
    height: "100%",
    borderRadius: 2,
  },
  timerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  timerValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  questionCounter: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  optionsContainer: {
    marginBottom: 20,
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
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "rgba(164, 47, 193, 0.05)",
  },
  correctOption: {
    borderColor: "#4CAF50",
  },
  incorrectOption: {
    borderColor: "#FF5252",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  correctIcon: {
    backgroundColor: "#4CAF50",
  },
  incorrectIcon: {
    backgroundColor: "#FF5252",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  navButton: {
    width: "48%",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  prevButton: {
    backgroundColor: "#A42FC1",
  },
  nextButton: {
    backgroundColor: "#A42FC1",
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
})

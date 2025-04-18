"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Circle, Path } from "react-native-svg"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors } from "../constants/colors"
import { Feather } from "@expo/vector-icons" // Import Feather icons

const { width, height } = Dimensions.get("window")

// Animated bubbles component (based on QuizBackground.js)
const AnimatedBubbles = () => {
  // Create multiple animated values for different bubbles
  const bubbles = [
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 120,
      position: { top: "5%", left: "10%" },
      opacity: 0.3,
      duration: 15000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 80,
      position: { top: "20%", right: "5%" },
      opacity: 0.2,
      duration: 18000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 150,
      position: { bottom: "40%", left: "0%" },
      opacity: 0.15,
      duration: 20000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 100,
      position: { bottom: "10%", right: "15%" },
      opacity: 0.25,
      duration: 25000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 60,
      position: { top: "40%", left: "30%" },
      opacity: 0.2,
      duration: 22000,
    },
  ]

  useEffect(() => {
    // Start animations for all bubbles
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

// Circular score component with animation
const CircularScore = ({ score, total }) => {
  const animatedValue = useRef(new Animated.Value(0)).current
  const scorePercentage = (score / total) * 100

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: scorePercentage / 100,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()
  }, [])

  const circleCircumference = 2 * Math.PI * 45 // radius is 45
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circleCircumference, 0],
  })

  return (
    <View style={styles.scoreCircleContainer}>
      <Svg width="120" height="120" viewBox="0 0 120 120">
        {/* Background circle */}
        <Circle cx="60" cy="60" r="45" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="8" fill="transparent" />
        {/* Progress circle */}
        <AnimatedCircle
          cx="60"
          cy="60"
          r="45"
          stroke="#A42FC1"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circleCircumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin="60, 60"
        />
      </Svg>
      <View style={styles.scoreTextContainer}>
        <Text style={styles.scoreText}>score</Text>
        <Text style={styles.scoreValue}>
          {score}/{total}
        </Text>
      </View>
    </View>
  )
}

// Animated Circle component for SVG
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

// Question item component
const QuestionItem = ({ number, isCorrect }) => {
  return (
    <View style={[styles.questionItem, isCorrect ? styles.correctItem : styles.incorrectItem]}>
      <Text style={styles.questionText}>Question {number}</Text>
      <View style={styles.iconContainer}>
        {isCorrect ? (
          <Svg width="20" height="20" viewBox="0 0 24 24">
            <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#4CAF50" />
          </Svg>
        ) : (
          <Svg width="20" height="20" viewBox="0 0 24 24">
            <Path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              fill="#FF5252"
            />
          </Svg>
        )}
      </View>
    </View>
  )
}

export default function QuizScoreScreen({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const [score, setScore] = useState(18)
  const [totalQuestions, setTotalQuestions] = useState(20)
  const [correctAnswers, setCorrectAnswers] = useState(18)
  const [incorrectAnswers, setIncorrectAnswers] = useState(2)

  // Sample question results
  const questionResults = [
    { id: 1, isCorrect: true },
    { id: 2, isCorrect: true },
    { id: 3, isCorrect: true },
    { id: 4, isCorrect: false },
    { id: 5, isCorrect: false },
    { id: 6, isCorrect: true },
  ]

  const { score: finalScore, totalQuestions: finalTotalQuestions, timeSpent } = route.params

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const percentage = (finalScore / finalTotalQuestions) * 100

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#A42FC1", "#9B2EB9"]} style={styles.background}>
        <AnimatedBubbles />

        <View style={[styles.content, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
              <Feather name="home" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Svg width="24" height="24" viewBox="0 0 24 24">
                <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="white" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Score Circle */}
          <CircularScore score={score} total={totalQuestions} />

          {/* Score Indicators */}
          <View style={styles.scoreIndicators}>
            <View style={styles.scoreItem}>
              <Text style={[styles.indicatorValue, { color: "#4CAF50" }]}>{correctAnswers}</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: "#4CAF50", width: `${(correctAnswers / totalQuestions) * 100}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.scoreItem}>
              <Text style={[styles.indicatorValue, { color: "#FF5252" }]}>0{incorrectAnswers}</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: "#FF5252", width: `${(incorrectAnswers / totalQuestions) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Questions List */}
          <ScrollView style={styles.questionsContainer} showsVerticalScrollIndicator={false}>
            {questionResults.map((question) => (
              <QuestionItem key={question.id} number={question.id} isCorrect={question.isCorrect} />
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#C16AD5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
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
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 30,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  scorePercentage: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
  },
  scoreText: {
    fontSize: 16,
    color: colors.white,
  },
  statsContainer: {
    width: "100%",
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  statLabel: {
    fontSize: 16,
    color: colors.foreground,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 30,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  scoreCircleContainer: {
    alignSelf: "center",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreTextContainer: {
    position: "absolute",
    alignItems: "center",
  },
  scoreText: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  scoreValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  scoreIndicators: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  scoreItem: {
    alignItems: "center",
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressBarContainer: {
    width: 50,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  questionsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
  },
  questionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  correctItem: {
    borderColor: "#4CAF50",
  },
  incorrectItem: {
    borderColor: "#FF5252",
  },
  questionText: {
    fontSize: 16,
    color: "#333",
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
})

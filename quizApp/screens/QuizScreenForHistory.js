"use client"

import React, { useEffect, useRef, useCallback } from "react"
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
  Alert,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg"

const { width, height } = Dimensions.get("window")
const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

// Floating bubbles background component
const FloatingBubbles = () => {
  // Create multiple animated values for different bubbles
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
    // Start animations for all bubbles
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
      // Clean up animations
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

// Animated score circle component
const ScoreCircle = ({ score, total }) => {
  const animatedValue = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Animate the score
    Animated.timing(animatedValue, {
      toValue: score / total,
      duration: 1500,
      useNativeDriver: false,
    }).start()

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    return () => {
      animatedValue.stopAnimation()
      pulseAnim.stopAnimation()
    }
  }, [score, total])

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  })

  return (
    <Animated.View
      style={[
        styles.scoreCircleContainer,
        {
          transform: [{ scale: pulseAnim }]
        },
      ]}
    >
      <AnimatedSvg height="150" width="150" viewBox="0 0 110 110">
        <Defs>
          <SvgLinearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#7B5CFF" />
            <Stop offset="100%" stopColor="#A42FC1" />
          </SvgLinearGradient>
        </Defs>
        <Circle cx="55" cy="55" r="45" stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="white" />
        <AnimatedCircle
          cx="55"
          cy="55"
          r="45"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90, 55, 55)"
        />
      </AnimatedSvg>
      <View style={styles.scoreTextContainer}>
        <Text style={styles.scoreValue}>
          {Math.round((score / total) * 100)}%
        </Text>
        <Text style={styles.scoreLabel}>{score}/{total}</Text>
      </View>
    </Animated.View>
  )
}

// Question item component with animations - making it a memoized component
const QuestionItem = React.memo(({ question, index, isCorrect, onPress, animationDelay }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const bounceAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Entrance animation with delay based on index
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      delay: animationDelay + index * 100,
      useNativeDriver: true,
    }).start()

    return () => {
      scaleAnim.stopAnimation()
      bounceAnim.stopAnimation()
    }
  }, [])

  const handlePress = useCallback(() => {
    // Bounce animation on press
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start()

    onPress && onPress(question)
  }, [onPress, question])

  // Determine border color based on correct/incorrect
  const borderColor = isCorrect === true ? "#4ADE80" : isCorrect === false ? "#FF5252" : "#7B5CFF"

  return (
    <Animated.View
      style={{
        opacity: scaleAnim,
        transform: [
          { scale: Animated.multiply(scaleAnim, bounceAnim) },
          {
            translateY: scaleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity style={[styles.questionItem, { borderColor }]} onPress={handlePress} activeOpacity={0.8}>
        <Text style={styles.questionText}>{question.text}</Text>
        {isCorrect !== null && (
          <View style={[styles.statusIcon, { backgroundColor: isCorrect ? "#4ADE80" : "#FF5252" }]}>
            {isCorrect ? (
              <Svg width="16" height="16" viewBox="0 0 24 24">
                <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
              </Svg>
            ) : (
              <Svg width="16" height="16" viewBox="0 0 24 24">
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
  )
})

// Format time helper function
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export default function QuizScreenForHistory({ navigation, route }) {
  // Get quiz results from route params
  const quizResultsRef = useRef(route.params?.quizResults);
  const {
    score = 0,
    total = 10,
    questions = [],
    correctCount = 0,
    incorrectCount = 0,
    timeSpent = 0,
    quizId = '',
    originalQuiz = null,
    attemptInfo = {}
  } = quizResultsRef.current || {};

  // Ensure normalized score for consistent display
  const normalizedScore = {
    score: score,
    total: total,
    correctCount: correctCount,
    incorrectCount: incorrectCount
  };

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current
  const contentAnim = useRef(new Animated.Value(0)).current

  // Track mount state to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleHomePress = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [navigation]);

  useEffect(() => {
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
      if (animationSequence.stop) {
        animationSequence.stop();
      }
      headerAnim.stopAnimation();
      contentAnim.stopAnimation();
    }
  }, []);

  const handleQuestionPress = useCallback((question) => {
    // Find or create original question data to pass to ReviewQuestionHistory
    let originalQuestion;

    // First try to get the question from the original quiz
    if (originalQuiz && originalQuiz.questions) {
      const originalIndex = question.originalIndex || 0;
      originalQuestion = originalQuiz.questions[originalIndex];
    }

    // If the original question isn't available, create a static fallback
    if (!originalQuestion) {
      // Create a fallback question with the same structure
      originalQuestion = {
        id: question.id || 1,
        text: question.text || "Question",
        options: [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        correctAnswer: question.isCorrect ? 0 : 1, // Mock correct answer
      };
    }

    // Navigate to ReviewQuestionHistory screen with either real or fallback data
    navigation.navigate("ReviewQuestionHistory", {
      originalQuestion: originalQuestion,
      quizId: quizId || "history-quiz",
      selectedAnswers: question.selections || [question.answer].filter(Boolean) || [question.isCorrect ? 0 : 1],
      title: (originalQuiz?.title || "History Quiz"),
      attemptInfo: {
        ...attemptInfo,
        date: attemptInfo.date || new Date().toLocaleDateString(),
        isCorrect: question.isCorrect,
        score: score
      }
    });
  }, [navigation, originalQuiz, quizId, attemptInfo, score]);

  // Item extractor for FlatList to prevent re-renders
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Render item function for FlatList
  const renderItem = useCallback(({ item, index }) => (
    <QuestionItem
      question={item}
      index={index}
      isCorrect={item.isCorrect}
      onPress={handleQuestionPress}
      animationDelay={500} // Start after main animations
    />
  ), [handleQuestionPress]);

  return (
    <SafeAreaView style={styles.container}>
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
            {/* Back button and home button */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoBack}
              >
                <Icon name="arrow-left" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.homeButton}
                onPress={handleHomePress}
              >
                <Icon name="home" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Large prominent score circle at the top */}
            <View style={styles.scoreCircleWrapper}>
              <ScoreCircle score={normalizedScore.score} total={total} />
            </View>

            {/* Title under the score */}
            <Text style={styles.screenTitle}>Attempt Review</Text>
            {attemptInfo.date && (
              <Text style={styles.screenSubtitle}>{attemptInfo.date}</Text>
            )}

            {/* Simple score text display */}
            <View style={styles.scoreTextSummary}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemValue}>{normalizedScore.correctCount}</Text>
                <Text style={styles.scoreItemLabel}>Correct</Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreItemValue, { color: "#FF5252" }]}>{normalizedScore.incorrectCount}</Text>
                <Text style={styles.scoreItemLabel}>Incorrect</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Questions list */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
          },
        ]}
      >
        <FlatList
          data={questions}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.questionsContainer}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
        />
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    height: height * 0.42,
    overflow: "hidden",
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
  },
  scoreCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  screenTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
  },
  screenSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 0,
  },
  scoreIndicators: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  indicatorContainer: {
    alignItems: "center",
  },
  indicatorValue: {
    color: "#4ADE80",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  indicatorBar: {
    width: 50,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 5,
  },
  indicatorFill: {
    height: "100%",
    borderRadius: 2,
  },
  indicatorLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  scoreCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  scoreTextContainer: {
    position: "absolute",
    alignItems: "center",
  },
  scoreValue: {
    color: "#333",
    fontSize: 28,
    fontWeight: "bold",
  },
  scoreLabel: {
    color: "#666",
    fontSize: 16,
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#F8F9FA",
    overflow: "hidden",
  },
  questionsContainer: {
    padding: 20,
    paddingTop: 30,
  },
  questionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginRight: 10,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  scoreTextSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  scoreItem: {
    alignItems: "center",
  },
  scoreItemValue: {
    color: "#4ADE80",
    fontSize: 20,
    fontWeight: "bold",
  },
  scoreItemLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    marginTop: 5,
  },
}) 
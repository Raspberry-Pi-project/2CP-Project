"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";
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
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

// Sample quiz data with 20 questions
const SAMPLE_QUIZ_DATA = {
  score: 18,
  total: 20,
  correctCount: 18,
  incorrectCount: 2,
  questions: [
    { id: 1, text: "What is the past tense of 'eat'?", isCorrect: true },
    {
      id: 2,
      text: "Which sentence is grammatically correct?",
      isCorrect: true,
    },
    {
      id: 3,
      text: "Choose the correct preposition: 'She arrived ___ the airport.'",
      isCorrect: true,
    },
    {
      id: 4,
      text: "What is the value of x in the equation 2x + 5 = 13?",
      isCorrect: false,
    },
    { id: 5, text: "Which of these is not a prime number?", isCorrect: false },
    { id: 6, text: "What is 25% of 80?", isCorrect: true },
    { id: 7, text: "If a = 3 and b = 5, what is a² + b²?", isCorrect: true },
    { id: 8, text: "What is the square root of 144?", isCorrect: true },
    {
      id: 9,
      text: "Which planet is known as the Red Planet?",
      isCorrect: true,
    },
    { id: 10, text: "What is the chemical symbol for water?", isCorrect: true },
    {
      id: 11,
      text: "What is the largest organ in the human body?",
      isCorrect: true,
    },
    {
      id: 12,
      text: "How many students in your class ___ from Korea?",
      isCorrect: true,
    },
    { id: 13, text: "Select the correct form of the verb.", isCorrect: true },
    { id: 14, text: "What is the capital of France?", isCorrect: true },
    { id: 15, text: "Who wrote 'Romeo and Juliet'?", isCorrect: true },
    { id: 16, text: "What is the formula for water?", isCorrect: true },
    { id: 17, text: "What is the largest continent?", isCorrect: true },
    { id: 18, text: "How many sides does a hexagon have?", isCorrect: true },
    {
      id: 19,
      text: "What is the main component of the sun?",
      isCorrect: false,
    },
    {
      id: 20,
      text: "Which element has the chemical symbol 'Au'?",
      isCorrect: true,
    },
  ],
};

// Floating bubbles background component
const FloatingBubbles = () => {
  const bubbles = useRef([
    {
      ref: new Animated.Value(0),
      size: 80,
      position: { top: 20, left: 30 },
      opacity: 0.2,
    },
    {
      ref: new Animated.Value(0),
      size: 60,
      position: { top: 80, right: 20 },
      opacity: 0.15,
    },
    {
      ref: new Animated.Value(0),
      size: 100,
      position: { top: 150, left: 0 },
      opacity: 0.1,
    },
  ]).current;

  const loops = useRef([]); // Store animated loops

  useEffect(() => {
    loops.current = bubbles.map((bubble, index) =>
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
        ])
      )
    );

    loops.current.forEach(loop => loop.start());

    return () => {
      loops.current.forEach(loop => loop.stop());
    };
  }, []);

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
  );
};


// Animated score circle component
const ScoreCircle = ({ score, total }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the score
    Animated.timing(animatedValue, {
      toValue: score / total,
      duration: 1500,
      useNativeDriver: false,
    }).start();

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
      ])
    ).start();

    // Subtle rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      animatedValue.stopAnimation();
      pulseAnim.stopAnimation();
      rotateAnim.stopAnimation();
    };
  }, [score, total]);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <Animated.View
      style={[
        styles.scoreCircleContainer,
        {
          transform: [
            { scale: pulseAnim },
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["-3deg", "3deg"],
              }),
            },
          ],
        },
      ]}
    >
      <AnimatedSvg height="120" width="120" viewBox="0 0 100 100">
        <Defs>
          <SvgLinearGradient
            id="scoreGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor="#7B5CFF" />
            <Stop offset="100%" stopColor="#A42FC1" />
          </SvgLinearGradient>
        </Defs>
        <Circle
          cx="50"
          cy="50"
          r="40"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="8"
          fill="white"
        />
        <AnimatedCircle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90, 50, 50)"
        />
      </AnimatedSvg>
      <View style={styles.scoreTextContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>
          {score}/{total}
        </Text>
      </View>
    </Animated.View>
  );
};

// Question item component with animations - making it a memoized component
const QuestionItem = React.memo(
  ({ question, index, isCorrect, onPress, animationDelay }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      // Entrance animation with delay based on index
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        delay: animationDelay + index * 100,
        useNativeDriver: true,
      }).start();

      return () => {
        scaleAnim.stopAnimation();
        bounceAnim.stopAnimation();
      };
    }, []);

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
      ]).start();

      onPress && onPress(question);
    }, [onPress, question]);

    // Determine border color based on correct/incorrect
    const borderColor =
      isCorrect === true
        ? "#4ADE80"
        : isCorrect === false
        ? "#FF5252"
        : "#7B5CFF";

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
        <TouchableOpacity
          style={[styles.questionItem, { borderColor }]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.questionText}>{question.text}</Text>
          {isCorrect !== null && (
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: isCorrect ? "#4ADE80" : "#FF5252" },
              ]}
            >
              {isCorrect ? (
                <Svg width="16" height="16" viewBox="0 0 24 24">
                  <Path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="white"
                  />
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
    );
  }
);

export default function QuizScreen({ navigation, route }) {
  // Get quiz results from route params or use sample data and keep it stable with useRef
  const quizResultsRef = useRef(route.params?.quizResults || SAMPLE_QUIZ_DATA);
  const quizData = route.params?.quizData || SAMPLE_QUIZ_DATA;
  const quizResults = quizResultsRef.current;
  useEffect(() => {
    console.log(" \n Quiz Results:", quizResults);
  }, []);

  // Ensure score is out of 20
  const normalizedScore = useRef({
    ...quizResults,
    total: quizResults.totalQuizScore || 20,
    score: Math.min(quizResults.score, quizResults.totalQuizScore), // Ensure score doesn't exceed 20
  }).current;

  // Create a persistent reference to all questions
  const questionsRef = useRef(normalizedScore.questions);
  const questions = questionsRef.current;

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  // Track mount state to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Disable going back to quiz questions
  useFocusEffect(
    useCallback(() => {
      // Prevent hardware back button from working
      const onBackPress = () => {
        // Show an alert telling the user they can't go back
        Alert.alert(
          "Quiz Completed",
          "You can't go back to the questions. Use the home button to return to the main screen.",
          [{ text: "OK" }]
        );
        return true; // Returning true prevents default behavior
      };

      // Add the event listener
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Disable swipe back gesture (only applies to iOS)
      navigation.setOptions({
        gestureEnabled: false,
      });

      // Clean up the event listener on unmount
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const goToHome = useCallback(() => {
    // Reset the entire navigation stack and go to Home screen
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  }, []);

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
    };
  }, []);

  const handleQuestionPress = useCallback(
    (question) => {
      // Get the original quiz data from the route params
      console.log("\n questions :", question);
      const quizId = quizResults.id_quiz;

      // Validate required data exists
      if (!quizId) {
        console.error("Missing quiz data for review");

        // FALLBACK: Look up the quiz from QUIZ_DATA if we have quizId
        if (quizId) {
          const fallbackQuiz = SAMPLE_QUIZ_DATA.find(
            (quiz) => quiz.id === quizId
          );
          if (fallbackQuiz) {
            navigation.navigate("ReviewQuestion", {
              question: question,
              quiz: quizResults,
            });
            return;
          }
        }

        // If we can't find the quiz, show an error
        Alert.alert(
          "Error",
          "Cannot display question details. Please try again.",
          [{ text: "OK" }]
        );
        return;
      }

      // Navigate to ReviewQuestion with complete data
      navigation.navigate("ReviewQuestion", {
        question: question,
        quiz: quizResults,
      });
    },
    [navigation]
  );

  // Item extractor for FlatList to prevent re-renders
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Render item function for FlatList
  const renderItem = useCallback(
    ({ item, index }) => (
      <QuestionItem
        question={item}
        index={item.question_number}
        isCorrect={item.isCorrect}
        onPress={handleQuestionPress}
        animationDelay={500} // Start after main animations
      />
    ),
    [handleQuestionPress]
  );

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
            {/* Remove the existing back button and add only home button */}
            <TouchableOpacity
              style={styles.backButton} // Keep using the same style for consistency
              onPress={goToHome}
            >
              <Icon name="home" size={24} color="white" />
            </TouchableOpacity>

            {/* Score indicators */}
            <View style={styles.scoreIndicators}>
              <View style={styles.indicatorContainer}>
                <Text style={styles.indicatorValue}>
                  {normalizedScore.score}
                </Text>
                <View style={styles.indicatorBar}>
                  <View
                    style={[
                      styles.indicatorFill,
                      {
                        backgroundColor: "#4ADE80",
                        width: `${
                          (normalizedScore.score /
                            normalizedScore.totalQuizScore) *
                          100
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <ScoreCircle
                score={normalizedScore.score}
                total={normalizedScore.totalQuizScore}
              />

              <View style={styles.indicatorContainer}>
                <Text style={[styles.indicatorValue, { color: "#FF5252" }]}>
                  {normalizedScore.incorrectCount}
                </Text>
                <View style={styles.indicatorBar}>
                  <View
                    style={[
                      styles.indicatorFill,
                      {
                        backgroundColor: "#FF5252",
                        width: `${
                          (normalizedScore.incorrectCount / normalizedScore.totalQuizScore) * 100
                        }%`,
                      },
                    ]}
                  />
                </View>
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
          removeClippedSubviews={false} // Prevents components from being unmounted when off-screen
          maxToRenderPerBatch={20} // Render all items at once
          windowSize={21} // Keep more items in memory
          initialNumToRender={20} // Render all items initially
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    height: height * 0.35, // Take up about 1/3 of the screen
    overflow: "hidden",
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreIndicators: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
  },
  indicatorContainer: {
    alignItems: "center",
  },
  indicatorValue: {
    color: "#4ADE80",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  indicatorBar: {
    width: 50,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  indicatorFill: {
    height: "100%",
    borderRadius: 2,
  },
  scoreCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  scoreTextContainer: {
    position: "absolute",
    alignItems: "center",
  },
  scoreLabel: {
    color: "#7B5CFF",
    fontSize: 14,
    fontWeight: "500",
    textTransform: "lowercase",
  },
  scoreValue: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
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
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
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
});

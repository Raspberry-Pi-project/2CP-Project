"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  Alert,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Circle, Path } from "react-native-svg"
import QuizBackground from "../components/QuizBackground"

const { width, height } = Dimensions.get("window")
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

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
        ])
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

const ReviewQuestionHistory = ({ navigation, route }) => {
  // Get the parameters from route
  const { 
    originalQuestion, 
    quizId, 
    selectedAnswers = [], 
    title = "History Quiz",
    attemptInfo = {}
  } = route.params || {};
  
  // Setup animations
  const questionAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(
    Array(originalQuestion?.options?.length || 4)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Animation setup
    questionAnim.setValue(0);
    optionsAnim.forEach((anim) => anim.setValue(0));

    Animated.timing(questionAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    Animated.stagger(
      100,
      optionsAnim.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      )
    ).start();
    
    return () => {
      // Cleanup animations when component unmounts
      questionAnim.stopAnimation();
      optionsAnim.forEach(anim => anim.stopAnimation());
    };
  }, []);
  
  // Create fallback question data if original is missing
  const questionData = originalQuestion || {
    text: "Question data could not be loaded",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Purple Header */}
          <View style={styles.purpleHeader}>
            <LinearGradient colors={["#A42FC1", "#8B27A3"]} style={styles.headerGradient}>
              <QuizBackground />

              <View style={styles.headerControls}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>

                <View style={styles.questionBadge}>
                  <Text style={styles.questionBadgeText}>
                    {title || "Question Review"}
                  </Text>
                </View>
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
                <Text style={styles.questionText}>{questionData.text}</Text>
                
                {/* Display attempt info if available */}
                {attemptInfo.date && (
                  <Text style={styles.attemptInfo}>
                    Attempted on: {attemptInfo.date}
                  </Text>
                )}
              </Animated.View>
            </LinearGradient>
          </View>

          {/* Options */}
          <View style={styles.optionsWrapper}>
            <View style={styles.optionsContainer}>
              {questionData.options.map((option, index) => {
                // Determine option state
                const isCorrectOption = typeof questionData.correctAnswer === 'number' 
                  ? index === questionData.correctAnswer
                  : Array.isArray(questionData.correctAnswer) && questionData.correctAnswer.includes(index);
                
                const isSelectedOption = Array.isArray(selectedAnswers) && selectedAnswers.includes(index);
                const isWrongSelection = isSelectedOption && !isCorrectOption;
                
                return (
                  <Animated.View
                    key={index}
                    style={{
                      opacity: optionsAnim[index % optionsAnim.length],
                      transform: [
                        {
                          translateY: optionsAnim[index % optionsAnim.length].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    }}
                  >
                    <View
                      style={[
                        styles.option,
                        // Highlight as correct answer (always show in green)
                        isCorrectOption && styles.correctOption,
                        // Highlight as wrong selection
                        isWrongSelection && styles.incorrectOption,
                        // Only apply selectedOption style if not correct and not wrong
                        (!isCorrectOption && !isWrongSelection && isSelectedOption) && styles.selectedOption,
                      ]}
                    >
                      <Text style={[
                        styles.optionText,
                        // Always show correct answer in green
                        isCorrectOption && styles.correctOptionText,
                        // Only apply incorrectOptionText if wrong selection
                        isWrongSelection && styles.incorrectOptionText,
                        // Only apply selectedOptionText if not correct and not wrong
                        (!isCorrectOption && !isWrongSelection && isSelectedOption) && styles.selectedOptionText,
                      ]}>
                        {option}
                      </Text>

                      {/* Checkmark for correct answer */}
                      {isCorrectOption && (
                        <View style={styles.checkmark}>
                          <Svg width={20} height={20} viewBox="0 0 24 24">
                            <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
                          </Svg>
                        </View>
                      )}
                      
                      {/* X mark for wrong selection */}
                      {isWrongSelection && (
                        <View style={styles.crossmark}>
                          <Svg width={16} height={16} viewBox="0 0 24 24">
                            <Path
                              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                              fill="white"
                            />
                          </Svg>
                        </View>
                      )}

                      {/* Circle indicator for user selection (only show for non-correct selections that aren't wrong) */}
                      {isSelectedOption && !isCorrectOption && !isWrongSelection && (
                        <View style={styles.selectedIndicator}>
                          <Svg width={20} height={20} viewBox="0 0 24 24">
                            <Path
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                              fill="#A42FC1"
                            />
                          </Svg>
                        </View>
                      )}
                    </View>
                  </Animated.View>
                );
              })}
              
              {/* Add legend for the user */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendIcon, { backgroundColor: "#4ADE80" }]}>
                    <Svg width={16} height={16} viewBox="0 0 24 24">
                      <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
                    </Svg>
                  </View>
                  <Text style={styles.legendText}>Correct Answer</Text>
                </View>
                
                <View style={styles.legendItem}>
                  <View style={[styles.legendIcon, { backgroundColor: "#FF5252" }]}>
                    <Svg width={16} height={16} viewBox="0 0 24 24">
                      <Path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                        fill="white"
                      />
                    </Svg>
                  </View>
                  <Text style={styles.legendText}>Wrong Selection</Text>
                </View>
              </View>
              
              {/* Back to Results Button */}
              <View style={styles.navigationButtons}>
                <TouchableOpacity 
                  style={[styles.navButton, styles.nextButton]} 
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.navButtonText}>Back to Results</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Light background color for the main container
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  purpleHeader: {
    height: 220, // Adjusted height to match QuizletScreen2
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
  },
  questionText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
  },
  attemptInfo: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
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
    borderRadius: 25, // EXACT same border radius as QuizletScreen2
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  correctOption: {
    borderColor: "#4ADE80",
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    transform: [{ scale: 1.02 }], // Match the subtle scale effect
  },
  incorrectOption: {
    borderColor: "#FF5252",
    backgroundColor: "rgba(255, 82, 82, 0.05)",
    transform: [{ scale: 1.02 }], // Match the subtle scale effect
  },
  optionText: {
    fontSize: 16,
    color: "#333333",
  },
  correctOptionText: {
    fontWeight: "600",
    color: "#2E8B57", // Darker green for better contrast
  },
  incorrectOptionText: {
    fontWeight: "500",
    color: "#FF5252",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4ADE80",
    justifyContent: "center",
    alignItems: "center",
  },
  crossmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF5252",
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#A42FC1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedOption: {
    borderColor: "#A42FC1",
    backgroundColor: "rgba(164, 47, 193, 0.05)",
    transform: [{ scale: 1.02 }],
  },
  selectedOptionText: {
    fontWeight: "500",
    color: "#A42FC1",
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  legendText: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "500",
  },
})

export default ReviewQuestionHistory; 
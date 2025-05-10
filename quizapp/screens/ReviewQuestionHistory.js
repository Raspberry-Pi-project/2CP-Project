"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path } from "react-native-svg";
import QuizBackground from "../components/QuizBackground";
import axios from "axios";
import { API_URL } from "../services/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ReviewQuestionHistory = ({ navigation, route }) => {
  // Get the parameters from route
  const {
    question,
    quiz,
    selectedAnswers = [],
    title = "Quiz Review",
    attemptInfo = {},
  } = route.params || {};

  if (!question) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={60} color="#A42FC1" />
          <Text style={styles.errorText}>Question data not available</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questionDetails, setQuestionDetails] = useState(null);

  const questionAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (question) {
      setQuestionDetails(question);
    } else if (quiz?.id_quiz && question?.id_question) {
      fetchQuestionDetails();
    }

    questionAnim.setValue(0);
    optionsAnim.setValue(0);

    Animated.timing(questionAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(optionsAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [question]);

  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/students/getQuestionDetails`,
        {
          id_question: question.id_question,
          id_quiz: quiz.id_quiz,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setQuestionDetails(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load question details");
    } finally {
      setLoading(false);
    }
  };

  const getAnswerStatus = (answer) => {
    const isCorrect = answer.correct === 1 || answer.correct === true;
    const isSelected = selectedAnswers.some(
      (selected) => selected.student_answer_text === answer.answer_text
    );
    const isWrongSelection = isSelected && !isCorrect;

    return { isCorrect, isSelected, isWrongSelection };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A42FC1" />
          <Text style={styles.loadingText}>Loading question details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={60} color="#FF5252" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!questionDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="help-circle" size={60} color="#A42FC1" />
          <Text style={styles.errorText}>Question data not available</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#A42FC1", "#7B1FA2"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerControls}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.placeholder} />
        </View>

        <Animated.View
          style={[
            styles.questionContainer,
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
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>
              {questionDetails.question_text}
            </Text>
            {attemptInfo.date && (
              <Text style={styles.attemptInfoText}>
                Attempted: {attemptInfo.date}
              </Text>
            )}
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.optionsWrapper,
            {
              opacity: optionsAnim,
              transform: [
                {
                  translateY: optionsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {questionDetails.answers?.map((answer, index) => {
            const { isCorrect, isSelected, isWrongSelection } =
              getAnswerStatus(answer);

            return (
              <View
                key={answer.id_answer || index}
                style={[
                  styles.optionCard,
                  isCorrect && styles.correctOption,
                  isWrongSelection && styles.incorrectOption,
                  isSelected && !isCorrect && !isWrongSelection && styles.selectedOption,
                ]}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      isCorrect && styles.correctOptionText,
                      isWrongSelection && styles.incorrectOptionText,
                    ]}
                  >
                    {answer.answer_text}
                  </Text>
                </View>

                <View style={styles.optionStatusContainer}>
                  {isCorrect && (
                    <View style={styles.statusIconContainer}>
                      <Icon name="check" size={20} color="#FFFFFF" />
                    </View>
                  )}

                  {isWrongSelection && (
                    <View style={[styles.statusIconContainer, styles.wrongIcon]}>
                      <Icon name="x" size={20} color="#FFFFFF" />
                    </View>
                  )}

                  {isSelected && !isCorrect && !isWrongSelection && (
                    <View style={[styles.statusIconContainer, styles.selectedIcon]}>
                      <Icon name="circle" size={20} color="#A42FC1" />
                    </View>
                  )}
                </View>
              </View>
            );
          })}

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIcon, styles.correctLegendIcon]}>
                <Icon name="check" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.legendText}>Correct Answer</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendIcon, styles.incorrectLegendIcon]}>
                <Icon name="x" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.legendText}>Wrong Selection</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.backToResultsButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToResultsText}>Back to Results</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  questionContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  questionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    lineHeight: 26,
  },
  attemptInfoText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 10,
    fontStyle: "italic",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  optionsWrapper: {
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  correctOption: {
    backgroundColor: "#4ADE80",
    borderColor: "#4ADE80",
  },
  incorrectOption: {
    backgroundColor: "#FF5252",
    borderColor: "#FF5252",
  },
  selectedOption: {
    borderColor: "#A42FC1",
    borderWidth: 2,
  },
  optionContent: {
    flex: 1,
    paddingRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  correctOptionText: {
    color: "white",
    fontWeight: "600",
  },
  incorrectOptionText: {
    color: "white",
    fontWeight: "600",
  },
  optionStatusContainer: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4ADE80",
    alignItems: "center",
    justifyContent: "center",
  },
  wrongIcon: {
    backgroundColor: "#FF5252",
  },
  selectedIcon: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#A42FC1",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  correctLegendIcon: {
    backgroundColor: "#4ADE80",
  },
  incorrectLegendIcon: {
    backgroundColor: "#FF5252",
  },
  legendText: {
    fontSize: 14,
    color: "#555",
  },
  backToResultsButton: {
    backgroundColor: "#A42FC1",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#A42FC1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  backToResultsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#A42FC1",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ReviewQuestionHistory;
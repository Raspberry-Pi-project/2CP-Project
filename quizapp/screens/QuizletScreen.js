"use client";

import { useState, useEffect, useRef } from "react";
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
  Platform,
  AppState,
  StatusBar,
  Image,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import QuizBackground from "../components/QuizBackground";
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../services/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function QuizletScreen({ navigation, route }) {

  // Refs for cleanup
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const appState = useRef(AppState.currentState);

  // Check if quiz data exists in route params
  useEffect(() => {
    if (!route.params || !route.params.quizData) {
      Alert.alert(
        "Error",
        "No quiz data found. Please select a quiz from the home screen.",
        [{ text: "Go Back", onPress: () => navigation.goBack() }]
      );
    }

    return () => {
      // Cleanup on unmount
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Get quiz data from route params or use a default quiz
  const quiz = route.params?.quizData || {};
  const id_attempt = route.params?.id_attempt || null;

  if (!quiz) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>No quiz data found.</Text>
      </View>
    );
  }

  if (!id_attempt) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>No attempt ID found.</Text>
      </View>
    );
  }

  // Ensure questions array exists
  const questions = quiz.questions || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const currentQuestionData = questions[currentQuestion];

  const [customAnswer, setCustomAnswer] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(
    currentQuestionData.duration === 0 ? 60 : currentQuestionData.duration
  );
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questions.length).fill([])
  );

  // Animation refs
  const progressAnim = useRef(new Animated.Value(0)).current;
  const questionAnim = useRef(new Animated.Value(0)).current;
  const timerProgress = useRef(new Animated.Value(1)).current;
  const timerOpacity = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const customInputAnim = useRef(new Animated.Value(0)).current;
  const nextButtonAnim = useRef(new Animated.Value(0)).current;

  const optionsAnim = useRef(
    Array(5)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  // Reset quiz function
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setCustomAnswer("");

    setSelectedAnswers(Array(questions.length).fill([]));

    setShowCustomInput(false);
    setTimeLeft(
      currentQuestionData.duration === 0 ? 60 : currentQuestionData.duration
    );
    setTimerActive(true);

    // Reset animations
    questionAnim.setValue(0);
    timerProgress.setValue(1);
    timerOpacity.setValue(1);
    pulseAnim.setValue(1);
    nextButtonAnim.setValue(0);
    progressAnim.setValue(0);
    optionsAnim.forEach((anim) => anim.setValue(0));
    customInputAnim.setValue(0);
    shakeAnim.setValue(0);
    headerAnim.setValue(0);
    progressBarAnim.setValue(0);
    backgroundAnim.setValue(0);


    Alert.alert(
      "Quiz Reset",
      "Your quiz progress was lost because you left the app. Please start over.",
      [{ text: "OK" }]
    );


  // AppState listener with improved handling
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        resetQuiz();
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [questions]);

  // Timer settings
  const timerRadius = 25;
  const timerStroke = 4;
  const timerCircumference = 2 * Math.PI * timerRadius;


  // Timer effect with cleanup
  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {

        setTimeLeft((prev) => {
          if (prev <= 0) {
            handleNext();
            return currentQuestionData.duration === 0
              ? 60
              : currentQuestionData.duration;
          }
          const newTime = prev - 1;

          Animated.timing(timerProgress, {
            toValue:
              newTime /
              (currentQuestionData.duration === 0
                ? 60
                : currentQuestionData.duration),

            duration: 1000,
            useNativeDriver: true,
          }).start();

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
            ]).start();
          }

          if (newTime === 0) {
            Animated.timing(timerOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start();
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentQuestion, timerActive]);


  // Keyboard listeners with cleanup
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Question change effect with cleanup
  useEffect(() => {
    // Reset animations for new question
    optionsAnim.forEach((anim) => anim.setValue(0));
    questionAnim.setValue(0);
    nextButtonAnim.setValue(0);

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
    ]).start();

    // Animate options
    const currentOptions = questions[currentQuestion]?.answers || [];
    const numOptions = currentOptions.length + 1;

    Animated.stagger(
      100,
      optionsAnim.slice(0, numOptions).map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        })
      )
    ).start();

    // Reset custom input state
    setShowCustomInput(false);
    setCustomAnswer("");
    customInputAnim.setValue(0);
    setTimeLeft(
      currentQuestionData.duration === 0 ? 60 : currentQuestionData.duration
    );
    timerProgress.setValue(1);
    timerOpacity.setValue(1);
    setTimerActive(true);
  }, [currentQuestion]);

  const handleAnswer = (index) => {
    if (index === (questions[currentQuestion]?.answers?.length || 0)) {
      setShowCustomInput(true);
      setTimerActive(false);
      Animated.timing(customInputAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }


    Animated.sequence([
      Animated.timing(optionsAnim[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(optionsAnim[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const currentQuestionAnswers = selectedAnswers[currentQuestion] || [];
    const existingAnswerIndex = currentQuestionAnswers.findIndex(
      (answer) =>
        answer.student_answer_text ===
        questions[currentQuestion].answers[index].answer_text
    );

    let newQuestionAnswers;
    if (existingAnswerIndex >= 0) {
      newQuestionAnswers = [...currentQuestionAnswers];
      newQuestionAnswers.splice(existingAnswerIndex, 1);
    } else {
      const newAnswer = {
        id_attempt,
        id_question: questions[currentQuestion].id_question,
        student_answer_text:
          questions[currentQuestion].answers[index].answer_text,
      };
      newQuestionAnswers = [...currentQuestionAnswers, newAnswer];
    }

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = newQuestionAnswers;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleCustomAnswer = () => {
    if (customAnswer.trim()) {
      const customAnswerObj = {
        id_attempt,
        id_question: questions[currentQuestion].id_question,
        student_answer_text: customAnswer.trim(),
      };

      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestion] = [customAnswerObj];
      setSelectedAnswers(newSelectedAnswers);

      Keyboard.dismiss();
      handleNext();
    } else {
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
      ]).start();
    }
  };

  const handleNext = async () => {

    if (isSubmittingRef.current) return;

    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(
        currentQuestionData.duration === 0 ? 60 : currentQuestionData.duration
      );
      setTimerActive(true);
    } else {
      // Submit answers
      isSubmittingRef.current = true;

      try {
        const finalScore = questions.reduce((totalScore, question, idx) => {
          const userAnswers = selectedAnswers[idx] || [];
          const correctAnswers = question.answers.filter(
            (answer) => answer.correct === 1
          );

          const allCorrectSelected = correctAnswers.every((ans) =>

            selectedAnswers[idx].some((userAns) => {
              if (userAns.student_answer_text === ans.answer_text) {
                userAns.correct = 1;
                return true;
              } else {
                userAns.correct = 0;
                return false;
              }
            })
          );

          const onlyCorrectSelected = userAnswers.every((userAns) =>
            correctAnswers.some(
              (ans) => ans.answer_text === userAns.student_answer_text
            )
          );

          if (allCorrectSelected && onlyCorrectSelected) {
            question.isCorrect = true;
            return totalScore + question.points;
          } else {
            question.isCorrect = false;
            return totalScore;
          }
        }, 0);


        const token = await AsyncStorage.getItem("token");

        // Store the score in AsyncStorage to prevent multiple submissions
        const submissionKey = `quiz_submission_${id_attempt}`;
        const hasSubmitted = await AsyncStorage.getItem(submissionKey);

        if (hasSubmitted) {
          console.log(
            "Quiz already submitted, preventing duplicate submission"
          );
          return;
        }

        const response = await axios.post(
          `${API_URL}/students/submitAnswers`,
          {
            id_attempt,
            score: finalScore,
            answers: selectedAnswers.flat(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          // Mark this attempt as submitted
          await AsyncStorage.setItem(submissionKey, "true");

          // Clear all timers and intervals before navigation
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (intervalRef.current) clearInterval(intervalRef.current);

          // Reset the submitting flag
          isSubmittingRef.current = false;

          // Navigate and reset the navigation state
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "Home",
                params: {
                  screen: "Results",
                  params: {
                    id_quiz: quiz.id_quiz,
                    score: finalScore,
                    totalQuestions: quiz.totalQuestions,
                    correctCount: finalScore,
                    incorrectCount: questions.length - finalScore,
                  },
                },
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error updating attempt:", error);
        Alert.alert("Error", "Failed to submit answers. Please try again.");
        isSubmittingRef.current = false;
      }
    }
  };

  // Add cleanup effect
  useEffect(() => {
    return () => {
      // Clear all timers and intervals
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Reset submitting flag
      isSubmittingRef.current = false;
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.purpleHeader}>
            <LinearGradient
              colors={["#A42FC1", "#8B27A3"]}
              style={styles.headerGradient}
            >
              <QuizBackground />

              <View style={styles.headerControls}>

                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Icon name="arrow-left" size={22} color="white" />
                </TouchableOpacity>
              </Animated.View>

                <Animated.View
                  style={[
                    styles.timerContainer,
                    {
                      opacity: timerOpacity,
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <Svg
                    width={timerRadius * 2 + timerStroke}
                    height={timerRadius * 2 + timerStroke}
                  >
                    <Defs>
                      <SvgLinearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#4A00E0" />
                        <Stop offset="100%" stopColor="#8E2DE2" />
                      </SvgLinearGradient>
                    </Defs>
                    <Circle
                      cx={timerRadius + timerStroke / 2}
                      cy={timerRadius + timerStroke / 2}
                      r={timerRadius}
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth={timerStroke}
                      fill="rgba(255, 255, 255, 0.1)"
                    />
                    <AnimatedCircle
                      cx={timerRadius + timerStroke / 2}
                      cy={timerRadius + timerStroke / 2}
                      r={timerRadius}
                      stroke="url(#timerGradient)"
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
                  <Text
                    style={[
                      styles.timerText,
                      timeLeft <= 5 && styles.timerTextRed,
                    ]}
                  >
                    {timeLeft}
                  </Text>
                </Animated.View>
              )}
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    {
                      width: progressBarAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', `${progressPercentage}%`],
                      }),
                    },
                  ]}
                />
              </View>

              <View style={styles.questionCounterContainer}>
                <Text style={styles.questionCounter}>
                  Question {currentQuestion + 1}/{quiz.totalQuestions}
                </Text>
              </View>

              <Animated.View
                style={[
                  styles.questionTextContainer,

                  {
                    translateY: questionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ]}
              >
                <Text style={styles.questionText}>
                  {currentQuestionData.question_text}
                </Text>
              </Animated.View>
            </LinearGradient>
          </View>


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
                    placeholderTextColor="rgba(0,0,0,0.4)"
                  />
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleCustomAnswer}
                  >
                    <LinearGradient
                      colors={["#8E2DE2", "#4A00E0"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.submitButtonGradient}
                    >
                      <Text style={styles.submitButtonText}>Submit Answer</Text>
                      <Icon name="check-circle" size={18} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                (currentQuestionData.answers || []).map((option, index) => (
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
                        selectedAnswers[currentQuestion]?.some(
                          (answer) =>
                            answer.student_answer_text === option.answer_text
                        )
                          ? styles.selectedOption
                          : styles.option,
                      ]}
                      onPress={() => handleAnswer(index)}
                      disabled={showCustomInput}
                      activeOpacity={0.7}

                    >
                      <TouchableOpacity
                        style={[
                          selectedAnswers[currentQuestion]?.some(
                            (answer) =>
                              answer.student_answer_text === option.answer_text
                          )
                            ? styles.selectedOptionText
                            : styles.optionText,

                        ]}
                        onPress={() => handleAnswer(index)}
                        disabled={showCustomInput}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={
                            isSelected
                              ? ["#8E2DE2", "#4A00E0"]
                              : ["#FFF", "#F8F8F8"]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[
                            styles.optionGradient,
                            isSelected && styles.selectedOptionGradient,
                          ]}
                        >
                          <View style={styles.optionContent}>
                            <Text
                              style={[
                                styles.optionText,
                                isSelected && styles.selectedOptionText,
                              ]}
                            >
                              {option.answer_text}
                            </Text>
                            {isSelected && (
                              <Icon
                                name="check"
                                size={20}
                                color="white"
                                style={styles.checkIcon}
                              />
                            )}
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })
              )}

              {/* "Other" option if open-ended question */}
              {currentQuestionData.allow_custom_answer && !showCustomInput && (
                <Animated.View
                  style={{
                    opacity: optionsAnim[
                      (currentQuestionData.answers || []).length
                    ],
                    transform: [
                      {
                        translateY: optionsAnim[
                          (currentQuestionData.answers || []).length
                        ].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() =>
                      handleAnswer((currentQuestionData.answers || []).length)
                    }
                  >
                    <LinearGradient
                      colors={["#F8F8F8", "#F0F0F0"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.optionGradient}
                    >
                      <View style={styles.otherOptionContent}>
                        <Icon name="edit-2" size={18} color="#8E2DE2" />
                        <Text style={styles.otherOptionText}>
                          Other (Write your own)
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={handleNext}
                disabled={
                  selectedAnswers[currentQuestion]?.length === 0 &&
                  !customAnswer.trim() &&
                  !showCustomInput

                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestion < questions.length - 1
                    ? "Next Question"
                    : "Finish Quiz"}
                </Text>
                <Icon
                  name={
                    currentQuestion < questions.length - 1
                      ? "arrow-right"
                      : "check-circle"
                  }
                  size={22}
                  color="white"
                  style={styles.nextIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",

  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    height: height * 0.35,
  },
  purpleHeader: {
    height: 220,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",

  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    width: "100%",
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButtonContainer: {
    marginRight: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
  },
  titleContainer: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  timerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  timerText: {
    position: "absolute",
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  timerTextRed: {
    color: "#FF5252",
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBackground: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    backgroundColor: "white",
    borderRadius: 4,
  },
  progressText: {
    color: "white",
    fontSize: 12,
    marginTop: 6,
    opacity: 0.85,
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    lineHeight: 24,
  },
  optionsWrapper: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 80,

  },
  option: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionGradient: {
    borderRadius: 12,
    padding: 16,
  },
  selectedOption: {
    transform: [{ scale: 1.01 }],
  },
  selectedOptionGradient: {
    borderRadius: 12,
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "600",
  },
  checkIcon: {
    marginLeft: 10,
  },
  otherOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  otherOptionText: {
    fontSize: 16,
    color: "#8E2DE2",
    marginLeft: 10,
    fontWeight: "500",
  },
  customInputContainer: {
    marginBottom: 20,
  },
  customInput: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
  },
  submitButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  submitButtonGradient: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  nextButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  nextButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  nextButtonGradient: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  nextIcon: {
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 18,
    color: "#FF5252",
    textAlign: "center",
    marginTop: 40,
  },
});
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
  // Get safe area insets for proper layout on notched devices
  const insets = useSafeAreaInsets();
  
  // AppState reference to track app state changes
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
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [customAnswer, setCustomAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(currentQuestionData.duration === 0 ? 60 : currentQuestionData.duration);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
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
  const backButtonAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const progressBarAnim = useRef(new Animated.Value(0)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  // Create option animations for each question
  const optionsAnim = useRef(
    Array(5)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  // Reset quiz function to be called when app returns to foreground
  const resetQuiz = () => {
    // Reset all quiz state
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setCustomAnswer("");
    setScore(0);
    setAnswers(Array(questions.length).fill(null));
    setTimeLeft(questions[0].duration === 0 ? 60 : questions[0].duration);
    setShowCustomInput(false);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setTimerActive(true);
    setSelectedAnswers(Array(questions.length).fill([]));

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

    // Start animations for first question
    runEntryAnimations();

    // Alert user that quiz has been reset
    Alert.alert(
      "Quiz Reset",
      "Your quiz progress was lost because you left the app. Please start over.",
      [{ text: "OK" }]
    );
  };

  // Run initial animations when component mounts
  useEffect(() => {
    runEntryAnimations();
  }, []);

  const runEntryAnimations = () => {
    // Animate header elements
    Animated.sequence([
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backButtonAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(progressBarAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Animate question and options with sequence
    Animated.sequence([
      Animated.timing(questionAnim, {
        toValue: 1,
        duration: 500,
        delay: 200,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.stagger(
        100,
        optionsAnim.slice(0, currentQuestionData?.answers?.length || 0).map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          })
        )
      ),
      Animated.timing(nextButtonAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress
    Animated.timing(progressAnim, {
      toValue: (currentQuestion + 1) / questions.length,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  // Listen for AppState changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
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
  const timerRadius = 25;
  const timerStroke = 4;
  const timerCircumference = 2 * Math.PI * timerRadius;

  // Reset animations and move to next question
  const prepareNextQuestion = () => {
    // Fade out current question and options
    Animated.parallel([
      Animated.timing(questionAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      ...optionsAnim.map((anim) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        })
      ),
      Animated.timing(nextButtonAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Update current question state
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(
        questions[currentQuestion + 1]?.duration === 0
          ? 60
          : questions[currentQuestion + 1]?.duration
      );
      setTimerActive(true);
      
      // Prepare animations for new question
      questionAnim.setValue(0);
      optionsAnim.forEach((anim) => anim.setValue(0));
      nextButtonAnim.setValue(0);
      timerProgress.setValue(1);
      timerOpacity.setValue(1);
      pulseAnim.setValue(1);
      
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: (currentQuestion + 2) / questions.length,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      
      // Fade in new question and options
      Animated.sequence([
        Animated.timing(questionAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.stagger(
          100,
          optionsAnim
            .slice(0, questions[currentQuestion + 1]?.answers?.length || 0)
            .map((anim) =>
              Animated.timing(anim, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.back(1.2)),
                useNativeDriver: true,
              })
            )
        ),
        Animated.timing(nextButtonAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  useEffect(() => {
    // Timer animation
    let timerInterval;

    if (timerActive && currentQuestionData.duration !== 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            handleNext();
            return currentQuestionData.duration === 0
              ? 60
              : currentQuestionData.duration;
          }
          const newTime = prev - 1;

          Animated.timing(timerProgress, {
            toValue: newTime / (currentQuestionData.duration === 0 ? 60 : currentQuestionData.duration),
            duration: 1000,
            useNativeDriver: true,
          }).start();

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

    return () => clearInterval(timerInterval);
  }, [currentQuestion, timerActive, currentQuestionData]);

  useEffect(() => {
    // Keyboard listeners
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

  const handleAnswer = (index) => {
    // If "Other" option is selected
    if (index === (questions[currentQuestion]?.answers?.length || 0)) {
      setShowCustomInput(true);
      setTimerActive(false); // Pause timer when custom input is shown
      Animated.timing(customInputAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }

    // Animate the selection with a quick scale effect
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

    // Get the current question's selected answers or initialize an empty array
    const currentQuestionAnswers = selectedAnswers[currentQuestion] || [];

    // Check if this answer is already selected
    const existingAnswerIndex = currentQuestionAnswers.findIndex(
      (answer) =>
        answer.student_answer_text ===
        questions[currentQuestion].answers[index].answer_text
    );

    // Create a new array for the current question's answers
    let newQuestionAnswers;

    if (existingAnswerIndex >= 0) {
      // If the answer is already selected, remove it (toggle off)
      newQuestionAnswers = [...currentQuestionAnswers];
      newQuestionAnswers.splice(existingAnswerIndex, 1);
    } else {
      // If the answer is not selected, add it (toggle on)
      const newAnswer = {
        id_attempt,
        id_question: questions[currentQuestion].id_question,
        student_answer_text:
          questions[currentQuestion].answers[index].answer_text,
      };
      newQuestionAnswers = [...currentQuestionAnswers, newAnswer];
    }

    // Update the selectedAnswers array
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = newQuestionAnswers;
    setSelectedAnswers(newSelectedAnswers);

    // For backward compatibility, set the most recent selection
    setSelectedAnswer(index);

    // Update the answers array to match selectedAnswers
    setAnswers(newSelectedAnswers);
  };

  const handleCustomAnswer = () => {
    if (customAnswer.trim()) {
      const index = -1; // Special index for custom answer
      setSelectedAnswer(index);

      // Create a custom answer object
      const customAnswerObj = {
        id_attempt,
        id_question: questions[currentQuestion].id_question,
        student_answer_text: customAnswer.trim(),
      };

      // Update both selectedAnswers and answers arrays
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestion] = [customAnswerObj];
      setSelectedAnswers(newSelectedAnswers);
      setAnswers(newSelectedAnswers);

      Keyboard.dismiss();

      // Move to next question after submitting custom answer
      handleNext();
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
      ]).start();
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      // Animate transition to next question
      prepareNextQuestion();
    } else {
      // Quiz is complete - calculate score based on selected answers
      const finalScore = questions.reduce((totalScore, question, idx) => {
        const userAnswers = selectedAnswers[idx] || [];
        const correctAnswer = question.answers.filter(
          (answer) => answer.correct === 1
        );

        // If there are multiple correct answers
        if (Array.isArray(correctAnswer)) {
          // Check if user selected all correct answers and only correct answers
          const allCorrectSelected = correctAnswer.every((ans) =>
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
            correctAnswer.some(
              (ans) => ans.answer_text === userAns.student_answer_text
            )
          );
          if (allCorrectSelected && onlyCorrectSelected) {
            question.isCorrect = true;
            return totalScore + 1;
          } else {
            question.isCorrect = false;
            return totalScore;
          }
        }

        return totalScore;
      }, 0);

      // Show loading animation
      Animated.parallel([
        Animated.timing(headerAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(questionAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        ...optionsAnim.map((anim) =>
          Animated.timing(anim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          })
        ),
        Animated.timing(nextButtonAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Submit quiz results
      const attemptResult = {
        id_attempt: id_attempt,
        answers: selectedAnswers.flat(),
        score: finalScore,
      };
      
      try {
        const token = await AsyncStorage.getItem("token");
        const updatedAttempt = await axios.post(
          `${API_URL}/students/submitAnswers`,
          {
            id_attempt: attemptResult.id_attempt,
            score: attemptResult.score,
            answers: attemptResult.answers,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (updatedAttempt.status === 200) {
          console.log("Attempt updated successfully");
          const quizResults = {
            id_quiz: quiz.id_quiz,
            totalQuizScore: quiz.score,
            score: finalScore,
            total: quiz.totalQuestions,
            correctCount: finalScore,
            incorrectCount: questions.length - finalScore,
            questions: questions.map((q, index) => ({
              ...q,
              id_question: q.id_question,
              id: q.question_number || index + 1,
              text: q.question_text,
              isCorrect: q.isCorrect,
              selectedAnswers: selectedAnswers[index] || [],
            })),
          };
          
          // Show success animation before navigation
          Animated.timing(backgroundAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            navigation.navigate("Home");
          });
        } else {
          throw new Error("Failed to update attempt");
        }
      } catch (error) {
        console.error("Error updating attempt:", error);
        Alert.alert("Error", "Failed to update attempt. Please try again.");
        navigation.navigate("Home");
      }
    }
  };

  // Calculate progress percentage for the progress bar
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" />
        
        {/* Quiz Background with Animation */}
        <Animated.View 
          style={[
            styles.backgroundContainer,
            {
              opacity: backgroundAnim,
              transform: [
                {
                  translateY: backgroundAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#8E2DE2", "#4A00E0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.backgroundGradient}
          >
            <QuizBackground />
          </LinearGradient>
        </Animated.View>

        <SafeAreaView style={styles.content}>
          {/* Header Section */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: headerAnim,
                transform: [
                  {
                    translateY: headerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.headerTop}>
              {/* Back Button */}
              <Animated.View
                style={[
                  styles.backButtonContainer,
                  {
                    opacity: backButtonAnim,
                    transform: [
                      {
                        translateX: backButtonAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Icon name="arrow-left" size={22} color="white" />
                </TouchableOpacity>
              </Animated.View>

              {/* Quiz Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.quizTitle} numberOfLines={1}>
                  {quiz.title || "Quiz"}
                </Text>
              </View>

              {/* Timer Circle */}
              {currentQuestionData.duration !== 0 && (
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
              
              <Text style={styles.progressText}>
                Question {currentQuestion + 1} of {questions.length}
              </Text>
            </View>
          </Animated.View>

          {/* Question Card */}
          <Animated.View
            style={[
              styles.questionCard,
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
            <Text style={styles.questionText}>
              {currentQuestionData.question_text}
            </Text>
          </Animated.View>

          {/* Options Section */}
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
                (currentQuestionData.answers || []).map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion]?.some(
                    (answer) => answer.student_answer_text === option.answer_text
                  );
                  
                  return (
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
                          {
                            scale: optionsAnim[index],
                          },
                        ],
                      }}
                    >
                      <TouchableOpacity
                        style={[
                          styles.option,
                          isSelected && styles.selectedOption,
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

          {/* Next Question Button */}
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
                selectedAnswers[currentQuestion]?.length === 0 &&
                  styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={selectedAnswers[currentQuestion]?.length === 0}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  selectedAnswers[currentQuestion]?.length === 0
                    ? ["#CCCCCC", "#AAAAAA"]
                    : ["#8E2DE2", "#4A00E0"]
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
    backgroundColor: "#F8F8F8",
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    height: height * 0.35,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  optionsContainer: {
    marginBottom: 20,
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
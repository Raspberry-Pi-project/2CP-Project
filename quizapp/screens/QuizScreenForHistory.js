"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
  ActivityIndicator,
} from "react-native"
import axios from "axios"
import { API_URL } from "../services/config"
import { useNavigation } from "@react-navigation/native"

import Icon from "react-native-vector-icons/Feather"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg"

const { width, height } = Dimensions.get("window")
const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

// Floating bubbles background component
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

// Animated score circle component
const ScoreCircle = ({ score, total }) => {
  const animatedValue = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score / total,
      duration: 1500,
      useNativeDriver: false,
    }).start()

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

// Question item component with animations
const QuestionItem = React.memo(({ question, index, isCorrect, onPress, animationDelay, studentAnswer }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const bounceAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
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

    onPress && onPress(question, studentAnswer)
  }, [onPress, question, studentAnswer])

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
      <TouchableOpacity 
        style={[styles.questionItem, { borderLeftWidth: 4, borderLeftColor: borderColor }]} 
        onPress={handlePress} 
        activeOpacity={0.8}
      >
        <View style={styles.questionItemContent}>
          <Text style={styles.questionText}>{question.text}</Text>
          
          {studentAnswer && (
            <View style={styles.studentAnswerContainer}>
              <Text style={styles.studentAnswerLabel}>Your answer:</Text>
              <Text style={[
                styles.studentAnswerText, 
                { color: isCorrect ? "#4ADE80" : "#FF5252" }
              ]}>
                {studentAnswer.student_answer_text || `Option ${studentAnswer.selected_answer}`}
              </Text>
            </View>
          )}
        </View>
        
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

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
}

export default function QuizScreenForHistory({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [attemptDetails, setAttemptDetails] = useState(null);
  const [error, setError] = useState(null);
  const [quizResultsData, setQuizResultsData] = useState(route.params?.quizResults || {});
  const [retryCount, setRetryCount] = useState(0);
  const [enrichedQuestions, setEnrichedQuestions] = useState([]);
  
  const isMounted = useRef(true);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  
  const { quizResults, attemptId } = route.params || {};

  useEffect(() => {
    if (quizResults) {
      setQuizResultsData(quizResults);
    }
  }, [quizResults]);

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        setLoading(true);
        
        if (!attemptId) {
          setError("Missing attempt ID");
          setLoading(false);
          return;
        }
        
        const response = await axios.post(`${API_URL}/students/getAttemptById`, 
          JSON.stringify({ id_attempt: attemptId }), 
          {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        if (response.data && response.data.data) {
          setAttemptDetails(response.data.data);
        } else {
          if (quizResults && Object.keys(quizResults).length > 0) {
            setAttemptDetails({
              student_answers: [],
              corrected: quizResults.correctCount || 0,
              attempt_at: new Date().toISOString()
            });
          } else {
            setError("No attempt data found in server response");
          }
        }
      } catch (err) {
        console.error("Error fetching attempt details:", err);
        
        if (err.response) {
          if (err.response.status === 500) {
            setError("The server encountered an internal error. The quiz attempt data may be unavailable.");
          } else {
            setError(`Server error (${err.response.status}): ${err.response.data?.message || 'Unknown server error'}`);
          }
          
          if (quizResults && Object.keys(quizResults).length > 0) {
            setAttemptDetails({
              student_answers: [],
              corrected: quizResults.correctCount || 0,
              attempt_at: new Date().toISOString()
            });
          }
        } else if (err.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError(`Request error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptDetails();
  }, [attemptId, quizResults, retryCount]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      headerAnim.stopAnimation();
      contentAnim.stopAnimation();
    };
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    if (!quizResultsData?.questions || !attemptDetails?.student_answers) {
      return;
    }
    
    const studentAnswersMap = {};
    attemptDetails.student_answers.forEach(answer => {
      studentAnswersMap[answer.id_question] = answer;
    });
    
    const enriched = quizResultsData.questions.map(question => {
      const studentAnswer = studentAnswersMap[question.id];
      const isCorrect = studentAnswer ? studentAnswer.is_correct : null;
      
      return {
        ...question,
        isCorrect,
        studentAnswer
      };
    });
    
    setEnrichedQuestions(enriched);
  }, [quizResultsData, attemptDetails]);

  const combinedData = useMemo(() => {
    if (!quizResultsData || !attemptDetails) return null;
    
    return {
      ...quizResultsData,
      studentAnswers: attemptDetails.student_answers || [],
      attemptInfo: {
        ...quizResultsData.attemptInfo,
        corrected: attemptDetails.corrected || 0,
        attempt_at: attemptDetails.attempt_at
      }
    };
  }, [quizResultsData, attemptDetails]);

  const {
    score = 0,
    total = 10,
    correctCount = 0,
    incorrectCount = 0,
    originalQuiz = null,
    attemptInfo = {}
  } = combinedData || quizResultsData || {};

  const normalizedScore = {
    score: score || 0,
    totalQuestions: total || 10,
    correctCount: correctCount || 0,
    incorrectCount: incorrectCount || 0
  };

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleHomePress = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [navigation]);

  const handleQuestionPress = useCallback((question, studentAnswer) => {
    if (!combinedData) return;
    
    navigation.navigate("ReviewQuestionHistory", {
      originalQuestion: question,
      quizId: combinedData.quizId,
      selectedAnswers: studentAnswer ? [studentAnswer.selected_answer] : [],
      title: combinedData.originalQuiz?.title || "Quiz Review",
      attemptInfo: {
        ...combinedData.attemptInfo,
        isCorrect: question.isCorrect,
        date: formatDate(combinedData.attemptInfo.attempt_at || attemptInfo.date)
      }
    });
  }, [combinedData, navigation]);

  const keyExtractor = useCallback((item, index) => 
    item.id ? `question-${item.id}` : `question-index-${index}`, []);

  const renderItem = useCallback(({ item, index }) => (
    <QuestionItem
      question={item}
      index={index}
      isCorrect={item.isCorrect}
      studentAnswer={item.studentAnswer}
      onPress={handleQuestionPress}
      animationDelay={500}
    />
  ), [handleQuestionPress]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B5CFF" />
        <Text style={styles.loadingText}>Loading attempt details...</Text>
      </View>
    );
  }

  if (error && (!quizResultsData || Object.keys(quizResultsData).length === 0)) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-triangle" size={50} color="#FF5252" />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          A server error occurred while fetching your quiz attempt.
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setRetryCount(prev => prev + 1);
              setError(null);
              setLoading(true);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.retryButton, {backgroundColor: "#6B7280"}]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  if (error && quizResultsData && Object.keys(quizResultsData).length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={20} color="#FFB238" />
          <Text style={styles.warningText}>
            Some data couldn't be loaded from the server. Showing limited information.
          </Text>
          <TouchableOpacity 
            style={styles.retrySmallButton}
            onPress={() => {
              setRetryCount(prev => prev + 1);
              setError(null);
              setLoading(true);
            }}
          >
            <Text style={styles.retrySmallButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        
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

              <View style={styles.scoreCircleWrapper}>
                <ScoreCircle score={normalizedScore.score} total={normalizedScore.totalQuestions} />
              </View>

              <Text style={styles.screenTitle}>Attempt Review</Text>
              <Text style={styles.screenSubtitle}>
                {formatDate(attemptInfo.attempt_at || attemptInfo.date)}
              </Text>

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
          {enrichedQuestions.length > 0 ? (
            <FlatList
              data={enrichedQuestions}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              contentContainerStyle={styles.questionsContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={20}
            />
          ) : (
            <View style={styles.noQuestionsContainer}>
              <Icon name="help-circle" size={50} color="#7B5CFF" />
              <Text style={styles.noQuestionsText}>
                Question details are not available.
              </Text>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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

            <View style={styles.scoreCircleWrapper}>
              <ScoreCircle score={normalizedScore.score} total={normalizedScore.totalQuestions} />
            </View>

            <Text style={styles.screenTitle}>Attempt Review</Text>
            <Text style={styles.screenSubtitle}>
              {formatDate(attemptInfo.attempt_at || attemptInfo.date)}
            </Text>

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
        {enrichedQuestions.length > 0 ? (
          <FlatList
            data={enrichedQuestions}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.questionsContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={20}
          />
        ) : (
          <View style={styles.noQuestionsContainer}>
            <Icon name="help-circle" size={50} color="#7B5CFF" />
            <Text style={styles.noQuestionsText}>
              No questions available for this attempt.
            </Text>
          </View>
        )}
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  questionItemContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 8,
  },
  studentAnswerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAnswerLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },
  studentAnswerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#FF5252",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: "#7B5CFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  warningBanner: {
    backgroundColor: "#FFF9E6",
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#FFE082",
  },
  warningText: {
    fontSize: 12,
    color: "#996500",
    flex: 1,
    marginHorizontal: 10,
  },
  retrySmallButton: {
    backgroundColor: "#FFB238",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  retrySmallButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  noQuestionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noQuestionsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
})
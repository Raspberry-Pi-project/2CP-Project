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
  Alert,
} from "react-native"
import axios from "axios"
import { API_URL } from "../services/config"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg"

import AsyncStorage from "@react-native-async-storage/async-storage"

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
    const percentage = total > 0 ? score / total : 0
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
        {total > 0 ? Math.round((score / total) * 100) : 0}%
        </Text>
        <Text style={styles.scoreLabel}>{score}/{total}</Text>
      </View>
    </Animated.View>
  )
}

// Question item component with animations
/*const QuestionItem = React.memo(({ question, index, isCorrect, onPress, animationDelay, studentAnswer }) => {
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
          <Text style={styles.questionText}>{question.question_text}</Text>
          
          {studentAnswer && (
            <View style={styles.studentAnswerContainer}>
              <Text style={styles.studentAnswerLabel}>Your answer:</Text>
              <Text style={[
                styles.studentAnswerText, 
                { color: isCorrect ? "#4ADE80" : "#FF5252" }
              ]}>
              {typeof studentAnswer === 'string' ? studentAnswer : "No answer selected"}

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
}) */


  // Complete corrected QuestionItem component
/*const QuestionItem = React.memo(({ question, index, isCorrect, onPress, animationDelay }) => {
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

    onPress && onPress(question, question.studentAnswer)
  }, [onPress, question])

  const isCorrect = question.correct === true || question.correct === 1;

  const borderColor = isCorrect ? "#4ADE80" : "#FF5252";

  /*if (enrichedQuestions.length === 0) {
    return <Text>No questions found</Text>;
  } *
  
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
          <Text style={styles.questionText}>{question.question_text}</Text>
          
          {question.studentAnswer && (
            <View style={styles.studentAnswerContainer}>
              <Text style={styles.studentAnswerLabel}>Your answer:</Text>
              <Text style={[
                styles.studentAnswerText, 
                { color: isCorrect ? "#4ADE80" : "#FF5252" }
              ]}>
                {typeof question.studentAnswer === 'string' ? question.studentAnswer : "No answer selected"}
              </Text>
            </View>
          )}
        </View>
        
        <View style={[styles.statusIcon, { backgroundColor: isCorrect ? "#4ADE80" : "#FF5252" }]}>
          {isCorrect  ? (
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
}) */

  const QuestionItem = React.memo(({ question, index, onPress, animationDelay }) => {
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
  
      onPress && onPress(question)
    }, [onPress, question])
  
    // Determine if the answer is correct - handle different data formats
    const isCorrect = question.correct === true || question.correct === 1;
    
    const borderColor = question.correct ? "#4ADE80" : "#FF5252";
    
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
            <Text style={styles.questionText}>{question.question_text}</Text>
            
            
              <View style={styles.studentAnswerContainer}>
                <Text style={styles.studentAnswerLabel}>Your answer:</Text>
                <Text style={[
                  styles.studentAnswerText, 
                  { color: isCorrect ? "#4ADE80" : "#FF5252" }
                ]}>
                  {typeof question.studentAnswer === 'string' ? question.studentAnswer : "No answer selected"}
                </Text>
              </View>
            
          </View>
          
          <View style={[styles.statusIcon, { backgroundColor: question.correct  ? "#4ADE80" : "#FF5252" }]}>
            {question.correct  ? (
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
  const [quizDetails, setQuizDetails] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const isMounted = useRef(true);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const { attemptId, quizId } = route.params || {};

  useEffect(() => {

     Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();


    if (!attemptId || !quizId) {
      console.error("Missing attemptId or quizId in navigation params:", route.params);
      setError("Invalid navigation parameters.");
    }

  }, [attemptId, quizId]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("token");

      //console.log("Attempting to fetch attempt data for ID:", attemptId);
      const attemptResponse = await axios.post(`${API_URL}/students/getAttemptAnswers`, {
        id_attempt: attemptId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

      if (!attemptResponse?.data) throw new Error("Attempt data unavailable");

      console.log("Raw API response:", JSON.stringify(attemptResponse.data, null, 2));

      const questions = attemptResponse.data.questions || [];

      //console.log("Got attempt data:", attemptResponse.data);


      const parsedAttempt = {
        attemptId: attemptResponse.data.id_attempt,
        quizId: attemptResponse.data.id_quiz,
        corrected: attemptResponse.data.corrected || 0,
        score: attemptResponse.data.score || 0,
        totalQuestions: attemptResponse.data.questions.length,
        attempt_at: attemptResponse.data.attempt_at,
        student_answers: attemptResponse.data.questions?.map((q) => {

         // const isCorrect = q.student_answers?.correct === 1 || q.student_answers?.correct === true;       
         const isCorrect = q.studentAnswer?.isCorrect === 1 ||  q.studentAnswer?.isCorrect === true;
          //const studentAnswerId = q.studentAnswer?.id_answer;

          return {
            id_question: q.questionId ,
            correct: isCorrect,
            selected_answer: q.studentAnswer?.answerText || 'No answer selected',
            question_text: q.questionText,
          };
        }) || [],
      };

      console.log("Parsed attempt data:", JSON.stringify(parsedAttempt, null, 2));

      setAttemptDetails(parsedAttempt);

      //console.log("Raw attempt details:", JSON.stringify(parsedAttempt, null, 2)); 


      //setAttemptDetails(attemptResponse?.data);

      //const token = await AsyncStorage.getItem("token");

      const id_quiz_to_use = parsedAttempt.quizId || quizId;
      if (!id_quiz_to_use) throw new Error("Quiz ID missing");

      console.log("Fetching quiz details for ID:", id_quiz_to_use);
      const quizResponse = await axios.post(`${API_URL}/students/getQuizDetails`, {
        id_quiz: id_quiz_to_use,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    
    );

      /*console.log('Attempt Response:', attemptResponse?.data);
      console.log(JSON.stringify(attemptResponse, null, 2));

      console.log('Quiz Response:', quizResponse?.data); */

      const quizData = quizResponse?.data?.data || quizResponse?.data;
      console.log("Raw quiz data:", JSON.stringify(quizData, null, 2));

      if (!quizData || !Array.isArray(quizData.questions)) {
        throw new Error("Invalid quiz data structure");
      }

      setQuizDetails(quizData);

      //console.log("Raw quiz details:", JSON.stringify(quizData, null, 2)); 

    } catch (err) {
      console.error("API Error:", err.message || err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [attemptId, quizId]);
  

  useEffect(() => {
    if (attemptId && quizId) {
      fetchData();
    }
    return () => {
      isMounted.current = false;
    };
  }, [fetchData, retryCount]);

  console.log("Attempt details before enrichment:", JSON.stringify(attemptDetails, null, 2));
console.log("Quiz details before enrichment:", JSON.stringify(quizDetails, null, 2));


  /*const enrichedQuestions = useMemo(() => {
    if (!quizDetails?.questions) return [];
    if (!attemptDetails?.student_answers) return [];


    //console.log("Quiz questions:", quizDetails.questions.length);
    //console.log("Attempt answers:", attemptDetails.student_answers?.length);


    return quizDetails.questions.map((question) => {

      if (!question.id_question) return null;

      const studentAnswerEntry = attemptDetails.student_answers.find(
        (a) => a.id_question === question.id_question
      ) ;

      //console.log("Attempt details questions:", attemptDetails.questions);


      if (!studentAnswerEntry) {
        return {
          ...question,
          correct: false,
          studentAnswer: 'No answer selected',
        };
      }

      const isCorrect = studentAnswerEntry.correct === 1 || studentAnswerEntry.correct === true || studentAnswerEntry.is_correct === true || studentAnswerEntry.is_correct === 1;

     // const isCorrect = studentAnswerEntry.correct === 1 || studentAnswerEntry.correct === true;


      return {
        ...question,
        //isCorrect: studentAnswer.is_correct ?? false,
        //studentAnswer,
        /*isCorrect: studentAnswer.isCorrect === true,
        studentAnswer: studentAnswer.student_answer_text || "No answer selected", *
        correct: isCorrect,
        studentAnswer: studentAnswerEntry.selected_answer || studentAnswerEntry.student_answer_text || 'No answer selected',
      };
    }).filter(Boolean);
  }, [quizDetails, attemptDetails]); */



  const enrichedQuestions = useMemo(() => {
    if (!quizDetails?.questions) return [];
    if (!attemptDetails?.student_answers) return [];
  
    return quizDetails.questions.map((question) => {
      const studentAnswer = attemptDetails.student_answers.find(
        a => a.id_question === question.id_question
      );

     /* if (!studentAnswer) {
        return {
          ...question,
          correct: false,
          studentAnswer: 'No answer selected'
        };
      } */
  
      return {
        ...question,
        correct: studentAnswer?.correct || false,
        studentAnswer: studentAnswer?.selected_answer || 'No answer selected',
      };
    });
  }, [quizDetails, attemptDetails]);

  const scoreData = useMemo(() => {
    if (!attemptDetails || !quizDetails) return {
      score: 0,
      totalQuestions: 0,
      correctCount: 0,
      incorrectCount: 0,
    };

    const totalQuestions = enrichedQuestions.length || quizDetails?.questions?.length || 0;

    const correctCount = enrichedQuestions.filter(q => q.correct).length;

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return {
      score,
      totalQuestions,
      correctCount,
      incorrectCount: totalQuestions - correctCount,
    };
  }, [attemptDetails, quizDetails, enrichedQuestions]);

  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleHomePress = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }, [navigation]);

  const handleQuestionPress = useCallback((question) => {
    navigation.navigate("ReviewQuestionHistory", {
      question: {  // Changed from originalQuestion to question
        id_question: question.id_question,
        question_text: question.question_text,
        answers: question.answers || [], // Make sure answers are included
        correctAnswer: question.correctAnswer // Add correct answer info
      },
      quiz: {
        id_quiz: quizDetails?.id_quiz,
        title: quizDetails?.title,
      },
      selectedAnswers: question.studentAnswer ? [{ 
        student_answer_text: question.studentAnswer 
      }] : [],
      attemptInfo: {
        date: formatDate(attemptDetails?.attempt_at),
        score: scoreData.score,
        corrected: scoreData.correctCount,
      }
    });
  }, [quizDetails, attemptDetails, scoreData]);


  const renderItem = useCallback(({ item, index }) => {

    return (
    <QuestionItem
      question={item}
      index={index}
      //correct={item.correct}
      //studentAnswer={item.studentAnswer}  // Fix: Use the properly formatted studentAnswer from enrichedQuestions
      onPress={() => handleQuestionPress(item, item.studentAnswer)}
      animationDelay={500}
    />
    );
  }, [handleQuestionPress]);  

  // === UI ===

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B5CFF" />
        <Text style={styles.loadingText}>Loading attempt details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-triangle" size={50} color="#FF5252" />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          {error.includes("attempt") ? "Attempt data unavailable" : "Quiz data unavailable"}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setRetryCount(prev => prev + 1)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.retryButton, styles.secondaryButton]}
            onPress={handleGoBack}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  console.log("Enriched Questions:", enrichedQuestions);


  return (
    <SafeAreaView style={styles.container}>
      {/* Header with gradient and score circle */}
      <Animated.View 
        style={[
          styles.headerContainer, 
          { 
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }] 
          }
        ]}
      >
        <LinearGradient
          colors={["#7B5CFF", "#A42FC1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <FloatingBubbles />
          <View style={styles.headerContent}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Icon name="arrow-left" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
                <Icon name="home" size={20} color="white" />
              </TouchableOpacity>
            </View>
            
            <View>
              <Text style={styles.screenTitle}>{quizDetails?.title || "Quiz Results"}</Text>
              <Text style={styles.screenSubtitle}>
                {formatDate(attemptDetails?.attempt_at || "")}
              </Text>
            </View>
            
            <View style={styles.scoreCircleWrapper}>
              <ScoreCircle score={scoreData.correctCount} total={scoreData.totalQuestions} />
            </View>
            
            <View style={styles.scoreTextSummary}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemValue}>{scoreData.correctCount}</Text>
                <Text style={styles.scoreItemLabel}>Correct</Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreItemValue, styles.incorrectValue]}>
                  {scoreData.incorrectCount}
                </Text>
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
            transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }],
          }
        ]}
      >
        {enrichedQuestions.length > 0 ? (
          <FlatList
            data={enrichedQuestions}
            keyExtractor={(item) => item.id_question.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.questionsContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noQuestionsContainer}>
            <Icon name="help-circle" size={50} color="#7B5CFF" />
            <Text style={styles.noQuestionsText}>
              No questions available for this attempt
            </Text>
          </View>
        )}
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
    height: height * 0.45,
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
    paddingTop: 20,
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
    marginBottom: 20, // Added to give more space at the bottom of the header

  },
  scoreItem: {
    alignItems: "center",
  },
  scoreItemValue: {
    color: "#4ADE80",
    fontSize: 20,
    fontWeight: "bold",
  },
  incorrectValue: {
    color: "#FF5252",
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
  secondaryButton: {
    backgroundColor: "#6B7280",
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
});
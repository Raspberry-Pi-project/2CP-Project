import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Animated 
} from "react-native";
import { colors } from "../constants/colors";
import Icon from "react-native-vector-icons/Feather";
import QuizBackground from '../components/QuizBackground';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function QuizScreen({ navigation, route }) {
  const { quiz = { questions: [] } } = route.params || {};
  const questions = quiz.questions || [];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(15);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const questionAnim = useRef(new Animated.Value(0)).current;
  const timerProgress = useRef(new Animated.Value(1)).current;
  const timerOpacity = useRef(new Animated.Value(1)).current;

  const timerRadius = 25;
  const timerStroke = 4;
  const timerCircumference = 2 * Math.PI * timerRadius;

  useEffect(() => {
    if (showSummary) {
      navigation.navigate('QuizScore', {
        score: score,
        totalQuestions: questions.length,
        questions: questions,
        answers: answers
      });
    }
  }, [showSummary]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: (currentQuestion + 1) / questions.length,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(questionAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, [currentQuestion]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if(prev <= 0) {
          handleNext();
          return 0;
        }
        const newTime = prev - 1;
        
        Animated.timing(timerProgress, {
          toValue: newTime / 15,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        if(newTime === 0) {
          Animated.timing(timerOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [currentQuestion]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
    
    if(index === questions[currentQuestion]?.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if(currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(15);
      questionAnim.setValue(0);
      timerProgress.setValue(1);
      timerOpacity.setValue(1);
    } else {
      setShowSummary(true);
    }
  };

  const getAnswerStyle = (index) => {
    if(selectedAnswer === null) return styles.option;
    const isCorrect = index === questions[currentQuestion]?.correctAnswer;
    
    return [
      styles.option,
      isCorrect ? styles.correctOption : styles.incorrectOption,
      selectedAnswer === index && !isCorrect && styles.incorrectOption
    ];
  };

  return (
    <SafeAreaView style={styles.container}>
      <QuizBackground />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {!showSummary ? (
        <View style={styles.contentContainer}>
          <View style={styles.questionBox}>
            <Animated.View style={[styles.timerContainer, { opacity: timerOpacity }]}>
              <Svg
                width={timerRadius * 2 + timerStroke}
                height={timerRadius * 2 + timerStroke}
              >
                <AnimatedCircle
                  cx={timerRadius + timerStroke/2}
                  cy={timerRadius + timerStroke/2}
                  r={timerRadius}
                  stroke="#7B5CFF"
                  strokeWidth={timerStroke}
                  fill="transparent"
                  strokeDasharray={timerCircumference}
                  strokeDashoffset={timerProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [timerCircumference, 0]
                  })}
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={[styles.timerText, timeLeft < 11 && styles.timerTextRed]}>
                {timeLeft}s
              </Text>
            </Animated.View>

            <Animated.Text style={[styles.questionCounter, { opacity: questionAnim }]}>
              Question {currentQuestion + 1}/{questions.length}
            </Animated.Text>

            <View style={styles.questionContent}>
              <Text style={styles.questionText}>
                {questions[currentQuestion]?.text || "Loading question..."}
              </Text>
              <Text style={styles.remainingText}>
                {questions.length - currentQuestion - 1} questions remaining
              </Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            {questions[currentQuestion]?.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={getAnswerStyle(index)}
                onPress={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.nextButton, selectedAnswer === null && styles.disabledButton]}
            onPress={handleNext}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A42FC1"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  questionBox: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    padding: 25,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  timerContainer: {
    alignSelf: "center",
    marginBottom: 10,
    position: 'relative',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    position: "absolute",
    color: "#7B5CFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
  },
  timerTextRed: {
    color: "#FF5252"
  },
  questionCounter: {
    color: "#A42FC1",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15
  },
  questionContent: {
    marginTop: 20
  },
  questionText: {
    color: "#333",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24
  },
  remainingText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic"
  },
  optionsContainer: {
    width: "100%",
    paddingHorizontal: 20
  },
  option: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 18,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#7B5CFF"
  },
  correctOption: {
    backgroundColor: "#E1FFE1",
    borderColor: "#4CAF50"
  },
  incorrectOption: {
    backgroundColor: "#FFE1E1",
    borderColor: "#FF5252"
  },
  optionText: {
    color: "#7B5CFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },
  nextButton: {
    backgroundColor: "#7B5CFF",
    borderRadius: 25,
    padding: 16,
    marginTop: 20,
    width: "50%",
    alignSelf: "center"
  },
  disabledButton: {
    opacity: 0.6
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  summaryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  summaryTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20
  },
  summaryScore: {
    color: "white",
    fontSize: 24
  }
});
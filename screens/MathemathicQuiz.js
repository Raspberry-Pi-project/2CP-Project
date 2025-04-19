import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated 
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import QuizBackground from '../components/QuizBackground';

export default function MathemathicQuiz({ navigation, route }) {
  const { quiz } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animation for question transition
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if(index === quiz.questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if(currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      progressAnim.setValue(0);
    } else {
      navigation.navigate('QuizScore', {
        score: score,
        totalQuestions: quiz.questions.length,
        questions: quiz.questions,
        answers: Array(quiz.questions.length).fill(null)
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <QuizBackground />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.questionCounter}>Question {currentQuestion + 1}/{quiz.questions.length}</Text>
      </View>

      <Animated.View style={[styles.contentContainer, { opacity: progressAnim }]}>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>
            {quiz.questions[currentQuestion]?.text}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {quiz.questions[currentQuestion]?.options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedAnswer === index && styles.selectedOption,
                selectedAnswer !== null && 
                  index === quiz.questions[currentQuestion]?.correctAnswer && 
                  styles.correctOption
              ]}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !selectedAnswer && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestion === quiz.questions.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

// Keep the same styles as previous QuizScreen2 implementation
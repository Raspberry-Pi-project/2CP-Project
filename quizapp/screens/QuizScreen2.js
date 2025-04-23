import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions 
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import QuizBackground from '../components/QuizBackground';

const { width } = Dimensions.get("window");

export default function QuizScreen2({ navigation, route }) {
  const { quiz = { questions: [] } } = route.params || {};
  const questions = quiz.questions || [];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if(index === questions[currentQuestion]?.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if(currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if(currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <QuizBackground />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.questionCounter}>Question {currentQuestion + 1}</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Question Box */}
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>
            {questions[currentQuestion]?.text || "Loading question..."}
          </Text>
        </View>

        {/* Options Container */}
        <View style={styles.optionsContainer}>
          {questions[currentQuestion]?.options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedAnswer === index && styles.selectedOption,
                selectedAnswer !== null && 
                  index === questions[currentQuestion]?.correctAnswer && 
                  styles.correctOption
              ]}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
            onPress={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, !selectedAnswer && styles.disabledButton]}
            onPress={handleNext}
            disabled={!selectedAnswer}
          >
            <Text style={styles.navButtonText}>
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 35
  },
  questionCounter: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  questionBox: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "90%",
    padding: 25,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  questionText: {
    color: "#7B5CFF",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24
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
  selectedOption: {
    backgroundColor: "#F0E8FF"
  },
  correctOption: {
    backgroundColor: "#E1FFE1",
    borderColor: "#4CAF50"
  },
  optionText: {
    color: "#7B5CFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 30
  },
  navButton: {
    backgroundColor: "#7B5CFF",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    minWidth: 120
  },
  disabledButton: {
    opacity: 0.6
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  }
});
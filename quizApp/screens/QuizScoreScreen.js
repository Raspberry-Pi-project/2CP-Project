import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import QuizBackground from '../components/QuizBackground';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function QuizScoreScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { score, totalQuestions, questions, answers } = route.params;
  const correctAnswers = score;
  const incorrectAnswers = totalQuestions - score;

  const questionResults = questions.map((question, index) => ({
    id: index + 1,
    isCorrect: answers[index] === question.correctAnswer
  }));

  return (
    <SafeAreaView style={styles.container}>
      <QuizBackground />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.scoreTitle}>Quiz Results</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}/{totalQuestions}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{correctAnswers}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{incorrectAnswers}</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </View>
        </View>

        <ScrollView style={styles.questionsList}>
          {questionResults.map((question) => (
            <View key={question.id} style={[
              styles.questionItem,
              question.isCorrect ? styles.correctItem : styles.incorrectItem
            ]}>
              <Text style={styles.questionText}>Question {question.id}</Text>
              <Icon 
                name={question.isCorrect ? "check" : "x"} 
                size={20} 
                color={question.isCorrect ? "#4CAF50" : "#FF5252"} 
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A42FC1'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },
  content: {
    flex: 1,
    paddingHorizontal: 20
  },
  scoreTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20
  },
  scoreContainer: {
    backgroundColor: 'white',
    borderRadius: 100,
    width: 150,
    height: 150,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  scoreText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#7B5CFF'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  statLabel: {
    fontSize: 16,
    color: 'white'
  },
  questionsList: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15
  },
  questionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  correctItem: {
    backgroundColor: '#E1FFE1'
  },
  incorrectItem: {
    backgroundColor: '#FFE1E1'
  },
  questionText: {
    fontSize: 16,
    color: '#333'
  }
});
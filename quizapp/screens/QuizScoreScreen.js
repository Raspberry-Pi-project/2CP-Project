import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Animated,
  Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import QuizBackground from '../components/QuizBackground';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function QuizScoreScreen({ navigation, route }) {
  const { score, totalQuestions, questions, answers } = route.params;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const circleRadius = 72;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * circleRadius;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: score / totalQuestions,
      duration: 1500,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const correctAnswers = score;
  const incorrectAnswers = totalQuestions - score;

  const questionResults = questions.map((question, index) => ({
    id: index + 1,
    isCorrect: answers[index] === question.correctAnswer
  }));

  return (
    <SafeAreaView style={styles.container}>
      <QuizBackground />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Animated Progress Circle */}
        <View style={styles.circleContainer}>
          <Svg width="160" height="160" style={styles.progressCircle}>
            <Circle
              cx="80"
              cy="80"
              r={circleRadius}
              stroke="#EEE"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <AnimatedCircle
              cx="80"
              cy="80"
              r={circleRadius}
              stroke="#7B5CFF"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin="80, 80"
            />
          </Svg>
          
          {/* Score Display */}
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Quiz Score</Text>
            <Text style={styles.scoreText}>{score}/{totalQuestions}</Text>
          </View>
        </View>

        {/* Stats Container */}
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

        {/* Questions List */}
        <ScrollView style={styles.questionsList}>
          {questionResults.map((question) => (
            <View 
              key={question.id} 
              style={[
                styles.questionItem,
                question.isCorrect ? styles.correctAura : styles.incorrectAura
              ]}
            >
              <Text style={styles.questionNumber}>Question {question.id}</Text>
              <Icon 
                name={question.isCorrect ? "check" : "x"} 
                size={24} 
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
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25
  },
  progressCircle: {
    position: 'absolute',
  },
  scoreContainer: {
    backgroundColor: 'white',
    borderRadius: 100,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7B5CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scoreText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#7B5CFF',
    marginBottom: 4
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A42FC1',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9
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
    marginBottom: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    elevation: 2,
  },
  correctAura: {
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  incorrectAura: {
    borderColor: '#FF5252',
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  questionNumber: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  }
});
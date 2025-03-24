import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../constants/colors";

export default function QuizResultScreen({ navigation, route }) {
  const { score, totalQuestions, timeSpent } = route.params;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const percentage = (score / totalQuestions) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Complete!</Text>

      <View style={styles.resultCard}>
        {/* Score Circle */}
        <View style={styles.scoreCircle}>
          <Text style={styles.scorePercentage}>{Math.round(percentage)}%</Text>
          <Text style={styles.scoreText}>Score</Text>
        </View>

        {/* Time Circle */}
        <View style={styles.timerContainer}>
          <Svg width={70} height={70} viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="40" stroke="#E0B3FF" strokeWidth="8" fill="none" />
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke="#7B5CFF"
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={(1 - (timeSpent / (totalQuestions * 30))) * 2 * Math.PI * 40} // Shrinking effect
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.timerText}>{formatTime(timeSpent)}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Correct Answers</Text>
            <Text style={styles.statValue}>{score}/{totalQuestions}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Time Taken</Text>
            <Text style={styles.statValue}>{formatTime(timeSpent)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 30,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  scorePercentage: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
  },
  scoreText: {
    fontSize: 16,
    color: colors.white,
  },
  timerContainer: {
    alignSelf: "center",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    position: "absolute",
    fontSize: 18,
    fontWeight: "bold",
    color: "#7B5CFF",
  },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 30,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});

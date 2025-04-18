import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { colors } from "../constants/colors"
import { Feather } from "@expo/vector-icons" // Import Feather icons

export default function QuizResultScreen({ navigation, route }) {
  const { score, totalQuestions, timeSpent } = route.params

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const percentage = (score / totalQuestions) * 100

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
          <Feather name="home" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Quiz Complete!</Text>

      <View style={styles.resultCard}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scorePercentage}>{Math.round(percentage)}%</Text>
          <Text style={styles.scoreText}>Score</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Correct Answers</Text>
            <Text style={styles.statValue}>
              {score}/{totalQuestions}
            </Text>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
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
  statsContainer: {
    width: "100%",
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  statLabel: {
    fontSize: 16,
    color: colors.foreground,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
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
})

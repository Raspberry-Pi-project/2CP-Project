import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/Feather"
import { UserContext } from "../App"
import React, { useContext } from "react"

const { width } = Dimensions.get("window")

export default function QuizHistoryScreen({ navigation, route }) {
  const { quiz, score, totalQuestions, timeSpent, id_quiz, id_student } = route.params || {};
  const { userData } = useContext(UserContext)
  const [loading, setLoading] = useState(false)


  // Create a default quiz object if none is provided
  const quizInfo = quiz || {
    id: id_quiz ? id_quiz.toString() : "1",
    title: `Quiz #${id_quiz || "1"}`,
    description: "View your previous quiz attempt results.",
    time: "30 minutes",
    attempts: 1,
    questions: totalQuestions || 0
  }

  // Get an icon based on quiz type
  
  const getQuizIcon = () => {
    // First check if quiz has a specific image set in the database
    if (quiz && quiz.image) {
      // If image field contains a recognizable icon name, use it
      const iconName = quiz.image.toLowerCase();
      if (iconName.includes("book")) return "book";
      if (iconName.includes("math") || iconName.includes("chart")) return "bar-chart-2";
      if (iconName.includes("science")) return "thermometer";
      if (iconName.includes("physics")) return "zap";
      if (iconName.includes("language")) return "edit";
      if (iconName.includes("history")) return "clock";
      if (iconName.includes("geography")) return "globe";
      if (iconName.includes("computer")) return "code";
    }
    
    // Fallback based on subject if available
    if (quiz && quiz.subject) {
      const subject = quiz.subject.toLowerCase();
      if (subject.includes("math")) return "bar-chart-2";
      if (subject.includes("physics")) return "zap";
      if (subject.includes("science")) return "thermometer";
      if (subject.includes("english") || subject.includes("language")) return "book";
      if (subject.includes("history")) return "clock";
      if (subject.includes("geography")) return "globe";
      if (subject.includes("computer")) return "code";
    }
    
    // Default icon if no match
    return "help-circle";
  }

  // Get the appropriate image based on quiz type
  const getQuizImage = () => {
    switch (quizInfo.id) {
      case "3": // Science
        return require("../assets/science.png")
      case "4": // Physics
        return require("../assets/physics.png")
      default:
        return null
    }
  }

  // Check if we should show an image
  const shouldShowImage = ["3", "4"].includes(quizInfo.id)
  const quizImage = getQuizImage()

  const handleCheckResults = () => {
    // Navigate to the QuizScore screen with the necessary parameters
    const { score, totalQuestions, timeSpent } = route.params;

    navigation.navigate("QuizScore", {
      score: score,
      totalQuestions: totalQuestions || 10,
      timeSpent: timeSpent || 300,
      id_quiz: quizInfo.id,
      id_student: id_student || userData?.id_student
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#7B5CFF", "#A42FC1"]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <Icon name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Quiz Image (for Science and Physics only) */}
        {shouldShowImage && quizImage && (
          <View style={styles.imageContainer}>
            <Image source={quizImage} style={styles.quizImage} resizeMode="contain" />
          </View>
        )}

        {/* Content Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* Quiz Icon */}
            <View style={styles.iconContainer}>
              <Icon name={getQuizIcon()} size={40} color="#7B5CFF" />
            </View>

            {/* Quiz Title */}
            <Text style={styles.quizTitle}>{quizInfo.title}</Text>

            {/* Quiz Description */}
            <Text style={styles.quizDescription}>
              {quizInfo.description || "A brief assessment to test your knowledge."}
            </Text>

            {/* Quiz Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Time :</Text>
                <Text style={styles.detailValue}>{quizInfo.time || "30 minutes"}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Number of attempts :</Text>
                <Text style={styles.detailValue}>{quizInfo.attempts || 1}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Questions :</Text>
                <Text style={styles.detailValue}>{quizInfo.questions || 0}</Text>
                </View>
            </View>
          </View>

          {/* Check Results Button */}
          <TouchableOpacity style={styles.startButton} onPress={handleCheckResults} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>Check Results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  backButtonLarge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  imageContainer: {
    width: "100%",
    height: width * 0.5, // Maintain aspect ratio
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  quizImage: {
    width: "100%",
    height: "100%",
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  iconContainer: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(123, 92, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  quizDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  detailsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
    width: "100%",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
    marginRight: 5,
    width: "50%",
    textAlign: "right",
    paddingRight: 10,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    width: "50%",
    textAlign: "left",
    paddingLeft: 10,
  },
  startButton: {
    backgroundColor: "#4CAF50", // Green color for the "Check Results" button
    width: "80%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
}) 
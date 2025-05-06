import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/Feather"

const { width } = Dimensions.get("window")

export default function QuizInfoScreen({ navigation, route }) {
  const { quiz } = route.params || {}

  if (!quiz) {
    // Handle case where quiz data is missing
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={["#7B5CFF", "#A42FC1"]} style={StyleSheet.absoluteFill} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Quiz information not available</Text>
          <TouchableOpacity style={styles.backButtonLarge} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Get an icon based on quiz type
  const getQuizIcon = () => {
    switch (quiz.id) {
      case "1": // English
        return "book"
      case "2": // Math
        return "bar-chart-2"
      case "3": // Science
        return "thermometer"
      case "4": // Physics
        return "zap"
      default:
        return "help-circle"
    }
  }

  // Get the appropriate image based on quiz type
  const getQuizImage = () => {
    switch (quiz.id) {
      case "3": // Science
        return require("../assets/science.png")
      case "4": // Physics
        return require("../assets/physics.png")
      default:
        return null
    }
  }

  // Check if we should show an image
  const shouldShowImage = ["3", "4"].includes(quiz.id)
  const quizImage = getQuizImage()

  const handleStartQuiz = () => {
    // Navigate to the appropriate quiz screen based on quiz ID
    if (quiz.id === "4") {
      navigation.navigate("Quizlet2", { quiz })
    } else {
      navigation.navigate("Quizlet", { quiz })
    }
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
            <Text style={styles.quizTitle}>{quiz.title}</Text>

            {/* Quiz Description */}
            <Text style={styles.quizDescription}>
              {quiz.description || "A brief assessment to test your knowledge."}
            </Text>

            {/* Quiz Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Time :</Text>
                <Text style={styles.detailValue}>{quiz.time || "30 minutes"}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Number of attempts :</Text>
                <Text style={styles.detailValue}>{quiz.attempts || 1}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Questions :</Text>
                <Text style={styles.detailValue}>{quiz.questions ? quiz.questions.length : 0}</Text>
              </View>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>Start Attempt</Text>
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
    justifyContent: "space-between",
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
  },
  detailsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
  },
  detailValue: {
    fontSize: 16,
    color: "#666",
  },
  startButton: {
    backgroundColor: "#4CD964",
    borderRadius: 12,
    paddingVertical: 16,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

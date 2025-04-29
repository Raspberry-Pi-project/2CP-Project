import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { API_URL } from "../services/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
import { useNavigation, useRoute } from "@react-navigation/native";

export default function QuizInfoScreen({ navigation, route }) {
  const { id_quiz, basicQuizData } = route.params ; // Get quizId from route params
  const [quiz, setQuiz] = useState(basicQuizData); // State to manage quiz data

  const [loading, setLoading] = useState(!basicQuizData); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors
  useEffect(()=>{
    
  },[basicQuizData])

  /*useEffect(() => {
    if (id_quiz) {
      fetchQuizDetails();
    } else {
      setError("Quiz ID is missing.");
      setLoading(false);
    }
  }, [id_quiz]);  */

  /*if (!quiz) {
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
  } */

  // Get an icon based on quiz type
  const getQuizIcon = () => {
    if (!quiz?.subject) return "help-circle";

    switch (quiz.id) {
      case "1": // English
        return "book";
      case "2": // Math
        return "bar-chart-2";
      case "3": // Science
        return "thermometer";
      case "4": // Physics
        return "zap";
      default:
        return "help-circle";
    }
  };

  // Get the appropriate image based on quiz type
  const getQuizImage = () => {
    switch (quiz.id) {
      case "3": // Science
        return require("../assets/science.png");
      case "4": // Physics
        return require("../assets/physics.png");
      default:
        return null;
    }
  };

  // Check if we should show an image
  const shouldShowImage = ["3", "4"].includes(quiz.id);
  const quizImage = getQuizImage();

  const handleStartQuiz = async () => {
    if (!quiz) return;

    if (quiz.totalQuestions === 0) {
      Alert.alert(
        "No Questions",
        "This quiz doesn't contain any questions yet."
      );
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (!token || !userId) {
        Alert.alert("Authentication Error", "Please log in to continue.");
        return;
      }

      const attemptStarted = await axios.post(
        `${API_URL}/students/startAttempt`,
        { id_quiz: quiz.id_quiz, id_student: parseInt(userId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (attemptStarted.status === 400) {
        Alert.alert("Error", "Attempts limit reached for this quiz");
        navigation.navigate("Home");
        return;
      } else if (attemptStarted.status === 201) {
        navigation.navigate("Quizlet", {
          id_attempt: attemptStarted.data.newAttempt.id_attempt,
          quizId: quiz.id_quiz,
          quizTitle: quiz.title,
          quizData: quiz,
        });
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
       
      console.error("Error starting quiz attempt:", error);
      Alert.alert("Error", "Attempts limit reached for this quiz");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={["#7B5CFF", "#A42FC1"]}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color="white" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (error || !quiz) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={["#7B5CFF", "#A42FC1"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || "Quiz information not available"}
          </Text>
          <TouchableOpacity
            style={styles.backButtonLarge}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#7B5CFF", "#A42FC1"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
            <Image
              source={quiz.image}
              style={styles.quizImage}
              resizeMode="contain"
            />
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
                <Text style={styles.detailLabel}>Subject :</Text>
                <Text style={styles.detailValue}>{quiz.subject}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Duration :</Text>
                <Text style={styles.detailValue}>{quiz.duration}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Number of attempts :</Text>
                <Text style={styles.detailValue}>{quiz.nb_attempts}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Questions :</Text>
                <Text style={styles.detailValue}>
                  {quiz.totalQuestions ||
                    (quiz.questions && quiz.questions.length) ||
                    0}
                </Text>
              </View>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartQuiz}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Attempt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
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
});

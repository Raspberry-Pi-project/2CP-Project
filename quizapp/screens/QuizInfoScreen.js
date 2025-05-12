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
  ActivityIndicator,
  ScrollView,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import { API_URL } from "../services/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function QuizInfoScreen({ navigation, route }) {
  const { id_quiz, basicQuizData } = route.params;
  const [quiz, setQuiz] = useState(basicQuizData);
  const [loading, setLoading] = useState(!basicQuizData);
  const [error, setError] = useState(null);

  // Get an icon based on quiz type
  const getQuizIcon = () => {
    if (quiz && quiz.image) {
      const iconName = quiz.image.toLowerCase();
      if (iconName.includes("book")) return "book-open";
      if (iconName.includes("math") || iconName.includes("chart")) return "bar-chart-2";
      if (iconName.includes("science")) return "thermometer";
      if (iconName.includes("physics")) return "zap";
      if (iconName.includes("language")) return "edit-3";
      if (iconName.includes("history")) return "clock";
      if (iconName.includes("geography")) return "globe";
      if (iconName.includes("computer")) return "code";
    }
    
    if (quiz && quiz.subject) {
      const subject = quiz.subject.toLowerCase();
      if (subject.includes("math")) return "award";
      if (subject.includes("physics")) return "zap";
      if (subject.includes("science")) return "flask";
      if (subject.includes("english") || subject.includes("language")) return "book-open";
      if (subject.includes("history")) return "clock";
      if (subject.includes("geography")) return "map";
      if (subject.includes("computer")) return "cpu";
    }
    
    return "award";
  };

  const getQuizGradient = () => {
    return ["#7B5CFF", "#A42FC1", "#6B1D99"];
  };

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

  const shouldShowImage = ["3", "4"].includes(quiz?.id);
  const quizImage = getQuizImage();

  const handleStartQuiz = async () => {
    if (!quiz) return;

    if (quiz.totalQuestions === 0 || (quiz.questions && quiz.questions.length === 0)) {
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
      Alert.alert("Error", "Failed to start quiz attempt");
    }
  };

  const formatDuration = (durationStr) => {
    const duration = parseInt(durationStr);
    if (isNaN(duration)) return durationStr || "30 minutes";
    return duration === 1 ? "1 min" : `${duration} min`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={getQuizGradient()} style={StyleSheet.absoluteFill} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Loading quiz information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !quiz) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={getQuizGradient()} style={StyleSheet.absoluteFill} />
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
      <LinearGradient colors={getQuizGradient()} style={StyleSheet.absoluteFill} />

      {/* Decorative Background Elements */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.decorationCircle, { top: height * 0.1, left: -width * 0.2 }]} />
        <View style={[styles.decorationCircle, { bottom: -height * 0.05, right: -width * 0.3 }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz Info</Text>
        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
          <Icon name="more-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quiz Image with gradient overlay (if applicable) */}
        {shouldShowImage && quizImage ? (
          <View style={styles.imageContainerWrapper}>
            <View style={styles.imageContainer}>
              <Image source={quizImage} style={styles.quizImage} resizeMode="cover" />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                style={styles.imageOverlay}
              />
              <View style={styles.quizBadge}>
                <Icon name={getQuizIcon()} size={20} color="#FFF" />
                <Text style={styles.quizBadgeText}>
                  {quiz.subject || "Quiz"}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.iconHeaderContainer}>
            <View style={styles.largeIconContainer}>
              <Icon name={getQuizIcon()} size={60} color="#FFF" />
            </View>
          </View>
        )}

        {/* Content Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* Quiz Title */}
            <Text style={styles.quizTitle}>{quiz.title}</Text>

            {/* Attempts Badge */}
            <View style={styles.attemptsBadge}>
              <Text style={styles.attemptsBadgeText}>
                {quiz.nb_attempts || "0"} {quiz.nb_attempts === 1 ? "Attempt" : "Attempts"}
              </Text>
            </View>

            {/* Quiz Description */}
            <Text style={styles.quizDescription}>
              {quiz.description || "A brief assessment to test your knowledge."}
            </Text>

            {/* Quiz Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Icon name="clock" size={24} color="#7B5CFF" />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Duration</Text>
                  <Text style={styles.statValue}>{formatDuration(quiz.duration)}</Text>
                </View>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Icon name="list" size={24} color="#7B5CFF" />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Questions</Text>
                  <Text style={styles.statValue}>
                    {quiz.totalQuestions || (quiz.questions && quiz.questions.length) || "0"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={handleStartQuiz} 
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#A48CFF', '#9370DB']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startButtonText}>Start Attempt</Text>
              <Icon name="play" size={20} color="white" style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundDecoration: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  decorationCircle: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
    fontWeight: "500",
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
    paddingBottom: 15,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  imageContainerWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: width * 0.5,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  quizImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  quizBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizBadgeText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  iconHeaderContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  largeIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    width: "100%",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  attemptsBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(123, 92, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  attemptsBadgeText: {
    color: "#7B5CFF",
    fontWeight: "600",
    fontSize: 14,
  },
  quizDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    backgroundColor: "#F7F7FB",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(123, 92, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: "#9E9E9E",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  startButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});
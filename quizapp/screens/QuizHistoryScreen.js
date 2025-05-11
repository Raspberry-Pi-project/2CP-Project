import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, Dimensions, ActivityIndicator, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/Feather"
// Use the already imported Icon instead of MaterialCommunityIcons
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { UserContext } from "../App"
import React, { useEffect, useState, useContext } from "react"
import axios from "axios"
import { API_URL } from "../services/config" 
import AsyncStorage from "@react-native-async-storage/async-storage"
// Removed BlurView import as it might not be installed

const { width, height } = Dimensions.get("window")

export default function QuizHistoryScreen({ navigation, route }) {
  const { score, timeSpent, id_quiz, id_student, basicQuizData, nb_attempts } = route.params || {};
  const { userData } = useContext(UserContext)
  const [loading, setLoading] = useState(!basicQuizData)
  const [quizData, setQuizData] = useState(null) 
  const [quiz, setQuiz] = useState(basicQuizData); // State to manage quiz data
  
  useEffect(() => {
    // If we have a quiz object already passed in route params, use it
    if (quiz || basicQuizData) {
      setQuizData(quiz || basicQuizData)
    } 
    // Otherwise fetch quiz details from backend if we have id_quiz
    else if (id_quiz) {
      fetchQuizDetails(id_quiz)
    } else {
      setQuizData({
        id_quiz: "1",
        title: "Mathematics Quiz",
        description: "Basic arithmetic operations quiz",
        duration: "5",
        nb_attempts: 1,
        questions: [],
        subject: "Mathematics"
      })
    }
  }, [quiz, id_quiz, basicQuizData])

  const fetchQuizDetails = async (quizId) => {
    setLoading(true)
    console.log("Fetching quiz details for ID:", quizId)
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(`${API_URL}/students/getQuizDetails`, {
        id_quiz: quizId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setQuizData(response.data)
    } catch (error) {
      console.error("Error fetching quiz details:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (quizData) {
      const needsUpdate = route.params?.nb_attempts !== undefined && quizData.nb_attempts !== route.params.nb_attempts;
      
      if (needsUpdate) {
        setQuizData(prevData => ({
          ...prevData,
          nb_attempts: route.params.nb_attempts
        }));
      }
    }
  }, [route.params?.nb_attempts, quizData]);

  // Create a default quiz object if none is provided
  const quizInfo = quizData || {
    id: id_quiz ? id_quiz.toString() : "1",
    title: `Quiz #${id_quiz || "1"}`,
    description: "View your previous quiz attempt results.",
    time: "30 minutes",
    attempts: 1,
    questions: []
  }

  // Get an icon based on quiz type (using Feather icon names)
  const getQuizIcon = () => {
    // First check if quiz has a specific image set in the database
    if (quiz && quiz.image) {
      // If image field contains a recognizable icon name, use it
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
    
    // Fallback based on subject if available
    if (quizData && quizData.subject) {
      const subject = quizData.subject.toLowerCase();
      if (subject.includes("math")) return "award";
      if (subject.includes("physics")) return "zap";
      if (subject.includes("science")) return "flask";
      if (subject.includes("english") || subject.includes("language")) return "book-open";
      if (subject.includes("history")) return "clock";
      if (subject.includes("geography")) return "map";
      if (subject.includes("computer")) return "cpu";
    }
    
    // Default icon if no match
    return "award";
  }

  // Get the same background gradient for all quizzes
  const getQuizGradient = () => {
    return ["#7B5CFF", "#A42FC1", "#6B1D99"]; // Same gradient for all quizzes
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
    const { score, timeSpent } = route.params;

    navigation.navigate("QuizScore", {
      score: score,
      totalQuestions: quizData?.questions?.length || 0,
      timeSpent: timeSpent || 0,
      id_quiz: quizData?.id_quiz,
      id_student: id_student || userData?.id_student
    })
  }

  // Format duration for display
  const formatDuration = (durationStr) => {
    const duration = parseInt(durationStr);
    if (isNaN(duration)) return durationStr || "30 minutes";
    return duration === 1 ? "1 min" : `${duration} min`;
  }

  // If quiz data is not loaded yet, show loading indicator
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
    )
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
        <Text style={styles.headerTitle}>Quiz History</Text>
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
                  {quizData?.subject || "Quiz"}
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
            <Text style={styles.quizTitle}>{quizInfo.title}</Text>

            {/* Attempts Badge */}
            <View style={styles.attemptsBadge}>
              <Text style={styles.attemptsBadgeText}>
                {quizData ? quizData.nb_attempts : "0"} {quizData?.nb_attempts === 1 ? "Attempt" : "Attempts"}
              </Text>
            </View>

            {/* Quiz Description */}
            <Text style={styles.quizDescription}>
              {quizInfo.description || "A brief assessment to test your knowledge."}
            </Text>

            {/* Quiz Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Icon name="clock" size={24} color="#7B5CFF" />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Duration</Text>
                  <Text style={styles.statValue}>{formatDuration(quizInfo.duration)}</Text>
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
                    {quizData && quizData.questions ? quizData.questions.length : "0"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Performance Preview (if score is available) */}
           
          </View>

          {/* Check Results Button */}
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={handleCheckResults} 
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#A48CFF', '#9370DB']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startButtonText}>Check Results</Text>
              <Icon name="award" size={20} color="white" style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
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
    paddingTop: 100,
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
  performancePreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    position: "relative",
    overflow: "hidden",
  },
  performanceGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  performanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  performanceTextContainer: {
    flex: 1,
  },
  performanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: "bold",
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
  newAttemptButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  newAttemptButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  }
});
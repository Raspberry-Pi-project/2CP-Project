"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  ActivityIndicator,
} from "react-native";
import { colors } from "../constants/colors";
import CustomStatusBar from "../components/CustomStatusBar";
import BottomNavigation from "../components/BottomNavigation";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { getQuizDetails } from "../services/quizService";
import { studentAPI } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import  api  from "../services/api";
// jhhg
const { width, height } = Dimensions.get("window");

const SimpleBackground = React.memo(() => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {Array.from({ length: 20 }).map((_, i) => {
        const size = Math.random() * 3 + 1;
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              backgroundColor: "#fff",
              borderRadius: 10,
              opacity: Math.random() * 0.5 + 0.1,
              top: Math.random() * height,
              left: Math.random() * width,
            }}
          />
        );
      })}
    </View>
  );
});

const SimpleQuizCard = ({ quiz, onPress }) => {
  return (
    <TouchableOpacity style={styles.quizCard} activeOpacity={0.8} onPress={() => onPress(quiz)}>
      <View style={styles.quizCardContent}>
        <View style={styles.quizCardIconContainer}>
          <View style={styles.quizCardIcon}>
            <Text style={styles.quizCardIconText}>{quiz.icon === "book" ? "📚" : "📊"}</Text>
          </View>
        </View>
        <View style={styles.quizCardTextContainer}>
          <Text style={styles.quizCardTitle}>{quiz.title}</Text>
          <Text style={styles.quizCardSubtitle}>{quiz.subtitle}</Text>
        </View>
        <View style={styles.quizCardArrow}>
          <Text style={styles.quizCardArrowText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SimpleHistoryCard = ({ title, date, icon }) => {
  return (
    <View style={styles.historyCard}>
      <View style={styles.historyCardContent}>
        <View style={styles.historyCardIconContainer}>
          <View
            style={[
              styles.historyCardIcon,
              { backgroundColor: icon === "math" ? "rgba(123, 92, 255, 0.1)" : "rgba(255, 157, 157, 0.1)" },
            ]}
          >
            <Text style={styles.historyCardIconText}>{icon === "math" ? "📊" : "📚"}</Text>
          </View>
        </View>
        <View style={styles.historyCardTextContainer}>
          <Text style={styles.historyCardTitle}>{title}</Text>
          <Text style={styles.historyCardDate}>{date}</Text>
        </View>
        <View style={styles.historyCardScoreContainer}>
          <Text style={styles.historyCardScore}>85%</Text>
        </View>
      </View>
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const panelAnimation = useRef(new Animated.Value(0)).current;

  const historyData = [
    { id: "1", title: "Math Quiz", date: "JAN", icon: "math" },
    { id: "2", title: "English Quiz", date: "FEB", icon: "language" },
    { id: "3", title: "Science Quiz", date: "MAR", icon: "math" },
    { id: "4", title: "History Quiz", date: "APR", icon: "language" },
  ];

/*
  useEffect(() => {
    const testGetQuizzes = async () => {
      try {
        const response = await studentAPI.getQuizzes(1, 10, 9, 2); // Replace "9" and "2" with valid group and year
        console.log("Quizzes Response:", response);
      } catch (error) {
        console.error("Error testing getQuizzes:", error);
      }
    };
  
    testGetQuizzes();
  }, []);  */


  const fetchQuizzes = async () => {
    try {
      const studentGroup = await AsyncStorage.getItem("studentGroup");
      const studentYear = await AsyncStorage.getItem("studentYear");

      console.log("Retrieved Student Group:", studentGroup);
      console.log("Retrieved Student Year:", studentYear);

      if (!studentGroup || !studentYear) {
        alert("Student group or year is missing. Please log in again.");
        navigation.navigate("Login");
        return;
      }

      const response = await api.post("http://172.20.10.2:3000/students/getAvailableQuizzes", {
        page: 1,
        limit: 10,
        for_groupe: studentGroup,
        for_year: studentYear,
      });

      console.log("Quizzes Response:", response.data.data);
      setQuizzes(response.data.data);
      console.log("Quizzes State After Fetch:", quizzes);


      
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
      setError("Failed to load quizzes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const startQuiz = async (quizId) => {
    try {
      const attempt = await studentAPI.startAttempt(quizId);
      
      if (!attempt || !attempt.id) {
        throw new Error("Invalid attempt object received");
      }
      
      navigation.navigate("QuizScreen", { attemptId: attempt.id });
    } catch (error) {
      console.error("Error starting quiz:", error);
          alert("Failed to start quiz. Please try again later.");

    }
  };

  const togglePanel = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(panelAnimation, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setIsExpanded(!isExpanded);
  };


  const handleQuizPress = async (quiz) => {
    console.log("Attempting to fetch details for quiz:", quiz.id_quiz); // Debug log

    try {
      const quizDetails = await getQuizDetails(quiz.id_quiz);
      navigation.navigate("QuizInfo", {
        id_quiz: quiz.id_quiz,  
        basicQuizData: {       
        id_quiz: quiz.id_quiz,
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        nb_attempts: quiz.nb_attempts,
        subject: quiz.subject,
        totalQuestions: quiz.totalQuestions,
        questions: quiz.questions || []
  }
      });
    } catch (error) {
      console.error("Error fetching quiz details:", error);
      navigation.navigate("QuizInfo", {
        quiz: {
          ...quiz,
          description: getQuizDescription(quiz),
          time: getQuizTime(quiz),
          attempts: 1,
        },
      });
    }
  };

  const getQuizDescription = (quiz) => {
    if (quiz.description) return quiz.description;
    switch (quiz.subject?.toLowerCase()) {
      case "1":
        return "A comprehensive assessment of English grammar skills.";
      case "2":
        return "A brief quiz about math.";
      case "3":
        return "Test your knowledge of general science concepts.";
      case "4":
        return "Explore the fundamental laws of physics.";
      default:
        return "A brief assessment to test your knowledge.";
    }
  };

  const getQuizTime = (quiz) => {
    if (quiz.duration) return quiz.duration;
    switch (quiz.id) {
      case "1":
      case "2":
        return "1 hour";
      case "3":
        return "30 minutes";
      case "4":
        return "45 minutes";
      default:
        return "30 minutes";
    }
  };

  /*
  const renderQuizItem = ({ item }) => <SimpleQuizCard quiz={item} onPress={handleQuizPress} />;
  */
  const panelHeight = panelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, height * 0.7],
  });  

  const renderQuizItem = ({ item }) => {
    console.log("Rendering Quiz Item:", item);
    return (
      <SimpleQuizCard
        quiz={{
          title: item.title,
          subtitle: item.description || "No description available",
          icon: "book", // Customize based on your data
        }}
        onPress={() => handleQuizPress(item)}
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            fetchQuizzes();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#6A4DE0", "#7B5CFF", "#8B65FF"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SimpleBackground />
        <CustomStatusBar time="9:41" />
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.title}>#Matricule</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: "https://via.placeholder.com/40" }} style={styles.avatar} />
          </View>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionTitleDecoration} />
            <Text style={styles.sectionTitle}>LIVE QUIZZES</Text>
          </View>
          <View style={styles.liveQuizzes}>
          {quizzes.length === 0 && !loading && !error && (
            <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
              No quizzes available.
            </Text>
          )}

          {error && (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
              <TouchableOpacity onPress={fetchQuizzes} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Render quizzes if available */}
          {!error && quizzes.length > 0 && (
          
            <FlatList
              data={quizzes}
              renderItem={renderQuizItem}
              keyExtractor={(item) => item.id_quiz.toString()}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
              refreshing={loading}
              onRefresh={fetchQuizzes}
            />
          )}

          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
        <Animated.View
          style={[
            styles.historyPanel,
            {
              height: panelHeight,
            },
          ]}
        >
          <TouchableOpacity style={styles.pullBar} onPress={togglePanel} activeOpacity={0.7}>
            <View style={styles.pullBarIndicator} />
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: panelAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "180deg"],
                    }),
                  },
                ],
              }}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 15l-6-6-6 6"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Animated.View>
          </TouchableOpacity>
          <Animated.View
            style={{
              opacity: panelAnimation,
              flex: 1,
              paddingHorizontal: 24,
              paddingTop: 10,
            }}
          >
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Quiz History</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {historyData.map((item) => (
                <SimpleHistoryCard key={item.id} title={item.title} date={item.date} icon={item.icon} />
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>
        <BottomNavigation onArrowPress={togglePanel} isPanelExpanded={isExpanded} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  avatarContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  avatar: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  sectionTitleDecoration: {
    width: 4,
    height: 20,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    letterSpacing: 1,
  },
  liveQuizzes: {
    marginBottom: 24,
  },
  historyPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 80,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  pullBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  pullBarIndicator: {
    width: 40,
    height: 5,
    backgroundColor: colors.muted,
    opacity: 0.3,
    borderRadius: 3,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.foreground,
  },
  viewAllButton: {
    backgroundColor: "rgba(123, 92, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary,
  },
  quizCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quizCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  quizCardIconContainer: {
    marginRight: 12,
  },
  quizCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(123, 92, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  quizCardIconText: {
    fontSize: 20,
  },
  quizCardTextContainer: {
    flex: 1,
  },
  quizCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  quizCardSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  historyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyCardIconContainer: {
    marginRight: 12,
  },
  historyCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  historyCardIconText: {
    fontSize: 20,
  },
  historyCardTextContainer: {
    flex: 1,
  },
  historyCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  historyCardDate: {
    fontSize: 12,
    color: "#666",
  },
  historyCardScoreContainer: {
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  historyCardScore: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4ADE80",
  },
});
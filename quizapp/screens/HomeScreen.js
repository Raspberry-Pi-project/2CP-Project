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
  TextInput,
  RefreshControl, // Add this import
  ActivityIndicator,
} from "react-native";
import { colors } from "../constants/colors";
import CustomStatusBar from "../components/CustomStatusBar";
import BottomNavigation from "../components/BottomNavigation";
import { Feather } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { getQuizDetails } from "../services/quizService";
import { studentAPI } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../services/api";
import { API_URL } from "../services/config";
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
    <TouchableOpacity
      style={styles.quizCard}
      activeOpacity={0.8}
      onPress={() => onPress(quiz)}
    >
      <View style={styles.quizCardContent}>
        <View style={styles.quizCardIconContainer}>
          <View style={styles.quizCardIcon}>
            <Text style={styles.quizCardIconText}>
              {quiz.image}
            </Text>
          </View>
        </View>
        <View style={styles.quizCardTextContainer}>
          <Text style={styles.quizCardTitle}>{quiz.title}</Text>
          <Text style={styles.quizCardSubtitle}>{quiz.subject}</Text>
        </View>
        <View style={styles.quizCardArrow}>
          <Text style={styles.quizCardArrowText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SimpleHistoryCard = ({ title, date, icon, score, onPress }) => {
  return (
    <TouchableOpacity style={styles.historyCard} onPress={onPress}>
      <View style={styles.historyCardContent}>
        <View style={styles.historyCardIconContainer}>
          <View
            style={[
              styles.historyCardIcon,
              { backgroundColor: icon === "math" ? "rgba(123, 92, 255, 0.1)" : "rgba(255, 157, 157, 0.1)" },
            ]}
          >
            <Text style={styles.historyCardIconText}>{icon}</Text>
          </View>
        </View>
        <View style={styles.historyCardTextContainer}>
          <Text style={styles.historyCardTitle}>{title}</Text>
          <Text style={styles.historyCardDate}>{date}</Text>
        </View>
        <View style={styles.historyCardScoreContainer}>
          <Text style={styles.historyCardScore}>{score}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const panelAnimation = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [historyData, setHistoryData] = useState([]); // State for history data

  // Add refresh function
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      setPage(page + 1);
      await fetchQuizzes(page); // 
    } catch (error) {
      console.error("Refresh error:", error);
      setError("Failed to refresh quizzes. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const studentID = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        if (!studentGroup || !studentYear) {
          alert("Student group or year is missing. Please log in again.");
          navigation.navigate("Login");
          return;
        }

        const response = await api.post(
          `${API_URL}/students/getHistory`,{id_student: studentID , page : 1 , limit : 7},)
        console.log("History Response:", response.data.data);
          setHistoryData(response.data.data);

        // Fetch history data here if needed
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    }
    fetchHistoryData();
  },[])

  // History data
  const historyDataa = [
    {
      id: "1",
      title: "Math Quiz",
      date: "JAN",
      icon: "math",
      score: 85,
      totalQuestions: 10,
      timeSpent: 450,
    },
    {
      id: "2",
      title: "English Quiz",
      date: "FEB",
      icon: "language",
      score: 92,
      totalQuestions: 15,
      timeSpent: 720,
    },
    {
      id: "3",
      title: "Science Quiz",
      date: "MAR",
      icon: "math",
      score: 78,
      totalQuestions: 12,
      timeSpent: 540,
    },
    {
      id: "4",
      title: "History Quiz",
      date: "APR",
      icon: "language",
      score: 88,
      totalQuestions: 8,
      timeSpent: 380,
    },
  ];

  // Filter quizzes based on search text - update to use quizzes state
  
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

  const fetchQuizzes = async (page) => {
    try {
      const studentGroup = await AsyncStorage.getItem("studentGroup");
      const studentYear = await AsyncStorage.getItem("studentYear");
      const token = await AsyncStorage.getItem("token");
      console.log("Retrieved Student Group:", studentGroup);
      console.log("Retrieved Student Year:", studentYear);

      if (!studentGroup || !studentYear) {
        alert("Student group or year is missing. Please log in again.");
        navigation.navigate("Login");
        return;
      }
      console.log("student group and year :", studentGroup, studentYear);
      const response = await api.post(
        `${API_URL}/students/getAvailableQuizzes`,
        {
          page,
          limit: 10,
          for_groupe: parseInt(studentGroup),
          for_year: parseInt(studentYear),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    fetchQuizzes(page);
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
      useNativeDriver: false,
    }).start()

    setIsExpanded(!isExpanded)
  }

  // Toggle search input
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      // Focus the input when search is activated
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when deactivated
      setSearchText("");
    }
  };

  // Clean up animation when component unmounts
  useEffect(() => {
    return () => {
      panelAnimation.stopAnimation();
    };
  }, []);

  // Update the goToFeedback function and add a new goToProfile function
  const goToFeedback = () => {
    navigation.navigate("Feedback");
  };

  const goToProfile = () => {
    navigation.navigate("Profile");
  };

  const handleQuizPress = async (quiz) => {
    console.log("Attempting to fetch details for quiz:", quiz.id_quiz); // Debug log

    try {
      const quizDetails = await getQuizDetails(quiz.id_quiz);
      navigation.navigate("QuizInfo", {
        id_quiz: quiz.id_quiz,
        basicQuizData: {
          id_quiz: quizDetails.id_quiz,
          title: quizDetails.title,
          description: quizDetails.description,
          duration: quizDetails.duration,
          nb_attempts: quizDetails.nb_attempts,
          subject: quizDetails.subject,
          totalQuestions: quizDetails.totalQuestions,
          questions: quizDetails.questions || [],
        },
      });
    } catch (error) {
      console.error("Error fetching quiz details:", error);
      
    }
  };



  /*
  const renderQuizItem = ({ item }) => <SimpleQuizCard quiz={item} onPress={handleQuizPress} />;
  */
  const panelHeight = panelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, height * 0.7],
  });

  const handleHistoryQuizPress = (item) => {
    navigation.navigate("QuizHistoryScreen", { 
      quiz: {
        id: item.id,
        title: item.title,
        description: item.descreption,
        time: item.duration,
        attempts: 1,
        questions: item.totalQuestions || 10
      },
      score: item.score,
      totalQuestions: item.totalQuestions,
    });
  };

  const renderQuizItem = ({ item, onPress }) => {
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
        {/* Simple background */}
        <SimpleBackground />

        <CustomStatusBar time="9:41" />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.title}>#Matricule</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Feather name="refresh-cw" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content - Live Quizzes */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ffffff"]}
              tintColor="#ffffff"
              progressBackgroundColor="#7B5CFF"
            />
          }
        >
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionTitleDecoration} />
            <Text style={styles.sectionTitle}>LIVE QUIZZES</Text>

            {/* Search Input */}
            {isSearchActive ? (
              <View style={styles.searchInputContainer}>
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder="Search quizzes..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={searchText}
                  onChangeText={setSearchText}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={toggleSearch}
                  style={styles.searchCloseButton}
                >
                  <Feather name="x" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={toggleSearch}
                style={styles.searchButton}
              >
                <Feather name="search" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.liveQuizzes}>
            {refreshing && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Refreshing quizzes...</Text>
              </View>
            )}

            {quizzes.length === 0 && !loading && !error && (
              <Text
                style={{ color: "white", textAlign: "center", marginTop: 20 }}
              >
                No quizzes available.
              </Text>
            )}

            {error && (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <Text style={{ color: "red", textAlign: "center" }}>
                  {error}
                </Text>
                <TouchableOpacity
                  onPress={fetchQuizzes}
                  style={styles.retryButton}
                >
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

          {/* Spacer for bottom panel */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* History Panel (Expandable) */}
        <Animated.View
          style={[
            styles.historyPanel,
            {
              height: panelHeight,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.pullBar}
            onPress={togglePanel}
            activeOpacity={0.7}
          >
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
                <SimpleHistoryCard
                  key={item.id_quiz}
                  title={item.title}
                  date={item.created_at}
                  icon={item.image}
                  score={item.score}
                  onPress={() => handleHistoryQuizPress(item)}
                />
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>

        {/* Then update the BottomNavigation component props */}
        <BottomNavigation
          onArrowPress={togglePanel}
          isPanelExpanded={isExpanded}
          onProfilePress={goToProfile}
          onFeedbackPress={goToFeedback}
          onSearchPress={toggleSearch}
        />
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
    flex: 1,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: "white",
    fontSize: 14,
  },
  searchCloseButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  noResultsSubtext: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 8,
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
    paddingBottom: 80, // Space for bottom navigation
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
  // Quiz card styles
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
  quizCardArrow: {
    width: 20,
    alignItems: "center",
  },
  quizCardArrowText: {
    fontSize: 20,
    color: colors.primary,
  },
  // History card styles
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});

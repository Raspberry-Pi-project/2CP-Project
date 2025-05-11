"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  TextInput,
  RefreshControl,
  Animated,
} from "react-native";
import { colors } from "../constants/colors";
import CustomStatusBar from "../components/CustomStatusBar";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../services/api";
import { API_URL } from "../services/config";

const { width, height } = Dimensions.get("window");

// Animated background component
const AnimatedBackground = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 15000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const interpolateColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#6A4DE0', '#8B65FF'],
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: interpolateColor }]}>
      {/* Floating bubbles */}
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 100 + 50;
        const left = Math.random() * width;
        const top = Math.random() * height;
        const opacity = Math.random() * 0.2 + 0.05;
        
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: 'rgba(255,255,255,0.15)',
              left,
              top,
              opacity,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, i % 2 === 0 ? 20 : -20],
                  }),
                },
              ],
            }}
          />
        );
      })}
    </Animated.View>
  );
};

const getQuizIcon = (title) => {
  const subject = title?.toLowerCase() || '';
  
  if (/math|algebra|calculus/.test(subject)) return '🧮'; // Math icon
  if (/science|physics|chemistry/.test(subject)) return '🔬'; // Science icon
  if (/english|literature|writing/.test(subject)) return '📝'; // English icon
  if (/history|social studies/.test(subject)) return '🏛️'; // History icon
  if (/geography/.test(subject)) return '🌍'; // Geography icon
  if (/computer|programming|coding/.test(subject)) return '💻'; // Computer icon
  if (/biology|anatomy/.test(subject)) return '🧬'; // Biology icon
  if (/art/.test(subject)) return '🎨'; // Art icon
  if (/music/.test(subject)) return '🎵'; // Music icon
  
  // Partial matches
  if (subject.includes('math')) return '🧮';
  if (subject.includes('science')) return '🔬';
  if (subject.includes('physics')) return '⚛️';
  if (subject.includes('english')) return '📖';
  if (subject.includes('history')) return '🏛️';
  if (subject.includes('geo')) return '🌍';
  if (subject.includes('comp')) return '💻';
  
  return '📚'; // Default book icon
};

/*const HistoryCard = ({ title, date, onPress, isPressed }) => {
  // Add a pressed state for animation
  const [pressed, setPressed] = useState(false);
  
  const handlePress = () => {
    setPressed(true);
    setTimeout(() => {
      setPressed(false);
      onPress();
    }, 150);
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.historyCard, 
        (pressed || isPressed) && styles.historyCardPressed
      ]} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.historyCardContent}>
        {/* Gradient Icon *}
        <View style={styles.iconOuter}>
          <LinearGradient 
            colors={["#A42FC1", "#7B5CFF"]}
            style={styles.historyIconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.emojiIconSmall}>
              {getQuizIcon(title)}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.historyCardTextContainer}>
          <Text style={styles.historyCardTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.historyCardDate}>{date}</Text>
        </View>
        
        <Feather name="chevron-right" size={20} color="#7B5CFF" />
      </View>
    </TouchableOpacity>
  );
}; */

const HistoryCard = ({ item, onPress, isPressed }) => {
  const [pressed, setPressed] = useState(false);
  
  const handlePress = () => {
    setPressed(true);
    setTimeout(() => {
      setPressed(false);
      onPress(item);
    }, 150);
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.historyCard, 
        (pressed || isPressed) && styles.historyCardPressed
      ]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.historyCardContent}>
        <View style={styles.historyCardIconContainer}>
          <View
            style={[
              styles.historyCardIcon,
              { backgroundColor: "rgba(123, 92, 255, 0.1)" },
            ]}
          >
            <Text style={styles.historyCardIconText}>
              {getQuizIcon(item.title)}
            </Text>
          </View>
        </View>

        <View style={styles.historyCardTextContainer}>
          <Text style={styles.historyCardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.historyCardDate}>{item.created_at}</Text>
          <View style={styles.quizStats}>
            <View style={styles.statItem}>
              <Feather name="clock" size={14} color={colors.primary} />
              <Text style={styles.statText}>{item.duration ? `${item.duration}m` : "N/A"}</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="help-circle" size={14} color={colors.primary} />
              <Text style={styles.statText}>{item.totalQuestions || 0} Questions</Text>
            </View>
          </View>
        </View>

        <View style={styles.historyCardScoreContainer}>
          <Text style={styles.historyCardScore}>{Math.round(item.score)}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default function FullHistory({ navigation, route }) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef(null);
  const [pressedItem, setPressedItem] = useState(null);

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", { 
        month: "short",
        day: "numeric", 
        year: "numeric"
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Fetch history data from API
  /*const fetchHistoryData = async (currentPage = page) => {
    try {
      setLoading(true);
      const studentID = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!studentID || !token) {
        alert("Please log in again.");
        navigation.navigate("Login");
        return;
      }

      const response = await api.post(
        `${API_URL}/students/history`,
        { id_student: parseInt(studentID), page: currentPage, limit: 20 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setHistoryData(
          response.data.data.map((quiz) => ({
            id_quiz: quiz.id_quiz,
            title: quiz.title,
            quizScore: quiz.score,
            created_at: formatDate(quiz.created_at),
            image: quiz.image || "📚", // Default icon if none provided
            score:
              quiz.attempts && quiz.attempts.length > 0
                ? (quiz.attempts.reduce((total, item) => total + item.score, 0) / quiz.score) * 100
                : 0,
            description: quiz.description,
            duration: quiz.duration,
            totalQuestions: quiz.totalQuestions || 0,
          }))
        );
      } else {
        setHistoryData([]);
      }
    } catch (error) {
      console.error("Error fetching history data:", error);
      setError("Failed to load quiz history. Please try again.");
      setHistoryData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }; */


  const fetchHistoryData = async (currentPage = page) => {
    try {
      setLoading(true);
      const studentID = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");
  
      if (!studentID || !token) {
        alert("Please log in again.");
        navigation.navigate("Login");
        return;
      }
  
      const response = await api.post(
        `${API_URL}/students/history`,
        { id_student: parseInt(studentID), page: currentPage, limit: 20 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data && response.data.data) {
        setHistoryData(
          response.data.data.map((quiz) => {
            // Filter out attempts with score 0 (assuming 0 means not completed)
            const validAttempts = quiz.attempts.filter(attempt => attempt.score > 0);
            const totalValidAttempts = validAttempts.length;
            
            // Calculate average score only from valid attempts
            const avgScore = totalValidAttempts > 0 
              ? (validAttempts.reduce((total, item) => total + item.score, 0) / totalValidAttempts) 
              : 0;
              
            // Calculate percentage based on quiz's total score
            const scorePercentage = quiz.score > 0 
              ? (avgScore / quiz.score) * 100 
              : 0;
  
            return {
              id_quiz: quiz.id_quiz,
              title: quiz.title,
              quizScore: quiz.score,
              created_at: formatDate(quiz.created_at),
              image: quiz.image || "📚",
              score: Math.round(scorePercentage), // Round to nearest integer
              description: quiz.description,
              duration: quiz.duration,
              totalQuestions: quiz.totalQuestions || 0,
              // Add attempts count for display if needed
              attemptsCount: totalValidAttempts,
            };
          })
        );
      } else {
        setHistoryData([]);
      }
    } catch (error) {
      console.error("Error fetching history data:", error);
      setError("Failed to load quiz history. Please try again.");
      setHistoryData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load history data on component mount
  useEffect(() => {
    fetchHistoryData();
  }, []);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistoryData(1); // Reset to first page
  };

  // Load more data when scrolling to bottom
  const loadMoreHistory = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHistoryData(nextPage);
  };

  // Toggle search input
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchText("");
    }
  };

  // Filter history items based on search text
  const filteredHistory = historyData.filter(item => 
    searchText === "" || 
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle pressing a history item
  const handleHistoryQuizPress = async (quiz) => {
    try {
      setPressedItem(quiz.id_quiz);
      const token = await AsyncStorage.getItem("token");
      
      const quizDetails = await axios.post(
        `${API_URL}/students/getQuizDetails`,
        {
          id_quiz: quiz.id_quiz,
          page: 1,
          limit: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTimeout(() => {
        setPressedItem(null);
        navigation.navigate("QuizHistoryScreen", {
          quiz: {
            id: quizDetails.data.id,
            title: quizDetails.data.title,
            description:
              quizDetails.data.description ||
              "View your previous quiz attempt results.",
            time: quizDetails.data.duration,
            nb_attempts: quizDetails.data.nb_attempts || 1,
            questions: quizDetails.data.totalQuestions || 10,
          },
          score: quizDetails.data.score,
          totalQuestions: quizDetails.data.totalQuestions,
          timeSpent: quizDetails.data.timeSpent || quizDetails.data.duration * 60,
          id_quiz: quizDetails.data.id_quiz,
          id_student: quizDetails.data.id_student,
        });
      }, 200);
    } catch (error) {
      console.error("Error fetching quiz details:", error);
      setPressedItem(null);
      alert("Failed to load quiz details. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <CustomStatusBar time="9:41" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Quiz History</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Feather name="refresh-cw" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
            <Feather name={isSearchActive ? "x" : "search"} size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar that appears when search is active */}
      {isSearchActive && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={16} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search your quiz history..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Feather name="x" size={16} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Main content */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading quiz history...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchHistoryData(1)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['white']}
              tintColor="white"
            />
          }
        >
          {filteredHistory.length > 0 ? (
            <>
              {filteredHistory.map((item) => (
  <HistoryCard
    key={item.id_quiz}
    item={item}
    onPress={handleHistoryQuizPress}
    isPressed={pressedItem === item.id_quiz}
  />
))}
              
              {/* Load more button shown when there are items */}
              
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Feather name="clipboard" size={64} color="rgba(255,255,255,0.5)" />
              <Text style={styles.emptyTitle}>
                {searchText ? "No matching quizzes found" : "No quiz history yet"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchText 
                  ? "Try adjusting your search" 
                  : "Complete some quizzes to see your history here"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
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
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 46,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: 46,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  historyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#7B5CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    transform: [{ scale: 1 }],
    transition: 'transform 0.3s ease',
  },
  historyCardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  historyCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconOuter: {
    borderRadius: 18,
    padding: 2,
    backgroundColor: 'white',
    shadowColor: '#7B5CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiIconSmall: {
    fontSize: 20,
  },
  historyCardTextContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  historyCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  historyCardDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  loadMoreButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
  },
  loadMoreText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  errorText: {
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: height * 0.15,
  },
  emptyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },

  historyCardIconContainer: {
    marginRight: 12,
  },
  historyCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyCardIconText: {
    fontSize: 20,
  },
  historyCardTextContainer: {
    flex: 1,
  },
  historyCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyCardDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  quizStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
  },
  historyCardScoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  historyCardScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
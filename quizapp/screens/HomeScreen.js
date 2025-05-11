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
  ImageBackground,
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


const { width, height } = Dimensions.get("window");

// Add after imports
/*const getQuizIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "science":
      return "flask";
    case "physics":
      return "zap";
    case "math":
      return "percent";
    case "english":
      return "book-open";
    case "history":
      return "clock";
    case "chemistry":
      return "droplet";
    case "biology":
      return "heart";
    case "computer":
      return "monitor";
    default:
      return "book";
  }
}; */

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
  
  // First try to match exact words
  if (/math|algebra|calculus/.test(subject)) return 'calculator';
  if (/science|physics|chemistry/.test(subject)) return 'atom';
  if (/english|literature|writing/.test(subject)) return 'book-open';
  if (/history|social studies/.test(subject)) return 'clock';
  if (/geography/.test(subject)) return 'map';
  if (/computer|programming|coding/.test(subject)) return 'code';
  if (/biology|anatomy/.test(subject)) return 'activity';
  if (/art|music/.test(subject)) return 'music';
  
  // Then try partial matches
  if (subject.includes('math')) return 'percent';
  if (subject.includes('science')) return 'flask';
  if (subject.includes('physics')) return 'zap';
  if (subject.includes('english')) return 'book';
  if (subject.includes('history')) return 'clock';
  if (subject.includes('geo')) return 'globe';
  if (subject.includes('comp')) return 'cpu';
  
  return 'help-circle'; // Default icon
};



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

// Enhanced quiz card component with fade animation and new purple question mark background
const QuizCard = ({ quiz, onPress, index = 0 }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Run entrance animation on component mount
  useEffect(() => {
    // Stagger the animation based on index for a cascade effect
    const delay = index * 150;

    Animated.parallel([
      // Fade in with a longer, smoother animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay,

        useNativeDriver: true,
      }),
      // Scale up with improved spring physics
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: delay + 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

    return (
      <Animated.View style={[styles.quizCardContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity style={styles.quizCard} onPress={() => { animatePress(); onPress(quiz); }} activeOpacity={0.95}>
          <ImageBackground source={require('../assets/quiz-background.png')} style={styles.cardBackground} imageStyle={styles.cardBackgroundImage}>
            
            {/* Enhanced Icon with Gradient Border */}
            <View style={styles.iconOuter}>
              <LinearGradient 
                colors={["#A42FC1", "#7B5CFF"]}
                style={styles.quizIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Feather
                  name={getQuizIcon(quiz.title)} // Use quiz title for more accurate icons
                  size={28}
                  color="white"
                />
              </LinearGradient>
            </View>
  
            <View style={styles.titleBand} />
  
            <Text style={styles.quizTitle} numberOfLines={2}>{quiz.title}</Text>
            <Text style={styles.quizDescription} numberOfLines={2}>{quiz.description}</Text>
  
            {/* Stats with improved layout */}
            <View style={styles.quizStats}>
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Feather name="clock" size={16} color={colors.primary} />
                </View>
                <Text style={styles.statText}>{quiz.duration} min |</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Feather name="help-circle" size={16} color={colors.primary} />
                </View>
                <Text style={styles.statText}>
                  {quiz.totalQuestions} Qsts |
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Feather name="repeat" size={16} color={colors.primary} />
                </View>
                <Text style={styles.statText}>
                  {quiz.nb_attempts || 0} tries
                </Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    );
  
};

/*const SimpleHistoryCard = ({ title, date, icon, score, onPress }) => {
  return (
    <TouchableOpacity style={styles.historyCard} onPress={onPress}>
      <View style={styles.historyCardContent}>
        <View style={styles.historyCardIconContainer}>
          <View
            style={[
              styles.historyCardIcon,
              {
                backgroundColor:
                  icon === "math"
                    ? "rgba(123, 92, 255, 0.1)"
                    : "rgba(255, 157, 157, 0.1)",
              },
            ]}
          >
            <Text style={styles.historyCardIconText}>
              {icon === "math" ? "📊" : "📚"}
            </Text>
          </View>
        </View>
        <View style={styles.historyCardTextContainer}>
          <Text style={styles.historyCardTitle}>{title}</Text>
          <Text style={styles.historyCardDate}>{date}</Text>
        </View>
     
      </View>
    </TouchableOpacity>
  );
}; */

const SimpleHistoryCard = ({ title, date, onPress }) => {
  return (
    <TouchableOpacity style={styles.historyCard} onPress={onPress}>
      <View style={styles.historyCardContent}>
        {/* Gradient Icon matching QuizCard */}
        <View style={styles.iconOuter}>
          <LinearGradient 
            colors={["#A42FC1", "#7B5CFF"]}
            style={styles.historyIconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather
              name={getQuizIcon(title)}
              size={20}
              color="white"
            />
          </LinearGradient>
        </View>

        <View style={styles.historyCardTextContainer}>
          <Text style={styles.historyCardTitle}>{title}</Text>
          <Text style={styles.historyCardDate}>{date}</Text>
        </View>
        
        <Feather name="chevron-right" size={20} color="#7B5CFF" />
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

  const [studentID, setStudentID] = useState('');
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        setStudentID(id);
      } catch (error) {
        console.error("Error fetching student ID:", error);
      }
    };
  
    fetchStudentData();
    fetchQuizzes(page);
    fetchHistoryData(page);
  }, []);


  // Add refresh function
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      //setPage(page + 1);
      await fetchQuizzes(page); //
      await fetchHistoryData(page);
    } catch (error) {
      console.error("Refresh error:", error);
      setError("Failed to refresh quizzes. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleViewAllPress = () => {
    // Navigate to FullHistory with history data
    navigation.navigate('FullHistory', {
      historyData: historyData // Pass the history data as a parameter
    });
  };
  const fetchHistoryData = async (page) => {
    try {
      const studentID = await AsyncStorage.getItem("userId");
      const studentGroup = await AsyncStorage.getItem("studentGroup");
      const studentYear = await AsyncStorage.getItem("studentYear");

      const token = await AsyncStorage.getItem("token");

      console.log("Student ID being sent:", studentID);

      if (!studentID || !token) {
        alert("Please log in again.");
        navigation.navigate("Login");
        return;
      }

      const response = await api.post(
        `${API_URL}/students/history`,
        { id_student: parseInt(studentID), page, limit: 10 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("History Response:", response.data.data);

      setHistoryData(response.data.data);

      if (response.data && response.data.data) {
        setHistoryData(
          response.data.data.map((quiz) => ({
            id_quiz: quiz.id_quiz,
            title: quiz.title,
            quizScore : quiz.score,
            created_at: formatDate(quiz.created_at),
            image: quiz.image || "📚", // Default icon if none provided
            score:
              quiz.attempts && quiz.attempts.length > 0
                ? (quiz.attempts.reduce((total,item)=> total + item.score , 0 ) / quiz.score)*100
                : 0,
            descreption: quiz.description,
            duration: quiz.duration,
            totalQuestions: quiz.totalQuestions || 0,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching history data:", error);
      setHistoryData([]); // Set empty array to avoid rendering issues
    }
  };
  useEffect(() => {
    fetchHistoryData(page);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    } catch (error) {
      return "N/A";
    }
  };

  <ScrollView showsVerticalScrollIndicator={false}>
    {historyData.length > 0 ? (
      historyData.map((item) => (
        <SimpleHistoryCard
          key={item.id_quiz}
          title={item.title}
          date={item.created_at}
          icon={item.image}
          score={item.score}
          type={item.type || item.subject} // Use quiz type/subject
          onPress={() => handleHistoryQuizPress(item)}
        />
      ))
    ) : (
      <View style={styles.emptyHistoryContainer}>
        <Text style={styles.emptyHistoryText}>No quiz history found</Text>
      </View>
    )}
  </ScrollView>;



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

      if (!studentGroup || !studentYear) {
        alert("Student group or year is missing. Please log in again.");
        navigation.navigate("Login");
        return;
      }
      const response = await api.post(
        `${API_URL}/students/getAvailableQuizzes`,
        {
          page,
          limit: 10,
          for_groupe: parseInt(studentGroup),
          for_year: parseInt(studentYear),
          status: "active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      setQuizzes(response.data.data);
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
      friction: 7,
      tension: 40,
      useNativeDriver: false,
    }).start();

    setIsExpanded(!isExpanded);
  };

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
  const goToProfile = () => {
    navigation.navigate("Profile");
  };

  const handleQuizPress = async (quiz) => {
    try {
      const quizDetails = await axios.post(
        `${API_URL}/students/getQuizDetails`,
        {
          id_quiz: quiz.id_quiz,
          page: 1,
          limit: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );

      console.log("Quiz Details Response:", quizDetails.data); // Debugging line to see the full response

      navigation.navigate("QuizInfo", {
        id_quiz: quiz.id_quiz,
        basicQuizData: {
          id_quiz: quizDetails.data.id_quiz,
          title: quizDetails.data.title,
          description: quizDetails.data.description,
          duration: quizDetails.data.duration,
          nb_attempts: quizDetails.data.nb_attempts,
          subject: quizDetails.data.subject,
          totalQuestions: quiz.totalQuestions,
          image: quizDetails.data.image,
          score: quizDetails.data.score,
          questions: quizDetails.data.questions || [],
        },
      });
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  /*
  const renderQuizItem = ({ item }) => <SimpleQuizCard quiz={item} onPress={handleQuizPress} />;
  */ //const renderQuizItem = ({ item, index }) => <QuizCard quiz={item} onPress={handleQuizPress} index={index} />
  const panelHeight = panelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, height * 0.7],
  });

  const handleHistoryQuizPress = async (quiz) => {
    const token = await AsyncStorage.getItem("token");
    console.log("Token:", token);

    try {
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

      console.log("Quiz Details Response:", quizDetails.data); // Debugging line to see the full response

      navigation.navigate("QuizHistoryScreen", {
        quiz: {
          id: quizDetails.data.id,
          title: quizDetails.data.title,
          description:
            quizDetails.data.descreption ||
            "View your previous quiz attempt results.",
          time: quizDetails.data.duration,
          nb_attempts: quizDetails.data.nb_attempts || 1,
          questions: quizDetails.data.totalQuestions || 10,
        },
        score: quizDetails.data.score,
        totalQuestions: quizDetails.data.totalQuestions,
        timeSpent: quizDetails.data.timeSpent || quizDetails.data.duration * 60, // Convert minutes to seconds if timeSpent not available
        id_quiz: quizDetails.data.id_quiz,
        id_student: quizDetails.data.id_student,
      });
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  const renderQuizItem = ({ item, index }) => <QuizCard quiz={item} onPress={handleQuizPress} index={index} />

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
          <AnimatedBackground />

        <CustomStatusBar time="9:41" />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.title}>
            {studentID ? `ID: ${studentID}` : '#Matricule'}

            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Feather name="refresh-cw" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content - Live Quizzes */}
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
              <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
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
              contentContainerStyle={{
                paddingVertical: 24,
                paddingBottom: 120,
                gap: 20,
                flexGrow: 1, // Add this
                justifyContent: "center", // Add this
                alignItems: "center", // Add this
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
              scrollEnabled={true}
              bounces={true}
              overScrollMode="never"
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
              removeClippedSubviews={true}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                />
              }
            />
          )}
        </View>

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
              <TouchableOpacity 
                style={styles.viewAllButton} 
                onPress={handleViewAllPress}
              >
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
          onSearchPress={toggleSearch}
        />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Important for absolute positioning
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 50,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  // Enhanced Quiz card styles
  quizCardContainer: {
    textAlign : "center",
    width: width * 0.85,
    alignSelf: "center",
    justifyContent: "center",
    marginVertical: 24, // Increased from 12 to 24 for more spacing
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 15, // Increased for more dramatic shadow
    },
    shadowOpacity: 0.6, // Increased for more visible shadow
    shadowRadius: 30, // Increased for softer, more spread shadow
    elevation: 25, // Increased for Android
  },
  quizCard: {
    alignItems : "center",
    borderRadius: 20,
    overflow: "hidden",
    // Removed padding to allow background to extend to borders
    borderWidth: 1,
    borderColor: "rgba(164, 47, 193, 0.2)",
    // Added direct shadow to quizCard
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 25,
  },
  cardBackground: {
    width: "110%",
    alignItems: "center",
    padding: 20, // Moved padding here from quizCard
    backgroundColor: "white", // Ensure white background under the image
  },
  cardBackgroundImage: {
    opacity: 0.35, // Increased from 0.25 to 0.35
    resizeMode: "cover", // Ensure it covers the entire card
  },
  quizIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(164, 47, 193, 0.5)",
    // Completely transparent background
    backgroundColor: "transparent",
  },
  titleBand: {
    width: 40,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 4,
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1C1E",
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quizDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
    lineHeight: 20,
    textAlign: "center",
    opacity: 0.8,
  },
  quizStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(123, 92, 255, 0.1)",
  },
  attemptsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    width: "100%",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    /*gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(164, 47, 193, 0.5)",
    // Completely transparent background
    backgroundColor: "transparent", */
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    fontWeight: '500',
  },
  // History card styles
  historyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    //shadowColor: "#000",
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
  },

  historyCardContent: {
    flexDirection: "row",
    alignItems: "center",
   //justifyContent: "space-between",
  },
  historyCardIconContainer: {
    //marginRight: 12,
    flex: 1,
    marginLeft: 16,
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
    //marginBottom: 4,
  },
  historyCardDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
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
  quizIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 6,
  },

});

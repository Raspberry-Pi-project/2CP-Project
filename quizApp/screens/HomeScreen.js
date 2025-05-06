"use client"

import { useState, useRef, useEffect } from "react"
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
} from "react-native"
import { colors } from "../constants/colors"
import CustomStatusBar from "../components/CustomStatusBar"
import BottomNavigation from "../components/BottomNavigation"
import { QUIZ_DATA } from "../data/quizData"
import Svg, { Path } from "react-native-svg"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

// Add after imports
const getQuizIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'science':
      return 'flask';
    case 'physics':
      return 'zap';
    case 'math':
      return 'percent';
    case 'english':
      return 'book-open';
    case 'history':
      return 'clock';
    case 'chemistry':
      return 'droplet';
    case 'biology':
      return 'heart';
    case 'computer':
      return 'monitor';
    default:
      return 'book';
  }
};

// Simple background component without complex animations
const SimpleBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Static background elements */}
      {Array.from({ length: 20 }).map((_, i) => {
        const size = Math.random() * 3 + 1
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
        )
      })}
    </View>
  )
}

// Replace the existing quiz card component
const QuizCard = ({ quiz, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
    <Animated.View
      style={[
        styles.quizCardContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity 
        style={[styles.quizCard, styles.elevation]} 
        onPress={() => {
          animatePress();
          onPress(quiz);
        }}
        activeOpacity={0.95}
      >
        <LinearGradient
          colors={['rgba(164, 47, 193, 0.08)', 'rgba(164, 47, 193, 0.03)']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <View style={styles.quizIconContainer}>
          <Feather 
            name={getQuizIcon(quiz.type)} 
            size={24} 
            color={colors.primary} 
          />
        </View>

        <View style={styles.titleBand} />
        
        <Text style={styles.quizTitle} numberOfLines={2}>
          {quiz.title}
        </Text>
        <Text style={styles.quizDescription} numberOfLines={2}>
          {quiz.subtitle}
        </Text>

        <View style={styles.quizStats}>
          <View style={styles.statItem}>
            <Feather name="clock" size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.primary }]}>{quiz.time}</Text>
          </View>
          <View style={styles.statItem}>
            <Feather name="help-circle" size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.primary }]}>{quiz.questions} Questions</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
            <Text style={styles.historyCardIconText}>{icon === "math" ? "📊" : "📚"}</Text>
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
  )
}

export default function HomeScreen({ navigation }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [refreshing, setRefreshing] = useState(false) // Add refreshing state
  const [quizzes, setQuizzes] = useState(QUIZ_DATA) // Store quizzes in state
  const panelAnimation = useRef(new Animated.Value(0)).current
  const searchInputRef = useRef(null)

  // Add refresh function
  const onRefresh = () => {
    setRefreshing(true)

    // Simulate API call with a timeout
    setTimeout(() => {
      // Simulate getting new data by shuffling the existing quizzes
      const shuffledQuizzes = [...QUIZ_DATA].sort(() => Math.random() - 0.5)
      setQuizzes(shuffledQuizzes)
      setRefreshing(false)
    }, 1500)
  }

  // History data
  const historyData = [
    { id: "1", title: "Math Quiz", date: "JAN", icon: "math", score: 85, totalQuestions: 10, timeSpent: 450 },
    { id: "2", title: "English Quiz", date: "FEB", icon: "language", score: 92, totalQuestions: 15, timeSpent: 720 },
    { id: "3", title: "Science Quiz", date: "MAR", icon: "math", score: 78, totalQuestions: 12, timeSpent: 540 },
    { id: "4", title: "History Quiz", date: "APR", icon: "language", score: 88, totalQuestions: 8, timeSpent: 380 },
  ]

  // Filter quizzes based on search text - update to use quizzes state
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchText.toLowerCase()) ||
      quiz.subtitle.toLowerCase().includes(searchText.toLowerCase()),
  )

  const togglePanel = () => {
    const toValue = isExpanded ? 0 : 1

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
    setIsSearchActive(!isSearchActive)
    if (!isSearchActive) {
      // Focus the input when search is activated
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      // Clear search when deactivated
      setSearchText("")
    }
  }

  // Clean up animation when component unmounts
  useEffect(() => {
    return () => {
      panelAnimation.stopAnimation()
    }
  }, [])

  // Update the goToFeedback function and add a new goToProfile function
  const goToFeedback = () => {
    navigation.navigate("Feedback")
  }

  const goToProfile = () => {
    navigation.navigate("Profile")
  }

  const handleQuizPress = (quiz) => {
    // Navigate to QuizInfo screen first for all quizzes
    navigation.navigate("QuizInfo", {
      quiz: {
        ...quiz,
        description: getQuizDescription(quiz),
        time: getQuizTime(quiz),
        attempts: 2, // Default number of attempts
      },
    })
  }

  // Helper function to get quiz description
  const getQuizDescription = (quiz) => {
    switch (quiz.id) {
      case "1":
        return "A comprehensive assessment of English grammar skills, covering various aspects of language usage and comprehension."
      case "2":
        return "A brief quiz about math: a short assessment that tests mathematical skills and knowledge through various question types."
      case "3":
        return "Test your knowledge of general science concepts, from biology to physics and chemistry."
      case "4":
        return "Explore the fundamental laws of physics through this interactive quiz covering mechanics, energy, and more."
      default:
        return "A brief assessment to test your knowledge."
    }
  }

  // Helper function to get quiz time
  const getQuizTime = (quiz) => {
    switch (quiz.id) {
      case "1":
      case "2":
        return "1 hour"
      case "3":
        return "30 minutes"
      case "4":
        return "45 minutes"
      default:
        return "30 minutes"
    }
  }

  const renderQuizItem = ({ item, index }) => <QuizCard quiz={item} onPress={handleQuizPress} index={index} />

  const panelHeight = panelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, height * 0.7],
  })

  const handleHistoryQuizPress = (item) => {
    navigation.navigate("QuizHistoryScreen", { 
      quiz: {
        id: item.id,
        title: item.title,
        description: "Your previous quiz attempt. View your results.",
        time: "30 minutes",
        attempts: 1,
        questions: item.totalQuestions || 10
      },
      score: item.score,
      totalQuestions: item.totalQuestions,
      timeSpent: item.timeSpent
    })
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
                <TouchableOpacity onPress={toggleSearch} style={styles.searchCloseButton}>
                  <Feather name="x" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={toggleSearch} style={styles.searchButton}>
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

            {filteredQuizzes.length > 0 ? (
              <FlatList
                data={filteredQuizzes}
                renderItem={({ item }) => (
                  <QuizCard quiz={item} onPress={handleQuizPress} />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ 
                  flex: 1,
                  justifyContent: 'center',
                  paddingVertical: 8,
                  minHeight: height * 0.6, // Reduced from 0.7 to 0.6
                  marginTop: -50, // Add negative margin to move it up
                }}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Feather name="search" size={40} color="rgba(255, 255, 255, 0.5)" />
                <Text style={styles.noResultsText}>No quizzes found</Text>
                <Text style={styles.noResultsSubtext}>Try a different search term</Text>
              </View>
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
                <SimpleHistoryCard
                  key={item.id}
                  title={item.title}
                  date={item.date}
                  icon={item.icon}
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
  )
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  // Updated Quiz card styles
  quizCardContainer: {
    width: width * 0.85,
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(164, 47, 193, 0.1)',
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  elevation: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  quizIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(164, 47, 193, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(164, 47, 193, 0.2)',
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
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quizDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.8,
  },
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(164, 47, 193, 0.1)',
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(164, 47, 193, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
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
})
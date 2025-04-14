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
} from "react-native"
import { colors } from "../constants/colors"
import CustomStatusBar from "../components/CustomStatusBar"
import BottomNavigation from "../components/BottomNavigation"
import { QUIZ_DATA } from "../data/quizData"
import Svg, { Path } from "react-native-svg"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

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

// Simple quiz card without complex animations
const SimpleQuizCard = ({ quiz, onPress, index }) => {
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
  )
}

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
  const panelAnimation = useRef(new Animated.Value(0)).current

  // History data
  const historyData = [
    { id: "1", title: "Math Quiz", date: "JAN", icon: "math", score: 85, totalQuestions: 10, timeSpent: 450 },
    { id: "2", title: "English Quiz", date: "FEB", icon: "language", score: 92, totalQuestions: 15, timeSpent: 720 },
    { id: "3", title: "Science Quiz", date: "MAR", icon: "math", score: 78, totalQuestions: 12, timeSpent: 540 },
    { id: "4", title: "History Quiz", date: "APR", icon: "language", score: 88, totalQuestions: 8, timeSpent: 380 },
  ]

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

  // Clean up animation when component unmounts
  useEffect(() => {
    return () => {
      panelAnimation.stopAnimation()
    }
  }, [])

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

  const renderQuizItem = ({ item, index }) => <SimpleQuizCard quiz={item} onPress={handleQuizPress} index={index} />

  const panelHeight = panelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, height * 0.7],
  })

  const handleHistoryQuizPress = (item) => {
    navigation.navigate("QuizScore", {
      score: (item.score * item.totalQuestions) / 100, // Convert percentage to actual score
      totalQuestions: item.totalQuestions,
      timeSpent: item.timeSpent,
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
          <View style={styles.avatarContainer}>
            <Image source={{ uri: "https://via.placeholder.com/40" }} style={styles.avatar} />
          </View>
        </View>

        {/* Main Content - Live Quizzes */}
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
            <FlatList
              data={QUIZ_DATA}
              renderItem={renderQuizItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            />
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

        <BottomNavigation onArrowPress={togglePanel} isPanelExpanded={isExpanded} onProfilePress={goToProfile} />
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
})

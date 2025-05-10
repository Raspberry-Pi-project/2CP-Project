"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, TextInput, StatusBar, ActivityIndicator } from "react-native"
import { colors } from "../constants/colors"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"

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

const HistoryQuizCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.historyCard} onPress={() => onPress(item)} activeOpacity={0.8}>
      <View style={styles.historyCardContent}>
        <View style={styles.historyCardIconContainer}>
          <View
            style={[
              styles.historyCardIcon,
              { backgroundColor: item.icon === "math" ? "rgba(123, 92, 255, 0.1)" : "rgba(255, 157, 157, 0.1)" },
            ]}
          >
            <Text style={styles.historyCardIconText}>{item.icon === "math" ? "📊" : "📚"}</Text>
          </View>
        </View>

        <View style={styles.historyCardTextContainer}>
          <Text style={styles.historyCardTitle}>{item.title}</Text>
          <Text style={styles.historyCardDate}>{item.date}</Text>
          <View style={styles.quizStats}>
            <View style={styles.statItem}>
              <Feather name="clock" size={14} color={colors.primary} />
              <Text style={styles.statText}>{item.timeSpent ? `${Math.floor(item.timeSpent / 60)}m` : "N/A"}</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="help-circle" size={14} color={colors.primary} />
              <Text style={styles.statText}>{item.totalQuestions || 0} Questions</Text>
            </View>
          </View>
        </View>

        <View style={styles.historyCardScoreContainer}>
          <Text style={styles.historyCardScore}>{item.score}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function FullHistory({ navigation }) {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchText, setSearchText] = useState("")
  const searchInputRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // History data - expanded with more entries
  const historyData = [
    { id: "1", title: "Math Quiz", date: "JAN 15, 2023", icon: "math", score: 85, totalQuestions: 10, timeSpent: 450 },
    {
      id: "2",
      title: "English Quiz",
      date: "FEB 22, 2023",
      icon: "language",
      score: 92,
      totalQuestions: 15,
      timeSpent: 720,
    },
    {
      id: "3",
      title: "Science Quiz",
      date: "MAR 10, 2023",
      icon: "math",
      score: 78,
      totalQuestions: 12,
      timeSpent: 540,
    },
    {
      id: "4",
      title: "History Quiz",
      date: "APR 05, 2023",
      icon: "language",
      score: 88,
      totalQuestions: 8,
      timeSpent: 380,
    },
    {
      id: "5",
      title: "Physics Quiz",
      date: "MAY 18, 2023",
      icon: "math",
      score: 75,
      totalQuestions: 20,
      timeSpent: 900,
    },
    {
      id: "6",
      title: "Chemistry Quiz",
      date: "JUN 07, 2023",
      icon: "language",
      score: 82,
      totalQuestions: 15,
      timeSpent: 650,
    },
    {
      id: "7",
      title: "Biology Quiz",
      date: "JUL 22, 2023",
      icon: "math",
      score: 90,
      totalQuestions: 18,
      timeSpent: 780,
    },
    {
      id: "8",
      title: "Geography Quiz",
      date: "AUG 14, 2023",
      icon: "language",
      score: 79,
      totalQuestions: 12,
      timeSpent: 520,
    },
    {
      id: "9",
      title: "Computer Science",
      date: "SEP 03, 2023",
      icon: "math",
      score: 95,
      totalQuestions: 10,
      timeSpent: 430,
    },
    {
      id: "10",
      title: "Art History",
      date: "OCT 19, 2023",
      icon: "language",
      score: 87,
      totalQuestions: 14,
      timeSpent: 600,
    },
  ]

  // Filter history data based on search text
  const filteredHistoryData = historyData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.date.toLowerCase().includes(searchText.toLowerCase()),
  )

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

  const handleHistoryQuizPress = (item) => {
    navigation.navigate("QuizHistoryScreen", {
      quiz: {
        id: item.id,
        title: item.title,
        description: "Your previous quiz attempt. View your results.",
        time: "30 minutes",
        attempts: 1,
        questions: item.totalQuestions || 10,
      },
      score: item.score,
      totalQuestions: item.totalQuestions,
      timeSpent: item.timeSpent,
    })
  }

  const loadMoreQuizzes = () => {
    if (!loading) {
      setLoading(true)
      // Simulate API call delay
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1)
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <View style={styles.container}>
      {/* Set status bar to transparent */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <LinearGradient
        colors={["#6A4DE0", "#7B5CFF", "#8B65FF"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SimpleBackground />

        {/* Quiz History Title with Back Button */}
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Quiz History</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main Content - History Quizzes */}
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionTitleDecoration} />
          <Text style={styles.sectionTitle}>HISTORY QUIZZES</Text>

          {/* Search Input */}
          {isSearchActive ? (
            <View style={styles.searchInputContainer}>
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder="Search history..."
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

        <View style={styles.historyQuizzes}>
          <FlatList
            data={filteredHistoryData.slice(0, page * ITEMS_PER_PAGE)}
            renderItem={({ item }) => <HistoryQuizCard item={item} onPress={handleHistoryQuizPress} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 24,
              paddingHorizontal: 24,
              paddingBottom: 120,
              gap: 16,
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
            onEndReached={loadMoreQuizzes}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#ffffff" />
                  <Text style={styles.loadingText}>Loading more quizzes...</Text>
                </View>
              ) : null
            }
            scrollEnabled={true}
            bounces={true}
            overScrollMode="never"
            initialNumToRender={ITEMS_PER_PAGE}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
            ListEmptyComponent={
              <View style={styles.noResultsContainer}>
                <Feather name="search" size={48} color="rgba(255, 255, 255, 0.5)" />
                <Text style={styles.noResultsText}>No quizzes found</Text>
                <Text style={styles.noResultsSubtext}>Try a different search term</Text>
              </View>
            }
          />
        </View>
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
    paddingTop: StatusBar.currentHeight || 40, // Add padding for status bar
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
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
  historyQuizzes: {
    flex: 1,
  },
  // History card styles
  historyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyCardIconContainer: {
    marginRight: 12,
  },
  historyCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  historyCardIconText: {
    fontSize: 24,
  },
  historyCardTextContainer: {
    flex: 1,
  },
  historyCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  historyCardDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  historyCardScoreContainer: {
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  historyCardScore: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4ADE80",
  },
  quizStats: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(164, 47, 193, 0.3)",
    backgroundColor: "transparent",
  },
  statText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 14,
    opacity: 0.8,
  },
})

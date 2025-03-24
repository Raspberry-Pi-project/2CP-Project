"use client"
import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from "react-native"
import { colors } from "../constants/colors"
import CustomStatusBar from "../components/CustomStatusBar"
import RecentQuizCard from "../components/RecentQuizCard"
import QuizCard from "../components/QuizCard"
import BottomNavigation from "../components/BottomNavigation"
import { QUIZ_DATA } from "../data/quizData"
import QuizBackground from '../components/QuizBackground'

const { height } = Dimensions.get("window")

export default function HomeScreen({ navigation }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const togglePanel = () => {
    setIsExpanded(!isExpanded)
  }

  const goToProfile = () => {
    navigation.navigate("Profile")
  }

  const handleQuizPress = (quiz) => {
    navigation.navigate("Quiz", { quiz: quiz })
  }

  const renderQuizItem = ({ item }) => <QuizCard quiz={item} onPress={() => handleQuizPress(item)} />

  return (
    <View style={styles.container}>
      
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

      {/* Main Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Recent Quizzes */}
        <View style={styles.recentQuizzes}>
          <RecentQuizCard title="Math Quizz" date="JAN" icon="math" />
          <RecentQuizCard title="ANG Quizz" date="JAN" icon="language" />
        </View>
      </ScrollView>

      {/* Live Quizzes Panel */}
      <View style={[styles.liveQuizzesContainer, isExpanded ? styles.expandedPanel : styles.collapsedPanel]}>
        <TouchableOpacity style={styles.pullBar} onPress={togglePanel}>
          <View style={styles.pullBarIndicator} />
        </TouchableOpacity>

        <View style={styles.liveQuizzesHeader}>
          <Text style={styles.liveQuizzesTitle}>Live Quizzes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={QUIZ_DATA}
          renderItem={renderQuizItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </View>

      <BottomNavigation onArrowPress={togglePanel} isPanelExpanded={isExpanded} onProfilePress={goToProfile} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
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
    fontSize: 20,
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  recentQuizzes: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  liveQuizzesContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 80, // Space for bottom navigation
    zIndex: 1,
  },
  collapsedPanel: {
    bottom: 0,
    height: 180,
  },
  expandedPanel: {
    bottom: 0,
    height: height - 100, // Almost full screen
  },
  pullBar: {
    alignItems: "center",
    paddingVertical: 12,
  },
  pullBarIndicator: {
    width: 40,
    height: 5,
    backgroundColor: colors.muted,
    opacity: 0.3,
    borderRadius: 3,
  },
  liveQuizzesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  liveQuizzesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.foreground,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  flatListContent: {
    paddingBottom: 20,
  },
})
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { colors } from "../constants/colors"

export default function QuizCard({ quiz, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(quiz)} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{quiz.icon === "statistics" ? "📊" : "#️⃣"}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{quiz.title}</Text>
          <Text style={styles.subtitle}>{quiz.subtitle}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(232, 234, 237, 0.3)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "rgba(232, 234, 237, 0.6)",
    height: 40,
    width: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 16,
  },
  textContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
  },
  chevron: {
    fontSize: 20,
    color: colors.muted,
  },
})


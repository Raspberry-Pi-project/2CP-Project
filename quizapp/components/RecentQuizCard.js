import { View, Text, StyleSheet } from "react-native"
import { colors } from "../constants/colors"

export default function RecentQuizCard({ title, date, icon }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>{icon === "math" ? "📊" : "📚"}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
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
  icon: {
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground,
    marginLeft: 8,
  },
  dateContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  date: {
    fontSize: 12,
    color: colors.foreground,
  },
})


import { View, Text, StyleSheet } from "react-native"
import { colors } from "../constants/colors"

export default function CustomStatusBar({ time }) {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.icons}>
        <Text style={styles.icon}>📶</Text>
        <Text style={styles.icon}>📡</Text>
        <Text style={styles.icon}>🔋</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  time: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 14,
    marginHorizontal: 2,
  },
})


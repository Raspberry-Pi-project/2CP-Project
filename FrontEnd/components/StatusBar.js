import { View, Text, StyleSheet } from "react-native"
import { colors } from "../constants/colors"
import Icon from "react-native-vector-icons/Feather"

export default function StatusBar({ time }) {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.icons}>
        <Icon name="wifi" size={16} color={colors.white} />
        <Icon name="signal" size={16} color={colors.white} />
        <Icon name="battery" size={16} color={colors.white} />
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
    gap: 4,
  },
})


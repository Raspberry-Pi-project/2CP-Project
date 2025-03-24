import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import { colors } from "../constants/colors"

export default function BottomNavigation({ onArrowPress, isPanelExpanded, onProfilePress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem}>
        <Text style={[styles.navIcon, styles.activeIcon]}>🏠</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>🔍</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={onArrowPress} activeOpacity={0.7}>
        <View style={styles.addButtonInner}>
          <Text style={styles.addIcon}>{isPanelExpanded ? "↓" : "↑"}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>📚</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={onProfilePress}>
        <Text style={styles.navIcon}>👤</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    zIndex: 2, // Ensure it's above the live quizzes panel
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    fontSize: 24,
    color: colors.muted,
  },
  activeIcon: {
    color: colors.primary,
  },
  addButton: {
    marginTop: -32,
  },
  addButtonInner: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    fontSize: 24,
    color: colors.white,
  },
})


import { View, StyleSheet, TouchableOpacity, Text, Animated } from "react-native"
import { Feather } from "@expo/vector-icons"
import { colors } from "../constants/colors"

export default function BottomNavigation({
  onArrowPress,
  isPanelExpanded,
  onProfilePress,
  onSearchPress,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={onSearchPress}>
        <Feather name="search" size={24} color={colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>🏠</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={onArrowPress} activeOpacity={0.7}>
        <View style={styles.addButtonInner}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: isPanelExpanded ? "180deg" : "0deg",
                },
              ],
            }}
          >
            <Feather name="chevron-up" size={24} color="white" />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>📚</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={onProfilePress}>
        <Feather name="user" size={24} color={colors.primary} />
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
    zIndex: 2,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navIcon: {
    fontSize: 24,
    color: colors.muted,
  },
  addButton: {
    marginTop: -32,
  },
  addButtonInner: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
})

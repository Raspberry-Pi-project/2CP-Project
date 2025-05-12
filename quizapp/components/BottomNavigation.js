import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import Svg, { Path, Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

// Update the component props to include onFeedbackPress
export default function BottomNavigation({
  onArrowPress,
  isPanelExpanded,
  onProfilePress,
  onFeedbackPress,
  onSearchPress,
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={onSearchPress}>
        <Feather name="search" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* Empty space to maintain layout */}
      <View style={styles.emptySpace} />

      <TouchableOpacity
        style={styles.addButton}
        onPress={onArrowPress}
        activeOpacity={0.7}
      >
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

      {/* Empty space to maintain layout */}
      <View style={styles.emptySpace} />

      <TouchableOpacity style={styles.navItem} onPress={onProfilePress}>
        <Feather name="user" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

function HexagonIcon({ size = 30 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Path
        d="M256 20L67 140v232l189 120 189-120V140L256 20z"
        stroke="#46348A"
        strokeWidth="24"
        fill="none"
      />
      <Circle cx="256" cy="140" r="18" fill="#F9CE18" />
      <Circle cx="256" cy="190" r="18" fill="#F9CE18" />
      <Circle cx="149" cy="171" r="18" fill="#69B657" />
      <Circle cx="183" cy="206" r="18" fill="#69B657" />
      <Circle cx="363" cy="171" r="18" fill="#E054D1" />
      <Circle cx="329" cy="206" r="18" fill="#E054D1" />
      <Circle cx="183" cy="306" r="18" fill="#29BFA4" />
      <Circle cx="149" cy="341" r="18" fill="#29BFA4" />
      <Circle cx="329" cy="306" r="18" fill="#2DB6E5" />
      <Circle cx="363" cy="341" r="18" fill="#2DB6E5" />
      <Circle cx="256" cy="372" r="18" fill="#E63535" />
      <Circle cx="256" cy="422" r="18" fill="#E63535" />
      <Circle
        cx="256"
        cy="256"
        r="70"
        stroke="#46348A"
        strokeWidth="18"
        fill="none"
      />
      <Circle
        cx="256"
        cy="256"
        r="40"
        stroke="#46348A"
        strokeWidth="18"
        fill="none"
      />
      <Path
        d="M256 186v40"
        stroke="#46348A"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <Path
        d="M256 286v40"
        stroke="#46348A"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <Path
        d="M186 256h40"
        stroke="#46348A"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <Path
        d="M286 256h40"
        stroke="#46348A"
        strokeWidth="18"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Custom Feedback Icon component based on the provided image
function FeedbackIcon({ size = 24, color = "#000" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M3 5h12M3 9h12M3 13h5M17 5l4 4-4 4" />
      <Circle cx="8.5" cy="18.5" r="2.5" />
      <Circle cx="15.5" cy="18.5" r="2.5" />
      <Path d="M9 18.5h6" />
    </Svg>
  );
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
  emptySpace: {
    width: 50,
    height: 50,
  },
});

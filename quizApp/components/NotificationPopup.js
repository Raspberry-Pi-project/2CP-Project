"use client"

import { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

const NotificationPopup = ({ visible = true, onDismiss, message = "A new quiz is available" }) => {
  const [isVisible, setIsVisible] = useState(visible)
  const translateY = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    if (visible) {
      setIsVisible(true)
      // Animate in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()

      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [visible])

  const handleDismiss = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false)
      if (onDismiss) onDismiss()
    })
  }

  if (!isVisible) return null

  return (
    <View style={styles.outerContainer}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }, { scale }],
            opacity,
          },
        ]}
      >
        <LinearGradient
          colors={["#7B5CFF", "#A42FC1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Feather name="bell" size={22} color="#7B5CFF" />
            </View>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>New Quiz Available!</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
            <Feather name="x" size={18} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    width: width - 40,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  message: {
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: 14,
    lineHeight: 18,
  },
  dismissButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
})

export default NotificationPopup

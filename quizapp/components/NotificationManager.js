"use client"

import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, Vibration } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"

// Make sure animations don't use complex Easing functions
const { width } = Dimensions.get("window")

// Notification types with different colors and icons
const NOTIFICATION_TYPES = {
  NEW_QUIZ: {
    colors: ["#7B5CFF", "#A42FC1"],
    icon: "book",
    title: "New Quiz Available!",
    vibration: [0, 50, 50, 50],
  },
  ACHIEVEMENT: {
    colors: ["#4ADE80", "#22C55E"],
    icon: "award",
    title: "Achievement Unlocked!",
    vibration: [0, 100, 100, 100],
  },
  REMINDER: {
    colors: ["#F59E0B", "#D97706"],
    icon: "clock",
    title: "Reminder",
    vibration: [0, 50, 50, 50],
  },
  INFO: {
    colors: ["#3B82F6", "#2563EB"],
    icon: "info",
    title: "Information",
    vibration: false,
  },   
}   

// Using forwardRef to properly handle the ref
const NotificationManager = forwardRef((props, ref) => {
  const [notifications, setNotifications] = useState([])
  const [activeNotification, setActiveNotification] = useState(null)
  const translateY = useRef(new Animated.Value(-150)).current
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.9)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const glowOpacity = useRef(new Animated.Value(0)).current

  // Expose methods to parent components via ref
  useImperativeHandle(ref, () => ({
    showNotification: (message, type = "NEW_QUIZ", duration = 5000) => {
      const newNotification = {
        id: Date.now(),
        message,
        type,
        duration,
      }
      setNotifications((prev) => [...prev, newNotification])
    },
  }))

  // Process the notification queue
  useEffect(() => {
    if (notifications.length > 0 && !activeNotification) {
      const nextNotification = notifications[0]
      setActiveNotification(nextNotification)
      setNotifications((prev) => prev.slice(1))

      // Vibrate based on notification type
      const notificationConfig = NOTIFICATION_TYPES[nextNotification.type] || NOTIFICATION_TYPES.INFO
      if (notificationConfig.vibration && Platform.OS !== "web") {
        Vibration.vibrate(notificationConfig.vibration)
      }

      // Show the notification with combined animations
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start()

      // Start pulsing animation
      startPulseAnimation()

      // Start glow animation
      startGlowAnimation()

      // Auto dismiss after duration
      const timer = setTimeout(() => {
        dismissNotification()
      }, nextNotification.duration)

      return () => clearTimeout(timer)
    }
  }, [notifications, activeNotification])

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const startGlowAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const dismissNotification = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 400,
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
      setActiveNotification(null)
      pulseAnim.stopAnimation()
      glowOpacity.stopAnimation()
    })
  }

  if (!activeNotification) return null

  const notificationConfig = NOTIFICATION_TYPES[activeNotification.type] || NOTIFICATION_TYPES.INFO

  return (
    <View style={styles.outerContainer}>
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowOpacity,
            backgroundColor: notificationConfig.colors[0],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }, { scale: pulseAnim }],
            opacity,
          },
        ]}
      >
        <LinearGradient
          colors={notificationConfig.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Feather name={notificationConfig.icon} size={22} color={notificationConfig.colors[0]} />
            </View>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{notificationConfig.title}</Text>
            <Text style={styles.message}>{activeNotification.message}</Text>
          </View>
          <TouchableOpacity style={styles.dismissButton} onPress={dismissNotification} activeOpacity={0.7}>
            <Feather name="x" size={18} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  )
})

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
  glowEffect: {
    position: "absolute",
    width: width - 20,
    height: 80,
    borderRadius: 40,
    top: 10,
    opacity: 0.3,
    filter: "blur(20px)",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    overflow: "hidden",
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

// Create a singleton instance
const notificationManager = {
  ref: React.createRef(),
  show: (message, type, duration) => {
    if (notificationManager.ref.current) {
      notificationManager.ref.current.showNotification(message, type, duration)
    }
  },
}

export { NotificationManager }
export default notificationManager

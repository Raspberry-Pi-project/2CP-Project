"use client"

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Path, Rect } from "react-native-svg"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")

// Logo component with animations
const TrivioLogo = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const iconAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // First fade in and scale up the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.out(Easing.back()),
        }),
      ]),
      // Then animate the icon
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic),
      }),
    ]).start()
  }, [])

  return (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.logoContent}>
        {/* Computer Icon */}
        <Animated.View
          style={{
            transform: [
              {
                translateY: iconAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
              {
                scale: iconAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.9, 1.1, 1],
                }),
              },
            ],
            opacity: iconAnim,
          }}
        >
          <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
            <Rect x="2" y="3" width="20" height="14" rx="2" fill="#4ADE80" />
            <Path d="M8 21H16M12 17V21" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
            <Path d="M6 7H18M6 11H14" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          </Svg>
        </Animated.View>

        {/* TRIVIO Text */}
        <Text style={styles.logoText}>TRIVIO</Text>
      </View>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [0, 0, 1],
            }),
          },
        ]}
      >
        Learn, Compete, Repeat
      </Animated.Text>
    </Animated.View>
  )
}

// Animated bubbles component
const AnimatedBubbles = () => {
  const bubbles = [
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 120,
      position: { top: "10%", left: "5%" },
      opacity: 0.1,
      duration: 15000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 80,
      position: { top: "25%", right: "10%" },
      opacity: 0.08,
      duration: 18000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 150,
      position: { bottom: "30%", left: "-5%" },
      opacity: 0.07,
      duration: 20000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 100,
      position: { bottom: "15%", right: "5%" },
      opacity: 0.09,
      duration: 25000,
    },
  ]

  useEffect(() => {
    // Start animations for all bubbles
    bubbles.forEach((bubble) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubble.ref, {
            toValue: 1,
            duration: bubble.duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bubble.ref, {
            toValue: 0,
            duration: bubble.duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start()
    })
  }, [])

  return (
    <>
      {bubbles.map((bubble, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bubble,
            {
              ...bubble.position,
              width: bubble.size,
              height: bubble.size,
              opacity: bubble.opacity,
              transform: [
                {
                  translateY: bubble.ref.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, index % 2 === 0 ? 15 : -15, 0],
                  }),
                },
                {
                  translateX: bubble.ref.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, index % 3 === 0 ? 10 : -10, 0],
                  }),
                },
                {
                  scale: bubble.ref.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.05, 1],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </>
  )
}

export default function FirstScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Fade in the entire screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    // Auto navigate to the next screen after a delay
    const timer = setTimeout(() => {
      navigation.replace("Login") // Navigate to login screen
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient colors={["#7B5CFF", "#A42FC1"]} style={styles.background}>
        <AnimatedBubbles />
        <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <TrivioLogo />
        </View>
      </LinearGradient>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
  tagline: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "white",
  },
})

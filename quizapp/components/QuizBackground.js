"use client"

import { useEffect, useRef } from "react"
import { StyleSheet, Animated, Easing, Dimensions, View } from "react-native"

const { width, height } = Dimensions.get("window")

const QuizBackground = () => {
  // Create multiple animated values for different bubbles
  const bubbles = [
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 120,
      position: { top: "5%", left: "10%" },
      opacity: 0.3,
      duration: 15000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 80,
      position: { top: "20%", right: "5%" },
      opacity: 0.2,
      duration: 18000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 150,
      position: { bottom: "40%", left: "0%" },
      opacity: 0.15,
      duration: 20000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 100,
      position: { bottom: "10%", right: "15%" },
      opacity: 0.25,
      duration: 25000,
    },
    {
      ref: useRef(new Animated.Value(0)).current,
      size: 60,
      position: { top: "40%", left: "30%" },
      opacity: 0.2,
      duration: 22000,
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

    return () => {
      // Clean up animations
      bubbles.forEach((bubble) => {
        bubble.ref.stopAnimation()
      })
    }
  }, [])

  return (
    <View style={StyleSheet.absoluteFill}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#C16AD5",
  },
})

export default QuizBackground

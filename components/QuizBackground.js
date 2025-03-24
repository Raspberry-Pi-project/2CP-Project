import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Bubble = ({ style }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        style,
        {
          opacity: animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.2, 0.4, 0.2],
          }),
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.8, 1.2, 0.8],
              }),
            },
          ],
        },
      ]}
    />
  );
};

const QuizBackground = () => {
  return (
    <View style={styles.container}>
      <View style={styles.purpleFrame}>
        <Bubble style={{ top: '5%', left: '10%', width: 40, height: 40 }} />
        <Bubble style={{ top: '15%', right: '15%', width: 60, height: 60 }} />
        <Bubble style={{ top: '25%', left: '25%', width: 45, height: 45 }} />
        <Bubble style={{ top: '10%', right: '30%', width: 35, height: 35 }} />
        <Bubble style={{ top: '30%', left: '60%', width: 50, height: 50 }} />
        <Bubble style={{ top: '20%', left: '40%', width: 30, height: 30 }} />
        <Bubble style={{ top: '8%', left: '75%', width: 25, height: 25 }} />
        <Bubble style={{ top: '35%', right: '45%', width: 40, height: 40 }} />
        <Bubble style={{ top: '40%', left: '20%', width: 35, height: 35 }} />
        <Bubble style={{ top: '45%', right: '10%', width: 45, height: 45 }} />
        <Bubble style={{ top: '50%', left: '5%', width: 30, height: 30 }} />
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
  purpleFrame: {
    backgroundColor: '#A42FC1',
    height: '45%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
  },
});

export default QuizBackground;
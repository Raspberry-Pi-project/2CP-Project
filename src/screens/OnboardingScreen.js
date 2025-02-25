import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Quiz App!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6C5CE7',
  },
  text: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
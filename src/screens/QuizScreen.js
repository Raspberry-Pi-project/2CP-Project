import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function QuizScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Time!</Text>
      <Text style={styles.text}>Get ready to test your knowledge.</Text>
      <Button title="Start Quiz" onPress={() => alert('Quiz Started!')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
});

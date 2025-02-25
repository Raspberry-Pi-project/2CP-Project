import React from 'react';
import { View, StyleSheet } from 'react-native';


const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: `${progress}%` }]} />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  bar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
});
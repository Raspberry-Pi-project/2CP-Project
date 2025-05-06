import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

/**
 * A wrapper component that only shows its children when the device is offline.
 * Otherwise displays a message asking the user to turn off internet.
 */
const OfflineOnly = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsCheckingConnection(false);
    });

    // Initial check
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      setIsCheckingConnection(false);
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  if (isCheckingConnection) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#A42FC1", "#7B5CFF"]} style={styles.background}>
          <View style={styles.contentContainer}>
            <Text style={styles.loadingText}>Checking network status...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (isConnected) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#A42FC1", "#7B5CFF"]} style={styles.background}>
          <View style={styles.contentContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.errorIcon}>!</Text>
            </View>
            <Text style={styles.title}>Internet Connection Detected</Text>
            <Text style={styles.message}>
              Please turn off your internet connection to use this app.
            </Text>
            <Text style={styles.subMessage}>
              This app is designed to work offline only.
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // If offline, render the app
  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: width * 0.85,
    alignItems: 'center',
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorIcon: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#A42FC1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default OfflineOnly; 
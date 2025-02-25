import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LanguageQuizScreen({ navigation }) {
  return (
    <LinearGradient colors={['#6A5AE0', '#8868E8']} style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Language Quiz</Text>
      <Text style={{ color: 'white', marginTop: 10 }}>Test your language skills!</Text>

      <TouchableOpacity 
        style={{ marginTop: 20, backgroundColor: '#9B7DF5', padding: 15, borderRadius: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Go Back</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

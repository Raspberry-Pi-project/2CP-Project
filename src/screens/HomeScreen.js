import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <LinearGradient colors={['#6A5AE0', '#8868E8']} style={{ flex: 1, padding: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Good Morning</Text>
          <Ionicons name="person-circle" size={40} color="white" />
        </View>
        
        {/* Recent Quiz */}
        <View style={{ backgroundColor: '#7B5EDB', borderRadius: 15, padding: 15, marginTop: 20 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Recent Quiz</Text>
          
        </View>
        
        {/* Featured */}
        <View style={{ backgroundColor: '#6A5AE0', borderRadius: 15, padding: 15, marginTop: 20 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>FEATURED</Text>
          <Text style={{ color: 'white', marginTop: 5 }}>Take part in challenges with friends or other players</Text>
          
        </View>
       
        
        {/* Live Quizzes */}
        
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Live Quizzes</Text>
          <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 15, marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Language Quiz</Text>
            <Text style={{ color: 'gray' }}>ANG3 • 12 Questions</Text>
          </View>
          <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 15, marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>algebra Quiz</Text>
            <Text style={{ color: 'gray' }}>ALG3 • 10 Questions</Text>
          </View>

          <view style={{ backgroundColor: 'white', borderRadius: 15, padding: 15, marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Programming Quiz</Text>
            <Text style={{ color: 'gray' }}>SFSD • 15 Questions</Text>
            </view>
            <view style={{ backgroundColor: 'white', borderRadius: 15, padding: 15, marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>ANA4</Text>
            <Text style={{ color: 'gray' }}>ANA4 • 10 Questions</Text>
            </view>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

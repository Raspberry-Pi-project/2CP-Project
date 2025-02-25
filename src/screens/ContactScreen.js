import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ContactUsScreen() {
  return (
    <LinearGradient colors={['#6A5AE0', '#8868E8']} style={{ flex: 1, padding: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 40 }}>
          Contact Us
        </Text>

        {/* Input Fields */}
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: 'white', fontSize: 16, marginBottom: 5 }}>Your Name</Text>
          <TextInput 
            style={{
              backgroundColor: 'white', 
              borderRadius: 10, 
              padding: 12, 
              fontSize: 16, 
              marginBottom: 15 
            }} 
            placeholder="Enter your name" 
          />

          <Text style={{ color: 'white', fontSize: 16, marginBottom: 5 }}>Email Address or mobile phone</Text>
          <TextInput 
            style={{
              backgroundColor: 'white', 
              borderRadius: 10, 
              padding: 12, 
              fontSize: 16, 
              marginBottom: 15 
            }} 
            placeholder="Enter your email or your phone number" 
            keyboardType="email-address"
          />

          <Text style={{ color: 'white', fontSize: 16, marginBottom: 5 }}>Message</Text>
          <TextInput 
            style={{
              backgroundColor: 'white', 
              borderRadius: 10, 
              padding: 12, 
              fontSize: 16, 
              height: 100, 
              textAlignVertical: 'top' 
            }} 
            placeholder="Type your message here..." 
            multiline
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={{
            marginTop: 20, 
            backgroundColor: '#9B7DF5', 
            padding: 15, 
            borderRadius: 10, 
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Send Message</Text>
        </TouchableOpacity>

      </ScrollView>
    </LinearGradient>
  );
}

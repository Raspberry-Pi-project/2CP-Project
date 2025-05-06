// screens/StudentPrivateChartScreen.js - Updated with wider chart container
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import RadarChart from '../components/RadarChart';
import BottomNavigation from '../components/BottomNavigation';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');

const StudentPrivateChartScreen = ({ navigation }) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  
  // Updated student mastery data with academic subjects
  const studentMasteryData = [
    { axis: "Math", value: 28 },
    { axis: "Physics", value: 21 },
    { axis: "English", value: 32 },
    { axis: "Science", value: 25 },
  ];
  
  // Navigation functions
  const handleArrowPress = () => {
    setIsPanelExpanded(!isPanelExpanded);
  };
  
  const goToFeedback = () => {
    navigation.navigate("Feedback");
  };
  
  const goToProfile = () => {
    navigation.navigate("Profile");
  };
  
  const goToSearch = () => {
    // Handle search action
  };
  
  const goToHome = () => {
    navigation.navigate("Home");
  };

  // Find the subject with the lowest mastery score
  const lowestMasterySubject = studentMasteryData.reduce(
    (min, current) => (current.value < min.value ? current : min),
    studentMasteryData[0]
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#6A4DE0", "#7B5CFF", "#8B65FF"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={goToHome} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Mastery</Text>
        <View style={styles.spacer} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.chartContainer}>
          <RadarChart data={studentMasteryData} maxValue={35} />
        </View>
        
        <View style={styles.statsList}>
          <Text style={styles.statsTitle}>Mastery Breakdown</Text>
          
          {studentMasteryData.map((item, index) => (
            <View key={index} style={styles.statItem}>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>{item.axis}</Text>
                <Text style={styles.statValue}>{(item.value / 35 * 100).toFixed(0)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${(item.value / 35 * 100)}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.recommendationsSection}>
          <Text style={styles.statsTitle}>Recommendations</Text>
          <View style={styles.recommendationCard}>
            <View style={styles.recommendationIcon}>
              <Feather name="book" size={24} color={colors.primary} />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Focus on {lowestMasterySubject.axis}</Text>
              <Text style={styles.recommendationText}>
                This area shows your lowest mastery score. Try reviewing the related materials 
                and taking practice quizzes to improve your {lowestMasterySubject.axis} skills.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <BottomNavigation
        onArrowPress={handleArrowPress}
        isPanelExpanded={isPanelExpanded}
        onProfilePress={goToProfile}
        onFeedbackPress={goToFeedback}
        onSearchPress={goToSearch}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12, // Reduced horizontal padding to accommodate wider containers
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10, // Reduced padding to give more space to the chart
    marginTop: 20,
    marginHorizontal: -8, // Negative margin to make it wider
    width: width * 0.95, // Make it 95% of screen width
    alignSelf: 'center', // Center it
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsList: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  statItem: {
    marginBottom: 16,
  },
  statInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  recommendationsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 100,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F8F0FF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  recommendationIcon: {
    marginRight: 16,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default StudentPrivateChartScreen;
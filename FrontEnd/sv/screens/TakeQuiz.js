import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import { UserContext } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_ENDPOINTS, apiClient } from '../config/apiConfig';

const { width } = Dimensions.get('window');

// Define theme colors
const COLORS = {
  primary: '#6a1b9a',    // Deep purple
  primaryLight: '#9c4dcc', // Light purple
  primaryDark: '#38006b',  // Dark purple
  accent: '#4CAF50',     // Green
  accentLight: '#80e27e', // Light green
  white: '#ffffff',
  background: '#f9f5ff',
  cardBg: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#888888',
  divider: '#e0d6f2',
  error: '#e74c3c'
};

const TakeQuiz = ({ navigation, route }) => {
  const { userData } = useContext(UserContext);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(5);

  // Add useFocusEffect to refresh quizzes when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Check if we're returning from StartResponse with a refresh flag
      if (route.params?.refreshQuizzes) {
        console.log('Refreshing quizzes after returning from quiz with code:', route.params?.returnCode);
        
        // Always fetch quizzes when returning with refresh flag
        fetchAvailableQuizzes();
        
        // Clear the params after handling them to prevent repeated refreshes
        navigation.setParams({
          refreshQuizzes: undefined,
          timestamp: undefined,
          returnCode: undefined
        });
      }
      return () => {
        // Clean up if needed
      };
    }, [route.params?.refreshQuizzes, route.params?.timestamp])
  );

  
  useEffect(() => {
    fetchAvailableQuizzes();
  }, [page]);

  // Update the fetchAvailableQuizzes function to handle attempt information
  // Update the fetchAvailableQuizzes function to include a timestamp to prevent caching
  const fetchAvailableQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching quizzes for student ID:', userData.id_student);
      
      const response = await apiClient.get(API_ENDPOINTS.AVAILABLE_QUIZZES, {
        params: {
          id_student: userData.id_student,
          for_year: userData.annee,         // Updated field name to match backend
          for_groupe: userData.groupe_student, // Updated field name to match backend
          page: page,
          limit: limit,
          timestamp: new Date().getTime() // Add timestamp to prevent caching
        }
      });
      
      console.log('Available quizzes received:', response.data);
      
      // Process quizzes to add attempt information if not already included
      const processedQuizzes = response.data.data.map(quiz => {
        // If the quiz already has attempt info, use it
        if (quiz.attemptsInfo) {
          return quiz;
        }
        
        // Otherwise, add default attempt info
        return {
          ...quiz,
          attemptsInfo: {
            canAttempt: true,
            remainingAttempts: quiz.nb_attempts,
            successfulAttempts: 0,
            totalAttempts: 0
          }
        };
      });
      
      setAvailableQuizzes(processedQuizzes);
      setTotalPages(response.data.totalPages);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching available quizzes:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        setError(`Server error (${error.response.status}): ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response received from server. Please check your connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
      
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAvailableQuizzes();
  };

  // If StartResponse is in a different navigator stack, you might need to use
  // navigation.navigate('StackName', { screen: 'StartResponse', params: { selectedQuiz: quiz } });
  
  // For example, if StartResponse is in a stack named 'QuizStack':
  const handleQuizSelection = (quiz) => {
    // Use direct navigation since StartResponse appears to be in the same navigator
    navigation.navigate('StartResponse', { 
      selectedQuiz: quiz 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderQuizCard = ({ item }) => {
    const canAttempt = item.attemptsInfo?.canAttempt && 
                      (!item.nb_attempts || item.attemptsInfo?.totalAttempts < item.nb_attempts);
    const hasPassed = item.attemptsInfo?.successfulAttempts > 0;
    
    return (
      <Card style={styles.quizCard}>
        <LinearGradient
          colors={[COLORS.primaryLight, COLORS.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardHeader}
        >
          <View style={styles.quizTitleContainer}>
            <Text style={styles.quizTitle}>{item.title}</Text>
            <Text style={styles.quizDate}>Published on {formatDate(item.published_quizzes[0].published_at)}</Text>
          </View>
          <View style={styles.durationBadge}>
            <Icon name="clock-outline" size={14} color={COLORS.white} />
            <Text style={styles.durationBadgeText}>{item.duration} min</Text>
          </View>
        </LinearGradient>
        
        <Card.Content style={styles.cardContent}>
          <View style={styles.quizInfoRow}>
            <View style={styles.infoItem}>
              <Icon name="school-outline" size={18} color={COLORS.primary} />
              <Text style={styles.infoText}>Year {item.for_year || userData.annee}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="account-group-outline" size={18} color={COLORS.primary} />
              <Text style={styles.infoText}>Group {item.for_groupe || userData.groupe_student}</Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.attemptsContainer}>
            <View style={styles.attemptItem}>
              <Icon name="counter" size={18} color={COLORS.primary} />
              <Text style={styles.attemptText}>
                Attempts: {item.attemptsInfo?.totalAttempts || 0}/{item.nb_attempts || 'Unlimited'}
              </Text>
            </View>
            <View style={styles.attemptItem}>
              <Icon 
                name={hasPassed ? "check-circle" : "information-outline"} 
                size={18} 
                color={hasPassed ? COLORS.accent : COLORS.primaryLight} 
              />
              <Text style={[
                styles.attemptText, 
                hasPassed ? styles.successText : {}
              ]}>
                {hasPassed ? 'Passed' : 'Not attempted yet'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.startButton,
              !canAttempt && styles.startButtonDisabled
            ]}
            onPress={() => handleQuizSelection(item)}
            disabled={!canAttempt}
          >
            <LinearGradient
              colors={canAttempt ? [COLORS.accent, COLORS.accentLight] : ['#d1d1d1', '#aaaaaa']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.startButtonText}>
                {!canAttempt ? 'No Attempts Left' : 'Start Quiz'}
              </Text>
              {canAttempt && 
                <Icon name="arrow-right" size={16} color={COLORS.white} style={styles.startButtonIcon} />
              }
            </LinearGradient>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyList = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Icon name="playlist-remove" size={80} color={`${COLORS.primary}40`} />
        <Text style={styles.emptyText}>No quizzes available</Text>
        <Text style={styles.emptySubText}>
          All assigned quizzes have been completed or no quizzes have been assigned to you yet.
        </Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
            <Icon name="refresh" size={16} color={COLORS.white} style={styles.refreshButtonIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderErrorView = () => {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Icon name="alert-circle-outline" size={80} color={COLORS.error} />
          <Text style={styles.errorTitle}>Error Loading Quizzes</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchAvailableQuizzes}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
              <Icon name="reload" size={16} color={COLORS.white} style={styles.retryButtonIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
      
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Available Quizzes</Text>
          <Text style={styles.headerSubtitle}>
            Select a quiz to start your assessment
          </Text>
        </View>
      </LinearGradient>

      {loading && availableQuizzes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading available quizzes...</Text>
        </View>
      ) : error ? (
        renderErrorView()
      ) : (
        <View style={styles.quizListContainer}>
          <FlatList
            data={availableQuizzes}
            keyExtractor={(item) => item.id_quiz.toString()}
            renderItem={renderQuizCard}
            ListEmptyComponent={renderEmptyList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            contentContainerStyle={styles.listContent}
          />

          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity 
                style={[styles.paginationButton, page === 1 && styles.paginationButtonDisabled]}
                onPress={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <Icon name="chevron-left" size={20} color={page === 1 ? COLORS.textMuted : COLORS.primary} />
              </TouchableOpacity>
              
              <Text style={styles.paginationText}>Page {page} of {totalPages}</Text>
              
              <TouchableOpacity 
                style={[styles.paginationButton, page === totalPages && styles.paginationButtonDisabled]}
                onPress={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                <Icon name="chevron-right" size={20} color={page === totalPages ? COLORS.textMuted : COLORS.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <LinearGradient
          colors={[COLORS.primaryLight, COLORS.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.footerGradient}
        >
          <Text style={styles.footerText}>TRIVIO QUIZ</Text>
          <Text style={styles.footerSubtext}>Learning made interactive</Text>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
  },
  headerContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  quizListContainer: {
    flex: 1,
    paddingTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  quizCard: {
    marginBottom: 16,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: COLORS.cardBg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardContent: {
    padding: 16,
  },
  quizTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  quizDate: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  durationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  quizInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 6,
  },
  divider: {
    backgroundColor: COLORS.divider,
    height: 1,
    marginVertical: 12,
  },
  attemptsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  attemptItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attemptText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 6,
  },
  successText: {
    color: COLORS.accent,
    fontWeight: '500',
  },
  startButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
  },
  startButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  startButtonIcon: {
    marginLeft: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 2,
  },
  paginationButtonDisabled: {
    backgroundColor: '#f5f5f5',
    elevation: 0,
  },
  paginationText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginHorizontal: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    margin: 16,
    elevation: 2,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  refreshButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  refreshButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  refreshButtonIcon: {
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    elevation: 3,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  retryButtonIcon: {
    marginLeft: 8,
  },
  footer: {
    overflow: 'hidden',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  footerGradient: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 2,
  },
});

export default TakeQuiz;
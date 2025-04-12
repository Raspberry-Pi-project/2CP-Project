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
  Dimensions
} from 'react-native';
import { UserContext } from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

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
  /*useFocusEffect(
    React.useCallback(() => {
      // Check if we're returning from StartResponse with a refresh flag
      if (route.params?.refreshQuizzes) {
        console.log('Refreshing quizzes after returning from quiz');
        fetchAvailableQuizzes();
      }
      return () => {
        // Clean up if needed
      };
    }, [route.params?.refreshQuizzes, route.params?.timestamp])
  );*/
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

  const fetchAvailableQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the authentication token
      const token = await AsyncStorage.getItem('token');
      
      console.log('Fetching quizzes for student ID:', userData.id_student);
      
      const response = await axios.get('http://localhost:3000/students/getAvailableQuizzes', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          id_student: userData.id_student,
          for_year: userData.annee,         // Updated field name to match backend
          for_groupe: userData.groupe_student, // Updated field name to match backend
          page: page,
          limit: limit
        }
      });
      
      console.log('Available quizzes received:', response.data);
      
      setAvailableQuizzes(response.data.data);
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

  const renderEmptyList = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Icon name="playlist-remove" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No quizzes available</Text>
        <Text style={styles.emptySubText}>
          All assigned quizzes have been completed or no quizzes have been assigned to you yet.
        </Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuizTable = () => {
    return (
      <DataTable style={styles.table}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title style={[styles.tableHeaderCell, { flex: 2 }]}>Quiz Title</DataTable.Title>
          <DataTable.Title style={[styles.tableHeaderCell, { flex: 1.5 }]}>Subject</DataTable.Title>
          <DataTable.Title style={[styles.tableHeaderCell, { flex: 1 }]}>Duration</DataTable.Title>
          <DataTable.Title style={[styles.tableHeaderCell, { flex: 0.8 }]}>Action</DataTable.Title>
        </DataTable.Header>

        <FlatList
          data={availableQuizzes}
          keyExtractor={(item) => item.id_quiz.toString()}
          renderItem={({ item }) => (
            <DataTable.Row style={styles.tableRow}>
              <DataTable.Cell style={[styles.tableCell, { flex: 2 }]}>
                <Text style={styles.quizTitle}>{item.title}</Text>
                <Text style={styles.quizDate}>Created: {formatDate(item.created_at)}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={[styles.tableCell, { flex: 1.5 }]}>
                <Text style={styles.subjectText}>{item.subject}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={[styles.tableCell, { flex: 1 }]}>
                <Text style={styles.durationText}>{item.duration} min</Text>
              </DataTable.Cell>
              <DataTable.Cell style={[styles.tableCell, { flex: 0.8 }]}>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleQuizSelection(item)}
                >
                  <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          )}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4a6da7']}
            />
          }
        />

        <DataTable.Pagination
          page={page - 1}
          numberOfPages={totalPages}
          onPageChange={(page) => setPage(page + 1)}
          label={`Page ${page} of ${totalPages}`}
          showFastPaginationControls
          numberOfItemsPerPage={limit}
          selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>
    );
  };

  const renderErrorView = () => {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={60} color="#e74c3c" />
        <Text style={styles.errorTitle}>Error Loading Quizzes</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchAvailableQuizzes}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Quizzes</Text>
        <Text style={styles.headerSubtitle}>
          Select a quiz to start your assessment
        </Text>
      </View>

      {loading && availableQuizzes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a6da7" />
          <Text style={styles.loadingText}>Loading available quizzes...</Text>
        </View>
      ) : error ? (
        renderErrorView()
      ) : (
        renderQuizTable()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a6da7',
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  table: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    backgroundColor: '#4a6da7',
  },
  tableHeaderCell: {
    justifyContent: 'center',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 60,
  },
  tableCell: {
    justifyContent: 'center',
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  quizDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  subjectText: {
    fontSize: 14,
    color: '#555',
  },
  durationText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TakeQuiz;
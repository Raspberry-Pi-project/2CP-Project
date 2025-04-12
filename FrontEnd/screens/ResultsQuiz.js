import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { UserContext } from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ResultsQuiz = ({ route, navigation }) => {
    const { userData } = useContext(UserContext);
    const { id_quiz, id_student } = route.params;
    const [quizResults, setQuizResults] = useState([]);
    const [quizDetails, setQuizDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const limit = 5;

    useEffect(() => {
        fetchQuizResults();
    }, [currentPage]);

    // Function to handle going back to TakeQuiz screen with refresh flag
    const handleBackToQuizList = () => {
        // Navigate back to TakeQuiz with a parameter to trigger refresh
        navigation.navigate('TakeQuiz', { refreshQuizzes: true });
    };

    const fetchQuizResults = async () => {
        try {
            setLoading(true);
            
            // Get the authentication token
            const token = await AsyncStorage.getItem('token');
            
            // Use the id_student from route params or from userData context
            const studentId = id_student || userData?.id_student;
            
            if (!studentId) {
                setError('Student ID not found. Please try again.');
                setLoading(false);
                return;
            }
            
            const response = await axios.get('http://localhost:3000/students/getQuizResults', {
                params: {
                    id_student: studentId,
                    id_quiz: id_quiz,
                    page: currentPage,
                    limit: limit
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data && response.data.length > 0) {
                setQuizResults(response.data);
                // Set quiz details from the first attempt
                if (response.data[0].quiz) {
                    setQuizDetails(response.data[0].quiz);
                }
                setTotalAttempts(response.data.length);
            } else {
                setError('No results found for this quiz.');
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz results:', error.response?.data || error.message);
            setError('Failed to load quiz results. Please try again.');
            setLoading(false);
        }
    };

    const renderQuizHeader = () => {
        if (!quizDetails) return null;
        
        return (
            <View style={styles.quizHeaderContainer}>
                <Text style={styles.quizTitle}>{quizDetails.title}</Text>
                <Text style={styles.quizDescription}>{quizDetails.description}</Text>
                <View style={styles.quizInfoRow}>
                    <View style={styles.quizInfoItem}>
                        <Text style={styles.quizInfoLabel}>Duration:</Text>
                        <Text style={styles.quizInfoValue}>{quizDetails.duration} min</Text>
                    </View>
                    <View style={styles.quizInfoItem}>
                        <Text style={styles.quizInfoLabel}>Total Attempts:</Text>
                        <Text style={styles.quizInfoValue}>{totalAttempts}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderAttemptHeader = (attempt) => {
        const attemptDate = new Date(attempt.created_at).toLocaleString();
        const scoreColor = attempt.score >= 70 ? '#4CAF50' : attempt.score >= 50 ? '#FF9800' : '#F44336';
        
        return (
            <View style={styles.attemptHeaderContainer}>
                <Text style={styles.attemptTitle}>Attempt #{attempt.id_attempt}</Text>
                <Text style={styles.attemptDate}>{attemptDate}</Text>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Score:</Text>
                    <Text style={[styles.scoreValue, { color: scoreColor }]}>{attempt.score}%</Text>
                </View>
            </View>
        );
    };

    const renderAnswerItem = ({ item }) => {
        return (
            <View style={[styles.answerRow, { backgroundColor: item.correct ? '#E8F5E9' : '#FFEBEE' }]}>
                <Text style={styles.questionNumber}>Q{item.id_question}</Text>
                <Text style={styles.answerText}>{item.student_answer_text}</Text>
                <View style={[styles.correctIndicator, { backgroundColor: item.correct ? '#4CAF50' : '#F44336' }]}>
                    <Text style={styles.correctIndicatorText}>{item.correct ? '✓' : '✗'}</Text>
                </View>
            </View>
        );
    };

    const renderAttemptDetails = (attempt) => {
        return (
            <View style={styles.attemptContainer}>
                {renderAttemptHeader(attempt)}
                
                <View style={styles.answersHeaderRow}>
                    <Text style={[styles.answersHeaderCell, { flex: 1 }]}>Q#</Text>
                    <Text style={[styles.answersHeaderCell, { flex: 3 }]}>Your Answer</Text>
                    <Text style={[styles.answersHeaderCell, { flex: 1 }]}>Result</Text>
                </View>
                
                <FlatList
                    data={attempt.student_answers}
                    renderItem={renderAnswerItem}
                    keyExtractor={(item) => `${attempt.id_attempt}-${item.id_question}`}
                    scrollEnabled={false}
                />
            </View>
        );
    };

    const renderPagination = () => {
        if (totalAttempts <= limit) return null;
        
        const totalPages = Math.ceil(totalAttempts / limit);
        
        return (
            <View style={styles.paginationContainer}>
                <TouchableOpacity 
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                    onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <Text style={styles.pageButtonText}>Previous</Text>
                </TouchableOpacity>
                
                <Text style={styles.pageInfo}>Page {currentPage} of {totalPages || 1}</Text>
                
                <TouchableOpacity 
                    style={[styles.pageButton, currentPage >= totalPages && styles.disabledButton]}
                    onPress={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <Text style={styles.pageButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4a6da7" />
                <Text style={styles.loadingText}>Loading quiz results...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {renderQuizHeader()}
                
                {quizResults.length === 0 ? (
                    <Text style={styles.noDataText}>No results found for this quiz.</Text>
                ) : (
                    quizResults.map(attempt => renderAttemptDetails(attempt))
                )}
                
                {renderPagination()}
                
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleBackToQuizList}
                >
                    <Text style={styles.backButtonText}>Back to Quiz List</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
    },
    quizHeaderContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quizTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    quizDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    quizInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    quizInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quizInfoLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 4,
    },
    quizInfoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    attemptContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    attemptHeaderContainer: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    attemptTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    attemptDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 16,
        color: '#333',
        marginRight: 8,
    },
    scoreValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    answersHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#4a6da7',
        padding: 12,
    },
    answersHeaderCell: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    answerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        padding: 12,
        alignItems: 'center',
    },
    questionNumber: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    answerText: {
        flex: 3,
        fontSize: 14,
        color: '#333',
        paddingHorizontal: 8,
    },
    correctIndicator: {
        flex: 1,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    correctIndicatorText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    pageButton: {
        backgroundColor: '#4a6da7',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    pageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pageInfo: {
        fontSize: 14,
        color: '#666',
    },
    backButton: {
        backgroundColor: '#4a6da7',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        fontSize: 16,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 40,
        fontSize: 16,
        color: '#666',
    }
});

export default ResultsQuiz;
import React, { useState, useEffect, useContext } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ActivityIndicator, 
    FlatList, 
    TouchableOpacity, 
    ScrollView,
    SafeAreaView,
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import { UserContext } from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, apiClient, apiRequest } from '../config/apiConfig';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

// Theme constants for this screen with updated color scheme
const QUIZ_THEME = {
    primary: '#6a5acd', // Violet from logo
    secondary: '#ffffff', // White
    accent: '#4CAF50', // Green accent color
    background: '#f8f5ff', // Light violet background
    cardBackground: '#ffffff', // White card background
    border: '#e0d9ff', // Light violet border
    scoreColors: {
        high: '#4CAF50', // Green for high scores (70%+)
        medium: '#FF9800', // Orange for medium scores (50-69%)
        low: '#F44336' // Red for low scores (<50%)
    },
    text: {
        dark: '#333333',
        medium: '#666666',
        light: '#888888',
        white: '#ffffff'
    },
    shadow: {
        light: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 8
        }
    }
};

const ResultsQuiz = ({ route, navigation }) => {
    const { userData } = useContext(UserContext);
    const { id_quiz, id_student } = route.params;
    const [quizResults, setQuizResults] = useState([]);
    const [quizDetails, setQuizDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const limit = 1;

    useEffect(() => {
        fetchQuizResults();
    }, [currentPage]);

    const handleBackToQuizList = () => {
        navigation.goBack();
    };

    const fetchQuizResults = async () => {
        try {
            setLoading(true);
            
            // Use the id_student from route params or from userData context
            const studentId = id_student || userData?.id_student;
            
            if (!studentId) {
                setError('Student ID not found. Please try again.');
                setLoading(false);
                return;
            }
            
            console.log(`Fetching quiz results for quiz ${id_quiz}, student ${studentId}, page ${currentPage}`);
            
            // Use the centralized API configuration
            const response = await apiClient.get(API_ENDPOINTS.QUIZ_RESULTS, {
                params: {
                    id_student: studentId,
                    id_quiz: id_quiz,
                    page: currentPage,
                    limit: limit
                }
            });
            
            // Alternative approach using apiRequest helper
            // const response = await apiRequest(
            //     'get',
            //     API_ENDPOINTS.QUIZ_RESULTS,
            //     null,
            //     {
            //         id_student: studentId,
            //         id_quiz: id_quiz,
            //         page: currentPage,
            //         limit: limit
            //     }
            // );
            
            console.log('Response received:', response.data);
            
            if (response.data && response.data.data && response.data.data.length > 0) {
                // Update state with the paginated data
                setQuizResults(response.data.data);
                
                // Set quiz details from the first attempt
                if (response.data.data[0].quiz) {
                    setQuizDetails(response.data.data[0].quiz);
                }
                
                // Update pagination info
                if (response.data.pagination) {
                    setTotalAttempts(response.data.pagination.totalAttempts);
                }
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
                <View style={styles.quizTitleContainer}>
                    <Text style={styles.quizTitle}>{quizDetails.title}</Text>
                    <View style={styles.quizTitleUnderline} />
                </View>
                <Text style={styles.quizDescription}>{quizDetails.description}</Text>
                <View style={styles.quizInfoRow}>
                    <View style={styles.quizInfoItem}>
                        <Icon name="clock-outline" size={18} color={QUIZ_THEME.primary} style={styles.infoIcon} />
                        <Text style={styles.quizInfoLabel}>Duration:</Text>
                        <Text style={styles.quizInfoValue}>{quizDetails.duration} min</Text>
                    </View>
                    <View style={styles.quizInfoItem}>
                        <Icon name="book-outline" size={18} color={QUIZ_THEME.primary} style={styles.infoIcon} />
                        <Text style={styles.quizInfoLabel}>Subject:</Text>
                        <Text style={styles.quizInfoValue}>{quizDetails.subject}</Text>
                    </View>
                    <View style={styles.quizInfoItem}>
                        <Icon name="refresh" size={18} color={QUIZ_THEME.primary} style={styles.infoIcon} />
                        <Text style={styles.quizInfoLabel}>Attempts:</Text>
                        <Text style={styles.quizInfoValue}>{totalAttempts}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderAttemptHeader = (attempt) => {
        const attemptDate = new Date(attempt.attempt_at).toLocaleString();
        const scoreColor = attempt.score >= 70 ? QUIZ_THEME.scoreColors.high : 
                          attempt.score >= 50 ? QUIZ_THEME.scoreColors.medium : 
                          QUIZ_THEME.scoreColors.low;
        
        // Determine score message based on score value
        const getScoreMessage = (score) => {
            if (score >= 70) return 'Great job!';
            if (score >= 50) return 'Good effort!';
            return 'Keep practicing!';
        };
        
        return (
            <View style={styles.attemptHeaderContainer}>
                <View style={styles.attemptHeaderTop}>
                    <View style={styles.attemptDateContainer}>
                        <Icon name="calendar-clock" size={18} color={QUIZ_THEME.primary} />
                        <Text style={styles.attemptDate}>{attemptDate}</Text>
                    </View>
                    
                    <View style={[styles.scoreContainer, { backgroundColor: scoreColor }]}>
                        <Text style={styles.scoreValue}>{attempt.score}%</Text>
                    </View>
                </View>
                <Text style={[styles.scoreMessage, { color: scoreColor }]}>
                    {getScoreMessage(attempt.score)}
                </Text>
            </View>
        );
    };

    const renderAnswerItem = ({ item }) => {
        return (
            <View style={[styles.answerRow, { backgroundColor: item.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(106, 90, 205, 0.05)' }]}>
                <View style={styles.questionNumberContainer}>
                    <Text style={styles.questionNumber}>Q{item.id_question}</Text>
                </View>
                <Text style={styles.answerText}>{item.student_answer_text}</Text>
                <View style={[styles.correctIndicator, { backgroundColor: item.correct ? QUIZ_THEME.accent : '#8677dd' }]}>
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
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    scrollIndicatorInsets={{ right: 1 }}
                    style={styles.answersList}
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
                    <Icon name="chevron-left" size={18} color={currentPage === 1 ? "#aaa" : QUIZ_THEME.text.white} style={{marginRight: 4}} />
                    <Text style={styles.pageButtonText}>Previous</Text>
                </TouchableOpacity>
                
                <Text style={styles.pageInfo}>Attempt {currentPage} of {totalPages || 1}</Text>
                
                <TouchableOpacity 
                    style={[styles.pageButton, currentPage >= totalPages && styles.disabledButton]}
                    onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                >
                    <Text style={styles.pageButtonText}>Next</Text>
                    <Icon name="chevron-right" size={18} color={currentPage >= totalPages ? "#aaa" : QUIZ_THEME.text.white} style={{marginLeft: 4}} />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <StatusBar backgroundColor={QUIZ_THEME.primary} barStyle="light-content" />
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color={QUIZ_THEME.primary} />
                    <Text style={styles.loadingText}>Loading your quiz results...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={QUIZ_THEME.primary} barStyle="light-content" />
                <View style={styles.errorContainer}>
                    <Icon name="alert-circle-outline" size={60} color={QUIZ_THEME.primary} />
                    <Text style={styles.errorTitle}>Oops!</Text>
                    <Text style={styles.error}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={fetchQuizResults}
                    >
                        <Icon name="refresh" size={18} color={QUIZ_THEME.text.white} style={{marginRight: 8}} />
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={QUIZ_THEME.primary} barStyle="light-content" />
            <LinearGradient
                colors={[QUIZ_THEME.primary, '#8677dd']}
                style={styles.headerContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity 
                        style={styles.backIconButton}
                        onPress={handleBackToQuizList}
                    >
                        <Icon name="arrow-left" size={24} color={QUIZ_THEME.text.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Quiz Results</Text>
                </View>
            </LinearGradient>
            
            <ScrollView 
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={true}
                scrollIndicatorInsets={{ right: 1 }}
            >
                <View style={styles.content}>
                    {renderQuizHeader()}
                    
                    {quizResults.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyTitle}>No Results Found</Text>
                            <Text style={styles.emptyText}>
                                We couldn't find any results for this quiz. Try taking the quiz first.
                            </Text>
                        </View>
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
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>QuizApp • Learn & Grow</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: QUIZ_THEME.background,
    },
    headerContainer: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: QUIZ_THEME.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...QUIZ_THEME.shadow.medium,
        marginBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIconButton: {
        position: 'absolute',
        left: 0,
        padding: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: QUIZ_THEME.text.white,
        textAlign: 'center',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    scrollContainer: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    quizHeaderContainer: {
        backgroundColor: QUIZ_THEME.cardBackground,
        borderRadius: 15,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: QUIZ_THEME.border,
        ...QUIZ_THEME.shadow.light,
    },
    quizTitleContainer: {
        marginBottom: 12,
    },
    quizTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: QUIZ_THEME.primary,
        marginBottom: 8,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    quizTitleUnderline: {
        height: 3,
        width: 60,
        backgroundColor: QUIZ_THEME.accent,
        borderRadius: 2,
        marginBottom: 12,
    },
    quizDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    quizInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f7',
        paddingTop: 16,
        flexWrap: 'wrap',
    },
    quizInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 8,
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
        backgroundColor: QUIZ_THEME.cardBackground,
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: QUIZ_THEME.border,
        ...QUIZ_THEME.shadow.light,
    },
    attemptHeaderContainer: {
        padding: 16,
        backgroundColor: 'rgba(106, 90, 205, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: QUIZ_THEME.border,
    },
    attemptHeaderTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    attemptTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    attemptDate: {
        fontSize: 14,
        color: '#666',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    scoreContainer: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    scoreValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    answersHeaderRow: {
        flexDirection: 'row',
        backgroundColor: QUIZ_THEME.primary,
        padding: 12,
    },
    answersHeaderCell: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    answerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: QUIZ_THEME.border,
        padding: 14,
        alignItems: 'center',
    },
    questionNumber: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    answerText: {
        flex: 3,
        fontSize: 14,
        color: '#333',
        paddingHorizontal: 8,
        lineHeight: 20,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
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
        backgroundColor: QUIZ_THEME.cardBackground,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: QUIZ_THEME.border,
        ...QUIZ_THEME.shadow.light,
    },
    pageButton: {
        backgroundColor: QUIZ_THEME.primary,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    disabledButton: {
        backgroundColor: '#d1d1e0',
    },
    pageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    pageInfo: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    backButton: {
        backgroundColor: QUIZ_THEME.primary,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 30,
        flexDirection: 'row',
        ...QUIZ_THEME.shadow.light,
    },
    backButtonText: {
        color: QUIZ_THEME.text.white,
        fontWeight: 'bold',
        fontSize: 16,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: QUIZ_THEME.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContent: {
        backgroundColor: QUIZ_THEME.cardBackground,
        padding: 30,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: QUIZ_THEME.border,
        ...QUIZ_THEME.shadow.light,
        width: width * 0.8,
    },
    loadingText: {
        marginTop: 16,
        color: '#6a5acd',
        fontSize: 16,
        fontWeight: '500',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6a5acd',
        marginBottom: 10,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    error: {
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        lineHeight: 24,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    retryButton: {
        backgroundColor: QUIZ_THEME.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...QUIZ_THEME.shadow.light,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    emptyContainer: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: QUIZ_THEME.cardBackground,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: QUIZ_THEME.border,
        ...QUIZ_THEME.shadow.light,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6a5acd',
        marginBottom: 10,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    },
    answersList: {
        maxHeight: 300,
    },
    footer: {
        padding: 16,
        backgroundColor: 'rgba(106, 90, 205, 0.1)',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: QUIZ_THEME.border,
    },
    footerText: {
        color: QUIZ_THEME.primary,
        fontSize: 14,
        fontWeight: '500',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
                includeFontPadding: false,
            }
        }),
    }
});

export default ResultsQuiz;
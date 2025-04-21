import React, { useState, useEffect, useContext } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ActivityIndicator, 
    FlatList, 
    TouchableOpacity, 
    SafeAreaView, 
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import { UserContext } from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, apiClient, apiRequest } from '../config/apiConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/appTheme';

const { width, height } = Dimensions.get('window');

// Theme constants for this screen with updated color scheme
const HISTORY_THEME = {
    primary: '#6a5acd', // Violet from logo
    accent: 'rgb(144 169 193)', // Blue-gray from welcome image
    green: '#4CAF50', // Green accent color
    background: '#f8f5ff', // Light violet background
    cardBackground: '#ffffff', // White card background
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
    }
};

const History = ({ navigation }) => {
    const { userData } = useContext(UserContext);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const limit = 5; // Number of items per page

    useEffect(() => {
        fetchHistory();
    }, [currentPage, userData]);

    // Update the fetchHistory function to use platform-aware API URL
    const fetchHistory = async () => {
        if (!userData?.id_student) {
            setError('User ID not found. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            // Get the authentication token
            const token = await AsyncStorage.getItem('token');
            
            // Use the centralized API configuration
            const response = await apiClient.get(API_ENDPOINTS.HISTORY, {
                params: {
                    id_student: userData.id_student,
                    page: currentPage,
                    limit: limit
                }
            });
            
            // Alternative approach using apiRequest helper
            // const response = await apiRequest(
            //     'get',
            //     API_ENDPOINTS.HISTORY,
            //     null,
            //     {
            //         id_student: userData.id_student,
            //         page: currentPage,
            //         limit: limit
            //     }
            // );
            
            if (response.data) {
                setHistoryData(response.data.data);
                setTotalAttempts(response.data.totale_attempts);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching history:', error.response?.data || error.message);
            setError('Failed to load quiz history. Please try again.');
            setLoading(false);
        }
    };

    const goToQuizResults = (id_quiz) => {
        navigation.navigate('ResultsQuiz', { id_quiz, id_student: userData.id_student });
    };

    const renderTableHeader = () => {
        return (
            <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { flex: 0.7 }]}>Quiz</Text>
                <Text style={[styles.headerCell, { flex: 2 }]}>Title</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Date</Text>
                <Text style={[styles.headerCell, { flex: 0.8 }]}>Score</Text>
            </View>
        );
    };

    // Add a new state for filtering
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'passed', 'failed'
    
    // REMOVE THIS FIRST renderItem FUNCTION
    // const renderItem = ({ item }) => {
    //     // Format the date
    //     const attemptDate = new Date(item.attempt_at).toLocaleDateString();
    //     
    //     // Determine score color based on value
    //     const scoreColor = item.score >= 70 ? '#4CAF50' : item.score >= 50 ? '#FF9800' : '#F44336';
    //     
    //     return (
    //         <TouchableOpacity 
    //             style={styles.tableRow} 
    //             onPress={() => goToQuizResults(item.id_quiz)}
    //             activeOpacity={0.7}
    //         >
    //             <Text style={[styles.cell, { flex: 0.7 }]}>{item.id_quiz}</Text>
    //             <Text style={[styles.cell, { flex: 2, textAlign: 'left', paddingLeft: 10 }]} numberOfLines={1} ellipsizeMode="tail">
    //                 {item.quizzes?.title || 'Unknown'}
    //             </Text>
    //             <Text style={[styles.cell, { flex: 1 }]}>{attemptDate}</Text>
    //             <View style={[styles.scoreCell, { flex: 0.8 }]}>
    //                 <Text style={[styles.scoreText, { color: scoreColor }]}>
    //                     {item.score}%
    //                 </Text>
    //             </View>
    //         </TouchableOpacity>
    //     );
    // };

    const renderPagination = () => {
        const totalPages = Math.ceil(totalAttempts / limit);
        
        return (
            <View style={styles.paginationContainer}>
                <TouchableOpacity 
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                    onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    activeOpacity={0.7}
                >
                    <Icon name="chevron-left" size={20} color={currentPage === 1 ? "#aaa" : "#fff"} />
                    <Text style={[styles.pageButtonText, currentPage === 1 && styles.disabledButtonText]}>Previous</Text>
                </TouchableOpacity>
                
                <View style={styles.pageInfoContainer}>
                    <Text style={styles.pageInfo}>Page {currentPage} of {totalPages || 1}</Text>
                </View>
                
                <TouchableOpacity 
                    style={[styles.pageButton, currentPage >= totalPages && styles.disabledButton]}
                    onPress={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= totalPages}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.pageButtonText, currentPage >= totalPages && styles.disabledButtonText]}>Next</Text>
                    <Icon name="chevron-right" size={20} color={currentPage >= totalPages ? "#aaa" : "#fff"} />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <StatusBar backgroundColor="rgb(144 169 193)" barStyle="light-content" />
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color={HISTORY_THEME.primary} />
                    <Text style={styles.loadingText}>Loading your quiz history...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar 
                backgroundColor="rgb(144 169 193)" 
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
            />
                <View style={styles.errorContainer}>
                    <Icon name="alert-circle-outline" size={60} color={HISTORY_THEME.primary} />
                    <Text style={styles.errorTitle}>Oops!</Text>
                    <Text style={styles.error}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={fetchHistory}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Add a filter function for quiz results
    const getFilteredData = () => {
        if (filterStatus === 'all') return historyData;
        if (filterStatus === 'passed') return historyData.filter(item => item.score >= 50);
        if (filterStatus === 'failed') return historyData.filter(item => item.score < 50);
        return historyData;
    };

    // Redesigned filter buttons with improved visual feedback
    const renderFilterOptions = () => {
        return (
            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter by:</Text>
                <View style={styles.filterButtonsRow}>
                    <TouchableOpacity 
                        style={[styles.filterButton, filterStatus === 'all' && styles.filterButtonActive]}
                        onPress={() => setFilterStatus('all')}
                    >
                        <Icon 
                            name="format-list-bulleted" 
                            size={16} 
                            color={filterStatus === 'all' ? HISTORY_THEME.text.white : HISTORY_THEME.primary} 
                            style={{marginRight: 6}}
                        />
                        <Text style={[styles.filterButtonText, filterStatus === 'all' && styles.filterButtonTextActive]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.filterButton, filterStatus === 'passed' && styles.filterButtonActive]}
                        onPress={() => setFilterStatus('passed')}
                    >
                        <Icon 
                            name="check-circle" 
                            size={16} 
                            color={filterStatus === 'passed' ? HISTORY_THEME.text.white : HISTORY_THEME.green} 
                            style={{marginRight: 6}}
                        />
                        <Text style={[styles.filterButtonText, filterStatus === 'passed' && styles.filterButtonTextActive]}>Passed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.filterButton, filterStatus === 'failed' && styles.filterButtonActive]}
                        onPress={() => setFilterStatus('failed')}
                    >
                        <Icon 
                            name="close-circle" 
                            size={16} 
                            color={filterStatus === 'failed' ? HISTORY_THEME.text.white : HISTORY_THEME.scoreColors.low} 
                            style={{marginRight: 6}}
                        />
                        <Text style={[styles.filterButtonText, filterStatus === 'failed' && styles.filterButtonTextActive]}>Failed</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // Redesigned renderItem function with improved visual appeal
    const renderItem = ({ item }) => {
        // Format the date
        const attemptDate = new Date(item.attempt_at).toLocaleDateString(
            undefined, 
            { year: 'numeric', month: 'short', day: 'numeric' }
        );
        
        // Determine score color based on value
        const scoreColor = item.score >= 70 ? HISTORY_THEME.scoreColors.high : 
                          item.score >= 50 ? HISTORY_THEME.scoreColors.medium : 
                          HISTORY_THEME.scoreColors.low;
        
        // Determine left border color based on score
        const borderColor = scoreColor;
        
        return (
            <TouchableOpacity 
                style={[styles.quizCard, { borderLeftColor: borderColor }]} 
                onPress={() => goToQuizResults(item.id_quiz)}
                activeOpacity={0.7}
            >
                <View style={styles.quizCardHeader}>
                    <Text style={styles.quizTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.quizzes?.title || 'Unknown Quiz'}
                    </Text>
                    <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '20', borderColor: scoreColor + '50' }]}>
                        <Text style={[styles.scoreText, { color: scoreColor }]}>
                            {item.score}%
                        </Text>
                    </View>
                </View>
                
                <View style={styles.quizCardDetails}>
                    <View style={styles.detailItem}>
                        <Icon name="calendar" size={16} color={HISTORY_THEME.text.medium} />
                        <Text style={styles.detailText}>{attemptDate}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="numeric" size={16} color={HISTORY_THEME.text.medium} />
                        <Text style={styles.detailText}>Quiz #{item.id_quiz}</Text>
                    </View>
                </View>
                
                <View style={styles.quizCardFooter}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Icon name="chevron-right" size={18} color={HISTORY_THEME.primary} />
                </View>
            </TouchableOpacity>
        );
    };

    // Update the return statement to move pagination above the FlatList
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="rgb(144 169 193)" barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
            
            <LinearGradient
                colors={[HISTORY_THEME.primary, HISTORY_THEME.accent]}
                style={styles.headerContainer}
            >
                <Text style={styles.title}>My Quiz History</Text>
                <Text style={styles.subtitle}>Track your progress and performance</Text>
            </LinearGradient>
            
            {historyData.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="history" size={80} color={HISTORY_THEME.primary} />
                    <Text style={styles.emptyTitle}>No History Yet</Text>
                    <Text style={styles.emptyText}>
                        You haven't completed any quizzes yet. Take a quiz to see your results here.
                    </Text>
                    <TouchableOpacity 
                        style={styles.takeQuizButton}
                        onPress={() => navigation.navigate('TakeQuiz')}
                    >
                        <Text style={styles.takeQuizButtonText}>Take a Quiz</Text>
                        <Icon name="arrow-right" size={16} color="#fff" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    {renderFilterOptions()}
                    
                    {/* Pagination moved to the top */}
                    {renderPagination()}
                    
                    <FlatList
                        data={getFilteredData()}
                        renderItem={renderItem}
                        keyExtractor={(item) => `${item.id_attempt}`}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={true}
                        scrollIndicatorInsets={{ right: 1 }}
                    />
                </View>
            )}
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>TRIVIO QUIZ</Text>
                <Text style={styles.footerSubtext}>Learning made interactive</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: HISTORY_THEME.background,
        paddingTop: Platform.OS === 'ios' ? 50 : 0,
    },
    headerContainer: {
        padding: SPACING.md,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xl,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 10,
            },
            web: {
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
            }
        }),
    },
    title: {
        fontSize: TYPOGRAPHY.sizes.xxl,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: HISTORY_THEME.text.white,
        textAlign: 'center',
        textShadow: '-1px 1px 10px rgba(0, 0, 0, 0.75)',
        ...Platform.select({
            ios: {
                fontFamily: TYPOGRAPHY.fontFamily,
            },
            android: {
                fontFamily: TYPOGRAPHY.fontFamily,
                includeFontPadding: false,
            }
        }),
    },
    subtitle: {
        fontSize: TYPOGRAPHY.sizes.regular,
        color: HISTORY_THEME.text.white,
        textAlign: 'center',
        marginTop: SPACING.sm,
        opacity: 0.9,
        ...Platform.select({
            ios: {
                fontFamily: TYPOGRAPHY.fontFamily,
            },
            android: {
                fontFamily: TYPOGRAPHY.fontFamily,
                includeFontPadding: false,
            }
        }),
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    filterContainer: {
        marginBottom: SPACING.md,
        backgroundColor: HISTORY_THEME.cardBackground,
        borderRadius: 16,
        padding: SPACING.md,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
            },
            android: {
                elevation: 3,
            },
            web: {
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
            }
        }),
    },
    filterLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    filterButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f7',
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filterButtonActive: {
        backgroundColor: HISTORY_THEME.primary,
        transform: [{ scale: 1.05 }],
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            }
        }),
    },
    filterButtonText: {
        color: HISTORY_THEME.text.medium,
        fontWeight: TYPOGRAPHY.weights.medium,
        fontSize: TYPOGRAPHY.sizes.medium,
        ...Platform.select({
            ios: {
                fontFamily: TYPOGRAPHY.fontFamily,
            },
            android: {
                fontFamily: TYPOGRAPHY.fontFamily,
                includeFontPadding: false,
            }
        }),
    },
    filterButtonTextActive: {
        color: HISTORY_THEME.text.white,
        fontWeight: TYPOGRAPHY.weights.bold,
    },
    quizCard: {
        backgroundColor: HISTORY_THEME.cardBackground,
        borderRadius: 16,
        marginBottom: 16,
        padding: SPACING.md,
        borderLeftWidth: 4,
        borderLeftColor: HISTORY_THEME.accent,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.15)',
            }
        }),
    },
    quizTitle: {
        fontSize: TYPOGRAPHY.sizes.large,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: HISTORY_THEME.text.dark,
        flex: 1,
        ...Platform.select({
            ios: {
                fontFamily: TYPOGRAPHY.fontFamily,
            },
            android: {
                fontFamily: TYPOGRAPHY.fontFamily,
                includeFontPadding: false,
            }
        }),
        letterSpacing: 0.2,
    },
    scoreBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs + 2,
        borderRadius: 20,
        marginLeft: SPACING.sm,
        borderWidth: 1,
    },
    scoreText: {
        fontWeight: TYPOGRAPHY.weights.bold,
        fontSize: TYPOGRAPHY.sizes.medium,
        letterSpacing: 0.5,
    },
    quizCardDetails: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    detailText: {
        fontSize: TYPOGRAPHY.sizes.medium,
        color: HISTORY_THEME.text.medium,
        marginLeft: SPACING.xs + 2,
        fontWeight: TYPOGRAPHY.weights.medium,
    },
    quizCardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: SPACING.sm,
        marginTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f7',
    },
    viewDetailsText: {
        fontSize: TYPOGRAPHY.sizes.medium,
        color: HISTORY_THEME.primary,
        fontWeight: TYPOGRAPHY.weights.medium,
        marginRight: SPACING.xs,
        textDecorationLine: 'underline',
        textDecorationColor: 'transparent',
    },
    takeQuizButton: {
        backgroundColor: HISTORY_THEME.green,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md - 4,
        paddingHorizontal: SPACING.lg,
        borderRadius: 12,
        marginTop: SPACING.lg,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
            },
            android: {
                elevation: 5,
            },
            web: {
                boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.2)',
            }
        }),
    },
    takeQuizButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Add these styles to your StyleSheet
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    pageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: HISTORY_THEME.primary,
        paddingVertical: SPACING.sm + 2,
        paddingHorizontal: SPACING.md,
        borderRadius: 25,
        minWidth: 120,
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
            }
        }),
    },
    pageButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
        marginHorizontal: 5,
    },
    disabledButton: {
        backgroundColor: '#f0f0f7',
        ...Platform.select({
            ios: {
                shadowOpacity: 0.05,
            },
            android: {
                elevation: 1,
            },
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            }
        }),
    },
    disabledButtonText: {
        color: '#aaa',
    },
    pageInfoContainer: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
            }
        }),
    },
    pageInfo: {
        color: '#666',
        fontWeight: '500',
        fontSize: 14,
    },
    footer: {
        padding: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(106, 90, 205, 0.1)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(106, 90, 205, 0.2)',
        paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md,
        marginTop: SPACING.md,
    },
    footerText: {
        fontSize: TYPOGRAPHY.sizes.large,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: HISTORY_THEME.primary,
        textAlign: 'center',
        letterSpacing: 1,
        ...Platform.select({
            ios: {
                fontFamily: TYPOGRAPHY.fontFamily,
            },
            android: {
                fontFamily: TYPOGRAPHY.fontFamily,
                includeFontPadding: false,
            }
        }),
    },
    footerSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
        fontStyle: 'italic',
        letterSpacing: 0.5,
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: 'rgba(144, 169, 193, 0.08)',
        borderRadius: 12,
        overflow: 'hidden',
    },
});

export default History;
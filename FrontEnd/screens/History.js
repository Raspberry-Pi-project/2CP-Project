import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { UserContext } from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            
            const response = await axios.get('http://localhost:3000/students/history', {
                params: {
                    id_student: userData.id_student,
                    page: currentPage,
                    limit: limit
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
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
                <Text style={[styles.headerCell, { flex: 1 }]}>Quiz</Text>
                <Text style={[styles.headerCell, { flex: 2 }]}>Title</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Date</Text>
                <Text style={[styles.headerCell, { flex: 1 }]}>Score</Text>
            </View>
        );
    };

    const renderItem = ({ item }) => {
        // Format the date
        const attemptDate = new Date(item.created_at).toLocaleDateString();
        
        return (
            <TouchableOpacity 
                style={styles.tableRow} 
                onPress={() => goToQuizResults(item.id_quiz)}
            >
                <Text style={[styles.cell, { flex: 1 }]}>{item.id_quiz}</Text>
                <Text style={[styles.cell, { flex: 2 }]}>{item.quizzes?.title || 'Unknown'}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>{attemptDate}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>{item.score || 'N/A'}</Text>
            </TouchableOpacity>
        );
    };

    const renderPagination = () => {
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
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading quiz history...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My History of Quiz</Text>
            
            {historyData.length === 0 ? (
                <Text style={styles.noDataText}>No quiz history found.</Text>
            ) : (
                <View style={styles.tableContainer}>
                    {renderTableHeader()}
                    <FlatList
                        data={historyData}
                        renderItem={renderItem}
                        keyExtractor={(item) => `${item.id_attempt}`}
                        contentContainerStyle={styles.listContent}
                    />
                    {renderPagination()}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    tableContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#4a6da7',
        padding: 12,
    },
    headerCell: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        padding: 12,
    },
    cell: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
    },
    listContent: {
        flexGrow: 1,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
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
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#666',
    }
});

export default History;
import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper';
import { UserContext } from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Add the formatTime function to convert seconds to MM:SS format
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const StartResponse = ({ route, navigation }) => {
  const { userData } = useContext(UserContext);
  const { selectedQuiz } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizDetails, setQuizDetails] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [textAnswers, setTextAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timer, setTimer] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Constants for pagination
  const questionsPerPage = 1;
  
  // Computed values
  const currentQuestions = quizDetails?.questions?.slice(
    (currentPage - 1) * questionsPerPage, 
    currentPage * questionsPerPage
  ) || [];
  
  const totalPages = quizDetails?.questions?.length 
    ? Math.ceil(quizDetails.questions.length / questionsPerPage) 
    : 1;

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuizDetails(selectedQuiz.id_quiz);
    }
  }, [selectedQuiz]);

  useEffect(() => {
    if (timeLeft > 0 && quizStarted) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            // Handle time up outside the state update
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setTimer(timerId);
      
      return () => {
        clearInterval(timerId);
        setTimer(null);  // Add this line
        //setShowConfirmDialog(false);  // Add dialog state reset
      };
    }
  }, [quizStarted]); // Only depend on quizStarted, not timeLeft

  const fetchQuizDetails = async (quizId) => {
    try {
      setLoading(true);
      
      // Get the authentication token
      const token = await AsyncStorage.getItem('token');
      
      console.log('Fetching quiz details for quiz ID:', quizId, 'and student ID:', userData.id_student);
      
      const response = await axios.get(`http://localhost:3000/students/getQuizDetails/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Quiz details received:', response.data);
      setQuizDetails(response.data);
      setCurrentPage(1); // Reset to first page when loading a new quiz
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      
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
    }
  };

  const startQuiz = async (quizId) => {
    try {
      setLoading(true);
      
      // Get the authentication token
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.post('http://localhost:3000/students/startAttempt', {
        id_student: userData.id_student,
        id_quiz: quizId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Start attempt response:', response.data);
      setCurrentAttempt(response.data.newAttempt);
      setQuizStarted(true);
      setCurrentPage(1);
      setAnswers({});
      setTextAnswers({});
      
      // Set timer based on quiz duration (convert minutes to seconds)
      if (quizDetails && quizDetails.duration) {
        setTimeLeft(quizDetails.duration * 60);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error starting quiz:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        if (error.response.status === 400 && error.response.data.error === "attempt limit reached") {
          setError('You have reached the maximum number of attempts for this quiz.');
        } else {
          setError(`Server error (${error.response.status}): ${error.response.data.error || 'Unknown error'}`);
        }
      } else if (error.request) {
        setError('No response received from server. Please check your connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
      
      setLoading(false);
    }
  };

  const handleAnswerSelection = (questionId, optionId, isMultipleChoice) => {
    if (isMultipleChoice) {
      // For multiple choice questions (checkboxes)
      setAnswers(prevAnswers => {
        const currentAnswers = prevAnswers[questionId] || [];
        
        if (currentAnswers.includes(optionId)) {
          // Remove if already selected
          return {
            ...prevAnswers,
            [questionId]: currentAnswers.filter(id => id !== optionId)
          };
        } else {
          // Add if not selected
          return {
            ...prevAnswers,
            [questionId]: [...currentAnswers, optionId]
          };
        }
      });
    } else {
      // For single choice questions (radio buttons)
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: [optionId]
      }));
    }
  };

  const handleTextAnswerChange = (questionId, text) => {
    setTextAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: text
    }));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleTimeUp = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    // Force close dialog before showing time-up alert
    setShowConfirmDialog(false);
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      Alert.alert(
        "Time's Up!",
        "Your time for this quiz has ended. Your answers will be submitted automatically.",
        [{ text: "OK", onPress: submitQuiz }]
      );
    }, 100);
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      setShowConfirmDialog(false);   ///****************** */
      // Get the authentication token
      const token = await AsyncStorage.getItem('token');
      console.log('Submitting answers for attempt tkn:', token);
      // Process multiple choice and single choice answers
      const formattedAnswers = [];
      
      // Process each question
      quizDetails.questions.forEach(question => {
        const questionId = question.id_question;
        
        if (question.question_type === 'QCM' || question.question_type === 'QCU') {
          // For multiple choice or single choice questions
          const selectedOptions = answers[questionId] || [];
          
          // Check if the answer is correct by comparing with correct options
          /*const correctOptions = question.answers
            .filter(option => option.correct)
            .map(option => option.id_answer);*/
            const correctOptions = question.answers
            .filter(answer => answer.correct === 1)
            .map(answer => answer.id_answer);
          // For QCM, the answer is correct if the selected option is the correct one
          // For QCS, the answer is correct if all correct options are selected and no incorrect ones
          let isCorrect = 0;
          
          if (question.question_type === 'QCM') {
            // For single choice, check if the selected option is correct
            isCorrect = selectedOptions.length === 1 && correctOptions.includes(selectedOptions[0])? 1 : 0;
          } else {
            // For multiple choice, check if selected options match exactly with correct options
            isCorrect = 
              selectedOptions.length === correctOptions.length && 
              selectedOptions.every(option => correctOptions.includes(option))?1:0;
          }
          
          // Create answer text from selected options
          const selectedAnswerText = question.answers
            .filter(option => selectedOptions.includes(option.id_answer))
            .map(option => option.answer_text)
            .join(', ');
          
          formattedAnswers.push({
            id_question: questionId,
            student_answer_text: selectedAnswerText || 'No answer provided',
            correct: isCorrect
          });
        } else if (question.question_type === 'QS') {
          // For text questions
          const textAnswer = textAnswers[questionId] || '';
          
          // For text questions, we would need a more sophisticated way to check correctness
          // Here we're just checking if the answer is not empty
          const isCorrect = textAnswer.trim().length > 0 ?1:0;
          
          formattedAnswers.push({
            id_question: questionId,
            student_answer_text: textAnswer || 'No answer provided',
            correct: isCorrect
          });
        }
      });
      
      // Calculate score as percentage of correct answers
      const correctCount = formattedAnswers.filter(answer => answer.correct).length;
      const totalQuestions = formattedAnswers.length;
      const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
      
      console.log('Submitting answers:', {
        id_attempt: currentAttempt.id_attempt,
        answers: formattedAnswers,
        score: scorePercentage
      });
      
      const response = await axios.post('http://localhost:3000/students/submitAnswers', {
        id_attempt: currentAttempt.id_attempt,
        answers: formattedAnswers,
        score: scorePercentage
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Submit answers response:', response.data);
      
      // Create results object
      const results = {
        score: scorePercentage,
        correct_answers: correctCount,
        total_questions: totalQuestions,
        answers: formattedAnswers.map((answer, index) => {
          const question = quizDetails.questions.find(q => q.id_question === answer.id_question);
          return {
            question_text: question ? question.question_text : `Question ${index + 1}`,
            student_answer: answer.student_answer_text,
            is_correct: answer.correct
          };
        })
      };
      
      setQuizResults(results);
      setQuizCompleted(true);
      setQuizStarted(false);
      
      if (timer) {
        clearInterval(timer);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      
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
    }
  };

 /* const resetQuiz = () => {
    navigation.goBack();
  };*/
  /*const resetQuiz = () => {
    navigation.goBack();
    navigation.setParams({
      refreshQuizzes: true,
      timestamp: new Date().getTime(),
      returnCode: 'QUIZ_CANCELLED'
    });
  };*/
  /*const resetQuiz = () => {
    // Pass parameters directly to the goBack method
    navigation.navigate({
      name: route.params?.source || 'QuizList',
      params: {
        refreshQuizzes: true,
        timestamp: new Date().getTime(),
        returnCode: 'QUIZ_CANCELLED'
      },
      merge: true
    });
  };*/
  /*const resetQuiz = () => {
    // Simply go back to the previous screen
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If we can't go back, navigate to a known screen in your app
      navigation.navigate('Home');
    }
  };*/
  const resetQuiz = () => {
    // Go back to the previous screen or navigate to the main tabs
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Navigate to the main tabs and then to the TakeQuiz tab
      navigation.navigate('MainTabs', {
        screen: 'TakeQuiz',
        params: {
          refreshQuizzes: true,
          timestamp: new Date().getTime(),
          returnCode: quizCompleted ? 'QUIZ_COMPLETED' : 'QUIZ_CANCELLED'
        }
      });
    }
  };

  const renderQuizDetails = () => {
    if (!quizDetails) return null;
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{quizDetails.title}</Text>
        <Text style={styles.description}>{quizDetails.description}</Text>
        
        <View style={styles.quizInfoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Duration:</Text>
            <Text style={styles.infoValue}>{quizDetails.duration} minutes</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Subject:</Text>
            <Text style={styles.infoValue}>{quizDetails.subject}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Questions:</Text>
            <Text style={styles.infoValue}>{quizDetails.questions?.length || 0}</Text>
          </View>
        </View>
        
        <Text style={styles.instructions}>
          This quiz contains {quizDetails.questions?.length || 0} questions. Read each question carefully and select the correct answer(s).
          Once you start the quiz, you will have {quizDetails.duration} minutes to complete it.
        </Text>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => startQuiz(quizDetails.id_quiz)}
        >
          <Text style={styles.startButtonText}>Start Quiz</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={resetQuiz}
        >
          <Text style={styles.backButtonText}>Back to Quiz List</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const ConfirmDialog = React.memo(({ visible, onCancel, onConfirm }) => {
    if (!visible) return null;
    
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          // Prevent automatic closing on back button press
          console.log('Modal request close - prevented automatic closing');
        }}
        useNativeDriver={false}
        // Add animationConfig to explicitly disable native driver
        animationConfig={{ useNativeDriver: false }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Quiz</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to submit your answers? You cannot change them after submission.
            </Text>
            <View style={styles.modalButtons}>
            <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onConfirm}
              >
                <Text style={styles.confirmButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }, (prevProps, nextProps) => {
    // Only re-render when visibility actually changes
    return prevProps.visible === nextProps.visible;
  });

  const renderQuizQuestions = () => {
    if (!quizDetails || !currentQuestions || currentQuestions.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.error}>No questions available for this quiz.</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={resetQuiz}
          >
            <Text style={styles.backButtonText}>Back to Quiz List</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <>
      <View style={styles.container}>
          <View style={styles.quizHeader}>
          <Text style={styles.questionCounter}>
            Page {currentPage} of {totalPages}
          </Text>
          <Text style={styles.timer}>Time Left: {formatTime(timeLeft)}</Text>
        </View>
        
        <ScrollView style={styles.questionsContainer}>
          {currentQuestions.map((question, index) => {
            const questionNumber = index + 1 + (currentPage - 1) * questionsPerPage;
            const isMultipleChoice = question.question_type === 'QCU';
            const isTextQuestion = question.question_type === 'QS';
            const selectedAnswers = answers[question.id_question] || [];
            const textAnswer = textAnswers[question.id_question] || '';
            
            return (
              <View key={question.id_question} style={styles.questionBlock}>
                <Text style={styles.questionText}>
                  {questionNumber}. {question.question_text}
                </Text>
                
                {isTextQuestion ? (
                  // Text input for text questions
                  <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={4}
                    placeholder="Type your answer here..."
                    value={textAnswer}
                    onChangeText={(text) => handleTextAnswerChange(question.id_question, text)}
                  />
                ) : (
                  // Options for multiple choice questions
                  question.answers.map(option => (
                    <View key={option.id_answer} style={styles.optionContainer}>
                      {isMultipleChoice ? (
                        // Checkbox for multiple choice questions (QCS)
                        <View style={styles.optionRow}>
                          <Checkbox
                            status={selectedAnswers.includes(option.id_answer) ? 'checked' : 'unchecked'}
                            onPress={() => handleAnswerSelection(
                              question.id_question,
                              option.id_answer,
                              true
                            )}
                            color="#4a6da7"
                          />
                          <Text style={styles.optionText}>{option.answer_text}</Text>
                        </View>
                      ) : (
                        // Radio button for single choice questions (QCM)
                        <View style={styles.optionRow}>
                          <RadioButton
                            value={option.id_answer.toString()}
                            status={selectedAnswers.includes(option.id_answer) ? 'checked' : 'unchecked'}
                            onPress={() => handleAnswerSelection(
                              question.id_question,
                              option.id_answer,
                              false
                            )}
                            color="#4a6da7"
                          />
                          <Text style={styles.optionText}>{option.answer_text}</Text>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            );
          })}
        </ScrollView>
        
        <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        {currentPage < totalPages ? (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNextPage}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
           style={styles.submitButton}
           onPress={() => setShowConfirmDialog(true)}
         >
          <Text style={styles.submitButtonText}>Submit Quiz</Text>
        </TouchableOpacity>
        )}
      </View>
      
      </View>
      {showConfirmDialog && (
        <ConfirmDialog 
          visible={true}
          onCancel={() => {
            console.log('Cancelling quiz submission');
            setShowConfirmDialog(false);
          }}
          onConfirm={() => {
            console.log('Confirming quiz submission');
            setShowConfirmDialog(false);
            submitQuiz();
          }}
        />
      )}
      </>
    );
  };


  const renderQuizResults = () => {
    if (!quizResults) {
      return (
        <View style={styles.container}>
          <Text style={styles.error}>No results available. Please try again.</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={resetQuiz}
          >
            <Text style={styles.backButtonText}>Back to Quiz List</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Results</Text>
        
        <View style={styles.resultsSummary}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{quizResults.score}%</Text>
          </View>
          <Text style={styles.scoreText}>Your Score</Text>
          <Text style={styles.correctAnswers}>
            {quizResults.correct_answers} correct out of {quizResults.total_questions} questions
          </Text>
          
          {quizResults.score >= 70 ? (
            <Text style={styles.feedbackText}>Great job! You passed the quiz.</Text>
          ) : (
            <Text style={styles.feedbackTextWarning}>You might want to review the material and try again.</Text>
          )}
        </View>
        
        <Text style={styles.sectionTitle}>Detailed Results</Text>
        
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Q#</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Question</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Your Answer</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Result</Text>
          </View>
          
          <FlatList
            data={quizResults.answers}
            keyExtractor={(item, index) => `result-${index}`}
            renderItem={({ item, index }) => (
              <View style={[
                styles.tableRow,
                item.is_correct ? styles.correctRow : styles.incorrectRow
              ]}>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={2}>
                  {item.question_text}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={2}>
                  {item.student_answer}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }, item.is_correct ? styles.correctText : styles.incorrectText]}>
                  {item.is_correct ? '✓ Correct' : '✗ Incorrect'}
                </Text>
              </View>
            )}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={resetQuiz}
          >
            <Text style={styles.backButtonText}>Back to Quiz List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.reviewButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.reviewButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderErrorView = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchQuizDetails(selectedQuiz.id_quiz)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={resetQuiz}
        >
          <Text style={styles.backButtonText}>Back to Quiz List</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6da7" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return renderErrorView();
  }

  if (quizCompleted) {
    return renderQuizResults();
  }

  if (quizStarted) {
    return renderQuizQuestions();
  }

  return renderQuizDetails();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  quizInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#555',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionCounter: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  questionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 450,
  },
  questionBlock: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
    fontWeight: '500',
  },
  optionContainer: {
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4a6da7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  correctAnswers: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '500',
    marginTop: 5,
  },
  feedbackTextWarning: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '500',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 350,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a6da7',
    padding: 12,
  },
  tableHeaderCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 12,
  },
  correctRow: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
  },
  incorrectRow: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  tableCell: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  correctText: {
    color: '#27ae60',
    fontWeight: '500',
  },
  incorrectText: {
    color: '#e74c3c',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#27ae60',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});

export default StartResponse;
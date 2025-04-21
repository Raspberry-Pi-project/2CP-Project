import React, { useState, useEffect, useContext, useRef } from 'react';
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
  Animated,
  Platform,
} from 'react-native';
import { animationConfig } from '../components/AnimationConfig';
import { RadioButton, Checkbox } from 'react-native-paper';
import { UserContext } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmDialog from '../components/ConfirmDialog';
import { API_ENDPOINTS, apiClient, apiRequest } from '../config/apiConfig';
import axios from 'axios';
// Add the formatTime function to convert seconds to MM:SS format
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const StartResponse = ({ route, navigation }) => {
  const { userData } = useContext(UserContext);
  const { selectedQuiz } = route.params;
  // Add animation value ref
  const animationValue = useRef(new Animated.Value(0)).current;

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
  const [textSaveTimeout, setTextSaveTimeout] = useState(null);
  
  
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
//////////////////////////////////////////////////////
// Add this function to trigger the animation
const startAnimation = () => {
  // Reset animation value
  animationValue.setValue(0);
  
  // Start the animation
  Animated.timing(animationValue, {
    toValue: 1,
    duration: 300,
    useNativeDriver: false, // Explicitly set to false
    ...animationConfig,
  }).start();
};
/////////////////////////////////////////////////
  useEffect(() => {
    if (selectedQuiz) {
      fetchQuizDetails(selectedQuiz.id_quiz);
    }
  }, [selectedQuiz]);

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuizDetails(selectedQuiz.id_quiz);
    }
  }, [selectedQuiz]);

  useEffect(() => {
    if (quizStarted) {
      startAnimation();
      
      // Set up timer when quiz starts
      if (quizDetails && quizDetails.duration) {
        setTimeLeft(quizDetails.duration * 60);
        
        // Create timer that updates every second
        const intervalId = setInterval(() => {
          setTimeLeft(prevTime => {
            if (prevTime <= 1) {
              clearInterval(intervalId);
              handleTimeUp();
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
        
        setTimer(intervalId);
        
        // Clean up timer when component unmounts or quiz ends
        return () => {
          if (intervalId) {
            clearInterval(intervalId);
          }
        };
      }
    }
  }, [quizStarted]); // Only depend on quizStarted, not timeLeft

  const fetchQuizDetails = async (quizId) => {
    try {
      setLoading(true);
      
      // Get the authentication token
      const token = await AsyncStorage.getItem('token');
      
      console.log('Fetching quiz details for quiz ID:', quizId, 'and student ID:', userData.id_student);
      
      // Use the apiRequest function from apiConfig.js
      const response = await apiRequest(
        'get',
        `${API_ENDPOINTS.QUIZ_DETAILS}/${quizId}`,
        null,
        { id_student: userData.id_student }
      );
      
      console.log('Quiz details received:', response);
      setQuizDetails(response);
  
      // Check if student can attempt this quiz
      if (response.attemptsInfo) {
        const { canAttempt, remainingAttempts, successfulAttempts } = response.attemptsInfo;
        
        if (!canAttempt) {
          setError(`You have reached the maximum number of attempts (${response.nb_attempts}) for this quiz.`);
        } else if (remainingAttempts === 0 && successfulAttempts > 0) {
          setError(`You have already completed this quiz successfully.`);
        }
      }
  
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
//////////////////////////////////////////////////////////////////

// Add a new function to save the current answer
// Update the saveCurrentAnswer function to properly format answers
  // Update the saveCurrentAnswer function to use the centralized API
  const saveCurrentAnswer = async (questionId) => {
    if (!currentAttempt || !questionId) {
      console.error('Cannot save answer: missing attempt or question ID');
      return;
    }
    
    try {
      const question = quizDetails.questions.find(q => q.id_question === questionId);
      
      if (!question) {
        console.error(`Question with ID ${questionId} not found`);
        return;
      }
      
      // Get the current state of answers directly to avoid stale state issues
      const currentAnswers = answers[questionId] || [];
      console.log(`Current answers for question ${questionId}:`, currentAnswers);
      
      let answerText = '';
      
      // Format answer text based on question type
      if (question.question_type === 'QS') {
        // For text questions, use the text answer directly
        answerText = textAnswers[questionId] || '';
        console.log(`Saving QS text answer for question ${questionId}: "${answerText}"`);
      } else if (question.question_type === 'QCM') {
        // For multiple choice questions
        if (currentAnswers.length > 0) {
          answerText = currentAnswers.join(',');
          console.log(`Saving QCM answer for question ${questionId} with IDs: ${answerText}`);
        } else {
          console.log(`No answers selected for QCM question ${questionId}`);
          return null; // Exit early if no answers selected
        }
      } else if (question.question_type === 'QCU') {
        // For single choice questions
        if (currentAnswers.length > 0) {
          // For QCU, we should only have one answer, but just in case take the first one
          answerText = currentAnswers[0].toString();
          console.log(`Saving QCU answer for question ${questionId} with ID: ${answerText}`);
        } else {
          console.log(`No answer selected for QCU question ${questionId}`);
          return null; // Exit early if no answer selected
        }
      }
      
      // Only send the request if we have an answer to save
      if (answerText.trim() !== '') {
        console.log(`Saving answer for question ${questionId}: "${answerText}"`);
        
        // Use the centralized API request helper
        const response = await apiRequest(
          'post',
          `${API_ENDPOINTS.API_BASE_URL}/students/saveAnswer`,
          {
            id_attempt: currentAttempt.id_attempt,
            id_question: questionId,
            student_answer_text: answerText
          }
        );
        
        console.log('Answer saved:', response);
        return response;
      } else {
        console.log(`Skipping save for question ${questionId} - no answer provided`);
        return null;
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
      return null;
    }
  };
///////////////////////////////////////////////////////////////////

const startQuiz = async (quizId) => {
  try {
    setLoading(true);
    
    // Use the centralized API request helper
    const response = await apiRequest(
      'post',
      `${API_ENDPOINTS.API_BASE_URL}/students/startAttempt`,
      {
        id_student: userData.id_student,
        id_quiz: quizId
      }
    );
    
    console.log('Start attempt response:', response);
    setCurrentAttempt(response.newAttempt);

    // Update context with attempt information if provided
    // Fetch any previously saved answers for this attempt
    if (response.newAttempt && response.newAttempt.id_attempt) {
      const savedAnswersResponse = await apiRequest(
        'get',
        `${API_ENDPOINTS.API_BASE_URL}/students/getSavedAnswers/${response.newAttempt.id_attempt}`
      );
      
      if (savedAnswersResponse.savedAnswers && savedAnswersResponse.savedAnswers.length > 0) {
        console.log('Found saved answers:', savedAnswersResponse.savedAnswers);
        
        // Process saved answers into the format expected by the UI
        const savedAnswersMap = {};
        const savedTextAnswersMap = {};
        
        savedAnswersResponse.savedAnswers.forEach(savedAnswer => {
          const question = quizDetails.questions.find(q => q.id_question === savedAnswer.id_question);
          
          if (question) {
            if (question.question_type === 'QS') {
              // For text questions
              savedTextAnswersMap[savedAnswer.id_question] = savedAnswer.student_answer_text;
            } else if (question.question_type === 'QCM' || question.question_type === 'QCU') {
              // For multiple choice and single choice questions
              // Parse the answer IDs directly from the saved answer text
              try {
                // The answer text should be a comma-separated list of IDs
                const answerIds = savedAnswer.student_answer_text.split(',')
                  .map(id => parseInt(id.trim()))
                  .filter(id => !isNaN(id));
                
                if (answerIds.length > 0) {
                  savedAnswersMap[savedAnswer.id_question] = answerIds;
                  console.log(`Parsed answer IDs for question ${savedAnswer.id_question}:`, answerIds);
                }
              } catch (e) {
                console.error(`Error parsing answer IDs for question ${savedAnswer.id_question}:`, e);
              }
            }
          }
        });
        
        console.log('Processed saved answers:', savedAnswersMap);
        console.log('Processed saved text answers:', savedTextAnswersMap);
        
        // Update the state with saved answers
        setAnswers(savedAnswersMap);
        setTextAnswers(savedTextAnswersMap);
      }
      
      // Update quiz details with the latest content from the database
      if (savedAnswersResponse.updatedQuiz) {
        setQuizDetails(savedAnswersResponse.updatedQuiz);
      }
    }
    
    setQuizStarted(true);
    setCurrentPage(1);
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

  
  ////////////////////////////////////////////////////////////////////////////////
  const saveAnswerWithLatestState = (questionId, currentAnswersState) => {
    if (!currentAttempt || !questionId) {
      console.error('Cannot save answer: missing attempt or question ID');
      return;
    }
    
    try {
      const question = quizDetails.questions.find(q => q.id_question === questionId);
      
      if (!question) {
        console.error(`Question with ID ${questionId} not found`);
        return;
      }
      
      const currentAnswers = currentAnswersState[questionId] || [];
      let answerText = '';
      
      // Format answer text based on question type
      if (question.question_type === 'QS') {
        // For text questions, use the text answer directly
        answerText = textAnswers[questionId] || '';
        console.log(`Saving QS text answer for question ${questionId}: "${answerText}"`);
      } else if (question.question_type === 'QCM') {
        // For multiple choice questions
        if (currentAnswers.length > 0) {
          answerText = currentAnswers.join(',');
          console.log(`Saving QCM answer for question ${questionId} with IDs: ${answerText}`);
        } else {
          console.log(`No answers selected for QCM question ${questionId}`);
          return null; // Exit early if no answers selected
        }
      } else if (question.question_type === 'QCU') {
        // For single choice questions
        if (currentAnswers.length > 0) {
          // For QCU, we should only have one answer, but just in case take the first one
          answerText = currentAnswers[0].toString();
          console.log(`Saving QCU answer for question ${questionId} with ID: ${answerText}`);
        } else {
          console.log(`No answer selected for QCU question ${questionId}`);
          return null; // Exit early if no answer selected
        }
      }
      
      // Only send the request if we have an answer to save
      if (answerText.trim() !== '') {
        console.log(`Saving answer for question ${questionId}: "${answerText}"`);
        
        // Use the centralized API request helper with async/await pattern
        (async () => {
          try {
            const response = await apiRequest(
              'post',
              `${API_ENDPOINTS.API_BASE_URL}/students/saveAnswer`,
              {
                id_attempt: currentAttempt.id_attempt,
                id_question: questionId,
                student_answer_text: answerText
              }
            );
            console.log('Answer saved:', response);
            return response;
          } catch (error) {
            console.error('Error saving answer:', error);
            if (error.response) {
              console.error('Server error:', error.response.data);
            }
            return null;
          }
        })();
      } else {
        console.log(`Skipping save for question ${questionId} - no answer provided`);
        return null;
      }
    } catch (error) {
      console.error('Error in saveAnswerWithLatestState:', error);
      return null;
    }
  };
  //////////////////////////////////////////////////////////////////////////////
  const handleAnswerSelection = (questionId, answerId, isMultipleChoice) => {
    console.log(`Selection for question ${questionId}: answer ${answerId}, isMultipleChoice: ${isMultipleChoice}`);
    
    // Update the state with the new selection
    setAnswers(prevAnswers => {
      const currentAnswers = prevAnswers[questionId] || [];
      let newAnswers;
      
      if (isMultipleChoice) {
        // For multiple choice questions (QCM)
        if (currentAnswers.includes(answerId)) {
          // If already selected, remove it
          newAnswers = {
            ...prevAnswers,
            [questionId]: currentAnswers.filter(id => id !== answerId)
          };
        } else {
          // If not selected, add it
          newAnswers = {
            ...prevAnswers,
            [questionId]: [...currentAnswers, answerId]
          };
        }
      } else {
        // For single choice questions (QCU)
        // Replace any existing selection with the new one
        newAnswers = {
          ...prevAnswers,
          [questionId]: [answerId]
        };
        console.log(`Set QCU answer for question ${questionId}: ${answerId}`);
      }
      
      // Use a callback to ensure we're working with the latest state
      setTimeout(() => {
        // Create a local copy of the updated answers to use for saving
        const updatedAnswers = {...newAnswers};
        console.log(`About to save answers for question ${questionId}:`, updatedAnswers[questionId]);
        
        // Use the local copy for the API call to avoid state timing issues
        saveAnswerWithLatestState(questionId, updatedAnswers);
      }, 50);
      
      return newAnswers;
    });
  };

  // Add a function to handle text answer changes
const handleTextAnswerChange = (questionId, text) => {
  setTextAnswers(prevTextAnswers => ({
    ...prevTextAnswers,
    [questionId]: text
  }));
  
  // Debounce saving text answers to avoid too many requests
  if (textSaveTimeout) {
    clearTimeout(textSaveTimeout);
  }
  
  const timeout = setTimeout(() => {
    saveCurrentAnswer(questionId);
  }, 1000); // Wait 1 second after typing stops
  
  setTextSaveTimeout(timeout);
};
  

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      // Start animation when changing pages
      startAnimation();
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      // Start animation when changing pages
      startAnimation();
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
/////////////////////////////
  const handleTimeUp = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
/////////////////////////////////////////////////
    // Force close dialog before showing time-up alert
    if (showConfirmDialog) {
      setShowConfirmDialog(false);
      // Add a small delay before showing the alert
      setTimeout(() => {
        Alert.alert(
          "Time's Up!",
          "Your time for this quiz has ended. Your answers will be submitted automatically.",
          [{ text: "OK", onPress: submitQuiz }]
        );
      }, 100);
    } else {
      // If dialog is not showing, just show the alert directly
      Alert.alert(
        "Time's Up!",
        "Your time for this quiz has ended. Your answers will be submitted automatically.",
        [{ text: "OK", onPress: submitQuiz }]
      );
    }
  };

// Update submitQuiz to save the current answer before submitting
// Update submitQuiz to save all answers before submitting
const submitQuiz = async () => {
  try {
    setLoading(true);
    setShowConfirmDialog(false);
    
    // Save the current answer before submitting
    if (currentQuestions && currentQuestions.length > 0) {
      const currentQuestion = currentQuestions[0];
      await saveCurrentAnswer(currentQuestion.id_question);
    }
    
    // Use the centralized API request helper
    const response = await apiRequest(
      'post',
      `${API_ENDPOINTS.API_BASE_URL}/students/submitQuiz`,
      {
        id_attempt: currentAttempt.id_attempt
      }
    );
    
    console.log('Submit quiz response:', response);
    
    // Set quiz results from the response
    setQuizResults(response.results);
    setQuizCompleted(true);
    setQuizStarted(false);
    
    if (timer) {
      clearInterval(timer);
    }
    
    setLoading(false);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    setLoading(false);
    
    // Log more details about the error
    if (error.response) {
      console.log('Error response data:', error.response.data);
      console.log('Error response status:', error.response.status);
    }
    
    Alert.alert(
      'Error',
      'Failed to submit quiz. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

const resetQuiz = () => {
  // Go back to the previous screen or navigate to the main tabs
  if (navigation.canGoBack()) {
    console.log('Going back to previous screen canGoBack');
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    // Pass refresh parameters when going back - fixed navigation structure
    navigation.navigate('MainTabs', {
      screen: 'TakeQuiz',
      params: {
        refreshQuizzes: true,
        timestamp: new Date().getTime(),
        returnCode: quizCompleted ? 'QUIZ_COMPLETED' : 'QUIZ_CANCELLED'
      }
    });
  } else {
    // Navigate to the main tabs and then to the TakeQuiz tab
    console.log('Going back to previous screen MainTabs');
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
    // Create animated styles
    const fadeIn = {
      opacity: animationValue,
      transform: [
        {
          translateY: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0] // Slide up 20 pixels
          })
        }
      ]
    };
    return (
      <>
    <Animated.View style={[styles.container, fadeIn]}>
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
            // Correctly identify question types
            const isMultipleChoice = question.question_type === 'QCM';
            const isSingleChoice = question.question_type === 'QCU';
            const isTextQuestion = question.question_type === 'QS';
            const selectedAnswers = answers[question.id_question] || [];
            const textAnswer = textAnswers[question.id_question] || '';
            
            return (
              <View key={question.id_question} style={styles.questionBlock}>
                <Text style={styles.questionText}>
                  {questionNumber}. {question.question_text}
                </Text>
                
                {isTextQuestion ? (
                  // Text input for text questions (QS)
                  <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={4}
                    placeholder="Type your answer here..."
                    value={textAnswer}
                    onChangeText={(text) => handleTextAnswerChange(question.id_question, text)}
                  />
                ) : (
                  // Options for multiple choice questions (QCM) or single choice (QCU)
                  question.answers.map(option => (
                    <View key={option.id_answer} style={styles.optionContainer}>
                      {isMultipleChoice ? (
                        // Checkbox for multiple choice questions (QCM)
                        <View style={styles.optionRow}>
                          <Checkbox
                            status={selectedAnswers.includes(option.id_answer) ? 'checked' : 'unchecked'}
                            onPress={() => handleAnswerSelection(
                              question.id_question,
                              option.id_answer,
                              true // isMultipleChoice = true
                            )}
                            color="#4a6da7"
                          />
                          <Text style={styles.optionText}>{option.answer_text}</Text>
                        </View>
                      ) : isSingleChoice ? (
                        // Radio button for single choice questions (QCU)
                        <View style={styles.optionRow}>
                          <RadioButton
                            value={option.id_answer.toString()}
                            status={selectedAnswers.includes(option.id_answer) ? 'checked' : 'unchecked'}
                            onPress={() => handleAnswerSelection(
                              question.id_question,
                              option.id_answer,
                              false // isMultipleChoice = false
                            )}
                            color="#4a6da7"
                          />
                          <Text style={styles.optionText}>{option.answer_text}</Text>
                        </View>
                      ) : null}
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
    </Animated.View>
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
    // Calculate the score correctly as a percentage
    const calculatedScore = quizResults.total_questions > 0 
      ? Math.round((quizResults.correct_answers / quizResults.total_questions) * 100) 
      : 0;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Results</Text>
        
        <View style={styles.resultsSummary}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{quizResults.score}%</Text>
          </View>
          <Text style={styles.scoreText}>Your Score</Text>
          <Text style={styles.correctAnswers}>
            {quizResults.earnedPoints?.toFixed(2) || 0} points out of {quizResults.totalPoints || 0} possible points
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
          onPress={() => navigation.navigate('MainTabs', {
            screen: 'Dashboard', // Changed from 'Home' to 'Dashboard' or whatever your actual tab name is
            params: {
              refreshQuizzes: true,
              timestamp: new Date().getTime(),
              returnCode: quizCompleted ? 'QUIZ_COMPLETED' : 'QUIZ_CANCELLED'
            }
          })}
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
  // Base containers
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
  
  // Text styles with platform-specific adjustments
  baseText: {
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
        includeFontPadding: false,
      },
      web: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }
    }),
  },
  
  // TRIVIO brand colors
  trivioColors: {
    primary: '#6a5acd', // Purple from logo
    secondary: '#2ecc71', // Green accent from logo
    background: '#f5f5f5',
    cardBackground: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#dddddd',
    success: '#27ae60',
    error: '#e74c3c',
    warning: '#f39c12',
    disabled: '#cccccc',
  },
  
  // Loading state
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  
  // Headers and titles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6a5acd', // TRIVIO purple
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Info containers
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
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 8,
    ...Platform.select({
      web: {
        alignItems: 'center',
      }
    }),
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a5acd', // TRIVIO purple
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#555',
  },
  
  // Instructions
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
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        lineHeight: '1.5',
      }
    }),
  },
  
  // Buttons
  buttonBase: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      }
    }),
  },
  startButton: {
    backgroundColor: '#6a5acd', // TRIVIO purple
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#5849b8',
        }
      }
    }),
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
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      }
    }),
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Quiz header
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
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  questionCounter: {
    fontSize: 16,
    color: '#6a5acd', // TRIVIO purple
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  
  // Questions container
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
    maxHeight: Platform.OS === 'web' ? '60vh' : 450,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
      }
    }),
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
    ...Platform.select({
      web: {
        lineHeight: '1.4',
      }
    }),
  },
  
  // Options
  optionContainer: {
    marginBottom: 8,
    ...Platform.select({
      web: {
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#f9f9f9',
        }
      }
    }),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      }
    }),
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  
  // Text input
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
    ...Platform.select({
      web: {
        resize: 'vertical',
        minHeight: '120px',
      }
    }),
  },
  
  // Navigation buttons
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        marginTop: '16px',
      }
    }),
  },
  navButton: {
    backgroundColor: '#6a5acd', // TRIVIO purple
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#5849b8',
        }
      }
    }),
  },
  disabledButton: {
    backgroundColor: '#ccc',
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      }
    }),
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2ecc71', // TRIVIO green
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#27ae60',
        }
      }
    }),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Results styles
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
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6a5acd', // TRIVIO purple
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  correctAnswers: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 16,
    color: '#2ecc71', // TRIVIO green
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackTextWarning: {
    fontSize: 16,
    color: '#f39c12',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Table styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
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
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        maxHeight: '40vh',
        overflowY: 'auto',
      }
    }),
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6a5acd', // TRIVIO purple
    padding: 12,
  },
  tableHeaderCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 12,
  },
  correctRow: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)', // Light green
  },
  incorrectRow: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)', // Light red
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
  },
  correctText: {
    color: '#2ecc71', // TRIVIO green
    fontWeight: 'bold',
  },
  incorrectText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  
  // Button container
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewButton: {
    backgroundColor: '#6a5acd', // TRIVIO purple
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#5849b8',
        }
      }
    }),
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Error and retry
  error: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 8,
  },
  retryButton: {
    backgroundColor: '#6a5acd', // TRIVIO purple
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#5849b8',
        }
      }
    }),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Animation styles for slide transitions
  slideAnimation: {
    ...Platform.select({
      web: {
        transition: 'all 0.3s ease-out',
      }
    }),
  }
});

export default StartResponse;
import { 
    getQuizWithQuestions, 
    startQuizAttempt,
    saveQuizProgress,
    submitQuizAnswers
  } from './quizService';
  
  export const startQuizFlow = async (quizId, navigation) => {
    try {
      // Get quiz with questions first
      const quizData = await getQuizWithQuestions(quizId);
      
      // Start attempt
      const attempt = await startQuizAttempt(quizId);
      
      // 3. Navigate to QuizScreen with all data
      navigation.navigate('QuizScreen', {
        questions: quizData.questions,
        attemptId: attempt.id_attempt,
        quizId: quizId
      });
      
      return true;
    } catch (error) {
      console.error('Quiz start failed:', error);
      throw error;
    }
  };
  
  export const handleQuizSubmit = async (attemptId, answers, navigation) => {
    try {
      await submitQuizAnswers(attemptId, answers);
      navigation.navigate('QuizResult', { attemptId });
    } catch (error) {
      
      throw error;
    }
  };
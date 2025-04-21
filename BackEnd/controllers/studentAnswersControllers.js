const { PrismaClient } = require("@prisma/client");

// Create a new instance of PrismaClient with query event logging
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

// Add event listener for the query event
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
  console.log('---------------------');
});

const getAllResults = async (req, res) => {
  const { id_quiz , page , limit } = req.body;
  try {
    const allResults = await prisma.attempts.findMany({
      skip: (page - 1) * limit, //skip records based on page number
      take: limit, // limit number of attempts per page
      where: {
          id_quiz: id_quiz
      },
      select: {
          id_attempt: true,
          score: true,
          students: {
              select: {
                  id_student: true,
                  first_name: true,
                  last_name: true
              }
          },
          
      }
  });
  const totalResults = await prisma.attempts.count({
      where: {
          id_quiz: id_quiz
      }
  });
  

    for (const attempt of allResults) {
      const answers = await prisma.student_answers.findMany({
          where: {
              id_attempt: attempt.id_attempt
          },
         
      });
      answers.sort((a, b) => a.id_question - b.id_question);
      attempt.answers = answers
    }
    
    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit),
      data: allResults
  });
      
    
  } catch (error) {
      console.error("Error fetching answers:", error);
      res.status(500).json({ error: "Error fetching answers" });
  }
};

// Save a student's answer for a specific question
const saveAnswer = async (req, res) => {
  try {
    const { id_attempt, id_question, student_answer_text } = req.body;
    
    // Validate input
    if (!id_attempt || !id_question) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`Processing answer for question ${id_question}: "${student_answer_text}"`);

    // First, get the question details to determine the correct answer
    const question = await prisma.questions.findUnique({
      where: { id_question },
      include: {
        answers: true // Include the possible answers for this question
      }
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Determine if the answer is correct based on question type
    let isCorrect = 0;
    let formattedAnswerText = student_answer_text;

    if (question.question_type === 'QCU') {
      // Single choice question - check if the selected answer is correct
      if (student_answer_text && student_answer_text.trim() !== '') {
        // Parse the answer ID (might be a single ID or the first in a comma-separated list)
        let selectedAnswerId;
        
        if (student_answer_text.includes(',')) {
          // If it's a comma-separated list, take the first value
          selectedAnswerId = parseInt(student_answer_text.split(',')[0]);
        } else {
          selectedAnswerId = parseInt(student_answer_text);
        }
        
        if (!isNaN(selectedAnswerId)) {
          // Find the answer with this ID and check if it's correct
          const selectedAnswer = question.answers.find(a => a.id_answer === selectedAnswerId);
          
          if (selectedAnswer) {
            // Store the actual answer text instead of just the ID
            formattedAnswerText = selectedAnswer.answer_text;
            isCorrect = selectedAnswer.correct === 1 ? 1 : 0;
            console.log(`QCU: Selected answer text "${formattedAnswerText}", correct: ${isCorrect}`);
          } else {
            console.log(`QCU: No answer found with ID ${selectedAnswerId}`);
            return res.status(400).json({ error: "Invalid answer ID" });
          }
        } else {
          console.log(`QCU: Could not parse answer ID from "${student_answer_text}"`);
          return res.status(400).json({ error: "Invalid answer format" });
        }
      } else {
        console.log(`QCU: No answer text provided`);
        return res.status(400).json({ error: "No answer provided" });
      }
    } 
    else if (question.question_type === 'QCM') {
      // Multiple choice question - check if all selected answers are correct
      if (student_answer_text && student_answer_text.trim() !== '') {
        const selectedAnswerIds = student_answer_text.split(',')
          .map(id => parseInt(id.trim()))
          .filter(id => !isNaN(id));
        
        if (selectedAnswerIds.length > 0) {
          // Get all correct answers for this question
          const correctAnswers = question.answers.filter(a => a.correct === 1).map(a => a.id_answer);
          const incorrectAnswers = question.answers.filter(a => a.correct === 0).map(a => a.id_answer);
          
          // Count how many correct answers the student selected
          const correctSelections = selectedAnswerIds.filter(id => correctAnswers.includes(id)).length;
          // Count how many incorrect answers the student selected
          const incorrectSelections = selectedAnswerIds.filter(id => incorrectAnswers.includes(id)).length;
          
          // Calculate partial score based on correct selections
          // If there are any incorrect selections, reduce the score
          if (incorrectSelections > 0) {
            // Penalize for incorrect selections
            isCorrect = 0; // For database storage, we'll still use 0 for partially correct
          } else if (correctSelections === correctAnswers.length) {
            // All correct answers selected and no incorrect ones
            isCorrect = 1;
          } else {
            // Some correct answers selected but not all, and no incorrect ones
            isCorrect = 0; // For database storage, we'll still use 0 for partially correct
          }
          
          // Store the actual answer texts instead of just IDs
          const selectedAnswers = question.answers
            .filter(a => selectedAnswerIds.includes(a.id_answer))
            .map(a => a.answer_text);
          
          formattedAnswerText = selectedAnswers.join('; ');
          
          console.log(`QCM: Selected answer IDs [${selectedAnswerIds.join(', ')}], correct: ${isCorrect}`);
          console.log(`QCM: Correct selections: ${correctSelections}/${correctAnswers.length}, incorrect selections: ${incorrectSelections}`);
          console.log(`Expected correct IDs [${correctAnswers.join(', ')}]`);
        }
      }
    }
    else if (question.question_type === 'QS') {
      // Text question - compare with expected answer(s)
      if (student_answer_text && student_answer_text.trim() !== '') {
        // Get the correct answer(s) for this question
        const correctAnswers = question.answers
          .filter(a => a.correct === 1)
          .map(a => a.answer_text.toLowerCase().trim());
        
        // Normalize student answer for comparison
        const normalizedStudentAnswer = student_answer_text.toLowerCase().trim();
        
        // Check if the student's answer matches any of the correct answers
        // This is a simple exact match - could be enhanced with fuzzy matching or NLP
        isCorrect = correctAnswers.some(answer => 
          normalizedStudentAnswer === answer || 
          normalizedStudentAnswer.includes(answer)
        ) ? 1 : 0;
        
        console.log(`QS: Text answer "${normalizedStudentAnswer}", correct: ${isCorrect}`);
        console.log(`Expected answers: [${correctAnswers.join(', ')}]`);
      } else {
        console.log(`QS: No answer text provided`);
      }
    }

    console.log(`Question ${id_question} answer: "${formattedAnswerText}" - Correct: ${isCorrect}`);

    // Check if an answer already exists for this attempt and question
    const existingAnswer = await prisma.student_answers.findFirst({
      where: {
        id_attempt,
        id_question
      }
    });

    let savedAnswer;
    
    if (existingAnswer) {
      // Update existing answer
      savedAnswer = await prisma.student_answers.update({
        where: {
          id_student_answer: existingAnswer.id_student_answer
        },
        data: {
          student_answer_text: formattedAnswerText,
          correct: isCorrect
        }
      });
      console.log(`Updated existing answer for question ${id_question}:`, savedAnswer);
    } else {
      // Create new answer
      savedAnswer = await prisma.student_answers.create({
        data: {
          id_attempt,
          id_question,
          student_answer_text: formattedAnswerText,
          correct: isCorrect
        }
      });
      console.log(`Created new answer for question ${id_question}:`, savedAnswer);
    }

    res.json({ 
      message: "Answer saved successfully", 
      answer: savedAnswer 
    });
  } catch (error) {
    console.error("Error saving answer:", error);
    res.status(500).json({ 
      error: "Error saving answer", 
      details: error.message 
    });
  }
};

// Submit a completed quiz
const submitQuiz = async (req, res) => {
  console.log("Processing quiz submission...");
  try {
    const { id_attempt } = req.body;
    
    if (!id_attempt) {
      return res.status(400).json({ error: "Missing attempt ID" });
    }
    
    // Get the attempt with all related data
    const attempt = await prisma.attempts.findUnique({
      where: { id_attempt },
      include: {
        student_answers: true,
        quizzes: {
          include: {
            questions: {
              include: {
                answers: true
              }
            }
          }
        }
      }
    });
    
    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    
    if (attempt.corrected === 1) {
      return res.status(400).json({ error: "This attempt has already been submitted" });
    }
    
    // Calculate the score based on correct answers
    let totalPoints = 0;
    let earnedPoints = 0;
    
    // Create a map of question IDs to their points
    const questionPoints = {};
    attempt.quizzes.questions.forEach(question => {
      questionPoints[question.id_question] = question.points;
      totalPoints += question.points;
    });
    
    // Create a map of question IDs to student answers for easier lookup
    const studentAnswersMap = {};
    attempt.student_answers.forEach(answer => {
      studentAnswersMap[answer.id_question] = answer;
    });
    
    // Calculate earned points from student answers with new scoring algorithm
    attempt.quizzes.questions.forEach(question => {
      const studentAnswer = studentAnswersMap[question.id_question];
      
      // Skip questions that weren't answered
      if (!studentAnswer) {
        console.log(`Question ${question.id_question} was not answered`);
        return;
      }
      
      // Get points for this question
      const points = questionPoints[question.id_question] || 0;
      
      // Apply different scoring rules based on question type
      if (question.question_type === 'QCU' || question.question_type === 'QS') {
        // For QCU and QS: If correct, full points, otherwise 0
        if (studentAnswer.correct === 1) {
          earnedPoints += points;
          console.log(`${question.question_type} Question ${question.id_question}: Correct answer, earned ${points} points`);
        } else {
          console.log(`${question.question_type} Question ${question.id_question}: Incorrect answer, earned 0 points`);
        }
      } 
      else if (question.question_type === 'QCM') {
        // For QCM: Calculate partial credit based on correct selections
        
        // Parse student's answer to get selected answer IDs
        let selectedAnswerIds = [];
        if (studentAnswer.student_answer_text && studentAnswer.student_answer_text.includes(';')) {
          // If stored as text with semicolons, extract answer texts
          const answerTexts = studentAnswer.student_answer_text.split(';').map(t => t.trim());
          // Find corresponding answer IDs
          selectedAnswerIds = question.answers
            .filter(a => answerTexts.includes(a.answer_text))
            .map(a => a.id_answer);
        } else if (studentAnswer.student_answer_text) {
          // Try to parse directly if it's stored as IDs
          try {
            // Check if it's stored as comma-separated IDs
            if (studentAnswer.student_answer_text.includes(',')) {
              selectedAnswerIds = studentAnswer.student_answer_text
                .split(',')
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id));
            }
          } catch (e) {
            console.log(`Error parsing QCM answer: ${e.message}`);
          }
        }
        
        // Get all correct answers for this question
        const correctAnswers = question.answers.filter(a => a.correct === 1).map(a => a.id_answer);
        const incorrectAnswers = question.answers.filter(a => a.correct === 0).map(a => a.id_answer);
        
        // Count how many correct answers the student selected
        const correctSelections = selectedAnswerIds.filter(id => correctAnswers.includes(id)).length;
        // Count how many incorrect answers the student selected
        const incorrectSelections = selectedAnswerIds.filter(id => incorrectAnswers.includes(id)).length;
        
        // Calculate partial score
        let questionScore = 0;
        
        if (incorrectSelections === 0) {
          // Award partial credit based on proportion of correct answers selected
          questionScore = (points * correctSelections) / correctAnswers.length;
        }
        
        earnedPoints += questionScore;
        
        console.log(`QCM Question ${question.id_question}: Selected ${correctSelections}/${correctAnswers.length} correct answers, ${incorrectSelections} incorrect answers, earned ${questionScore.toFixed(2)} points`);
      }
    });
    
    // Calculate percentage score (0-100): (sum of earned points × 100) ÷ sum of all question points
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    
    console.log(`Quiz score calculation: ${earnedPoints.toFixed(2)}/${totalPoints} = ${score}%`);
    
    // Update the attempt with the score and mark as corrected
    const updatedAttempt = await prisma.attempts.update({
      where: { id_attempt },
      data: {
        score,
        corrected: 1
      }
    });
    
    // Return the results
    res.status(200).json({
      message: "Quiz submitted successfully",
      results: {
        score,
        totalPoints,
        earnedPoints: parseFloat(earnedPoints.toFixed(2)),
        attemptId: id_attempt,
        quizTitle: attempt.quizzes.title,
        quizId: attempt.quizzes.id_quiz
      }
    });
    
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ 
      error: "Error submitting quiz",
      details: error.message
    });
  }
};
// Get saved answers for a specific attempt
// Add this function to get saved answers for an attempt
const getSavedAnswers = async (req, res) => {
  try {
    const { id_attempt } = req.params;
    
    // Validate input
    if (!id_attempt) {
      return res.status(400).json({ error: "Missing attempt ID" });
    }

    const attemptId = parseInt(id_attempt);
    if (isNaN(attemptId)) {
      return res.status(400).json({ error: "Invalid attempt ID format" });
    }

    // Check if the attempt exists
    const attempt = await prisma.attempts.findUnique({
      where: { id_attempt: attemptId }
    });

    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    // Get all saved answers for this attempt
    const savedAnswers = await prisma.student_answers.findMany({
      where: { id_attempt: attemptId }
    });

    res.json({ savedAnswers });
    
  } catch (error) {
    console.error("Error fetching saved answers:", error);
    res.status(500).json({ 
      error: "Error fetching saved answers",
      message: error.message
    });
  }
};

// Make sure to export the functions
module.exports = {
  getAllResults,
  saveAnswer,
  getSavedAnswers,
  submitQuiz
}
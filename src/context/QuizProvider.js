import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthProvider";
export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const { user } = useAuth();
  const teacherId = user.id;

  // Initialize quiz data with the structure matching Prisma schema
  const [quizData, setQuizData] = useState({
    id_teacher: teacherId,
    title: "",
    description: "",
    subject: "",
    nb_attempts: 1,
    duration: 30, // Default 30 minutes
    correctionType: "auto", // Default to auto-graded
    score: 100, // Default score
    for_year: "", // To be filled by user
    for_groupe: "", // To be filled by user
    status: "draft", // Default to draft
    questions: [], // Array to hold questions
  });

  return (
    <QuizContext.Provider value={{ quizData, setQuizData }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};

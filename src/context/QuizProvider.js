import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthProvider"
export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
const { user } = useAuth();
const teacherId = user.id;
const [quizData, setQuizData] = useState({id_teacher: teacherId});

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

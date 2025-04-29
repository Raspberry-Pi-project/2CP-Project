import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthProvider";
export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const { user } = useAuth();
  const teacherId = user.id;  
  const [quizData, setQuizData] = useState(() => {
    const savedQuiz = sessionStorage.getItem("quizData");
    return savedQuiz ? JSON.parse(savedQuiz) : {id_teacher: teacherId,
      title: "",
      description: "",
      subject: "",
      nb_attempts: 1,
      duration: 30, // Default 30 minutes
      correctionType: "auto", // Default to auto-graded
      score: 100, // Default score
      for_year: 0, // To be filled by user
      for_groupe: 0, // To be filled by user
      status: "draft", // Default to draft
      questions: [], // Array to hold questions};
  }});

  // Initialize quiz data with the structure matching Prisma schema
  useEffect(() => {
    if (quizData && Object.keys(quizData).length > 0) {
      sessionStorage.setItem("quizData", JSON.stringify(quizData));
    } else {
      sessionStorage.removeItem("quizData");
    }
    console.log("quizData : ", quizData);
  }, [quizData]);
  
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

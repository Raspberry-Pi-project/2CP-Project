import { createContext, useState, useEffect, useContext } from "react";

export const QuizContext = createContext();


export const QuizProvider = ({ children }) => {
  // Function to retrieve stored quiz data safely
  const getStoredQuizData = () => {
    try {
      const storedData = localStorage.getItem("quizData");
      return storedData ? JSON.parse(storedData) : { subject: "", title: "", description: "", image: null };
    } catch (error) {
      console.error("Error parsing quizData from localStorage:", error);
      return { subject: "", title: "", description: "", image: null };
    }
  };

  //const [quizData, setQuizData] = useState(getStoredQuizData());

  const [quizData, setQuizData] = useState(() => {
    // Load saved quiz from local storage (session-based)
    return JSON.parse(sessionStorage.getItem("quizData")) || null;
  });

  const [teacherId, setTeacherId] = useState(() => {
    return sessionStorage.getItem("teacherId") || null;
  });

  // Save quiz data to local storage whenever it changes
  
  useEffect(() => {
    if (teacherId) {
      sessionStorage.setItem("teacherId", teacherId);
    }
  }, [teacherId]);

  const clearQuizDataOnLogout = () => {
    if (quizData && !quizData.isDraft && !quizData.isPosted) {
      sessionStorage.removeItem("quizData");
      sessionStorage.removeItem("teacherId");
      setQuizData(null);
      setTeacherId(null);
    }
  };


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
  
  //export { QuizProvider };
import { useState,useEffect } from "react";

/*const autoStopQuiz = (duration , onTimeUP , quizID)=>{
  const totalSeconds = duration * 60;
  const storageKey = `quizTimeLeft_${quizID}`;

  const getInitialTimeLeft = () => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      const { startTime } = JSON.parse(saved);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      return Math.max(totalSeconds - elapsed, 0);
    } else {
      const data = { startTime: Date.now() };
      sessionStorage.setItem(storageKey, JSON.stringify(data));
      return totalSeconds;
    }
}
    const [secondsLeft, setSecondsLeft] = useState(getInitialTimeLeft);

    useEffect(async() => {
        if (secondsLeft <= 0) {
          sessionStorage.removeItem(storageKey);
          onTimeUP();
          try{
            const response = await axios.post(`http://${API_URL}:3000/quizzes/updateQuiz`, { id_quiz : quizID , status:"published" }, { headers: { Authorization: `Bearer ${user.token}` } }, { withCredentials: true });
            if (response.status !== 200) {
              throw new Error("Failed to update quiz");
            }
            console.log("Quiz updated successfully");
            setTimeout(() => {
                navigate("/historypage");
              }, 500); // Small delay
          } catch (error) {
            console.error("Error in onTimeUP callback:", error);
          }
          return;
        }
    
        const timer = setInterval(() => {
          setSecondsLeft(getInitialTimeLeft());
        }, 1000);
    
        return () => clearInterval(timer);
      }, [secondsLeft, onTimeUP, storageKey]);
  };*/


export const API_URL = "localhost";
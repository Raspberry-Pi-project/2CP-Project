import { useContext } from "react";
import { QuizContext } from "../context/QuizProvider";

const QuizForm = () => {
  const { quizData, setQuizData } = useContext(QuizContext);

  const handleChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <input
        type="text"
        name="title"
        value={quizData.title}
        onChange={handleChange}
        placeholder="Quiz Title"
      />
      <input
        type="text"
        name="description"
        value={quizData.description}
        onChange={handleChange}
        placeholder="Quiz Description"
      />
    </>
  );
};

export default QuizForm;

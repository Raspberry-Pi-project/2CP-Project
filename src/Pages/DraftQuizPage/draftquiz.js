import "./draftquiz.css";
import { useNavigate } from "react-router-dom";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { useState, useEffect } from "react";

const DraftQuiz = () => {
  const [draftQuizzzes, setDraftQuizzzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const { user } = useAuth();

  // This useEffect will log draftQuizzzes whenever it changes
  useEffect(() => {
    console.log("draftQuizzzes updated:", draftQuizzzes);
  }, [draftQuizzzes]);

  useEffect(() => {
    const fetchDraftQuizzes = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:3000/teachers/getQuizzes",
          { status: "draft", page, limit },
          { withCredentials: true }
        );
        console.log("API response:", response.data);
        setDraftQuizzzes(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching draft quizzes:", err);
        setError("Failed to load draft quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDraftQuizzes();
  }, [page, limit]); // Re-fetch when page or limit changes

  // Fallback data in case the API call fails or returns no data
  const fallbackQuizzes = [
    {
      id: 1,
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
      image:
        "https://aipromptopus.com/wp-content/uploads/2023/12/train-your-ai-.jpeg",
    },
  ];

  // Use the API data if available, otherwise use fallback data
  const draftQuizzes =
    draftQuizzzes && draftQuizzzes.length > 0 ? draftQuizzzes : fallbackQuizzes;

  // Handle starting a quiz
  const handleStart = (quizId) => {
    navigate(`/finalization2/${quizId}`); // will go to the page of finalization2 basing on its id
  };

  // Handle quiz options
  const handleQuizOptions = (quizId) => {
    // if we want to add the option of delete or other things ...
    console.log(`Options for quiz ${quizId}`);
  };

  return (
    <div className="draft-container">
      {/* Main Content */}
      <div className="draft-content">
        <h1 className="page-title">Draft Quizzes</h1>

        {loading ? (
          <div className="loading-message">Loading draft quizzes...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          /* Draft Quiz Grid */
          <div className="draft-grid">
            {draftQuizzes.map((quiz) => (
              <div key={quiz.id} className="draft-card">
                <div className="draft-image">
                  <img
                    src={quiz.image || "/placeholder.svg"}
                    alt={quiz.title}
                  />
                </div>
                <div className="draft-info">
                  <h3 className="draft-title">{quiz.title}</h3>
                  <p className="draft-difficulty">{quiz.difficulty}</p>
                  <p className="draft-questions">{quiz.questions} Questions</p>
                  <div className="draft-actions">
                    <button
                      className="start-btn"
                      onClick={() => handleStart(quiz.id)}
                    >
                      START
                    </button>
                    <button
                      className="options-btn"
                      onClick={() => handleQuizOptions(quiz.id)}
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftQuiz;

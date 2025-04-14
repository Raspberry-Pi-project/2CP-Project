import { useState, useEffect } from "react";
import axios from "axios";
import "./historypage.css";
import { useNavigate } from "react-router-dom";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/AuthProvider";
import { useQuiz } from "../../context/QuizProvider"; // Import the QuizProvider context
import LOGO from "../../photos/Frame 39 (2).png";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [quizzes, setQuizzes] = useState([]); // State to store quizzes from the database
  const [loading, setLoading] = useState(true); // Loading state for fetching quizzes
  const [error, setError] = useState(null); // Error state if something goes wrong
  const { user } = useAuth(); // Get user information from context (if needed)
  const [page, setPage] = useState(1); // State for pagination
  const [limit, setLimit] = useState(10); // State for number of quizzes per page
  const { setQuizData } = useQuiz(); // Get setQuiz function from QuizProvider context

  // Filter options
  const filters = [
    "All",
    "A-Z",
    "date",
    "recently",
    "Data structure",
    "Arrays",
  ];

  // Fetch quizzes from the backend API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // You might need to replace the URL with your own backend URL
        const response = await axios.post(
          "http://localhost:3000/teachers/getQuizzes",
          { page, limit, id_teacher: user.id, status: "published" },
          { withCredentials: true }
        ); // Adjust the API endpoint accordingly
        console.log("API response:", response.data);

        // Ensure response.data is an array before setting it to state
        const quizzesData = Array.isArray(response.data)
          ? response.data
          : response.data.quizzes || response.data.data || [];

        setQuizzes(quizzesData); // Set quizzes data from the backend
      } catch (error) {
        setError("Failed to fetch quizzes.");
        console.error("Error fetching quizzes:", error);
        setQuizzes([]); // Set empty array on error
      } finally {
        setLoading(false); // Set loading to false when fetch is complete
      }
    };
    setLoading(true); // Set loading to true before fetching
    fetchQuizzes();
  }, [page, limit, user.id]); // Added user.id to dependency array

  useEffect(() => {
    console.log("Quizzes updated:", quizzes); // Log quizzes data whenever it changes
  }, [quizzes]);

  // Handle consulting a quiz
  const handleConsult = async (quizId) => {
    try {
      // Fetch quiz details from the backend API
      const response = await axios.post(
        "http://localhost:3000/teachers/getQuizDetails",
        { id_quiz: quizId },
        { withCredentials: true }
      );
      //console.log("Quiz details response:", response.data);
      if (response.status !== 200) {
        throw new Error("Failed to fetch quiz details");
      } else {
        setQuizData(response.data); // Set the selected quiz data in context
        navigate(`/quizdetails`);
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  // Handle quiz options
  const handleQuizOptions = (quizId) => {
    console.log(`Options for quiz ${quizId}`);
  };

  // Filter quizzes based on active filter
  const filteredQuizzes = Array.isArray(quizzes)
    ? activeFilter === "All"
      ? quizzes
      : quizzes.filter((quiz) => quiz.category === activeFilter)
    : [];

  return (
    <div className="history-container">
      {/* Main Content */}
      <div className="history-content">
        {/* Filter Tabs */}
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && <p>Loading quizzes...</p>}

        {/* Error state */}
        {error && <p>{error}</p>}
        {/* No quizzes found state */}
        {quizzes.length === 0 && !loading && !error && (
          <div className="full-page-container">
            <div className="logo-container">
              <img src={LOGO} alt="Logo" className="full-page-logo" />
            </div>
          </div>
        )}
        {/* Quiz Grid */}
        {!loading && !error && quizzes.length > 0 && (
          <div className="quiz-grid">
            {Array.isArray(quizzes) && quizzes.length > 0 ? (
              quizzes.map((quiz, index) => (
                <div key={quiz.id_quiz} className="quiz-card">
                  <div className="quiz-image">
                    <img
                      src={quiz.image || "/placeholder.svg"}
                      alt={quiz.title}
                    />
                  </div>
                  <div className="quiz-info">
                    <h3 className="quiz-title">{quiz.title}</h3>
                    <h3 className="quiz-title">ID :{quiz.id_quiz}</h3>
                    <p className="quiz-questions">
                      {quiz.totalQuestions} Questions
                    </p>
                    <p className="quiz-questions">
                      For Year{" "}
                      {quiz.for_year === 0 || quiz.for_year === NaN
                        ? "all"
                        : quiz.for_year}{" "}
                      Group{" "}
                      {quiz.for_groupe === 0 || quiz.for_groupe === NaN
                        ? "all"
                        : quiz.for_groupe}{" "}
                    </p>
                    <div className="quiz-actions">
                      {/* Button to consult the quiz details */}
                      <button
                        className="consult-btn"
                        onClick={() => handleConsult(quiz.id_quiz)}
                      >
                        CONSULT
                      </button>

                      {/* Button for quiz options */}
                      <button
                        className="options-btn"
                        onClick={() => handleQuizOptions(quiz.id_quiz)}
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No quizzes found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

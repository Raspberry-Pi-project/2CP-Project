import { useState, useEffect } from "react";
import axios from "axios";
import "./activeQuizPage.css";
import { useNavigate } from "react-router-dom";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/AuthProvider";
import { useQuiz } from "../../context/QuizProvider";
import LOGO from "../../photos/Frame 39 (2).png";
import { API_URL } from "../../config";

// Add these styles directly in your component
const horizontalGridStyle = {
  display: "flex",
  overflowX: "auto",
  scrollBehavior: "smooth",
  padding: "10px 0",
  marginBottom: "20px",
  msOverflowStyle: "none", /* IE and Edge */
  scrollbarWidth: "none", /* Firefox */
};

const quizCardStyle = {
  flex: "0 0 calc(25% - 20px)",
  minWidth: "calc(25% - 20px)",
  marginRight: "20px",
};

const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "20px 0",
  gap: "10px",
};

const pageNumberStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backgroundColor: "#f0f0f0",
  border: "none",
  fontWeight: "500",
};

const activePageStyle = {
  ...pageNumberStyle,
  backgroundColor: "#7b68ee",
  color: "white",
};

const pageArrowStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backgroundColor: "#f0f0f0",
  border: "none",
};

const ActiveQuizPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { setQuizData } = useQuiz();
  const [totalPages, setTotalPages] = useState(0);

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
        const response = await axios.post(
          `http://${API_URL}:3000/teachers/getQuizzes`,
          { page, limit, id_teacher: user.id, status: "active" },
          { headers: { Authorization: `Bearer ${user.token}` } },
          { withCredentials: true }
        );
        console.log("API response:", response.data);

        const quizzesData = Array.isArray(response.data)
          ? response.data
          : response.data.quizzes || response.data.data || [];
       
        setQuizzes(quizzesData);
        setTotalPages(response.data.totalPages || 0); // Set total pages from the response
      } catch (error) {
        setError("Failed to fetch quizzes.");
        console.error("Error fetching quizzes:", error);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchQuizzes();
  }, [page, limit, user.id]);

  useEffect(() => {
    console.log("Quizzes updated:", quizzes);
  }, [quizzes]);

  // Handle consulting a quiz
  const handleStop = async (quizId) => {
    try {
      const response = await axios.post(
        `http://${API_URL}:3000/teachers/updateQuiz`,
        { id_quiz: quizId , status: "published"},
        { headers: { Authorization: `Bearer ${user.token}` } },
        { withCredentials: true }
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch quiz details");
      } else {
        setQuizData(response.data);
        
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

  // Calculate total pages
  

  return (
    <div className="history-container">
      {/* Main Content */}
      <div className="history-content">
        <h2 className="history-title">Active Quizzes</h2>
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
              <img src={LOGO || "/placeholder.svg"} alt="Logo" className="full-page-logo" />
            </div>
          </div>
        )}
        
        {/* Quiz Grid - using inline styles */}
        {!loading && !error && quizzes.length > 0 && (
          <div className="quiz-grid" style={horizontalGridStyle}>
            {Array.isArray(quizzes) && quizzes.length > 0 ? (
              quizzes.map((quiz, index) => (
                <div key={quiz.id_quiz} className="quiz-card" style={quizCardStyle}>
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
                      <button
                        className="consult-btn"
                        onClick={() => handleStop(quiz.id_quiz)}
                      >
                        STOP
                      </button>
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
        
         {/* Pagination - using inline styles */}
         {!loading && !error && quizzes.length > 0 && (
          <div style={paginationStyle}>
            <button style={pageArrowStyle} onClick={()=>{if(page > 1) { setPage(page - 1)}}}>&#10094;</button>
            <button style={activePageStyle}>{page}</button>
            {totalPages - page >= 1 && <button style={pageNumberStyle} onClick={()=>{setPage(page + 1)}}>{page+1}</button>}
            {totalPages - page >= 2 && <button style={pageNumberStyle} onClick={()=>{setPage(page + 2)}}>{page+2}</button>}
            {totalPages - page >= 3 && <button style={pageNumberStyle} onClick={()=>{setPage(page + 3)}}>{page+3}</button>}
            {totalPages - page >= 4 && <span>...</span>}
            {totalPages - page >= 4 && <button style={pageNumberStyle} onClick={()=>{setPage(totalPages)}}>{totalPages}</button>}
            <button style={pageArrowStyle} onClick={()=>{ if (totalPages - page >= 1) {setPage(page +1)}}}>&#10095;</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveQuizPage;
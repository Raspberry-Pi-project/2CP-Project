
import { useState } from "react";
import "./quizdetails.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  faPlus,
  faEdit,
  faUsers,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuiz } from "../../context/QuizProvider";

const QuizDetails = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [activeTab, setActiveTab] = useState("info");
  const { quizData, setQuizData } = useQuiz(); // Get quiz data from context


  // Sample quiz data
  /*const quizData = {
    id: quizId,
    title: "AI",
    subject: "Subject",
    language: "Language",
    description: "A quiz about artificial intelligence concepts and applications.",
    image: "https://aipromptopus.com/wp-content/uploads/2023/12/train-your-ai-.jpeg",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        text: "What does AI stand for?",
        options: ["Automated Information", "Artificial Intelligence", "Advanced Innovation"],
        correctAnswer: 1,
        points: 1,
        time: 30,
      },
      {
        id: 2,
        type: "true-false",
        text: "Machine Learning is a type of AI where computers learn from data",
        correctAnswer: true,
        points: 2,
        time: 45,
      },
    ],*/
  const sessions = [
    {
      id: 1,
      date: "2023-05-15",
      participants: 25,
      averageScore: 85,
    },
    {
      id: 2,
      date: "2023-06-20",
      participants: 32,
      averageScore: 78,
    },
  ];

  // Handle starting a new session
  const handleStartSession = () => {
    console.log("Starting new session");
    // Navigate to session setup page

    navigate(`/session-setup/${quizId}`); // this one must go to the page of finalization2 (to set group and year of study) then publish  it
  };

  // Handle adding questions
  const handleAddQuestion = () => {
    navigate(`/generating`); // this must go to the generating quizz question in the same quizz id i do nooot knowhow to do it with id but i know yooou can do it :)
  };

  // Handle editing quiz
  const handleEditQuiz = () => {
    navigate(`/info`); // this one go to the page of finalization1
  };

  // Handle viewing results
  const handleViewResults = (sessionId) => {
    navigate(`/results`);
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="quiz-details-info">
            <div className="info-section">
              <h3>Description</h3>
              <p>{quizData.description}</p>
            </div>
            <div className="info-section">
              <h3>Questions ({quizData.questions.length})</h3>
              <div className="questions-list">
                {quizData.questions.map((question, index) => (
                  <div key={question.id_question} className="question-item">
                    <span className="question-number">{index + 1}.</span>
                    <span className="question-text">
                      {question.question_text}
                    </span>
                    <div className="question-meta">
                      <span className="question-type">
                        {question.question_type}
                      </span>
                      <span className="question-points">
                        {question.points} points
                      </span>
                      <span className="question-time">
                        {question.duration}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="add-questionn-btn" onClick={handleAddQuestion}>
                <FontAwesomeIcon icon={faPlus} /> Add Question
              </button>
            </div>
          </div>
        );
      case "sessions":
        return (
          <div className="quiz-details-sessions">
            <button className="new-session-btn" onClick={handleStartSession}>
              <FontAwesomeIcon icon={faPlus} /> Start New Session
            </button>
            <h3>Previous Sessions</h3>
            <div className="sessions-list">
              {sessions.map((session, index) => (
                <div key={index} className="session-item">
                  <div className="session-info">
                    <span className="session-date">{session.date}</span>
                    <span className="session-participants">
                      <FontAwesomeIcon icon={faUsers} /> {session.participants}{" "}
                      participants
                    </span>
                    <span className="session-score">
                      Average Score: {session.averageScore}%
                    </span>
                  </div>

                  <button
                    className="view-results-btn"
                    onClick={() => handleViewResults(session.id)}
                  >
                    <FontAwesomeIcon icon={faChartBar} /> View Results
                  </button>

                  {/*i add it first to see if it works and to test the page of results when i wlick on view result but after it did not work more as an exmple  
             
            <button className="view-results-btn" onClick={() => navigate("/results")}>
                    <FontAwesomeIcon icon={faChartBar} /> View Results
                  </button>
                     */}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="quiz-details-container">
      {/* Main Content */}
      <div className="quiz-details-content">
        {/* Quiz Header */}
        <div className="quiz-header">
          <div className="quiz-header-left">
            <div className="quiz-image">
              <img
                src={quizData.image || "/placeholder.svg"}
                alt={quizData.title}
              />
            </div>
            <div className="quiz-header-info">
              <h1 className="quiz-title">{quizData.title}</h1>
              <div className="quiz-meta">
                <div className="quiz-meta-item">
                  <span className="meta-label">Subject</span>
                  <span className="meta-value">{quizData.subject}</span>
                </div>
                <div className="quiz-meta-item">
                  <span className="meta-label">Score</span>
                  <span className="meta-value">{quizData.score}pts</span>
                </div>
                <div className="quiz-meta-item">
                  <span className="meta-label">Duration</span>
                  <span className="meta-value">{quizData.duration}min</span>
                </div>
                <div className="quiz-meta-item">
                  <span className="meta-label">Correction</span>
                  <span className="meta-value">{quizData.correctionType}</span>
                </div>
                <div className="quiz-meta-item">
                  <span className="meta-label">Attempts</span>
                  <span className="meta-value">{quizData.nb_attempts}</span>
                </div>
                <div className="quiz-meta-item">
                  <span className="meta-label">for year/group</span>
                  <span className="meta-value">
                    {quizData.for_year}/{quizData.for_groupe}
                  </span>
                </div>
                <div className="quiz-meta-item">
                  <span className="meta-label">Published At</span>
                  <span className="meta-value">
                    {quizData.created_at.replace("T", " ").split(".")[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="quiz-header-actions">
            <button className="view-results-button" onClick={handleViewResults}>
              <FontAwesomeIcon icon={faChartBar} /> View Results
            </button>
            <button className="start-session-button" onClick={handleStartSession}>
              <FontAwesomeIcon icon={faPlay} /> Start Session
            </button>
            <button className="edit-quiz-btn" onClick={handleEditQuiz}>
              <FontAwesomeIcon icon={faEdit} /> Edit Quiz
            </button>
          </div>
        </div>


        {/* Quiz Information Section */}
        <div className="quiz-info-section">
          <h2 className="section-title">Quiz Information</h2>

          <div className="tab-content">
            <div className="quiz-details-info">
              <div className="info-section">
                <h3>Description</h3>
                <p>{quizData.description}</p>
              </div>
              <div className="info-section">
                <h3>Questions ({quizData.questions.length})</h3>
                <div className="questions-list">
                  {quizData.questions.map((question, index) => (
                    <div key={question.id} className="question-item">
                      <span className="question-number">{index + 1}.</span>
                      <span className="question-text">{question.text}</span>
                      <div className="question-meta">
                        <span className="question-type">{question.type}</span>
                        <span className="question-points">{question.points} points</span>
                        <span className="question-time">{question.time}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/*Add Question button */}
          <button className="add-question-btnnn" onClick={handleAddQuestion}>
            <FontAwesomeIcon icon={faPlus} /> Add Question

        {/* Quiz Tabs */}
        <div className="quiz-tabs">
          <button
            className={`quiz-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Quiz Information
          </button>
          <button
            className={`quiz-tab ${activeTab === "sessions" ? "active" : ""}`}
            onClick={() => setActiveTab("sessions")}
          >
            Sessions

          </button>
        </div>
      </div>
    </div>
  );
};


export default QuizDetails


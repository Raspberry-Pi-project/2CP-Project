
import { useState, useEffect } from "react";
import "./Finalization1.css";
import { useNavigate } from "react-router-dom";
import { faTrash, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuiz } from "../../context/QuizProvider";
import axios from "axios";



const Finalization1 = () => {
  const navigate = useNavigate();
  const { quizData, setQuizData } = useQuiz();
  const [currentStep, setCurrentStep] = useState(4);
  const [error, setError] = useState(null);
  
  // Get questions from quizData
  const questions = quizData.questions || [];

  const handleEdit = (index) => {
    // Navigate back to generating page with the question to edit
    navigate("/generating", { state: { editIndex: index } });
  };

  const handleDelete = (index) => {
    // Remove the question at the specified index
    const updatedQuestions = questions.filter((_, i) => i !== index);

    // Update question numbers
    const renumberedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      question_number: i + 1,
    }));

    // Update quizData
    setQuizData({
      ...quizData,
      questions: renumberedQuestions,
    });
  };

  const handleAddQuestion = () => {
    // Navigate to generating page to add a new question
    navigate("/generating");
  };

  const handlePublish = () => {
    // Validate quiz data
    if (!quizData.title || !quizData.subject) {
      setError("Title and subject are required");
      return;
    }

    if (questions.length === 0) {
      setError("At least one question is required");
      return;
    }

    // Set status to published
    setQuizData({
      ...quizData,
      status: "published",
    });

    // Navigate to finalization2
    navigate("/finalization2");
  };

  const handleSaveInDraft = async () => {
    // Set status to draft
    setQuizData({
      ...quizData,
      status: "draft",
    });
    console.log("quizData", quizData);
    const publishedQuiz = await axios.post("http://localhost:3000/teachers/createQuiz", quizData , {withCredentials: true} );
    console.log("publishedQuiz", publishedQuiz);
    setQuizData({
      ...quizData,
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
    })
    // Navigate to draft quiz page
    navigate("/draftquiz");
  };

  const handleCancel = () => {
    // Navigate back to generating page
    navigate("/generating");
  };

  return (
    <div className="quiz-generator-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Finalization</h2>
        </div>

        {/* Quiz Content */}
        <div className="quiz-content">
          {/* Step Indicator */}
          <div className="step-indicator">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`step ${currentStep === step ? "active" : ""} ${
                  currentStep > step ? "completed" : ""
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Quiz Summary */}
          <div className="quiz-summary">
            <h3>Quiz Summary</h3>
            <div className="summary-details">
              <p>
                <strong>Title:</strong> {quizData.title}
              </p>
              <p>
                <strong>Subject:</strong> {quizData.subject}
              </p>
              <p>
                <strong>Description:</strong> {quizData.description}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {quizData.duration === -1
                  ? "No time limit"
                  : `${quizData.duration} minutes`}
              </p>
              <p>
                <strong>Attempts:</strong>{" "}
                {quizData.nb_attempts === -1
                  ? "Unlimited"
                  : quizData.nb_attempts}
              </p>
              <p>
                <strong>Score:</strong> {quizData.score}
              </p>
              <p>
                <strong>Correction Type:</strong>{" "}
                {quizData.correctionType === "auto"
                  ? "Auto-graded"
                  : "Manually graded"}
              </p>
              <p>
                <strong>For Year:</strong> {quizData.for_year}
              </p>
              <p>
                <strong>For Group:</strong> {quizData.for_groupe}
              </p>
            </div>
          </div>

          {/* Questions List */}
          <div className="questions-container">
            <h3>Questions ({questions.length})</h3>
            <div className="questions-grid">
              {questions.map((question, index) => (
                <div key={index} className="question-card">
                  <div className="question-header">
                    <span className="question-number">
                      Question {question.question_number}
                    </span>
                    <span className="question-type">
                      {question.question_type}
                    </span>
                  </div>
                  <div className="question-content">
                    <p className="question-text">{question.question_text}</p>
                    <div className="question-details">
                      <span className="question-points">
                        {question.points}{" "}
                        {question.points === 1 ? "point" : "points"}
                      </span>
                      {question.duration > 0 && (
                        <span className="question-duration">
                          {question.duration} seconds
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="question-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(index)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
              <button className="add-question-btn" onClick={handleAddQuestion}>
                <FontAwesomeIcon icon={faPlus} className="plus-icon" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="draft-btn" onClick={handleSaveInDraft}>
              Save as Draft
            </button>
            <button className="publish-btn" onClick={handlePublish}>
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finalization1;


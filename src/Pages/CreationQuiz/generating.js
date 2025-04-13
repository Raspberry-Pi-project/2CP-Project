import React, { useState, useRef, useEffect } from "react";
import "./generating.css";
import { useNavigate } from "react-router-dom";
import { faCheck, faTrash, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuiz } from "../../context/QuizProvider";

const Generating = () => {
  const navigate = useNavigate();
  const { quizData, setQuizData } = useQuiz();

  // Initialize state with values from quizData
  const [questions, setQuestions] = useState(quizData.questions || []);
  const [question_type, setQuestionType] = useState("multiple-choice");
  const [question_text, setQuestionText] = useState("");
  const [question_duration, setQuestionDuration] = useState(0);
  const [question_points, setQuestionPoints] = useState(1);
  const [answers, setAnswers] = useState([{ answer_text: "", correct: 0 }]);
  const [currentStep, setCurrentStep] = useState(3);
  const [error, setError] = useState(null);

  // Refs for dropdowns
  const timerDropdownRef = useRef(null);
  const pointsDropdownRef = useRef(null);
  const [showTimerDropdown, setShowTimerDropdown] = useState(false);
  const [showPointsDropdown, setShowPointsDropdown] = useState(false);

  // Timer options
  const timerOptions = [
    "No Timer",
    "30 seconds",
    "1 minute",
    "2 minutes",
    "5 minutes",
  ];

  // Points options
  const pointsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const addAnswer = () => {
    setAnswers([...answers, { answer_text: "", correct: 0 }]);
  };

  const updateAnswer = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].answer_text = value;
    setAnswers(newAnswers);
  };

  const deleteAnswer = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const toggleCorrect = (index) => {
    const newAnswers = [...answers];
    if (newAnswers[index].correct === 0) {
      newAnswers[index].correct = 1;
    } else {
      newAnswers[index].correct = 0;
    }
    setAnswers(newAnswers);
  };

  // Handle clicking outside of dropdowns
  const handleClickOutside = (event) => {
    if (
      timerDropdownRef.current &&
      !timerDropdownRef.current.contains(event.target)
    ) {
      setShowTimerDropdown(false);
    }
    if (
      pointsDropdownRef.current &&
      !pointsDropdownRef.current.contains(event.target)
    ) {
      setShowPointsDropdown(false);
    }
  };

  const saveQuestion = () => {
    // Validate question
    if (!question_text) {
      setError("Question text is required");
      return;
    }

    if (answers.length < 2) {
      setError("At least two answers are required");
      return;
    }

    if (!answers.some((answer) => answer.correct)) {
      setError("At least one correct answer is required");
      return;
    }

    // Create new question object
    const newQuestion = {
      question_text,
      question_number: questions.length + 1,
      question_type,
      duration: question_duration,
      points: question_points,
      answers: answers.map((answer) => ({
        answer_text: answer.answer_text,
        correct: answer.correct,
      })),
    };

    // Update questions array
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);

    // Update quizData
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });

    // Reset form
    setQuestionText("");
    setQuestionDuration(0);
    setQuestionPoints(1);
    setAnswers([{ answer_text: "", correct: 0 }]);
    setError(null);
  };

  const handleNext = () => {
    // Validate that at least one question has been added
    if (questions.length === 0) {
      setError("At least one question is required");
      return;
    }
    console.log("questions", questions);
    navigate("/finalization1");
  };

  const handleReturn = () => {
    navigate("/duration");
  };

  // Add event listener for clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render quiz content based on quiz type
  const renderQuizContent = () => {
    switch (question_type) {
      case "multiple-choice":
        return (
          <>
            {/* Question Input */}
            <div className="question-container">
              <input
                type="text"
                placeholder="Type Question HERE .."
                className="question-input"
                value={question_text}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            {/* Answer Options */}
            <div className="options-grid">
              {answers.map((answer, index) => (
                <div key={index} className="option-container">
                  <div className="option-icons">
                    <button
                      className={`check-btn ${
                        answer.correct ? "selected" : ""
                      }`}
                      onClick={() => toggleCorrect(index)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteAnswer(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Type Answer"
                    value={answer.answer_text}
                    onChange={(e) => updateAnswer(index, e.target.value)}
                    className="option-input"
                  />
                </div>
              ))}
              <button className="add-option-btn" onClick={addAnswer}>
                <span className="plus-icon">+</span>
              </button>
            </div>
          </>
        );
      case "true-false":
        return (
          <>
            {/* Question Input */}
            <div className="question-container">
              <input
                type="text"
                placeholder="Type Question HERE .."
                className="question-input"
                value={question_text}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            {/* True/False Options */}
            <div className="true-false-container">
              <button
                className={`true-false-btn ${
                  answers[0]?.correct ? "active" : ""
                }`}
                onClick={() => {
                  setAnswers([
                    { answer_text: "TRUE", correct: 1 },
                    { answer_text: "FALSE", correct: 0 },
                  ]);
                }}
              >
                TRUE
              </button>
              <button
                className={`true-false-btn ${
                  answers[1]?.correct ? "active" : ""
                }`}
                onClick={() => {
                  setAnswers([
                    { answer_text: "TRUE", correct: 0 },
                    { answer_text: "FALSE", correct: 1 },
                  ]);
                }}
              >
                FALSE
              </button>
            </div>
          </>
        );
      case "short-answer":
        return (
          <>
            {/* Question Input */}
            <div className="question-container">
              <input
                type="text"
                placeholder="Type Question HERE .."
                className="question-input"
                value={question_text}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            {/* Short Answer Input */}
            <div className="short-answer-container">
              <textarea
                placeholder="Type the correct answer here..."
                className="short-answer-input"
                value={answers[0]?.answer_text || ""}
                onChange={(e) => {
                  setAnswers([{ answer_text: e.target.value, correct: 1 }]);
                }}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="quiz-generator-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Generating quiz</h2>
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

          {/* Quiz Type Selection */}
          <div className="quiz-type-selection">
            <button
              className={`quiz-type-btn ${
                question_type === "multiple-choice" ? "active" : ""
              }`}
              onClick={() => setQuestionType("multiple-choice")}
            >
              Multiple Choice
            </button>
            <button
              className={`quiz-type-btn ${
                question_type === "true-false" ? "active" : ""
              }`}
              onClick={() => setQuestionType("true-false")}
            >
              TRUE/FALSE
            </button>
            <button
              className={`quiz-type-btn ${
                question_type === "short-answer" ? "active" : ""
              }`}
              onClick={() => setQuestionType("short-answer")}
            >
              Short Answer
            </button>
          </div>

          {/* Render quiz content based on selected type */}
          {renderQuizContent()}

          {/* Common Controls */}
          <div className="question-controls">
            <div className="timer-points-container">
              <div className="timer-container" ref={timerDropdownRef}>
                <FontAwesomeIcon icon={faClock} className="timer-icon" />
                <div className="dropdown">
                  <button
                    className="dropdown-btn"
                    onClick={() => setShowTimerDropdown(!showTimerDropdown)}
                  >
                    {question_duration === 0
                      ? "No Timer"
                      : `${question_duration} seconds`}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {showTimerDropdown && (
                    <div className="dropdown-content">
                      {timerOptions.map((option, index) => (
                        <div
                          key={index}
                          className="dropdown-item"
                          onClick={() => {
                            switch (option) {
                              case "No Timer":
                                setQuestionDuration(0);
                                break;
                              case "30 seconds":
                                setQuestionDuration(30);
                                break;
                              case "1 minute":
                                setQuestionDuration(60);
                                break;
                              case "2 minutes":
                                setQuestionDuration(120);
                                break;
                              case "5 minutes":
                                setQuestionDuration(300);
                                break;
                              default:
                                setQuestionDuration(0);
                                break;
                            }
                            setShowTimerDropdown(false);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="points-container" ref={pointsDropdownRef}>
                <div className="dropdown">
                  <button
                    className="dropdown-btn"
                    onClick={() => setShowPointsDropdown(!showPointsDropdown)}
                  >
                    {question_points}{" "}
                    {question_points === 1 ? "Point" : "Points"}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {showPointsDropdown && (
                    <div className="dropdown-content">
                      {pointsOptions.map((option, index) => (
                        <div
                          key={index}
                          className="dropdown-item"
                          onClick={() => {
                            setQuestionPoints(option);
                            setShowPointsDropdown(false);
                          }}
                        >
                          {option} {option === 1 ? "Point" : "Points"}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Question Actions */}
          <div className="question-actions">
            <button className="save-question-btn" onClick={saveQuestion}>
              Save Question
            </button>
          </div>

          {/* Navigation */}
          <div className="navigation-buttons">
            <button className="return-btn" onClick={handleReturn}>
              Return
            </button>
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generating;

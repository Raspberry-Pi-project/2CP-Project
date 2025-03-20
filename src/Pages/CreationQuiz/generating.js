import React, { useState, useRef, useEffect } from "react";
import "./generating.css";
import { useNavigate } from "react-router-dom";
import { faCheck, faTrash, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Generating = () => {
  const navigate = useNavigate();
  const [quizType, setQuizType] = useState("multiple-choice");
  const [options, setOptions] = useState(["", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [multipleCorrect, setMultipleCorrect] = useState(false);
  const [autoGraded, setAutoGraded] = useState(true);
  const [timer, setTimer] = useState("");
  const [points, setPoints] = useState("");
  const [currentStep, setCurrentStep] = useState(3);
  const [question, setQuestion] = useState("");
  const [shortAnswer, setShortAnswer] = useState("");
  const [selectedTrueFalse, setSelectedTrueFalse] = useState("TRUE");
  
  // Refs for dropdowns
  const timerDropdownRef = useRef(null);
  const pointsDropdownRef = useRef(null);
  const [showTimerDropdown, setShowTimerDropdown] = useState(false);
  const [showPointsDropdown, setShowPointsDropdown] = useState(false);

  // Timer options
  const timerOptions = ["No Timer", "30 seconds", "1 minute", "2 minutes", "5 minutes"];
  
  // Points options
  const pointsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const deleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    setCorrectAnswers(correctAnswers.filter((i) => i !== index));
  };

  const toggleCorrect = (index) => {
    if (multipleCorrect) {
      if (correctAnswers.includes(index)) {
        setCorrectAnswers(correctAnswers.filter((i) => i !== index));
      } else {
        setCorrectAnswers([...correctAnswers, index]);
      }
    } else {
      setCorrectAnswers([index]);
    }
  };

  // Handle clicking outside of dropdowns
  const handleClickOutside = (event) => {
    if (timerDropdownRef.current && !timerDropdownRef.current.contains(event.target)) {
      setShowTimerDropdown(false);
    }
    if (pointsDropdownRef.current && !pointsDropdownRef.current.contains(event.target)) {
      setShowPointsDropdown(false);
    }
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
    switch (quizType) {
      case "multiple-choice":
        return (
          <>
            {/* Question Input */}
            <div className="question-container">
              <input 
                type="text" 
                placeholder="Type Question HERE .." 
                className="question-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            {/* Answer Options */}
            <div className="options-grid">
              {options.map((option, index) => (
                <div key={index} className="option-container">
                  <div className="option-icons">
                    <button 
                      className={`check-btn ${correctAnswers.includes(index) ? "selected" : ""}`} 
                      onClick={() => toggleCorrect(index)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button className="delete-btn" onClick={() => deleteOption(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Type Answer"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="option-input"
                  />
                </div>
              ))}
              <button className="add-option-btn" onClick={addOption}>
                <span className="plus-icon">+</span>
              </button>
            </div>

            {/* Quiz Settings */}
            <div className="quiz-settings">
              <div className="answer-type-container">
                <button 
                  className={`answer-type-btn ${!multipleCorrect ? "active" : ""}`} 
                  onClick={() => setMultipleCorrect(false)}
                >
                  Single correct answer
                </button>
                <button 
                  className={`answer-type-btn ${multipleCorrect ? "active" : ""}`} 
                  onClick={() => setMultipleCorrect(true)}
                >
                  Multiple correct answer
                </button>
              </div>
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
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            {/* True/False Options */}
            <div className="true-false-container">
              <button 
                className={`true-false-btn ${selectedTrueFalse === "TRUE" ? "active" : ""}`}
                onClick={() => setSelectedTrueFalse("TRUE")}
              >
                TRUE
              </button>
              <button 
                className={`true-false-btn ${selectedTrueFalse === "FALSE" ? "active" : ""}`}
                onClick={() => setSelectedTrueFalse("FALSE")}
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
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            {/* Short Answer Input */}
            <div className="short-answer-container">
              <textarea 
                placeholder="Type Here ..."
                className="short-answer-input"
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
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
                className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Quiz Type Selection */}
          <div className="quiz-type-selection">
            <button 
              className={`quiz-type-btn ${quizType === "multiple-choice" ? "active" : ""}`} 
              onClick={() => setQuizType("multiple-choice")}
            >
              Multiple Choice
            </button>
            <button 
              className={`quiz-type-btn ${quizType === "true-false" ? "active" : ""}`} 
              onClick={() => setQuizType("true-false")}
            >
              TRUE/FALSE
            </button>
            <button 
              className={`quiz-type-btn ${quizType === "short-answer" ? "active" : ""}`} 
              onClick={() => setQuizType("short-answer")}
            >
              Short Answer
            </button>
          </div>

          {/* Render quiz content based on selected type */}
          {renderQuizContent()}

          {/* Common Controls */}
          <div className="common-controls">
            <div className="timer-points-container">
              <div className="timer-container" ref={timerDropdownRef}>
                <FontAwesomeIcon icon={faClock} className="timer-icon" />
                <div className="dropdown">
                  <button 
                    className="dropdown-btn"
                    onClick={() => setShowTimerDropdown(!showTimerDropdown)}
                  >
                    {timer || "Timer"}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {showTimerDropdown && (
                    <div className="dropdown-content">
                      {timerOptions.map((option, index) => (
                        <div 
                          key={index} 
                          className="dropdown-item"
                          onClick={() => {
                            setTimer(option);
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
                    {points ? `${points} Points` : "Points"}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {showPointsDropdown && (
                    <div className="dropdown-content">
                      {pointsOptions.map((option, index) => (
                        <div 
                          key={index} 
                          className="dropdown-item"
                          onClick={() => {
                            setPoints(option);
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

              <div className="grading-toggle">
                <ToggleSwitch isOn={autoGraded} handleToggle={() => setAutoGraded(!autoGraded)} />
              </div>
            </div>
            
            <div className="navigation-buttons">
              <button className="return-btn" onClick={() => navigate("/Duration")}>
                Return
              </button>
              <button className="next-btn" onClick={() => navigate("/Finalization1")}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ isOn, handleToggle }) => {
  return (
    <div className="toggle-container" onClick={handleToggle}>
      <div className={`toggle-switch ${isOn ? "active" : ""}`}>
        <button 
          className={`toggle-option ${isOn ? "selected" : ""}`}
        >
          AutoGraded
        </button>
        <button
          className={`toggle-option ${!isOn ? "selected" : ""}`}
        >
          Manually
        </button>
      </div>
    </div>
  );
};

export default Generating;
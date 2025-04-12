
import { useEffect, useState } from "react";
import "./Duration.css";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../context/QuizProvider";

const Duration = () => {
  const navigate = useNavigate();
  const { quizData, setQuizData } = useQuiz();

  const [nb_attempts, setNbAttempts] = useState(quizData.nb_attempts || 1);
  const [duration, setDuration] = useState(
    quizData.duration || "No time limit"
  );
  const [score, setScore] = useState(quizData.score || 0);
  const [currentStep, setCurrentStep] = useState(2);
  const [showAttemptsDropdown, setShowAttemptsDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  // Options for dropdowns
  const attemptsOptions = ["1", "2", "3", "Unlimited"];
  const durationOptions = [
    "5 minutes",
    "10 minutes",
    "15 minutes",
    "20 minutes",
    "30 minutes",
    "45 minutes",
    "1 hour",
    "No time limit",
  ];

  useEffect(() => {
    setQuizData({ ...quizData, nb_attempts, duration, score });
    console.log(quizData);
  }, [nb_attempts, duration, score]);

  const handleReturn = () => {
    setQuizData({ ...quizData, nb_attempts, duration, score });
    navigate("/Info");
  };

  const handleNext = () => {
    setQuizData({ ...quizData, nb_attempts, duration, score });
    navigate("/generating");
  };


  return (
    <div className="quiz-generator-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Duration and Attempts</h2>
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

          {/* Duration and Attempts Form */}
          <div className="duration-attempts-form">
            <div className="form-group">
              <label>number of Attempts :</label>
              <div className="dropdown-container">
                <div
                  className="dropdown-field"
                  onClick={() => setShowAttemptsDropdown(!showAttemptsDropdown)}
                >
                  <span>
                    {nb_attempts || "enter the number of possible attempts"}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </div>
                {showAttemptsDropdown && (
                  <div className="dropdown-options">
                    {attemptsOptions.map((option, index) => (
                      <div
                        key={index}
                        className="dropdown-option"
                        onClick={() => {
                          if (option === "Unlimited") {
                            setNbAttempts(-1);
                          } else {
                            setNbAttempts(parseInt(option));
                          }
                          setShowAttemptsDropdown(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Duration :</label>
              <div className="dropdown-container">
                <div
                  className="dropdown-field"
                  onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                >
                  <span>{duration || "Enter the General Duration"}</span>
                  <span className="dropdown-arrow">▼</span>
                </div>
                {showDurationDropdown && (
                  <div className="dropdown-options">
                    {durationOptions.map((option, index) => (
                      <div
                        key={index}
                        className="dropdown-option"
                        onClick={() => {
                          switch (option) {
                            case "1 hour":
                              setDuration(60);
                              break;
                            case "45 minutes":
                              setDuration(45);
                              break;
                            case "30 minutes":
                              setDuration(30);
                              break;
                            case "20 minutes":
                              setDuration(20);
                              break;
                            case "15 minutes":
                              setDuration(15);
                              break;
                            case "10 minutes":
                              setDuration(10);
                              break;
                            case "5 minutes":
                              setDuration(5);
                              break;
                            case "No time limit":
                              setDuration(-1);
                              break;
                            default:
                              setDuration(-1);
                              break;
                          }
                          setShowDurationDropdown(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-note">
              you can set the duration of each question later .
            </div>

            <div className="form-group">
              <label>Score:</label>
              <input
                type="number"
                placeholder="enter the total score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="form-input"
              />
            </div>
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

export default Duration;

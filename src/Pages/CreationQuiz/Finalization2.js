import { useEffect, useState } from "react";
import "./Finalization2.css";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../context/QuizProvider";
import axios from "axios";

const Finalization2 = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(5);
  const [yearOfStudy, setYearOfStudy] = useState();
  const [group, setGroup] = useState();
  const {quizData, setQuizData} = useQuiz();
  const handleReturn = () => {
    navigate("/Finalization1");
  };
  useEffect(() => {
    setQuizData({
      ...quizData,
      for_year: parseInt(yearOfStudy),
      for_groupe: parseInt(group),
    });
  }, [yearOfStudy, group]);

  async function handlePublish() {
    setQuizData({
      ...quizData,
      for_year: parseInt(yearOfStudy),
      for_groupe: parseInt(group),
      status: "published",
    });
    const publishedQuiz = await axios.post(
      "http://localhost:3000/teachers/createQuiz",
      quizData,
      { withCredentials: true }
    );
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
    });
    // Navigate to draft quiz page
    navigate("/draftquiz");
    // Publish quiz
    //console.log("Quiz published");
    // Navigate to dashboard or confirmation page orr as needed i do not know wch hbin dyro ki npubliyiwh
    //navigate("/dashboard");
  }
  const handleCancel = () => {
    // Cancel and go back
    navigate("/finalization1");
  };

  return (
    <div className="quiz-generator-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Finalazation</h2>
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

          {/* Final Form */}
          <div className="final-form">
            <div className="form-group">
              <label>YEAR OF STUDY : (optional) </label>
              <input

                
                placeholder="enter the year of study"

                type="number"
                

                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>GROUPE : (optional)</label>
              <input              
                placeholder="enter the group"
                type="number"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons final-actions">
            <button className="publish-btn" onClick={handlePublish}>
              Publish
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finalization2;

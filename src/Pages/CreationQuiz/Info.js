import React, { useState, useEffect } from "react";
import "./Info.css";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../context/QuizProvider";
import { useAuth } from "../../context/AuthProvider";
const Infos = () => {
  const navigate = useNavigate();
  const { quizData, setQuizData } = useQuiz();
  const { user  } = useAuth();
  // Initialize state with values from quizData
  const [subject, setSubject] = useState(quizData.subject || "");
  const [title, setTitle] = useState(quizData.title || "");
  const [description, setDescription] = useState(quizData.description || "");
  const [for_year, setForYear] = useState(quizData.for_year || "");
  const [for_groupe, setForGroupe] = useState(quizData.for_groupe || "");
  const [image, setImage] = useState(quizData.image || null);

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Update quizData when form fields change
  useEffect(() => {
    setQuizData({
      ...quizData,
      id_teacher : user.id,
      subject,
      title,
      description,
      for_year : parseInt(for_year),
      for_groupe : parseInt(for_groupe),
    });
  }, [subject, title, description, for_year, for_groupe , user]);

  const handleNext = async () => {
    // Validate required fields
    if (!title || !subject) {
      setError("Title and subject are required");
      return;
    }

    // Save entered data before navigating
    setQuizData({
      ...quizData,
      id_teacher: user.id,
      subject,
      title,
      description,
      for_year : parseInt(for_year),
      for_groupe : parseInt(for_groupe),
    });
    console.log("quizData", quizData);
    navigate("/duration");
  };

  return (
    <div className="quiz-generator-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Quiz Infos</h2>
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

          {/* Quiz Info Form */}
          <div className="quiz-info-form">
            <div className="form-group">
              <label>Subject:</label>
              <input
                type="text"
                placeholder="Enter your subject name here"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                placeholder="Name your quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                placeholder="Describe your quiz"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Image :</label>
              <div className="image-upload-container">
                {image ? (
                  <div className="image-preview">
                    <img src={image || "/placeholder.svg"} alt="Quiz" />
                    <button 
                      className="remove-image-btn"
                      onClick={() => setImage(null)}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="image-upload-label">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-placeholder">
                      Add one +
                    </div>
                  </label>
                )}
              </div>
            </div>

            

            {error && <div className="error-message">{error}</div>}
          </div>

          {/* Navigation */}
          <div className="navigation-buttons quiz-info-nav">
            <div></div> {/* Empty div for spacing */}
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infos;

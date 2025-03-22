import React, { useState, useEffect } from "react";
import "./Info.css";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../context/QuizProvider"; // Import useQuiz


const Infos = () => {
  const navigate = useNavigate();
  const { quizData, setQuizData } = useQuiz();
  const defaultQuizData = quizData || { subject: "", title: "", description: "", image: null };
  const [subject, setSubject] = useState(defaultQuizData.subject || "");
  const [title, setTitle] = useState(defaultQuizData.title || "");
  const [description, setDescription] = useState(defaultQuizData.description || "");
  const [image, setImage] = useState(defaultQuizData.image || null);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

 //  Ensure state updates when navigating back
   useEffect(() => {
     setQuizData({ ...quizData,subject, title, description, image });
    }, [subject, title, description, image]);


  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]); // ✅ Define imageUrl here
      setImage(imageUrl);
      setQuizData({ ...quizData, image: imageUrl });
    }
  };

  const handleNext = async () => {

    // Save entered data before navigating
    setQuizData({ subject, title, description, image });

    //console.log("Navigating to Duration Page with data:", { title, description }); 
   navigate("/duration");
  }

  return (
    <div className="quiz-generator-container">

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Quizz Infos</h2>
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

          {/* Quiz Info Form */}
          <div className="quiz-info-form">
            <div className="form-group">
              <label>Subject :</label>
              <input 
                type="text" 
                placeholder="Enter your subject name here" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Title :</label>
              <input 
                type="text" 
                placeholder="name your quiz" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <input 
                type="text" 
                placeholder="name your quiz" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
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

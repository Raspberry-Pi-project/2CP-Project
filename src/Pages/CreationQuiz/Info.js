import React, { useState } from "react";
import "./Info.css";
import { useNavigate } from "react-router-dom";

const Infos = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleNext = () => {
    navigate("/duration");
  };

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

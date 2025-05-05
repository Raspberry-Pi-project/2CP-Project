import React, { useState, useEffect } from "react";
import "./Info.css";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../context/QuizProvider";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { API_URL } from "../../config";
const Infos = () => {
  const navigate = useNavigate();
  const { quizData, setQuizData } = useQuiz();
  const { user } = useAuth();
  // Initialize state with values from quizData
  const [subject, setSubject] = useState(quizData.subject || "");
  const [title, setTitle] = useState(quizData.title || "");
  const [description, setDescription] = useState(quizData.description || "");
  const [file, setFile] = useState(null);

  const [image, setImage] = useState(quizData.image || null);
  

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setQuizData({
      ...quizData,
      title: "",
      description: "",
      subject: "",
      nb_attempts: 1,
      duration: 30, // Default 30 minutes
      correctionType: "auto", // Default to auto-graded
      score: 100, // Default score
      for_year: 0, // To be filled by user
      for_groupe: 0, // To be filled by user
      status: "draft", // Default to draft
      questions: [], // Array to hold questions
      navigation: "linear", // Default navigation
    });
  }, []);

  // Update quizData when form fields change
  useEffect(() => {
    setQuizData({
      ...quizData,
      id_teacher: user.id,
      subject,
      title,
      description,
      
    });
  }, [subject, title, description, user, image]);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]); // ✅ Define imageUrl here
      setFile(e.target.files[0]); // Set the file state
      setImage(imageUrl);
      setQuizData({ ...quizData, image: imageUrl });
      return;
    }
    setImage(null);
    setQuizData({ ...quizData, image: null });
  };

  const handleNext = async () => {
    // Validate required fields
    if (!title || !subject) {
      setError("Title and subject are required");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_teacher", user.id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subject", subject);
    try {
      const craetedQuiz = await axios.post(
        `http://${API_URL}:3000/teachers/createQuiz`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`, // Include the token in the headers
          },
        },
        { withCredentials: true }
      );
      console.log("craetedQuiz", craetedQuiz);
      setQuizData({
        ...quizData,
        id_quiz: craetedQuiz.data.newQuiz.id_quiz,
        id_teacher: user.id,
        subject,
        title,
        description,
        
      });
      console.log("quizData", quizData);
      navigate("/duration");
      console.log("Quiz created successfully:", craetedQuiz.data);
    } catch (error) {
      console.error("Error creating quiz:", error);
      setError("Failed to create quiz. Please try again.");
    }

    // Save entered data before navigating
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
                {file ? (
                  <div className="image-preview">
                    <img src={image || "/placeholder.svg"} alt="Quiz" />
                    <button
                      className="remove-image-btn"
                      onClick={() => setFile(null)}
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
                      style={{ display: "none" }}
                    />
                    <div className="upload-placeholder">Add one +</div>
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

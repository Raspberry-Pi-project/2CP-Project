import { useState } from "react"
import "./Finalization2.css"
import { useNavigate } from "react-router-dom"

const Finalization2 = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(5)
  const [yearOfStudy, setYearOfStudy] = useState("")
  const [group, setGroup] = useState("")

  const handleReturn = () => {
    navigate("/Finalization1")
  }

  function handlePublish() {
    // Publish quiz
    console.log("Quiz published")
    // Navigate to dashboard or confirmation page
    navigate("/dashboard")
  }
  const handleCancel = () => {
    // Cancel and go back
    navigate("/finalization1")
  }

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
                className={`step ${currentStep === step ? "active" : ""} ${currentStep > step ? "completed" : ""}`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Final Form */}
          <div className="final-form">
            <div className="form-group">
              <label>YEAR OF STUDY :</label>
              <input
                type="text"
                placeholder="enter the total score"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>GROUPE :</label>
              <input
                type="text"
                placeholder="enter the total score"
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
  )
}

export default Finalization2;
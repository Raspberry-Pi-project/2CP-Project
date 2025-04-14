
import { useState } from "react"
import "./Finalization1.css"
import { useNavigate } from "react-router-dom"
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Finalization1 = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(4)
  const [questions, setQuestions] = useState([
    { id: 1, title: "Question 01" },
    { id: 2, title: "Question 02" },
    { id: 3, title: "Question 03" },
  ])

  const handleEdit = (id) => {
    // Navigate to edit question page or open modal
    console.log(`Edit question ${id}`)
  }

  const handleDelete = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleAddQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1
    setQuestions([...questions, { id: newId, title: `Question ${String(newId).padStart(2, "0")}` }])
  }

  const handlePublish = () => {
    navigate("/finalization2")
  }

  const handleSaveInDraft = () => {
    // Save quiz in draft
    console.log("Saved in draft")
    navigate("/draftquiz")
  }

  const handleCancel = () => {
    // Cancel and go back
    navigate("/generating")
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

          {/* Questions List */}
          <div className="questions-container">
            <div className="questions-grid">
              {questions.map((question) => (
                <div key={question.id} className="question-card">
                  <div className="question-actions">
                    <button className="edit-btn" onClick={() => handleEdit(question.id)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(question.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div className="question-title">{question.title}</div>
                </div>
              ))}
              <button className="add-question-btn" onClick={handleAddQuestion}>
                <FontAwesomeIcon icon={faPlus} className="plus-icon" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="publish-btn" onClick={handlePublish}>
              Next to Publish
            </button>
            <button className="draft-btn" onClick={handleSaveInDraft}>
              Save in Draft
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

export default Finalization1;



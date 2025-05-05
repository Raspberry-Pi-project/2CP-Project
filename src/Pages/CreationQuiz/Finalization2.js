import { useEffect, useState } from "react"
import "./Finalization2.css"
import { useNavigate } from "react-router-dom"
import { useQuiz } from "../../context/QuizProvider"
import { useAuth } from "../../context/AuthProvider"
import axios from "axios"
import PresentationConfirmationDialog from "./presentation-confirmation-dialog"
import PresentationMode from "./presentation-mode"
import { API_URL } from "../../config"
import { useQuizTimer } from "../../context/QuizTimerContext"

const Finalization2 = () => {
  const { startTimer } = useQuizTimer();
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(5)
  const [yearOfStudy, setYearOfStudy] = useState()
  const [group, setGroup] = useState()
  const { quizData, setQuizData } = useQuiz()
  const [showPresentationConfirmation, setShowPresentationConfirmation] = useState(false)
  const [showPresentation, setShowPresentation] = useState(false)
  const [timerType, setTimerType] = useState("wholeQuiz")

  const handleReturn = () => {
    navigate("/Finalization1")
  }

  useEffect(() => {
    setQuizData({
      ...quizData,
      for_year: Number.parseInt(yearOfStudy),
      for_groupe: Number.parseInt(group),
      status: "active",
    })
  }, [yearOfStudy, group])

  async function handlePublish() {
    // Update quiz data with year and group
    setQuizData({
      ...quizData,
      for_year: Number.parseInt(yearOfStudy),
      for_groupe: Number.parseInt(group),
      status: "active",
    })

    // Show presentation confirmation dialog
    setShowPresentationConfirmation(true)
  }

  const handleContinuePublish = async () => {
    // Close the confirmation dialog
    setShowPresentationConfirmation(false)

    // Publish the quiz
    try {
      const publishedQuiz = await axios.post(
        `http://${API_URL}:3000/teachers/updateQuiz`,
        quizData,
        { headers: { Authorization: `Bearer ${user.token}` } },
        { withCredentials: true },
      )
      if (publishedQuiz.status !== 200) {
        throw new Error("Failed to publish quiz")
      }
      console.log("publishedQuiz", publishedQuiz)
      startTimer(quizData.id_quiz,quizData.duration * 60, async () =>{
        try {
          const response = await axios.post(
            `http://${API_URL}:3000/teachers/updateQuiz`,
            { id_quiz: quizData.id_quiz, status: "published" },
            { headers: { Authorization: `Bearer ${user.token}` } },
            { withCredentials: true },
          )
          console.log("response", response)
        } catch (error) {
          console.error("Error updating quiz status:", error)
        }
      })

      setQuizData({
        ...quizData,
        title: "",
        description: "",
        subject: "",
        nb_attempts: 1,
        duration: 30,
        correctionType: "auto",
        score: 100,
        for_year: 0,
        for_groupe: 0,
        status: "draft",
        questions: [],
      })


      navigate("/draftquiz")
    } catch (error) {
      console.error("Error publishing quiz:", error)
    }
  }

  const handleStartPresentation = (selectedTimerType) => {

    setShowPresentationConfirmation(false)

    setTimerType(selectedTimerType)

    setShowPresentation(true)
  }

  const handlePresentationClose = async () => {
    setShowPresentation(false)

    try {
      const publishedQuiz = await axios.post(
        `http://${API_URL}:3000/teachers/updateQuiz`,
        quizData,
        { headers: { Authorization: `Bearer ${user.token}` } },
        { withCredentials: true },
      )
      console.log("publishedQuiz", publishedQuiz)


      setQuizData({
        ...quizData,
        title: "",
        description: "",
        subject: "",
        nb_attempts: 1,
        duration: 30,
        correctionType: "auto",
        score: 100,
        for_year: 0,
        for_groupe: 0,
        status: "draft",
        questions: [],
      })

      // Navigate to draft quiz page
      navigate("/draftquiz")
    } catch (error) {
      console.error("Error publishing quiz:", error)
    }
  }

  const handleCancel = () => {
    // Cancel and go back
    navigate("/finalization1")
  }

  return (
    <div className="quiz-generator-container">

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

      {/* Presentation Confirmation Dialog */}
      {showPresentationConfirmation && (
        <PresentationConfirmationDialog
          quiz={quizData}
          onClose={() => setShowPresentationConfirmation(false)}
          onPresent={handleStartPresentation}
          onContinuePublish={handleContinuePublish}
        />
      )}

      {/* Presentation Mode */}
      {showPresentation && <PresentationMode quiz={quizData} timerType={timerType} onClose={handlePresentationClose} />}
    </div>
  )
}

export default Finalization2

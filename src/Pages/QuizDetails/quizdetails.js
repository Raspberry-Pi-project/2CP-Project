import "./quizdetails.css"
import { useNavigate, useParams } from "react-router-dom"
import { faPlus, faEdit, faChartBar, faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const QuizDetails = () => {
  const navigate = useNavigate()
  const { quizId } = useParams()

  // Sample quiz data
  const quizData = {
    id: quizId,
    title: "AI",
    subject: "Subject",
    language: "Language",
    description: "A quiz about artificial intelligence concepts and applications.",
    image: "https://aipromptopus.com/wp-content/uploads/2023/12/train-your-ai-.jpeg",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        text: "What does AI stand for?",
        options: ["Automated Information", "Artificial Intelligence", "Advanced Innovation"],
        correctAnswer: 1,
        points: 1,
        time: 30,
      },
      {
        id: 2,
        type: "true-false",
        text: "Machine Learning is a type of AI where computers learn from data",
        correctAnswer: true,
        points: 2,
        time: 45,
      },
    ],
    sessions: [
      {
        id: 1,
        date: "2023-05-15",
        participants: 25,
        averageScore: 85,
      },
      {
        id: 2,
        date: "2023-06-20",
        participants: 32,
        averageScore: 78,
      },
    ],
  }

  // Handle starting a new session
  const handleStartSession = () => {
    console.log("Starting new session")
    // Navigate to session setup page
    navigate(`/session-setup/${quizId}`) // this one must go to the page of finalization2 (to set group and year of study) then publish it
  }

  // Handle adding questions
  const handleAddQuestion = () => {
    navigate(`/generating/${quizId}`) // this must go to the generating quizz question in the same quizz id
  }

  // Handle editing quiz
  const handleEditQuiz = () => {
    navigate(`/quizInfos/${quizId}`) // this one go to the page of finalization1
  }


  const handleViewResults = () => {
    navigate(`/ResultsPage/${quizId}`) // this one must go to the page of results of this quizId same as li rahoum lfo9
  }

  return (
    <div className="quiz-details-container">
      {/* Main Content */}
      <div className="quiz-details-content">
        {/* Quiz Header */}
        <div className="quiz-header">
          <div className="quiz-header-left">
            <div className="quiz-image">
              <img src={quizData.image || "/placeholder.svg"} alt={quizData.title} />
            </div>
            <div className="quiz-header-info">
              <h1 className="quiz-title">{quizData.title}</h1>
              <div className="quiz-meta">
                <div className="quiz-meta-item">
                  <span className="meta-label">Subject</span>
                  <span className="meta-value">{quizData.subject}</span>
                </div>
                <div className="quiz-meta-item">
                  <span className="meta-label">Language</span>
                  <span className="meta-value">{quizData.language}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="quiz-header-actions">
            <button className="view-results-button" onClick={handleViewResults}>
              <FontAwesomeIcon icon={faChartBar} /> View Results
            </button>
            <button className="start-session-button" onClick={handleStartSession}>
              <FontAwesomeIcon icon={faPlay} /> Start Session
            </button>
            <button className="edit-quiz-btn" onClick={handleEditQuiz}>
              <FontAwesomeIcon icon={faEdit} /> Edit Quiz
            </button>
          </div>
        </div>

        {/* Quiz Information Section */}
        <div className="quiz-info-section">
          <h2 className="section-title">Quiz Information</h2>

          <div className="tab-content">
            <div className="quiz-details-info">
              <div className="info-section">
                <h3>Description</h3>
                <p>{quizData.description}</p>
              </div>
              <div className="info-section">
                <h3>Questions ({quizData.questions.length})</h3>
                <div className="questions-list">
                  {quizData.questions.map((question, index) => (
                    <div key={question.id} className="question-item">
                      <span className="question-number">{index + 1}.</span>
                      <span className="question-text">{question.text}</span>
                      <div className="question-meta">
                        <span className="question-type">{question.type}</span>
                        <span className="question-points">{question.points} points</span>
                        <span className="question-time">{question.time}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/*Add Question button */}
          <button className="add-question-btnnn" onClick={handleAddQuestion}>
            <FontAwesomeIcon icon={faPlus} /> Add Question
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizDetails

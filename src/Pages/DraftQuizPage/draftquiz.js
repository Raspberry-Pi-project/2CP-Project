import "./draftquiz.css"
import { useNavigate } from "react-router-dom"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const DraftQuiz = () => {
  const navigate = useNavigate()

  // Sample draft quizzes
  const draftQuizzes = [
    {
      id: 1,
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
      image: "https://aipromptopus.com/wp-content/uploads/2023/12/train-your-ai-.jpeg",
    },
  ]

  // Handle starting a quiz
  const handleStart = (quizId) => {
    navigate(`/finalization2/${quizId}`)   // will go to the page of finalization2 basing on it s id 
  }

  // Handle quiz options
  const handleQuizOptions = (quizId) => {   // if we want to add the option of delet or other things ...
    console.log(`Options for quiz ${quizId}`)
  }

  return (
    <div className="draft-container">

      {/* Main Content */}
      <div className="draft-content">
        <h1 className="page-title">Draft Quizzes</h1>

        {/* Draft Quiz Grid */}
        <div className="draft-grid">
          {draftQuizzes.map((quiz) => (
            <div key={quiz.id} className="draft-card">
              <div className="draft-image">
                <img src={quiz.image || "/placeholder.svg"} alt={quiz.title} />
              </div>
              <div className="draft-info">
                <h3 className="draft-title">{quiz.title}</h3>
                <p className="draft-difficulty">{quiz.difficulty}</p>
                <p className="draft-questions">{quiz.questions} Questions</p>
                <div className="draft-actions">
                  <button className="start-btn" onClick={() => handleStart(quiz.id)}>
                    START
                  </button>
                  <button className="options-btn" onClick={() => handleQuizOptions(quiz.id)}>
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DraftQuiz;


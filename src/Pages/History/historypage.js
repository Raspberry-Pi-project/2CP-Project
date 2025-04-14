import { useState } from "react"
import "./historypage.css"
import { useNavigate } from "react-router-dom"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const HistoryPage = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState("All")

  // Sample quiz data
  const quizzes = [
    {
      id: 1,
      title: "AI Challenge",
      difficulty: "Medium",
      questions: 10,
      image: "https://aipromptopus.com/wp-content/uploads/2023/12/train-your-ai-.jpeg",
      category: "date",
    },
    {
      id: 2,
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
      image:
        "https://cdn.pixabay.com/photo/2024/06/20/11/59/data-8841981_1280.png",
      category: "recently",
    },
    {
      id: 3,
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
      image:
        "https://miro.medium.com/v2/resize:fit:1200/1*J38nYZU7gzu-4lQmtjlSUw.jpeg",
      category: "A-Z",
    },
    {
      id: 4,
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
      image: "https://employees.mcco.com/img/msds.png",
      category: "A-Z",
    },
    {
      id: 5,
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
      image: "https://cdn.pixabay.com/photo/2022/12/09/03/55/big-data-7644537_640.jpg",
      category: "A-Z",
    },
    {
      id: 6,
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
      image:
        "https://mir-s3-cdn-cf.behance.net/project_modules/1400/b2fc78180847927.6511e1644fae9.jpg",
      category: "recently",
    },
    {
      id: 7,
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
      image: "https://cdn.pixabay.com/photo/2015/08/19/05/16/large-895564_1280.jpg",
      category: "Data structure",
    },
    {
      id: 8,
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
      image: "https://cdn.pixabay.com/photo/2015/08/19/05/16/large-895564_1280.jpg",
      category: "Arrays",
    },
  ]

  // Filter options
  const filters = ["All", "A-Z", "date", "recently", "Data structure", "Arrays"]

  // Handle consulting a quiz
  const handleConsult = (quizId) => {
    navigate(`/quiz-details/${quizId}`)
  }

  // Handle quiz options
  const handleQuizOptions = (quizId) => {
    console.log(`Options for quiz ${quizId}`)
  }

  // Filter quizzes based on active filter
  const filteredQuizzes = activeFilter === "All" ? quizzes : quizzes.filter((quiz) => quiz.category === activeFilter)

  return (
    <div className="history-container">
      {/* Main Content */}
      <div className="history-content">
        {/* Filter Tabs */}
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Quiz Grid */}
        <div className="quiz-grid">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-image">
                <img src={quiz.image || "/placeholder.svg"} alt={quiz.title} />
              </div>
              <div className="quiz-info">
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="quiz-difficulty">{quiz.difficulty}</p>
                <p className="quiz-questions">{quiz.questions} Questions</p>
                <div className="quiz-actions">



{/****************************************************************************************************** 
---------->>>>> HERE WHERE YOU HAVE TO WORK WITH THE ID TO GO TO THE QUIZ DETAILS PAGE for each one 
              
                  <button className="consult-btn" onClick={() => handleConsult(quiz.id)}>
                    CONSULTE
                  </button>

              */}



              {/*HERE I HAVE JUST PUT EXMPLE TO TEST AND SEE THE FUNCTIONALITY OF QUIZ DETAILS OPTION, WHEN YOU FINISH THE FIRST DELETE THIIS ONE IT IS ADDITIONAL*/}
              <button className="consult-btn" onClick={() => navigate("/quizdetails") }>
                    CONSULTE
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

export default HistoryPage;


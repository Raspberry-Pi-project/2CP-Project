import "./results.css"
import { useNavigate, useParams } from "react-router-dom"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Results = () => {
  const navigate = useNavigate()
  const { quizId, sessionId } = useParams()

  // Sample quiz data
  const quizData = {
    id: quizId,
    title: "AI",
    subject: "Intro to AI",
    language: "English",
    image:
      "https://aipromptopus.com/wp-content/uploads/2023/12/train-your-ai-.jpeg",
    questions: [
      {
        id: 1,
        type: "Muliple choice",
        text: "What does AI stand for?",
        options: ["Automated Information", "Artificial Intelligence", "Advanced Innovation"],
        correctAnswer: 1,
        points: 1,
        time: 30,
      },
      {
        id: 2,
        type: "True/False",
        text: "Machine Learning is a type of AI where computers learn from data",
        correctAnswer: true,
        points: 2,
        time: 45,
      },
    ],
    participants: [
      {
        id: 100,
        name: "Amri Asmaa",
        score: 100,
        percentage: "100%",
      },
      {
        id: 160,
        name: "Bahri Assia",
        score: 99,
        percentage: "99%",
      },
      {
        id: 89,
        name: "Mostefaoui Lyna",
        score: 70,
        percentage: "99%",
      },
      {
        id: 45,
        name: "Amri Asmaa",
        score: 56,
        percentage: "56%",
      },
      {
        id: 9,
        name: "Bahri Assia",
        score: 45,
        percentage: "100%",
      },
      {
        id: 101,
        name: "Mostefaoui Lyna",
        score: 100,
        percentage: "100%",
      },
      {
        id: 161,
        name: "Bahri Assia",
        score: 99,
        percentage: "99%",
      },
      {
        id: 90,
        name: "Amri Asmaa",
        score: 70,
        percentage: "70%",
      },
      {
        id: 46,
        name: "Amri Asmaa",
        score: 56,
        percentage: "56%",
      },
      {
        id: 10,
        name: "Mostefaoui lyna",
        score: 45,
        percentage: "45%",
      },
    ],
    successRates: [
      { question: "Question 1", rate: 95 },
      { question: "Question 2", rate: 75 },
      { question: "Question 3", rate: 60 },
      { question: "Question 4", rate: 85 },
      { question: "Question 5", rate: 40 },
    ],
  }

  // Chart data
  const chartData = {
    labels: quizData.successRates.map((item) => item.question),
    datasets: [
      {
        label: "Success Rate (%)",
        data: quizData.successRates.map((item) => item.rate),
        backgroundColor: "rgba(123, 104, 238, 0.4)",
        borderColor: "rgba(123, 104, 238, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => value + "%",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  }

  return (
    <div className="results-container">
 
      {/* Main Content */}
      <div className="results-content">
        <div className="results-layout">
          {/* Left Column - Quiz Info and Participants */}
          <div className="results-left-column">
            {/* Quiz Info */}
            <div className="quiz-info-card">
              <div className="quiz-info-header">
                <div className="quiz-image">
                  <img src={quizData.image || "/placeholder.svg"} alt={quizData.title} />
                </div>
                <div className="quiz-info">
                  <h2 className="quiz-title">{quizData.title}</h2>
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
            </div>

            {/* Participants List */}
            <div className="participants-card">
              <h3 className="card-title">Participants List</h3>
              <div className="participants-list">
                {quizData.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className={`participant-item ${participant.percentage === "100%" ? "perfect-score" : ""}`}
                  >
                    <div className="participant-id">{participant.id}</div>
                    <div className="participant-name">{participant.name}</div>
                    <div className="participant-score">{participant.percentage}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Questions and Chart */}
          <div className="results-right-column">
            {/* Questions List */}
            <div className="questions-card">
              <h3 className="card-title">{quizData.questions.length} Questions</h3>
              <div className="questions-list">
                {quizData.questions.map((question, index) => (
                  <div key={question.id} className="question-item">
                    <div className="question-header">
                      <div className="question-number">{index + 1}.</div>
                      <div className="question-type">{question.type}</div>
                      <div className="question-meta">
                        <span className="question-time">{question.time}s</span>
                        <span className="question-points">
                          {question.points}point{question.points !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="question-text">{question.text}</div>
                    <div className="question-answers">
                      {question.type === "Muliple choice" ? (
                        <div className="multiple-choice-answers">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`answer-option ${optIndex === question.correctAnswer ? "correct" : ""}`}
                            >
                              {option}
                              {optIndex === question.correctAnswer && <span className="correct-indicator">✓</span>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="true-false-answers">
                          <div className={`answer-option ${question.correctAnswer === true ? "correct" : ""}`}>
                            True
                            {question.correctAnswer === true && <span className="correct-indicator">✓</span>}
                          </div>
                          <div className={`answer-option ${question.correctAnswer === false ? "correct" : ""}`}>
                            False
                            {question.correctAnswer === false && <span className="correct-indicator">✓</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Rate Chart */}
            <div className="chart-card">
              <h3 className="card-title">Success Rate</h3>
              <div className="chart-container">
                <Bar data={chartData} options={chartOptions} height={300} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results;


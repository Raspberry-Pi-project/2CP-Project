import "./results.css";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuiz } from "../../context/QuizProvider";
import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Results = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { quizData, setQuizData } = useQuiz();
  const [studentsList, setStudentsList] = useState([]);
  useEffect(()=>{
    console.log("Student List : ", studentsList)
  },[studentsList])

  useEffect(() => {
    const getStudentsList = async () => {
      try {
        const response = await axios.post(
          `http://${API_URL}:3000/teachers/countParticipants`,
          {
            id_quiz: quizData.id_quiz,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch students list");
        }
        console.log("response ",response)
        setStudentsList(response.data.totalStudents)
      } catch (error) {
        console.error("Error fetching students list:", error);
      }
    };

    const calculatePercetage = async () => {
      try {
        const response = await axios.put(
          `http://${API_URL}:3000/teachers/calculatePercentage`,
          { id_quiz: quizData.id_quiz },
          {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
          }
        );

        const responseQuestionsMap = {};
        response.data.forEach((question) => {
          responseQuestionsMap[question.id_question] = question;
        });

        const updatedQuestions = quizData.questions.map((question) => {
          if (responseQuestionsMap[question.id_question]) {
            return {
              ...question,
              ...responseQuestionsMap[question.id_question],
            };
          }
          return question;
        });

        setQuizData({
          ...quizData,
          questions: updatedQuestions,
        });
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    calculatePercetage();
    getStudentsList(); 

  }, []);

  useEffect(() => {
    console.log("Quiz data updated:", quizData);
    setLoading(false);
  }, [quizData]);

  useEffect(() => {
    const container = document.querySelector(".results-container");

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      const size = Math.random() * 10 + 5;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;

      container.appendChild(particle);
    }

    const participants = document.querySelectorAll(".participant-item");
    participants.forEach((participant, index) => {
      participant.style.setProperty("--i", index + 1);
    });

    const questions = document.querySelectorAll(".question-item");
    questions.forEach((question, index) => {
      question.style.setProperty("--i", index + 1);
    });

    setTimeout(() => {
      const chartCanvas = document.querySelector(".chart-container canvas");
      if (chartCanvas) {
        chartCanvas.style.filter =
          "drop-shadow(0 5px 15px rgba(123, 104, 238, 0.2))";
      }
    }, 1000);
  }, []);

  useEffect(() => {
    const createFloatingEmojis = () => {
      const chartCard = document.querySelector(".chart-card");
      if (!chartCard) return;

      const emojis = ["🎯", "📊", "🏆", "⭐", "🚀", "💯", "🔥", "👏"];

      setInterval(() => {
        const emoji = document.createElement("div");
        emoji.className = "floating-emoji";
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const leftPos = Math.random() * 100;
        emoji.style.left = `${leftPos}%`;

        const duration = 5 + Math.random() * 5;
        emoji.style.animationDuration = `${duration}s`;

        chartCard.appendChild(emoji);

        setTimeout(() => {
          emoji.remove();
        }, duration * 1000);
      }, 1500);
    };

    createFloatingEmojis();
  }, []);

  const participants = [
    { id: 100, name: "Amri Asmaa", score: 100, percentage: "100%" },
    { id: 160, name: "Bahri Assia", score: 99, percentage: "99%" },
    { id: 89, name: "Mostefaoui Lyna", score: 70, percentage: "99%" },
    { id: 100, name: "Amri Asmaa", score: 100, percentage: "100%" },
    { id: 160, name: "Bahri Assia", score: 99, percentage: "99%" },
    { id: 89, name: "Mostefaoui Lyna", score: 70, percentage: "99%" },
    { id: 45, name: "Amri Asmaa", score: 56, percentage: "56%" },
    { id: 9, name: "Bahri Assia", score: 45, percentage: "100%" },
    { id: 101, name: "Mostefaoui Lyna", score: 100, percentage: "100%" },
    { id: 161, name: "Bahri Assia", score: 99, percentage: "99%" },
    { id: 90, name: "Amri Asmaa", score: 70, percentage: "70%" },
    { id: 89, name: "Mostefaoui Lyna", score: 70, percentage: "99%" },
    { id: 45, name: "Amri Asmaa", score: 56, percentage: "56%" },
    { id: 9, name: "Bahri Assia", score: 45, percentage: "100%" },
    { id: 101, name: "Mostefaoui Lyna", score: 100, percentage: "100%" },
    { id: 161, name: "Bahri Assia", score: 99, percentage: "99%" },
    { id: 90, name: "Amri Asmaa", score: 70, percentage: "70%" },
    { id: 46, name: "Amri Asmaa", score: 56, percentage: "56%" },
    { id: 10, name: "Mostefaoui lyna", score: 45, percentage: "45%" },
  ];

  const chartData = {
    labels:
      quizData?.questions?.map((item) => "Question" + item.question_number) ||
      [],
    datasets: [
      {
        label: "Success Rate (%)",
        data:
          quizData?.questions?.map((item) => item.question_percentage) || [],
        backgroundColor: "rgba(123, 104, 238, 0.4)",
        borderColor: "rgba(123, 104, 238, 1)",
        borderWidth: 1,
      },
    ],
  };

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
      legend: { display: false },
      title: { display: false },
    },
  };

  return (
    <div className="results-container">
      {loading ? (
        <div className="loading-container">
          <p>Loading quiz results...</p>
        </div>
      ) : (
        <div className="results-content">
          <div className="results-layout">
            <div className="results-left-column">
              <div className="quiz-info-card">
                <div className="quiz-info-header">
                  <div className="quiz-image">
                    <img
                      src={quizData.image || "/placeholder.svg"}
                      alt={quizData.title}
                    />
                  </div>
                  <div className="quiz-info">
                    <h2 className="quiz-title">{quizData.title}</h2>
                    <div className="quiz-meta">
                      <div className="quiz-meta-item">
                        <span className="meta-label">Subject</span>
                        <span className="meta-value">{quizData.subject}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="participants-card">
                <h3 className="card-title">Participants List</h3>
                <div className="participants-list">
                  {studentsList.map((attempt) => (
                    <div
                      key={attempt?.students?.id_student}
                      className={`participant-item ${
                        (attempt?.score / quizData?.score ) * 100 === 100 ? "perfect-score" : ""
                      }`}
                    >
                      <div className="participant-id">{attempt?.students?.id_student}</div>
                      <div className="participant-name">{attempt?.students?.last_name + " " + attempt?.students?.first_name}</div>
                      <div className="participant-score">
                        {(attempt?.score / quizData?.score ) * 100}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="chart-card">
              <h3 className="card-title">Success Rate</h3>
              <div className="chart-container">
                <Bar data={chartData} options={chartOptions} height={300} />
              </div>
              <div className="chart-notice">
                <div className="chart-notice-icon">📈</div>
                <div className="chart-notice-content">
                  <h4>Quiz Performance Analysis</h4>
                  <p>
                    {quizData?.questions?.reduce(
                      (avg, q) => avg + (q.question_percentage || 0),
                      0
                    ) /
                      (quizData?.questions?.length || 1) >
                    85
                      ? "Excellent understanding! Students have mastered this topic."
                      : quizData?.questions?.reduce(
                          (avg, q) => avg + (q.question_percentage || 0),
                          0
                        ) /
                          (quizData?.questions?.length || 1) >
                        70
                      ? "Good progress! Most students understand the core concepts."
                      : "Needs review. Consider revisiting these topics in class."}
                  </p>
                  <div>
                    <span className="chart-notice-badge badge-excellent">
                      Excellent: 90-100%
                    </span>
                    <span className="chart-notice-badge badge-good">
                      Good: 70-89%
                    </span>
                    <span className="chart-notice-badge badge-needs-improvement">
                      Needs Review: &lt;70%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="results-right-column">
              <div className="questions-card">
                <h3 className="card-title">
                  {quizData?.questions?.length || 0} Questions
                </h3>
                <div className="questions-list">
                  {quizData?.questions?.map((question) => (
                    <div key={question.id_question} className="question-item">
                      <div className="question-header">
                        <div className="question-number">
                          {question.question_number}.
                        </div>
                        <div className="question-type">
                          {question.question_type}
                        </div>
                        <div className="question-meta">
                          <span className="question-time">
                            {question.duration}s
                          </span>
                          <span className="question-points">
                            {question.points} point
                            {question.points !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="question-text">
                        {question.question_text}
                      </div>
                      <div className="question-answers">
                        {question.question_type === "Muliple choice" ? (
                          <div className="multiple-choice-answers">
                            {question.answers?.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`answer-option ${
                                  option.correct === 1 ? "correct" : ""
                                }`}
                              >
                                {option.answer_text || option}
                                {option.correct === 1 && (
                                  <span className="correct-indicator">✓</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="true-false-answers">
                            {question.answers?.map((option, optIndex) => (
                              <div key={optIndex} className="answer-option">
                                <div
                                  className={`answer-option ${
                                    option.correct === 1 ? "correct" : ""
                                  }`}
                                >
                                  {option.answer_text}
                                  {option.correct === 1 && (
                                    <span className="correct-indicator">✓</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;

import { useState, useEffect } from "react"
import "./presentation-mode.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faExpand, faCompress, faTimes } from "@fortawesome/free-solid-svg-icons"

const PresentationMode = ({ quiz, onClose, timerType = "wholeQuiz" }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(
    timerType === "wholeQuiz" ? quiz.duration * 60 : quiz.questions[0]?.duration || 30,
  )
  const [progress, setProgress] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const docEl = document.documentElement

      const requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullscreen ||
        docEl.msRequestFullscreen

      if (requestFullScreen) {
        requestFullScreen
          .call(docEl)
          .then(() => {
            setIsFullscreen(true)
          })
          .catch((err) => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`)
          })
      }
    } else {
      const exitFullscreen =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen

      if (exitFullscreen) {
        exitFullscreen
          .call(document)
          .then(() => {
            setIsFullscreen(false)
          })
          .catch((err) => {
            console.error(`Error exiting fullscreen: ${err.message}`)
          })
      }
    }
  }


  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const docEl = document.documentElement

        const requestFullScreen =
          docEl.requestFullscreen ||
          docEl.mozRequestFullScreen ||
          docEl.webkitRequestFullscreen ||
          docEl.msRequestFullscreen

        if (requestFullScreen) {
          await requestFullScreen.call(docEl)
          setIsFullscreen(true)
        }
      } catch (err) {
        console.error(`Could not enter fullscreen: ${err.message}`)
      }
    }


    const timer = setTimeout(() => {
      enterFullscreen()
    }, 100)

    return () => clearTimeout(timer)
  }, [])


  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])


  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        const exitFullscreen =
          document.exitFullscreen ||
          document.mozCancelFullScreen ||
          document.webkitExitFullscreen ||
          document.msExitFullscreen

        if (exitFullscreen) {
          exitFullscreen.call(document).catch((err) => {
            console.error(`Error exiting fullscreen: ${err.message}`)
          })
        }
      }
    }
  }, [])


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {

          if (timerType === "perQuestion") {
            // Move to next question if time is up for current qst
            if (currentQuestionIndex < totalQuestions - 1) {
              setCurrentQuestionIndex((prev) => prev + 1)
              return quiz.questions[currentQuestionIndex + 1]?.duration || 30
            }
          }
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, timerType, quiz.questions, totalQuestions])

  // progress baaar
  useEffect(() => {
    const totalTime = timerType === "wholeQuiz" ? quiz.duration * 60 : currentQuestion?.duration || 30

    setProgress((timeRemaining / totalTime) * 100)
  }, [timeRemaining, currentQuestion, timerType, quiz.duration])


  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      if (timerType === "perQuestion") {
        setTimeRemaining(quiz.questions[currentQuestionIndex + 1]?.duration || 30)
      }
    }
  }

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
      if (timerType === "perQuestion") {
        setTimeRemaining(quiz.questions[currentQuestionIndex - 1]?.duration || 30)
      }
    }
  }

  // Format time i choose this one simple  MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  //close with confirmation
  const handleClose = () => {
    // Exit fullscreen first if needed
    if (document.fullscreenElement) {
      const exitFullscreen =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen

      if (exitFullscreen) {
        exitFullscreen
          .call(document)
          .then(() => {
            onClose()
          })
          .catch((err) => {
            console.error(`Error exiting fullscreen: ${err.message}`)
            onClose() // Still try to close even if fullscreen exit fails
          })
      } else {
        onClose()
      }
    } else {
      onClose()
    }
  }

  if (!currentQuestion) {
    return (
      <div className="presentation-mode-container">
        <div className="presentation-content">
          <div className="presentation-question">
            <div className="presentation-question-text">No questions available</div>
            <button className="presentation-btn presentation-exit-btn" onClick={handleClose}>
              Exit Presentation Mode
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="presentation-mode-container">
      {/* Header with timer and controls */}
      <div className="presentation-header">
        <div className="presentation-controls">
          <button className="presentation-btn presentation-exit-btn" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} /> Exit
          </button>
          <button className="presentation-btn" onClick={toggleFullscreen}>
            <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
            {isFullscreen ? " Exit Fullscreen" : " Fullscreen"}
          </button>
        </div>

        <div className="presentation-timer">
          <FontAwesomeIcon icon={faClock} />
          <span>{formatTime(timeRemaining)}</span>
        </div>

        <div className="presentation-controls">
          <button className="presentation-btn" onClick={goToPrevQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <span className="presentation-question-counter">
            {currentQuestionIndex + 1} / {totalQuestions}
          </span>
          <button
            className="presentation-btn"
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            Next
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="presentation-progress">
        <div className="presentation-progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Question content */}
      <div className="presentation-content">
        <div className="presentation-question">
          <div className="presentation-question-header">
            <div className="presentation-question-number">Question {currentQuestion.question_number}</div>
            <div className="presentation-question-points">
              {currentQuestion.points} {currentQuestion.points === 1 ? "point" : "points"}
            </div>
          </div>

          <div className="presentation-question-text">{currentQuestion.question_text}</div>

          {currentQuestion.question_type === "multiple-choice" && (
            <div className="presentation-options">
              {currentQuestion.answers.map((answer, index) => (
                <div key={index} className="presentation-option">
                  <div className="presentation-option-letter">{String.fromCharCode(65 + index)}</div>
                  <span>{answer.answer_text}</span>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.question_type === "true-false" && (
            <div className="presentation-true-false">
              <div className="presentation-true-false-option">TRUE</div>
              <div className="presentation-true-false-option">FALSE</div>
            </div>
          )}

          {currentQuestion.question_type === "short-answer" && (
            <div className="presentation-short-answer">Short answer question</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PresentationMode

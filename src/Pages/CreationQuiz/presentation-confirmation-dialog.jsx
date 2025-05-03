import { useState } from "react"
import "./presentation-confirmation-dialog.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDesktop, faTimes } from "@fortawesome/free-solid-svg-icons"

const PresentationConfirmationDialog = ({ onClose, onPresent, onContinuePublish, quiz }) => {
  const [timerType, setTimerType] = useState("wholeQuiz")

  const handlePresent = () => {
    onPresent(timerType)
  }

  return (
    <div className="presentation-confirmation-overlay">
      <div className="presentation-confirmation-dialog">
        <div className="presentation-confirmation-header">
          <h3>Quiz Published Successfully !</h3>
          <button className="presentation-confirmation-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="presentation-confirmation-content">
          <p>Would you like to present this quiz in real-time on a big screen?</p>

          <div className="presentation-confirmation-options">
            <div className="presentation-confirmation-option" onClick={handlePresent}>
              <div className="presentation-confirmation-icon">
                <FontAwesomeIcon icon={faDesktop} size="2x" />
              </div>
              <h4>Present Now</h4>
              <p>Display the quiz on a big screen with timer</p>
            </div>

            <div className="presentation-confirmation-option" onClick={onContinuePublish}>
              <div className="presentation-confirmation-icon">
                <FontAwesomeIcon icon={faTimes} size="2x" />
              </div>
              <h4>Continue</h4>
              <p>Return to dashboard</p>
            </div>
          </div>

          {/* Timer Type Selection */}
          <div className="presentation-timer-selection">
            <h4>Timer Settings:</h4>
            <div className="presentation-radio-group">
              <div className="presentation-radio-option">
                <input
                  type="radio"
                  id="wholeQuiz"
                  name="timerType"
                  value="wholeQuiz"
                  checked={timerType === "wholeQuiz"}
                  onChange={() => setTimerType("wholeQuiz")}
                />
                <label htmlFor="wholeQuiz">Use timer for the whole quiz ({quiz.duration} minutes)</label>
              </div>
              <div className="presentation-radio-option">
                <input
                  type="radio"
                  id="perQuestion"
                  name="timerType"
                  value="perQuestion"
                  checked={timerType === "perQuestion"}
                  onChange={() => setTimerType("perQuestion")}
                />
                <label htmlFor="perQuestion">Use individual timers for each question</label>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default PresentationConfirmationDialog

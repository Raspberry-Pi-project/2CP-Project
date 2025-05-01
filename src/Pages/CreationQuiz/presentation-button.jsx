import { useState } from "react"
import "./presentation-button.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDesktop } from "@fortawesome/free-solid-svg-icons"
import PresentationMode from "./presentation-mode"

const PresentationButton = ({ quiz }) => {
  const [showDialog, setShowDialog] = useState(false)
  const [timerType, setTimerType] = useState("wholeQuiz")
  const [showPresentation, setShowPresentation] = useState(false)

  const handleStartPresentation = () => {
    setShowDialog(false)
    setShowPresentation(true)
  }

  return (
    <>
      <button onClick={() => setShowDialog(true)} className="presentation-button">
        <FontAwesomeIcon icon={faDesktop} />
        <span>Present Quiz</span>
      </button>

      {showDialog && (
        <div className="presentation-dialog-overlay">
          <div className="presentation-dialog">
            <div className="presentation-dialog-header">
              <h3>Present Quiz</h3>
              <p>Display this quiz on a big screen with a timer.</p>
            </div>

            <div className="presentation-dialog-content">
              <h4>Timer Settings</h4>
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

            <div className="presentation-dialog-footer">
              <button className="presentation-dialog-button cancel" onClick={() => setShowDialog(false)}>
                Cancel
              </button>
              <button className="presentation-dialog-button start" onClick={handleStartPresentation}>
                Start Presentation
              </button>
            </div>
          </div>
        </div>
      )}

      {showPresentation && (
        <PresentationMode quiz={quiz} timerType={timerType} onClose={() => setShowPresentation(false)} />
      )}
    </>
  )
}

export default PresentationButton

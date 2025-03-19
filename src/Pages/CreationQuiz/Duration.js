import React from "react";
import { useNavigate } from "react-router-dom";
import "./Duration.css";
import duration2 from "../../photos/Group 2.png";


const Duration = () => {
    const navigate = useNavigate();
    return (
      <div className="wrapperDuration">
      <div className="rightDuration">
          <h1 className="Duration">Duration and Attempts</h1>
          
      </div>
      <div className="leftDuration">
        <img className="imageDuration" src={duration2} alt="" /><br /> 
        
        <label htmlFor="Number of attempts">Number of Attempts :</label><br/>
        <select type="number of Attempts" id="number of Attempts" placeholder="Enter the number of possible attempts" required>
          <option value="once">once</option>
          <option value="twice">twice</option>
          <option value="three times">three times</option>
          </select><br />

        <label htmlFor="Duration">Duration :</label><br />
        <select type="Duration" id="Duration" placeholder="enter the general duration" required>
          <option value="five">5 min</option>
          <option value="ten">10 min</option>
          <option value="fifteen">15 min</option>
          <option value="twenty">20 min</option>
          <option value="twenty five">25 min</option>
          <option value="thirtenn">30 min</option>
          </select><br />

        <p className="d">you can set the duration of each question later</p>
        <label htmlFor="Score">Score:</label><br />
        <input type="Score" id="Score" placeholder="enter the total score"  /><br />

        <div className="buttons-container">
        <button className="ReturnDuration" onClick={() => navigate("/Info")}>Return</button> 
        <button className="NextDuration">Next</button>
        </div>

      </div>
  </div>
      );
}
 
export default Duration;
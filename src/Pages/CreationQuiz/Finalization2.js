import React from 'react';
import "./Finalization2.css";
import finalization2 from "../../photos/Group 5.png";

const Finalization2 = () => {
    return (
            <div className="wrapperFinalization2">
                <div className="rightFinalization2">
                    <h1 className="Finalization2">Finalization</h1>
                    
                </div>
                <div className="leftFinalization2">
                <img className="imageFinalization2" src={finalization2} alt="" /><br />
                  <label htmlFor="Year of study">YEAR OF STUDY : </label><br/>
                  <input type="text" id="Year" placeholder="Enter the year" required /><br/>
                  <label htmlFor="Group">Group :</label><br />
                  <input type="text" id="Group" placeholder="Enter the group" required /><br/>
                  
                  
                  <button className="ReturnFinalization2" >
                    Return
                  </button>
                </div>
            </div>
    );
};

export default Finalization2;
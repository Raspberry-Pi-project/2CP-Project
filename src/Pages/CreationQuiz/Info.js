import React from "react";
import { useNavigate } from "react-router-dom";
import "./Info.css";
import duration1 from "../../photos/Group 1.png";
import imageadd from "../../photos/add-image-icon.png";

const Info = () => {
  const navigate = useNavigate();
    return(
        <div className="wrapperInfo">
            <div className="rightInfo">
                <h1 className="Info">Quiz Infos</h1>
                
            </div>
            <div className="leftInfo">
              <img className="imageInfo" src={duration1} alt="" /><br /> 
              <label htmlFor="Subject ">Subject :</label><br/>
              <input type="Subject" id="Subject" placeholder="Enter your Subject" required /><br/>
              <label htmlFor="Title">Title :</label><br />
              <input type="Title" id="Title" placeholder="name your Quiz" required /><br/>
              <label htmlFor="Description">Description :</label><br />
              <input type="text" id="Description" placeholder="Describe your Quiz"  /><br />
              <label for="Upload-image" id="Upload-image" >Image :</label>
              <div className="Upload-image">
              <input type="file" id="Image" accept="image/*" placeholder="Upload an Image" hidden />
              <div className="img-view">
                <img src={imageadd} alt=""/>
                <p className="drag">Drag and drop </p>
                <span></span>
              </div>
              </div>
              <button className="NextInfo" onClick={() => navigate("/Duration")}>
                Next
              </button>
            </div>
        </div>
    )
}
export default Info;
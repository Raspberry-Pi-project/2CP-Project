import React from "react";
import headerimage from "../photos/headerimage.png";
import './Home.css';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <header>
     <div className="container">
        <div className="row">
            <div className="col-md-6 ">
                <h5>Free & Automated</h5>
                <h2>Create, Share, and Track Student Quizzes —All <br></br> in One Place!</h2>
                <p>Save Time on Assessments – Focus More on Teaching!</p>
                <Link to="/signin" className="button">Get Started</Link>

            </div>
            <div className="col-md-6">
                <img src={headerimage} alt="headerimage" />
            </div>
        </div>
     </div>
    </header>
  );
}

export default Home;

import React from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";
import  LOGO from "../photos/Design (3).png";

const SignIn = () => {
  return (
    <div className="wrapperIn">
    <div className="image-containerIn">
    <img className="logo" src={LOGO} alt="LOGO" />
    </div>

    <div className="container">

     
     <div className="big-box">
     <h1 className="in1">SIGN IN</h1><br/>
       <div className="small-box">
       <h2 className="in2">Welcome Back !</h2><br/>
       <form>
        <label htmlFor="email">Email</label><br/>
         <input type="email" id="email" placeholder="Enter your email" required /><br/>
         <label htmlFor="password">Password</label><br/>
         <input type="password" id="password" placeholder="Enter your password" required /><br/>
            <p><Link to="/NoQuizzes">
            <button type="submit" className="login-button">LOGIN</button>    
            </Link></p>
            
        </form><br></br>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
     </div>   


    </div>
    </div>
  );
};

export default SignIn;

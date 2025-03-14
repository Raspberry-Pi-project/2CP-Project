import React from "react";
import "./SignUp.css";
import  LOGO from "../photos/Design (3).png";
const SignUp = () => {
  return (
    <div className="wrapper">
    <div className="image-container">
    <img src={LOGO} alt="LOGO" />
    </div>

    <div className="container">
     <div className="big-box">

<h1>ADD TEACHER/STUDENT</h1>
     <div className="small-box">
       <h3>Welcome !</h3><br/>
       <form>
       <label htmlFor="Full Name ">Full Name* </label><br/>
       <input type="Full Name " id="Full Name " required /><br/>
       <label htmlFor="Last name ">Last name * </label><br/>
         <input type="Last name " id="Last name " required /><br/>
        <label htmlFor="email">Email*</label><br/>
         <input type="email" id="email" placeholder="Enter your email" required /><br/>
         <label htmlFor="Role">Role*</label><br/>
       <input type="Role" id="Role" placeholder="Select studet / teacher" required /><br/>
         <label htmlFor="password">Password*</label><br/>
         <input type="password" id="password" placeholder="Enter your password" required /><br/>
         <label htmlFor="password Confirmation">Password Confirmation*</label><br/>
         <input type="password" id="password Confirmation" placeholder="Enter your password" required /><br/>
         <button type="submit" className="login-button">Create account</button>
        </form><br></br>
        
        </div>
     </div>   


    </div>
    </div>
  );
};

export default SignUp;
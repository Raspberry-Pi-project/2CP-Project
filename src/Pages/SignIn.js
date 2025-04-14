import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";
import LOGO from "../photos/Design (3).png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
const SignIn = () => {
  const { setUser , user } = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  useEffect(()=> {console.log("user",user)},[user])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !role) {
      alert("Please enter both email,password and role.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        { email, password, role },
        { withCredentials: true }
      );

      //if (response.data.token) {
      if (response.status === 200) {
        await setUser({ id: response.data.userId, role: response.data.role });
        alert("Login successful");
        setTimeout(() => {
          navigate("/draftquiz");
        }, 500); // Small delay
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Error logging in. Try again.");
    }
  };

  return (
    <div className="wrapperIn">
      <div className="image-containerIn">
        <img className="logo" src={LOGO} alt="LOGO" />
      </div>

      <div className="container">
        <div className="big-box">
          <h1 className="in1">SIGN IN</h1>
          <br />
          <div className="small-box">
            <h2 className="in2">Welcome Back !</h2>
            <br />
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <br />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <label htmlFor="password">Password</label>
              <br />
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="role">Role</label>
<br />
<select
  id="role"
  value={role}
  onChange={(e) => setRole(e.target.value)}
  required
  className="role-select"
>
  <option value="" disabled>Select a role</option>
  <option value="admin">Admin</option>
  <option value="teacher">Teacher</option>
</select>
<br />
              {/* <p><Link to="/NoQuizzes"> */}
              <button type="submit" className="login-button">
                LOGIN
              </button>
              {/* </Link></p> */}
            </form>
            <br></br>

            {/*  <p>                      // this is the correct one once you finish delet the brakcets comment and make it available
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>   */}

            <p>
              {" "}
              {/* this one is just to goo directly into the history page just to test and see things it is not correct ofc */}
              Don't have an account? <Link to="/historypage">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

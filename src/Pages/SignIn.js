import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";
import LOGO from "../photos/Design (3).png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
const SignIn = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
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
        setUser({ id: response.data.userId, role: response.data.role });
        // localStorage.setItem("token", response.data.token);
        //localStorage.setItem("role", response.data.role); // Store user role
        alert("Login successful");
        setTimeout(() => {
          navigate("/NoQuizzes");
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
              <br />
              <label htmlFor="role">Role</label>
              <br />
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="admin / teacher"
                required
              />
              <br />

              {/* <p><Link to="/NoQuizzes"> */}
              <button type="submit" className="login-button">
                LOGIN
              </button>
              {/* </Link></p> */}
            </form>
            <br></br>
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

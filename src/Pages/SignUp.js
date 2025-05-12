import React, { use, useState } from "react";
import "./SignUp.css";
import LOGO from "../photos/Design (3).png";
import axios from "axios";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthProvider";

const SignUp = () => {
  const { user } = useAuth();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [year, setYear] = useState(0);
  const [group, setGroup] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !email ||
      !password ||
      !role ||
      !first_name ||
      !last_name ||
      !confirmPassword
    ) {
      alert("Please enter All information");
      return;
    }

    if (role === "student" && (year < 0 || group < 0)){
      alert("Please enter valid year and group")
      return
    }

    if (confirmPassword !== password){
      alert("Password confirmation does not match")
    }

    try {
      const response = await axios.post(
        `http://${API_URL}:3000/auth/register`,
        { email, password, role , first_name , last_name , groupe_student : group , annee : year },
        { headers:{Authorization : `Bearer ${user.token}`} },
        { withCredentials: true }
      );

      //if (response.data.token) {
        alert(`${role} registered successfully`);
        
      
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Error logging in. Try again.");
    }
  };

  return (
    <div className="wrapperUp">
      <div className="image-containerUp">
        <img className="logo" src={LOGO} alt="LOGO" />
      </div>

      <div className="container">
        <div className="big-box">
          <h1 className="up1">ADD USER</h1>
          <div className="small-box">
            <h3 className="up3">Welcome !</h3>
            <br />
            <form onSubmit={handleSubmit}>
              <label htmlFor="First Name ">First Name * </label>
              <br />
              <input
                type="First Name "
                id="First Name "
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <br />
              <label htmlFor="Last name ">Last name * </label>
              <br />
              <input
                type="Last name "
                id="Last name "
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <br />
              <label htmlFor="email">Email*</label>
              <br />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <label htmlFor="Role">Role*</label>
              <br />
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="role-select"
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              {role === "student" && (
                <>
                  <label htmlFor="year">Year*</label>
                  <br />
                  <input
                    type="number"
                    id="year"
                    placeholder="Enter the year of study"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                  <label htmlFor="group">Group*</label>
                  <br />
                  <input
                    type="number"
                    id="group"
                    placeholder="Enter the Group"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    required
                  />
                </>
              )}
              <label htmlFor="password">Password*</label>
              <br />
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br />
              <label htmlFor="password Confirmation">
                Password Confirmation*
              </label>
              <br />
              <input
                type="password"
                id="password Confirmation"
                placeholder="Enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <br />
              <button type="submit" className="login-button">
                Create account
              </button>
            </form>
            <br></br>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

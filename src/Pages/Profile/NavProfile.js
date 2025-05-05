import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../photos/Design2.jpg";
import styles from "./NavProfile.module.css"; // Import styles from the CSS module
import { useAuth } from "../../context/AuthProvider";
import { useQuiz } from "../../context/QuizProvider";
import axios from "axios";
import { API_URL } from "../../config";

export const NavProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { setQuizData } = useQuiz();
  const handleLogout = async () => {
    try {
      await axios.post(
        `http://${API_URL}:3000/auth/logout`
      );
      setQuizData({});
      setUser({});
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className={styles.navProfile}>
      <div className={styles.navLeft}>
        <img className={styles.navLogo} src={logo} alt="logo" />
      </div>
      <div className={styles.navRight}>
        <button className={styles.logout} onClick={() => handleLogout()}>
          Logout
        </button>
        {user.role === "admin" && (
          <button
            className={styles.addUser}
            onClick={() => navigate("/SignUp")}
          >
            + Add a new user
          </button>
        )}
      </div>
    </nav>
  );
};

import React from "react";
import { NavProfile } from "./NavProfile";
import { useNavigate } from "react-router-dom";
import styles from "./TeacherProfile.module.css";
import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuiz } from "../../context/QuizProvider";
import { API_URL } from "../../config";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setQuizData } = useQuiz(); // Import setQuizData from QuizProvider
  const [quizzes, setQuizzes] = useState([]); // Initialize quizzes state to an empty array
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [teacher, setTeacher] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user || !user.id) return;

      setLoading(true);
      try {
        let result = {};
        result.status = 200; // Initialize result status to 200
        if (user.role === "teacher") {
          result = await axios.post(
            `http://${API_URL}:3000/teachers/getQuizzes`,
            { id_teacher: user.id, page, limit, status: "published" },
            { headers: { Authorization: `Bearer ${user.token}` } },
            { withCredentials: true }
          );
        }
        let userr;
        if (user.role === "teacher") {
          userr = await axios.post(
            `http://${API_URL}:3000/teachers/getTeachers`,
            { id_teacher: user.id, page: 1, limit: 1000000 },
            { headers: { Authorization: `Bearer ${user.token}` } },
            { withCredentials: true }
          );
        } else if (user.role === "admin") {
          userr = await axios.post(
            `http://${API_URL}:3000/admins/getAdmin`,
            { id_admin: user.id },
            { headers: { Authorization: `Bearer ${user.token}` } },
            { withCredentials: true }
          );
        }

        if (
          (result.status !== 200 && userr.role === "teacher") ||
          userr.status !== 200
        ) {
          throw new Error("Failed to fetch quizzes");
        } else {
          if (user.role === "teacher") {
            setQuizzes(result.data.data);
            setTotalPages(result.data.totalPages);
            setTeacher(userr.data.data[0]);
          } else if (user.role === "admin") {
            setTeacher(userr.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [page, limit, user]);

  useEffect(() => {
    console.log("Quizzes updated:", quizzes);
  }, [quizzes]);
  useEffect(() => {
    console.log("teacher updated:", teacher);
  }, [teacher]);

  const handleConsult = async (quizId) => {
    try {
      // Fetch quiz details from the backend API
      const response = await axios.post(
        `http://${API_URL}:3000/teachers/getQuizDetails`,
        { id_quiz: quizId },
        { headers: { Authorization: `Bearer ${user.token}` } },
        { withCredentials: true }
      );
      //console.log("Quiz details response:", response.data);
      if (response.status !== 200) {
        throw new Error("Failed to fetch quiz details");
      } else {
        setQuizData(response.data); // Set the selected quiz data in context
        navigate(`/quizDetails`); // will go to the page of finalization2 basing on its id
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }

    //setQuizData(quizzes.find((quiz) => quiz.id === quizId)); // Set the selected quiz data in context
    // Navigate to the quiz details page
    //
  };

  return (
    <div className={styles.teacherProfileContainer}>
      <NavProfile />

      <div className={styles.teacherProfileBody}>
        <div className={styles.sidebar}>
          <div className={styles.profileSection}>
            <div
              className={`${styles.profileCircle} `}
              onClick={() => {
                navigate("/TeacherProfile");
              }}
            >
              {loading === true
                ? ""
                : teacher.last_name[0] + teacher.first_name[0]}
            </div>
            <p className={styles.adminName}>
              {teacher.last_name + " " + teacher.first_name}
            </p>
          </div>
          <ul className={styles.sidebarMenu}>
            {user.role === "admin" && (
              <>
                <li
                  className={styles.menuItem}
                  onClick={() => navigate("/AdminDash")}
                >
                  Dashboard
                </li>

                <li className={`${styles.menuItem} `}
                onClick={() => navigate("/AdminTeacher")}>
                  Teachers
                </li>
              </>
            )}
            <li
              className={styles.menuItem}
              onClick={() => navigate("/AdminStudent")}
            >
              Students
            </li>
          </ul>
        </div>

        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Profile</h1>
          <div className={styles.profileHeader}>
            <div className={styles.teacherAvatar}>
              {loading === true
                ? ""
                : teacher.last_name[0] + teacher.first_name[0]}
            </div>
            <div className={styles.teacherInfo}>
              <h2>{teacher.last_name + " " + teacher.first_name}</h2>
              <p>{user.role}</p>
            </div>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.personalInfo}>
              <h3>Personal Information:</h3>
              <p>
                <strong>Full Name:</strong> <br />{" "}
                {teacher.last_name + " " + teacher.first_name}
              </p>
              <p>
                <strong>Email Address:</strong> <br /> {teacher.email}
              </p>
              <p>
                <strong>User Id:</strong> <br /> { user.role === "teacher" ? teacher.id_teacher : teacher.id_admin}
              </p>
            </div>

            { user.role === "teacher" && <div className={styles.quizzes}>
              <h3>Quizzes:</h3>
              <div className={styles.quizCards}>
                {quizzes.length === 0
                  ? "No Quizzes Created"
                  : quizzes.map((quiz, index) => (
                      <div className={styles.quizCard} key={index}>
                        <h4>{quiz.title}</h4>
                        <p>{quiz.subject}</p>
                        <p>
                          {quiz.totalQuestions} Question
                          {quiz.totalQuestions === 1 ? "" : "s"}
                        </p>
                        <button
                          className={styles.consultButton}
                          onClick={() => handleConsult(quiz.id_quiz)}
                        >
                          CONSULT
                        </button>
                      </div>
                    ))}
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;

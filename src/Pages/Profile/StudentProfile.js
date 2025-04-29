import React, { useEffect, useState } from "react";
import { NavProfile } from "./NavProfile";
import { useNavigate } from "react-router-dom";
import styles from "./StudentProfile.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";

const StudentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({});
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [teacher , setTeacher] = useState ({})
  const [loadingTeacher, setLoadingTeacher] = useState(true);
  useEffect(() => {
    const fetchTeacher = async () => {
      setLoadingTeacher(true);
      try {
      const userr = await axios.post(
        "http://localhost:3000/teachers/getTeachers",
        { id_teacher: user.id, page: 1, limit: 1000000 },
        { headers: { Authorization: `Bearer ${user.token}` } },
        { withCredentials: true }
      );
      if (userr.status !== 200) {
        throw new Error("Failed to fetch quizzes");
      } else {
        setTeacher(userr.data.data[0]);
        setLoadingTeacher(false);
      }} catch (error){
        console.log('Error Fetching teacher')
      }
    }
    fetchTeacher()
  },[])

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/teachers/getStudents",
          { id_student: parseInt(id), page: 1, limit: 1 },
          { headers: { Authorization: `Bearer ${user.token}` } },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setStudent(response.data.data[0]);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch student data");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudent();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/teachers/getStudentHistory",
          { id_student: parseInt(id), page: 1, limit: 6 },
          { headers: { Authorization: `Bearer ${user.token}` } },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setQuizzes(response.data.data);
        } else {
          throw new Error("Failed to fetch quizzes data");
        }
      } catch (error) {
        console.error("Error fetching quizzes data:", error);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    console.log("Student data:", student);
  }, [student]);
  useEffect(() => {
    console.log("Quizzes data:", quizzes);
  }, [quizzes]);

  const quizzess = [
    {
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
    },
    {
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
    },
    {
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
    },
    {
      title: "General Knowledge Challenge",
      difficulty: "Medium",
      questions: 10,
    },
  ];

  return (
    <div className={styles.studentProfileContainer}>
      {/* Top Navbar */}
      <NavProfile />

      {/* Sidebar and Main Content */}
      <div className={styles.studentProfileBody}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.profileSection}>
            <div
              className={styles.profileCirclee}
              onClick={() => {
                navigate("/TeacherProfile");
              }}
            >
              {loadingTeacher === true
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

                <li className={`${styles.menuItem} ${styles.active}`}>
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

        {/* Main Content */}
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Profile</h1>
          <div className={styles.profileHeader}>
            <div className={styles.studentAvatar}>{loading ? "" : student.last_name[0] + student.first_name[0] }</div>
            <div className={styles.studentInfo}>
              <h2>{student.last_name + " " + student.first_name}</h2>
              <p>Student</p>
            </div>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.personalInfo}>
              <h3>Personal Information:</h3>
              <p>
                <strong>Full Name:</strong> <br /> {student.last_name + " " + student.first_name}
              </p>
              <p>
                <strong>Email Address:</strong> <br /> {student.email}
              </p>
              <p>
                <strong>Student Id:</strong> <br /> {student.id_student} 
              </p>
            </div>

            <div className={styles.quizzes}>
              <h3>Quizzes:</h3>
              <div className={styles.quizCards}>
                {quizzes.length===0 ? "No Quizzes Passed" : quizzes.map((quiz, index) => (
                  <div className={styles.quizCard} key={index}>
                    <h4 className={styles.quizTitle}>{quiz.title}</h4>
                    <p className={styles.quizDifficulty}>{quiz.subject}</p>
                    <p className={styles.quizQuestions}>
                      {quiz.totalQuestions} Questions
                    </p>
                    <div className={styles.quizFooter}>
                      <span className={styles.quizScore}>
                        {quiz.attempts && quiz.attempts.length > 0
                          ? `AVG: ${(
                              quiz.attempts.reduce(
                                (sum, attempt) => sum + attempt.score,
                                0
                              ) / quiz.attempts.length
                            ).toFixed(1)}/${quiz.score}`
                          : "No attempts"}
                      </span>
                      <span className={styles.quizLevel}>
                        {quiz.duration} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

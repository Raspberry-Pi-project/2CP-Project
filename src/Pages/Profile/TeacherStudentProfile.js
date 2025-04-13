import React from "react";
import { NavProfile } from "./NavProfile";
import { useNavigate } from "react-router-dom";
import styles from "./StudentProfile.module.css";

const StudentProfile = () => {
  const navigate = useNavigate();

  const quizzes = [
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
            <div className={styles.profileCirclee}>MR</div>
            <p className={styles.adminName}>Teacher Name</p>
          </div>
          <ul className={styles.sidebarMenu}>
            <li className={styles.menuItem} onClick={() => navigate('/TeacherDash')}>Dashboard</li>
            <li className={`${styles.menuItem} ${styles.active}`}>Students</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Profile</h1>
          <div className={styles.profileHeader}>
            <div className={styles.studentAvatar}>MR</div>
            <div className={styles.studentInfo}>
              <h2>Bahri Assia</h2>
              <p>Student</p>
            </div>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.personalInfo}>
              <h3>Personal Information:</h3>
              <p><strong>Full Name:</strong> <br /> Bahri Assia</p>
              <p><strong>Email Address:</strong> <br /> Bahri_Assia@esi.dz</p>
              <p><strong>User Id:</strong> <br /> 123</p>
            </div>

            <div className={styles.quizzes}>
              <h3>Quizzes:</h3>
              <div className={styles.quizCards}>
                {quizzes.map((quiz, index) => (
                  <div className={styles.quizCard} key={index}>
                    <h4 className={styles.quizTitle}>{quiz.title}</h4>
                    <p className={styles.quizDifficulty}>{quiz.difficulty}</p>
                    <p className={styles.quizQuestions}>{quiz.questions} Questions</p>
                    <div className={styles.quizFooter}>
                      <span className={styles.quizScore}>10/20</span>
                      <span className={styles.quizLevel}>{quiz.difficulty.toUpperCase()}</span>
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

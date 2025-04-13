import React from "react";
import { NavProfile } from "./NavProfile";
import { useNavigate } from "react-router-dom";
import styles from "./TeacherProfile.module.css";

const TeacherProfile = () => {
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
    <div className={styles.teacherProfileContainer}>
      <NavProfile />

      <div className={styles.teacherProfileBody}>
        <div className={styles.sidebar}>
          <div className={styles.profileSection}>
            <div className={styles.profileCircle}>MR</div>
            <p className={styles.adminName}>Teacher Name</p>
          </div>
          <ul className={styles.sidebarMenu}>
            <li
              className={styles.menuItem}
              onClick={() => navigate("/AdminDash")}
            >
              Dashboard
            </li>
            <li className={`${styles.menuItem} ${styles.active}`}>Teachers</li>
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
            <div className={styles.teacherAvatar}>MR</div>
            <div className={styles.teacherInfo}>
              <h2>Bahri Assia</h2>
              <p>Teacher</p>
            </div>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.personalInfo}>
              <h3>Personal Information:</h3>
              <p>
                <strong>Full Name:</strong> <br /> Bahri Assia
              </p>
              <p>
                <strong>Email Address:</strong> <br /> Bahri_Assia@esi.dz
              </p>
              <p>
                <strong>User Id:</strong> <br /> 123
              </p>
            </div>

            <div className={styles.quizzes}>
              <h3>Quizzes:</h3>
              <div className={styles.quizCards}>
                {quizzes.map((quiz, index) => (
                  <div className={styles.quizCard} key={index}>
                    <h4>{quiz.title}</h4>
                    <p>{quiz.difficulty}</p>
                    <p>{quiz.questions} Questions</p>
                    <button className={styles.consultButton}>CONSULT</button>
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

export default TeacherProfile;

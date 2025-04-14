import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavProfileT } from './NavProfileT';
import teacherIcon from "../../photos/teacher.png";
import studentIcon from "../../photos/student.png";
import quizIcon from "../../photos/quizz.png";
import styles from './TeacherDash.module.css';

const Teacher = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.adminDashContainer}>
      <NavProfileT />

      <div className={styles.adminBody}>
        <div className={styles.sidebarArea}>
          <div className={styles.profileSection}>
            <div className={styles.profileCircle}>MR</div>
            <p className={styles.adminName}>Teacher Name</p>
          </div>
          <ul className={styles.sidebarMenu}>
            <li className={`${styles.menuItem} ${styles.active}`}>Dashboard</li>
            <li className={styles.menuItem} onClick={() => navigate('/TeacherStudents')}>Students</li>
          </ul>
        </div>

        <div className={styles.mainContent}>
          <h1 className={styles.dashboardTitle}>Dashboard</h1>
          <div className={styles.dashboardCards}>
            
            <div className={`${styles.card} ${styles.students}`}>
              <h3>Students</h3>
              <img src={studentIcon} alt="Student Icon" />
              <h2>100</h2>
            </div>
            <div className={`${styles.card} ${styles.quizzes}`}>
              <h3>Quizzes</h3>
              <img src={quizIcon} alt="Quiz Icon" />
              <h2>100</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacher;

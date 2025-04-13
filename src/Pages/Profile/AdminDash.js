import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavProfile } from './NavProfile';
import teacherIcon from "../../photos/teacher.png";
import studentIcon from "../../photos/student.png";
import quizIcon from "../../photos/quizz.png";
import styles from './AdminDash.module.css';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.adminDashContainer}>
      <NavProfile />

      <div className={styles.adminBody}>
        <div className={styles.sidebarArea}>
          <div className={styles.profileSection}>
            <div className={styles.profileCircle}>MR</div>
            <p className={styles.adminName}>Admin Name</p>
          </div>
          <ul className={styles.sidebarMenu}>
            <li className={`${styles.menuItem} ${styles.active}`}>Dashboard</li>
            <li className={styles.menuItem} onClick={() => navigate('/AdminTeacher')}>Teachers</li>
            <li className={styles.menuItem} onClick={() => navigate('/AdminStudent')}>Students</li>
          </ul>
        </div>

        <div className={styles.mainContent}>
          <h1 className={styles.dashboardTitle}>Dashboard</h1>
          <div className={styles.dashboardCards}>
            <div className={`${styles.card} ${styles.teachers}`}>
              <h3>Teachers</h3>
              <img src={teacherIcon} alt="Teacher Icon" />
              <h2>10</h2>
            </div>
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

export default Admin;

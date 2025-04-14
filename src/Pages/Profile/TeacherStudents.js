import React from "react";
import { useNavigate } from "react-router-dom";
import { NavProfile } from "./NavProfile";
import styles from "./AdminStudent.module.css";

const AdminStudent = () => {
  const students = [
    { id: "148", name: "Bahri Assia", email: "Bahri_Assia@esi.dz" },
    { id: "754", name: "Bahri Assia", email: "Bahri_Assia@esi.dz" },
    { id: "234", name: "Bahri Assia", email: "Bahri_Assia@esi.dz" },
    { id: "001", name: "Bahri Assia", email: "Bahri_Assia@esi.dz" },
    { id: "009", name: "Bahri Assia", email: "Bahri_Assia@esi.dz" },
    { id: "007", name: "Bahri Assia", email: "Bahri_Assia@esi.dz" },
    { id: "123", name: "Bahri Assia", email: "Bahri_Assia@esi.dz" },
  ];

  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(`/TeacherStudentProfile`);
  };

  return (
  /**
   * Handles the row click event by navigating to the student's profile page.
   * @param {string} id - The ID of the student to navigate to.
   */
    <div className={styles.adminStudentContainer}>
      <NavProfile />

      <div className={styles.adminStudentBody}>
        <div className={styles.sidebar}>
          <div className={styles.profileSection}>
      {/* Top Navbar */}
            <div className={styles.profileCircle}>MR</div>
            <p className={styles.adminName}>Teacher Name</p>
      {/* Sidebar and Main Content */}
          </div>
        {/* Sidebar */}
          <ul className={styles.sidebarMenu}>
            <li className={styles.menuItem} onClick={() => navigate('/TeacherDash')}>Dashboard</li>
            <li className={`${styles.menuItem} ${styles.active}`}>Students</li>
          </ul>
        </div>

        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Students</h1>
          <div className={styles.tableContainer}>
            <table className={styles.studentTable}>
              <thead>
        {/* Main Content */}
                <tr>
                  <th>Full Name</th>
                  <th>Id</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(student.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div className={styles.studentInfo}>
                        <div className={styles.studentAvatar}>
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td>{student.id}</td>
                    <td>{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudent;

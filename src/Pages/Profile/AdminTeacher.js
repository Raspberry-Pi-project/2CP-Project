import React from "react";
import { useNavigate } from "react-router-dom";
import { NavProfile } from "./NavProfile";
import styles from "./AdminTeacher.module.css"; // Importing the CSS module

const AdminTeacher = () => {
  const Teachers = [
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
    navigate(`/TeacherProfile`);
  };

  return (
    <div className={styles.adminTeacherContainer}>
      {/* Top Navbar */}
      <NavProfile />

      {/* Sidebar and Main Content */}
      <div className={styles.adminTeacherBody}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.profileSection}>
            <div className={styles.profileCircle}>MR</div>
            <p className={styles.adminName}>Admin Name</p>
          </div>
          <ul className={styles.sidebarMenu}>
            <li className={styles.menuItem} onClick={() => navigate('/AdminDash')}>Dashboard</li>
            <li className={`${styles.menuItem} ${styles.active}`}>Teachers</li>
            <li className={styles.menuItem} onClick={() => navigate('/AdminStudent')}>Students</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Teachers</h1>
          <div className={styles.tableContainer}>
            <table className={styles.teacherTable}>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Id</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {Teachers.map((teacher, index) => (
                  <tr key={index} onClick={() => handleRowClick(teacher.id)} style={{ cursor: "pointer" }}>
                    <td>
                      <div className={styles.teacherInfo}>
                        <div className={styles.teacherAvatar}>
                          {teacher.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span>{teacher.name}</span>
                      </div>
                    </td>
                    <td>{teacher.id}</td>
                    <td>{teacher.email}</td>
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

export default AdminTeacher;

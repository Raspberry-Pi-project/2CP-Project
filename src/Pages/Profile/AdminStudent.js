import React from "react";
import { useNavigate } from "react-router-dom";
import { NavProfile } from "./NavProfile";
import styles from "./AdminStudent.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";

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
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    const getStudents = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/teachers/getStudents",
          { page, limit },
          { withCredentials: true }
        );
        setStudentsList(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    getStudents();
  }, []);

  useEffect(() => {
    console.log("Students List:", studentsList);
  }, [studentsList]);


  const [teacher, setTeacher] = useState({});
  const [error, setError] = useState(null);
  const [loadingTeacher, setLoadingTeacher] = useState(true);
  useEffect(() => {
    const fetchTeacher = async () => {
      if (!user || !user.id) return;

      setLoadingTeacher(true);
      try {
        let userr = {};
        userr.status = 200; // Initialize result status to 200
       if (user.role === "teacher") {
        userr = await axios.post(
          "http://localhost:3000/teachers/getTeachers",
          { id_teacher: user.id, page: 1, limit: 1000000 },
          { withCredentials: true }
        );
      }
      else if (user.role === "admin") {
        userr = await axios.post(
          "http://localhost:3000/admins/getAdmin",
          { id_admin: user.id },
          { withCredentials: true }
        );
      }
        if (userr.status !== 200) {
          throw new Error("Failed to fetch quizzes");
        } else {

         user.role == "teacher" ? setTeacher(userr.data.data[0]) : setTeacher(userr.data.data);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoadingTeacher(false);
      }
    };

    fetchTeacher();
  }, [user]);


  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(`/StudentProfile/${id}`);
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
        < div className={styles.profileSection}>
            <div
              className={styles.profileCircle}
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
        {/* Sidebar */}
        <ul className={styles.sidebarMenu}>
            {user.role === "admin" && (
              <>
                <li
                  className={styles.menuItem}
                  onClick={() => navigate("/AdminDash")}
                >
                  Dashboard
                </li>

                <li className={`${styles.menuItem} `}>
                  Teachers
                </li>
              </>
            )}
            <li
              className={`${styles.menuItem} ${styles.active}`}
              onClick={() => navigate("/AdminStudent")}
            >
              Students
            </li>
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
                {studentsList.map((student, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(student.id_student)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div className={styles.studentInfo}>
                        <div className={styles.studentAvatar}>
                          {loading === true ? "" : student.last_name[0] + student.first_name[0]}
                        </div>
                        <span>{student.last_name + " " + student.first_name}</span>
                      </div>
                    </td>
                    <td>{student.id_student}</td>
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

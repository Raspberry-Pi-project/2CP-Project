import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../photos/Design2.jpg";
import styles from './NavProfile.module.css'; // Import styles from the CSS module

export const NavProfileT = () => {
    const navigate = useNavigate();

    return (
        <nav className={styles.navProfile}>
            <div className={styles.navLeft}>
                <img className={styles.navLogo} src={logo} alt="logo" />
            </div>
            <div className={styles.navRight}>
                <button className={styles.logout} onClick={() => navigate("/")}>Logout</button>
            </div>
        </nav>
    );
};

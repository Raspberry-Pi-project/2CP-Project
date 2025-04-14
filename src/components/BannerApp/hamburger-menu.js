import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faChevronRight,
  faHome,
  faBook,
  faPlus,
  faUser,
  faQuestionCircle,
  faCog,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import "./hamburger-menu.css";


const HamburgerMenu = ({ routes }) => {
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".hamburger-menu-container") && !e.target.closest(".hamburger-toggle")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);


  const defaultRoutes = [
    {
      name: "Home",
      path: "/noquizzes",
      icon: <FontAwesomeIcon icon={faHome} />
    },
    {
      name: "Quizzes",
      path: "/quizzes",
      icon: <FontAwesomeIcon icon={faBook} />
    },
    {
      name: "Create Quiz",
      path: "/Info",
      icon: <FontAwesomeIcon icon={faPlus} />
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FontAwesomeIcon icon={faUser} />
    },
    {
      name: "Draft",
      path: "/draftquiz",
      icon: <FontAwesomeIcon icon={faQuestionCircle} />
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FontAwesomeIcon icon={faCog} />
    },
    {
      name: "Logout",
      path: "/logout",
      icon: <FontAwesomeIcon icon={faSignOutAlt} />
    }
  ];

  const menuRoutes = routes || defaultRoutes;

  return (
    <>
      <button className="hamburger-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
        <FontAwesomeIcon icon={faBars} className={`menu-icon ${isOpen ? "hidden" : "visible"}`} />
        <FontAwesomeIcon icon={faTimes} className={`close-icon ${isOpen ? "visible" : "hidden"}`} />
      </button>

      {isOpen && (
        <>
          <div className="menu-backdrop" onClick={() => setIsOpen(false)} />

          <div className={`hamburger-menu-container ${isOpen ? "open" : ""}`}>
            <div className="menu-header">
              <h2>Navigation</h2>
            </div>

            <nav className="menu-items">
              {menuRoutes.map((route, index) => (
                <a
                  key={index}
                  href={route.path}
                  className="menu-item"
                  style={{ "--index": index }}
                  onClick={() => setIsOpen(false)}
                >
                  {route.icon && <span className="menu-item-icon">{route.icon}</span>}
                  <span>{route.name}</span>
                  <FontAwesomeIcon icon={faChevronRight} className="menu-item-arrow" />
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default HamburgerMenu;
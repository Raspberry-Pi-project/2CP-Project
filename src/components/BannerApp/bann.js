import React from "react";
import LOGO from "../../photos/Design (1) 1.png";
import "./bann.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faBell, faUserCircle,faPlus } from "@fortawesome/free-solid-svg-icons";

const Link = ({ to, children }) => <a href={to}>{children}</a>;

const BannerApp = () => {
  return (
    <div className="banner-container">
      <div className="banner-row py-2">
        {/* Home Button */}
        <div className="col-md-1 col-sm-2 text-center">
          <Link to="/">
            <button className="banner-btn">
              <FontAwesomeIcon icon={faHome} />
            </button>
          </Link>
        </div>

        {/* Add Button  ; To Add QUIZZES*/}
        <div className="col-md-1 col-sm-2 text-center">
                  <button className="banner-btnnn">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {/* Search Bar with Choices */}
        <div className="col-md-6 col-sm-6 text-center">
          <div className="banner-search">
            <select className="form-select me-2">
              <option>Search</option>
              <option>Search by Year</option>
              <option>Search by Group</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-md-1 col-sm-3 text-center">
          <button className="banner-btn">
            <FontAwesomeIcon icon={faBell} />
          </button>
        </div>

        {/* Account Circle */}
        <div className="col-md-1 col-sm-3 text-center">
          <div className="banner-profile">
            <FontAwesomeIcon icon={faUserCircle} size="2x" />
          </div>
        </div>

        {/* Small Logo */}
        <div className="col-md-2 col-sm-3 text-center">
          <Link to="/">
          <img src={LOGO} alt="Logo" className="banner-logo" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerApp;

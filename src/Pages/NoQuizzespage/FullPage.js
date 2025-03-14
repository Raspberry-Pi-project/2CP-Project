import React from "react";
import BannerApp from "../../components/BannerApp/bann"; 
import LOGO from "../../photos/Frame 39 (2).png"; 
import "./FullPage.css";

const FullPage = () => {
  return (
    <div className="full-page-container">
      <div className="logo-container">
        <img src={LOGO} alt="Logo" className="full-page-logo" />
      </div>
    </div>
  );
};

export default FullPage;

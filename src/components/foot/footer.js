import React from "react";
import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import logo1 from "../../photos/Design (2) 1.png";
const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          {/* First Column */}
          <div className="col-md-3 col-sm-6">
            <img src={logo1} alt="Logo" />
            <p className="footer-para">
              "Empowering teachers to create <br />
              interactive and effective quizzes for <br />
              better learning outcomes."
            </p>
          </div>

          {/* Second Column */}
          <div className="col-md-3 col-sm-6">
            <h4> Quick Links</h4>
            <ul>
              <li><a href="#">  Home</a></li>
              <li><a href="#">  About us</a></li>
              <li><a href="#">  How it works</a></li>
              <li><a href="#">  Contact us</a></li>
              <li>  Terms & Conditions</li>
            </ul>
          </div>

          {/* Fourth Column */}
          <div className="col-md-3 col-sm-6">
            <h4>Contact Infos</h4>
            <div className="footer-right">
              <p><FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" /> Address: ESI-ALgiers-Algeria</p>
              <p><FontAwesomeIcon icon={faPhone} className="contact-icon" /> Phone: +213 00 00 00</p>
              <p><FontAwesomeIcon icon={faEnvelope} className="contact-icon" /> Email: trivio@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

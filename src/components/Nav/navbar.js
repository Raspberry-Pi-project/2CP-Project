import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Nav.css";
import logo from "../../photos/Design (1) 1.png";
import banner from "../../photos/banner.png";
import { Link } from "react-router-dom";

const Navbars = () => {
  return (
    <>
      {/* Banner */}
      <div className="banner">
        <img src={banner} alt="banner" width="100%" height="100%" className="d-inline-block align-top" />
      </div>

      {/* Navbar */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="Logo" width="140" height="40" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link className="nav-link active" to="/">Home</Link>
              <Link className="nav-link" to="/about">AboutUs</Link>

              {/* Dropdown Menu */}
              <NavDropdown title="Contents" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/">Home</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/guide">Guide</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/about">About-Us</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/contact">Contact Us</NavDropdown.Item>
              </NavDropdown>

              <Link className="nav-link" to="/contact">Contact</Link>


            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navbars;

import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AppNavbar() {
  const { isAuthenticated, logout } = useAuth();

  const navLinkStyle = {
    fontSize: '1.5rem',
  };

  const brandStyle = {
    fontSize: '2.0rem',
  };

  return (
    <Navbar bg={null} variant="light" expand="lg" style={{ backgroundColor: '#f95a25ff' }}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" style={brandStyle}>CalorieCounter</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" style={navLinkStyle}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/foods" style={navLinkStyle}>Food Management</Nav.Link>
                <Nav.Link onClick={logout} style={navLinkStyle}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={navLinkStyle}>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" style={navLinkStyle}>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/navbar';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/Dashboard';
import Food from './pages/Food';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'black' }}>
          <AppNavbar />
          <Container fluid className="flex-grow-1 d-flex justify-content-center align-items-center py-4">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/foods" element={<Food />} />
              </Route>

              <Route path="*" element={<h1 className="text-center text-white">404 - Not Found</h1>} /> {/* Ensure 404 text is white */}
            </Routes>
          </Container>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

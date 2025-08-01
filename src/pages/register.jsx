// src/pages/Register.js
import React, { useState } from "react";
import { Form, Button, Container, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
const backend_url = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [roleNames, setRoleNames] = useState(["USER"]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRoleChange = (e) => {
        const { value, checked } = e.target;
        setRoleNames((prevRoles) => {
            if (checked) {
                return [...new Set([...prevRoles, value])];
            } else {
                const updatedRoles = prevRoles.filter((role) => role !== value);
                return updatedRoles.length === 0 ? ["USER"] : updatedRoles;
            }
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const userData = {
            name,
            email,
            password,
            userName,
            roleNames: roleNames.length > 0 ? roleNames : ["USER"],
        };

        try {
            await axios.post(`${backend_url}/api/auth/register`, userData);
            setSuccess("Registered Successfully! You can now log in.");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error("Registration Error:", err);
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
            <Row>
                <Col md={12}>
                    <Card className="shadow-lg p-4" style={{ width: '28rem', borderRadius: '1rem' }}>
                        <Card.Body>
                            <h2 className="card-title text-center mb-4" style={{ color: '#f95a25' }}>Create Your Account</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}
                            <Form onSubmit={handleSignup}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="userName">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Choose a username"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>Assign Roles:</Form.Label>
                                    <div className="d-flex gap-3">
                                        <Form.Check
                                            type="checkbox"
                                            id="roleUser"
                                            label="User"
                                            value="USER"
                                            checked={roleNames.includes("USER")}
                                            onChange={handleRoleChange}
                                            // Optional: Add custom color for checkbox if desired, otherwise it will be default Bootstrap blue
                                             style={{ '--bs-form-check-input-checked-bg': '#f95a25', '--bs-form-check-input-checked-border-color': '#f95a25' }}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="roleAdmin"
                                            label="Admin"
                                            value="ADMIN"
                                            checked={roleNames.includes("ADMIN")}
                                            onChange={handleRoleChange}
                                            style={{ '--bs-form-check-input-checked-bg': '#f95a25', '--bs-form-check-input-checked-border-color': '#f95a25' }}
                                        />
                                    </div>
                                </Form.Group>
                                <div className="d-grid gap-2">
                                    <Button
                                        variant={null} 
                                        type="submit"
                                        className="py-2"
                                        style={{ backgroundColor: '#f95a25', borderColor: '#f95a25', color: 'white' }}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            </Form>
                            <div className="text-center mt-3">
                                Already have an account? 
                                <Link to="/login" style={{ color: '#f95a25' }} className="fw-bold">Login here</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
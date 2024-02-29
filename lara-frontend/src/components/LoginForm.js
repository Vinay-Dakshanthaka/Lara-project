import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber && !email) {
      setError('Please enter either phone number or email');
      return;
    }

    try {
      let response;
      if (email && isValidEmail(email)) {
        response = await axios.post('http://localhost:8080/api/student/verifyByEmailAndPassword', {
          email,
          password
        });
      } else {
        response = await axios.post('http://localhost:8080/api/student/verifyByPhoneAndPassword', {
          phoneNumber,
          password
        });
      }

      if (response && response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role',role)
        // Redirect based on role
        if (role === "STUDENT") {
          setSuccess(true)
          setTimeout(() => {
            navigate('/studentHome');
            }, 2000);
        } else if (role === "ADMIN") {
          setSuccess(true)
          setTimeout(() => {
            console.log(" Admin Logged in")
            navigate('/adminDashboard')
            }, 2000);
            // navigate('/adminDashboard');
        } else if (role === "SUPER ADMIN") {
          setSuccess(true)
          setTimeout(() => {
            // navigate('/studentHome');
            console.log(" Super Admin Logged in")
            navigate('/superAdminDashboard');
            }, 2000);
        } else {
            // Handle unknown role
            // console.error("Unknown role:", role);
            setError("OOP's!! \n Something went wrong!! Please try to login again")
            // Redirect to a default page or display an error message
        }
    }
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
    }
};


  const isValidEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-form bg-light rounded shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formPhoneNumber" className="mb-3">
            <Form.Label>Phone Number / Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number or email"
              value={phoneNumber || email}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setEmail(e.target.value);
              }}
            />
          </Form.Group>
    
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
    
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Login
          </Button>
          <div className="text-center">
          Forgot Password ? <Link to="/passwodResetForm">Click Here</Link>
        </div>
        </Form>
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        {success && <Alert variant="success" className="mb-3">Login successful. Redirecting...</Alert>}
        <div className="text-center">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </Container>
  );
};

export default LoginForm;

import { useState, useEffect, useContext } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../context/UserContext';

export default function Register() {
  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isValid = email && password.length >= 8;
    setIsActive(isValid);
  }, [email, password]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setIsAdmin(false);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isAdmin })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        notyf.success("Successfully registered! Redirecting to login...");
        resetForm();
        setTimeout(() => setRegistered(true), 1500);
      } else {
        const message = data.message || "Registration failed";

        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach(err => notyf.error(err));
        } else if (message.toLowerCase().includes("success")) {
          notyf.success(message);
          resetForm();
          setTimeout(() => setRegistered(true), 1500);
        } else {
          notyf.error(message);
        }
      }
    } catch (error) {
      console.error("Registration Error:", error);
      notyf.error(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user.id !== null) return <Navigate to="/movies" />;
  if (registered) return <Navigate to="/login" />;

  return (
    <>
      <Form onSubmit={registerUser}>
        <h1 className="my-5 text-center">Sign Up & Get Started</h1>

        <Form.Group>
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={8}
          />
        </Form.Group>

        <Form.Group className="mt-3 mb-3">
          <Form.Check
            type="checkbox"
            label="Register as Admin"
            checked={isAdmin}
            onChange={e => setIsAdmin(e.target.checked)}
          />
        </Form.Group>

        <Button
          variant={isActive ? "primary" : "secondary"}
          type="submit"
          disabled={!isActive || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Registering...
            </>
          ) : 'Submit'}
        </Button>
      </Form>

      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Click here</Link> to log in.
      </p>
    </>
  );
}

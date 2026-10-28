import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response =
        await axiosInstance.post(
          "/auth/login",
          formData
        );

      const loginData =
        response.data.data;

      login(loginData);

      if (
        loginData.role === "CANDIDATE"
      ) {
        navigate(
          "/candidate/dashboard"
        );
      } else if (
        loginData.role === "RECRUITER"
      ) {
        navigate(
          "/recruiter/dashboard"
        );
      } else {
        navigate("/");
      }
    } catch (error) {
      const validationErrors = error.response?.data?.validationErrors;
      if (validationErrors && Object.keys(validationErrors).length > 0) {
        setMessage(Object.values(validationErrors).join(". "));
      } else if (error.response) {
        setMessage(error.response.data?.message || `Login failed (HTTP ${error.response.status}).`);
      } else {
        setMessage("Cannot reach the backend. Check that Spring Boot and MySQL are running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>

        <p>
          Login to continue to
          JobPortal Pro
        </p>

        {message && (
          <div className="error-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
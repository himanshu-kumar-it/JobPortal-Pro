import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      fullName: "",
      email: "",
      password: "",
      role: "CANDIDATE",
    });

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

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
      setSuccess(false);

      const response =
        await axiosInstance.post(
          "/auth/register",
          formData
        );

      setSuccess(true);

      setMessage(
        response.data.message ||
          "Registration successful"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const validationErrors = error.response?.data?.validationErrors;
      const serverMessage = error.response?.data?.message;

      if (validationErrors && Object.keys(validationErrors).length > 0) {
        setMessage(Object.values(validationErrors).join(". "));
      } else if (error.response?.status === 409) {
        setMessage(serverMessage || "This email is already registered. Please log in or use another email.");
      } else if (error.response) {
        setMessage(serverMessage || `Registration failed (HTTP ${error.response.status}).`);
      } else if (error.code === "ECONNABORTED") {
        setMessage("The server took too long to respond. Check that the backend and MySQL are running.");
      } else {
        setMessage("Cannot reach the backend. Start the Spring Boot backend and check the API URL/CORS settings.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        <p>
          Register as candidate or
          recruiter
        </p>

        {message && (
          <div
            className={
              success
                ? "success-message"
                : "error-message"
            }
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
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
              placeholder="Minimum 6 characters"
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Register As</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="CANDIDATE">
                Candidate
              </option>

              <option value="RECRUITER">
                Recruiter
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
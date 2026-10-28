import {
  useEffect,
  useState,
} from "react";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

import "./Account.css";

function Account() {
  const { user } = useAuth();

  const [account, setAccount] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response =
        await axiosInstance.get(
          "/account/me"
        );

      setAccount(
        response.data?.data || null
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Account details could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  const handlePasswordChange = async (
    event
  ) => {
    event.preventDefault();

    try {
      setPasswordLoading(true);
      setMessage("");
      setSuccessMessage("");

      const response =
        await axiosInstance.put(
          "/account/change-password",
          formData
        );

      setSuccessMessage(
        response.data?.message ||
          "Password changed successfully"
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const validationErrors =
        error.response?.data
          ?.validationErrors;

      if (validationErrors) {
        setMessage(
          Object.values(
            validationErrors
          ).join(", ")
        );
      } else {
        setMessage(
          error.response?.data
            ?.message ||
            "Password could not be changed"
        );
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="account-page">
        <div className="account-loading">
          <div className="dashboard-loader" />
          <p>
            Loading account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page">
      <section className="account-header">
        <div>
          <span>My Account</span>

          <h1>
            Account Settings
          </h1>

          <p>
            View your account details and
            update your password.
          </p>
        </div>
      </section>

      {message && (
        <div className="account-message account-error-message">
          {message}
        </div>
      )}

      {successMessage && (
        <div className="account-message account-success-message">
          {successMessage}
        </div>
      )}

      <section className="account-layout">
        <article className="account-profile-card">
          <div className="account-avatar">
            {(account?.fullName ||
              user?.fullName)
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <h2>
            {account?.fullName ||
              user?.fullName}
          </h2>

          <p>
            {account?.email ||
              user?.email}
          </p>

          <span className="account-role">
            {account?.role ===
            "CANDIDATE"
              ? "Candidate"
              : "Recruiter"}
          </span>

          <div className="account-information">
            <div>
              <span>User ID</span>
              <strong>
                #{account?.id ||
                  user?.id}
              </strong>
            </div>

            <div>
              <span>Full Name</span>
              <strong>
                {account?.fullName ||
                  user?.fullName}
              </strong>
            </div>

            <div>
              <span>Email Address</span>
              <strong>
                {account?.email ||
                  user?.email}
              </strong>
            </div>

            <div>
              <span>Account Type</span>
              <strong>
                {account?.role ===
                "CANDIDATE"
                  ? "Candidate"
                  : "Recruiter"}
              </strong>
            </div>
          </div>
        </article>

        <article className="change-password-card">
          <div className="account-card-heading">
            <span>Security</span>

            <h2>
              Change Password
            </h2>

            <p>
              Use a secure password that
              you do not use elsewhere.
            </p>
          </div>

          <form
            onSubmit={
              handlePasswordChange
            }
          >
            <div className="form-group">
              <label>
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={
                  formData.currentPassword
                }
                onChange={handleChange}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="form-group">
              <label>
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={
                  formData.newPassword
                }
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                placeholder="Confirm new password"
                minLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="change-password-button"
              disabled={
                passwordLoading
              }
            >
              {passwordLoading
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}

export default Account;
import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

import "./CandidateDashboard.css";

function CandidateDashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    fetchDashboard();
  }, [user?.id]);

  const fetchDashboard = async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response =
        await axiosInstance.get(
          `/dashboard/candidate/${user.id}`
        );

      setDashboard(response.data.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Dashboard could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  const getFirstName = () => {
    if (!user?.fullName) {
      return "Candidate";
    }

    return user.fullName.split(" ")[0];
  };

  if (loading) {
    return (
      <main className="candidate-dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loader" />

          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (message) {
    return (
      <main className="candidate-dashboard-page">
        <div className="dashboard-error-card">
          <div className="dashboard-error-icon">
            !
          </div>

          <h2>
            Unable to load dashboard
          </h2>

          <p>{message}</p>

          <button
            type="button"
            onClick={fetchDashboard}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const totalApplications =
    dashboard?.totalApplications || 0;

  const appliedApplications =
    dashboard?.appliedApplications || 0;

  const underReviewApplications =
    dashboard?.underReviewApplications ||
    0;

  const shortlistedApplications =
    dashboard?.shortlistedApplications ||
    0;

  const selectedApplications =
    dashboard?.selectedApplications || 0;

  const rejectedApplications =
    dashboard?.rejectedApplications || 0;

  const withdrawnApplications =
    dashboard?.withdrawnApplications || 0;

  const savedJobs =
    dashboard?.savedJobs || 0;

  return (
    <main className="candidate-dashboard-page">
      <section className="candidate-welcome-section">
        <div>
          <span className="welcome-label">
            Candidate Dashboard
          </span>

          <h1>
            Welcome back,{" "}
            {getFirstName()}!
          </h1>

          <p>
            Track your applications,
            saved jobs and career
            progress from one place.
          </p>
        </div>

        <Link
          to="/"
          className="browse-jobs-button"
        >
          Browse Jobs
          <span>→</span>
        </Link>
      </section>

      <section className="candidate-summary-grid">
        <article className="summary-card">
          <div className="summary-icon blue-icon">
            A
          </div>

          <div>
            <span>
              Total Applications
            </span>

            <strong>
              {totalApplications}
            </strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon purple-icon">
            S
          </div>

          <div>
            <span>Saved Jobs</span>

            <strong>{savedJobs}</strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon orange-icon">
            R
          </div>

          <div>
            <span>Under Review</span>

            <strong>
              {underReviewApplications}
            </strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon green-icon">
            ✓
          </div>

          <div>
            <span>Shortlisted</span>

            <strong>
              {shortlistedApplications}
            </strong>
          </div>
        </article>
      </section>

      <section className="candidate-dashboard-content">
        <div className="application-overview-card">
          <div className="dashboard-card-heading">
            <div>
              <span>
                Application overview
              </span>

              <h2>
                Your application status
              </h2>
            </div>

            <Link to="/my-applications">
              View Applications
              <span>→</span>
            </Link>
          </div>

          <div className="application-status-list">
            <div className="application-status-row">
              <div className="status-title">
                <span className="status-dot applied-dot" />

                <div>
                  <strong>
                    Applied
                  </strong>

                  <small>
                    Application submitted
                  </small>
                </div>
              </div>

              <span className="status-count">
                {appliedApplications}
              </span>
            </div>

            <div className="application-status-row">
              <div className="status-title">
                <span className="status-dot review-dot" />

                <div>
                  <strong>
                    Under Review
                  </strong>

                  <small>
                    Recruiter is reviewing
                  </small>
                </div>
              </div>

              <span className="status-count">
                {underReviewApplications}
              </span>
            </div>

            <div className="application-status-row">
              <div className="status-title">
                <span className="status-dot shortlisted-dot" />

                <div>
                  <strong>
                    Shortlisted
                  </strong>

                  <small>
                    Selected for next round
                  </small>
                </div>
              </div>

              <span className="status-count">
                {shortlistedApplications}
              </span>
            </div>

            <div className="application-status-row">
              <div className="status-title">
                <span className="status-dot selected-dot" />

                <div>
                  <strong>
                    Selected
                  </strong>

                  <small>
                    Successfully selected
                  </small>
                </div>
              </div>

              <span className="status-count">
                {selectedApplications}
              </span>
            </div>

            <div className="application-status-row">
              <div className="status-title">
                <span className="status-dot rejected-dot" />

                <div>
                  <strong>
                    Rejected
                  </strong>

                  <small>
                    Application not selected
                  </small>
                </div>
              </div>

              <span className="status-count">
                {rejectedApplications}
              </span>
            </div>

            <div className="application-status-row">
              <div className="status-title">
                <span className="status-dot withdrawn-dot" />

                <div>
                  <strong>
                    Withdrawn
                  </strong>

                  <small>
                    Application withdrawn
                  </small>
                </div>
              </div>

              <span className="status-count">
                {withdrawnApplications}
              </span>
            </div>
          </div>
        </div>

        <aside className="candidate-side-column">
          <article className="profile-summary-card">
            <div className="profile-avatar-large">
              {user?.fullName
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <h3>
              {dashboard?.candidateName ||
                user?.fullName}
            </h3>

            <p>
              {dashboard?.email ||
                user?.email}
            </p>

            <div className="candidate-role-badge">
              Candidate
            </div>

            <Link
              to="/candidate/profile"
              className="profile-action-button"
            >
              Complete Profile
            </Link>
          </article>

          <article className="quick-actions-card">
            <div className="quick-actions-heading">
              <span>Quick actions</span>
              <h3>
                What would you like to
                do?
              </h3>
            </div>

            <Link
              to="/"
              className="quick-action-item"
            >
              <div className="quick-action-icon">
                ⌕
              </div>

              <div>
                <strong>
                  Search Jobs
                </strong>

                <span>
                  Explore latest openings
                </span>
              </div>

              <b>→</b>
            </Link>

            <Link
              to="/saved-jobs"
              className="quick-action-item"
            >
              <div className="quick-action-icon">
                ♡
              </div>

              <div>
                <strong>
                  Saved Jobs
                </strong>

                <span>
                  View saved opportunities
                </span>
              </div>

              <b>→</b>
            </Link>

            <Link
              to="/my-applications"
              className="quick-action-item"
            >
              <div className="quick-action-icon">
                ✓
              </div>

              <div>
                <strong>
                  My Applications
                </strong>

                <span>
                  Track application status
                </span>
              </div>

              <b>→</b>
            </Link>
          </article>
        </aside>
      </section>
    </main>
  );
}

export default CandidateDashboard;
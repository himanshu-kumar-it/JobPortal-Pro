import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

import "./RecruiterDashboard.css";

function RecruiterDashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

      const response = await axiosInstance.get(
        `/dashboard/recruiter/${user.id}`
      );

      setDashboard(response.data?.data || null);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Recruiter dashboard could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  const getFirstName = () => {
    if (!user?.fullName) {
      return "Recruiter";
    }

    return user.fullName.split(" ")[0];
  };

  if (loading) {
    return (
      <main className="recruiter-dashboard-page">
        <div className="recruiter-loading">
          <div className="dashboard-loader" />
          <p>Loading recruiter dashboard...</p>
        </div>
      </main>
    );
  }

  if (message) {
    return (
      <main className="recruiter-dashboard-page">
        <div className="recruiter-error-card">
          <div>!</div>

          <h2>Unable to load dashboard</h2>

          <p>{message}</p>

          <button type="button" onClick={fetchDashboard}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="recruiter-dashboard-page">
      <section className="recruiter-welcome-section">
        <div>
          <span>Recruiter Dashboard</span>

          <h1>
            Welcome back, {getFirstName()}!
          </h1>

          <p>
            Manage jobs, review applications and track your
            hiring activity.
          </p>
        </div>

        <Link
          to="/recruiter/jobs"
          className="manage-jobs-button"
        >
          Manage Jobs
          <b>→</b>
        </Link>
      </section>

      <section className="recruiter-summary-grid">
        <article className="recruiter-summary-card">
          <div className="recruiter-summary-icon blue-summary">
            J
          </div>

          <div>
            <span>Total Jobs</span>
            <strong>{dashboard?.totalJobs || 0}</strong>
          </div>
        </article>

        <article className="recruiter-summary-card">
          <div className="recruiter-summary-icon green-summary">
            O
          </div>

          <div>
            <span>Open Jobs</span>
            <strong>{dashboard?.openJobs || 0}</strong>
          </div>
        </article>

        <article className="recruiter-summary-card">
          <div className="recruiter-summary-icon red-summary">
            C
          </div>

          <div>
            <span>Closed Jobs</span>
            <strong>{dashboard?.closedJobs || 0}</strong>
          </div>
        </article>

        <article className="recruiter-summary-card">
          <div className="recruiter-summary-icon purple-summary">
            A
          </div>

          <div>
            <span>Total Applications</span>
            <strong>
              {dashboard?.totalApplications || 0}
            </strong>
          </div>
        </article>
      </section>

      <section className="recruiter-dashboard-layout">
        <article className="recruiter-status-card">
          <div className="recruiter-card-heading">
            <span>Hiring Overview</span>
            <h2>Application Status</h2>
          </div>

          <div className="recruiter-status-list">
            <div>
              <span>Applied</span>
              <strong>
                {dashboard?.appliedApplications || 0}
              </strong>
            </div>

            <div>
              <span>Under Review</span>
              <strong>
                {dashboard?.underReviewApplications || 0}
              </strong>
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>
                {dashboard?.shortlistedApplications || 0}
              </strong>
            </div>

            <div>
              <span>Selected</span>
              <strong>
                {dashboard?.selectedApplications || 0}
              </strong>
            </div>

            <div>
              <span>Rejected</span>
              <strong>
                {dashboard?.rejectedApplications || 0}
              </strong>
            </div>

            <div>
              <span>Withdrawn</span>
              <strong>
                {dashboard?.withdrawnApplications || 0}
              </strong>
            </div>
          </div>
        </article>

        <aside className="recruiter-side-column">
          <article className="recruiter-company-card">
            <div className="recruiter-company-logo">
              {dashboard?.companyName
                ?.charAt(0)
                .toUpperCase() || "C"}
            </div>

            <h3>
              {dashboard?.companyName || "Company"}
            </h3>

            <p>
              Recruiter:{" "}
              {dashboard?.recruiterName ||
                user?.fullName}
            </p>

            <span>
              {dashboard?.email || user?.email}
            </span>
          </article>

          <article className="recruiter-quick-actions">
            <span>Quick Actions</span>

            <h3>Manage hiring</h3>

            <Link to="/recruiter/jobs">
              <div>J</div>

              <section>
                <strong>Manage Jobs</strong>
                <small>
                  Create, edit and remove jobs
                </small>
              </section>

              <b>→</b>
            </Link>

            <Link to="/recruiter/applications">
              <div>A</div>

              <section>
                <strong>Applications</strong>
                <small>
                  Review candidate applications
                </small>
              </section>

              <b>→</b>
            </Link>

            <Link to="/account">
              <div>P</div>

              <section>
                <strong>Account</strong>
                <small>
                  View profile and security
                </small>
              </section>

              <b>→</b>
            </Link>
          </article>
        </aside>
      </section>
    </main>
  );
}

export default RecruiterDashboard;
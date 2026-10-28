import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

import "./CandidatePages.css";

function MyApplications() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] =
    useState("ALL");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");


  useEffect(() => {
    fetchApplications();
  }, [user?.id]);

  const fetchApplications = async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get(
        `/applications/candidate/${user.id}`
      );

      const data = response.data?.data;

      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Applications could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not specified";
    }

    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getApplicationId = (application) =>
    application.id ||
    application.applicationId ||
    application.jobApplicationId;

  const getJobId = (application) =>
    application.jobId ||
    application.job?.id;

  const getJobTitle = (application) =>
    application.jobTitle ||
    application.title ||
    application.job?.title ||
    "Job Opening";

  const getCompanyName = (application) =>
    application.companyName ||
    application.job?.companyName ||
    application.job?.company?.companyName ||
    "Company";

  const getLocation = (application) =>
    application.location ||
    application.jobLocation ||
    application.job?.location ||
    "Not specified";

  const getStatus = (application) =>
    application.status ||
    application.applicationStatus ||
    "APPLIED";

  const getAppliedDate = (application) =>
    application.appliedAt ||
    application.applicationDate ||
    application.createdAt;

  const filteredApplications =
    selectedStatus === "ALL"
      ? applications
      : applications.filter(
          (application) =>
            getStatus(application) === selectedStatus
        );

  const statusOptions = [
    "ALL",
    "APPLIED",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "SELECTED",
    "REJECTED",
    "WITHDRAWN",
  ];

  const getStatusClass = (status) => {
    return `application-status application-status-${status
      .toLowerCase()
      .replace("_", "-")}`;
  };

  const formatStatus = (status) =>
    status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (character) =>
        character.toUpperCase()
      );

  if (loading) {
    return (
      <main className="candidate-list-page">
        <div className="candidate-page-loading">
          <div className="dashboard-loader" />
          <p>Loading applications...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="candidate-list-page">
      <section className="candidate-page-header">
        <div>
          <span>Candidate Workspace</span>
          <h1>My Applications</h1>
          <p>
            View every job application and track its current
            status.
          </p>
        </div>

        <Link to="/" className="header-action-button">
          Apply for More Jobs
          <b>→</b>
        </Link>
      </section>

      {message && (
        <div className="candidate-error-box">
          <div>!</div>
          <h2>Unable to load applications</h2>
          <p>{message}</p>

          <button type="button" onClick={fetchApplications}>
            Try Again
          </button>
        </div>
      )}

      {!message && applications.length === 0 && (
        <section className="candidate-empty-state">
          <div className="empty-state-icon">✓</div>

          <h2>No applications yet</h2>

          <p>
            Apply for a job and your application will appear
            here.
          </p>

          <Link to="/">Explore Jobs</Link>
        </section>
      )}

      {!message && applications.length > 0 && (
        <>
          <section className="application-filter-section">
            <div>
              <span>Total Applications</span>
              <strong>{applications.length}</strong>
            </div>

            <div className="application-filter-buttons">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={
                    selectedStatus === status
                      ? "application-filter-active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedStatus(status)
                  }
                >
                  {formatStatus(status)}
                </button>
              ))}
            </div>
          </section>

          {filteredApplications.length === 0 && (
            <section className="candidate-empty-state small-empty-state">
              <h2>No matching applications</h2>

              <p>
                There are no applications with this status.
              </p>
            </section>
          )}

          <section className="applications-list">
            {filteredApplications.map((application) => {
              const status = getStatus(application);
              const jobId = getJobId(application);

              return (
                <article
                  key={getApplicationId(application)}
                  className="application-list-card"
                >
                  <div className="application-company-logo">
                    {getCompanyName(application)
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="application-main-content">
                    <div className="application-title-row">
                      <div>
                        <span>
                          {getCompanyName(application)}
                        </span>

                        <h2>
                          {getJobTitle(application)}
                        </h2>
                      </div>

                      <span className={getStatusClass(status)}>
                        {formatStatus(status)}
                      </span>
                    </div>

                    <div className="application-details-row">
                      <div>
                        <span>Location</span>
                        <strong>
                          {getLocation(application)}
                        </strong>
                      </div>

                      <div>
                        <span>Applied On</span>
                        <strong>
                          {formatDate(
                            getAppliedDate(application)
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Application ID</span>
                        <strong>
                          #{getApplicationId(application)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="application-card-action">
                    {jobId ? (
                      <Link to={`/jobs/${jobId}`}>
                        View Job
                      </Link>
                    ) : (
                      <span>Job Details</span>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}

export default MyApplications;
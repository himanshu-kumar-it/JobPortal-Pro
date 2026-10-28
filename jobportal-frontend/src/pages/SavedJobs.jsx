import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

import "./CandidatePages.css";

function SavedJobs() {
  const { user } = useAuth();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchSavedJobs();
  }, [user?.id]);

  const fetchSavedJobs = async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get(
        `/saved-jobs/candidate/${user.id}`
      );

      const data = response.data?.data;

      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Saved jobs could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveJob = async (jobId) => {
    const confirmRemove = window.confirm(
      "Do you want to remove this job from saved jobs?"
    );

    if (!confirmRemove) {
      return;
    }

    try {
      setRemovingId(jobId);

      await axiosInstance.delete(
        `/saved-jobs/candidate/${user.id}/job/${jobId}`
      );

      setSavedJobs((currentJobs) =>
        currentJobs.filter(
          (savedJob) => savedJob.jobId !== jobId
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Saved job could not be removed"
      );
    } finally {
      setRemovingId(null);
    }
  };

  const formatSalary = (salary) => {
    if (salary === null || salary === undefined) {
      return null;
    }

    return Number(salary).toLocaleString("en-IN");
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

  if (loading) {
    return (
      <main className="candidate-list-page">
        <div className="candidate-page-loading">
          <div className="dashboard-loader" />
          <p>Loading saved jobs...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="candidate-list-page">
      <section className="candidate-page-header">
        <div>
          <span>Candidate Workspace</span>
          <h1>Saved Jobs</h1>
          <p>
            Review the opportunities you saved and apply when
            you are ready.
          </p>
        </div>

        <Link to="/" className="header-action-button">
          Browse More Jobs
          <b>→</b>
        </Link>
      </section>

      {message && (
        <div className="candidate-error-box">
          <div>!</div>
          <h2>Unable to load saved jobs</h2>
          <p>{message}</p>

          <button type="button" onClick={fetchSavedJobs}>
            Try Again
          </button>
        </div>
      )}

      {!message && savedJobs.length === 0 && (
        <section className="candidate-empty-state">
          <div className="empty-state-icon">♡</div>

          <h2>No saved jobs yet</h2>

          <p>
            Save interesting jobs from the home page and they
            will appear here.
          </p>

          <Link to="/">Find Jobs</Link>
        </section>
      )}

      {!message && savedJobs.length > 0 && (
        <>
          <div className="candidate-list-summary">
            <div>
              <span>Total Saved Jobs</span>
              <strong>{savedJobs.length}</strong>
            </div>
          </div>

          <section className="candidate-job-list">
            {savedJobs.map((savedJob) => {
              const minimumSalary = formatSalary(
                savedJob.minimumSalary
              );

              const maximumSalary = formatSalary(
                savedJob.maximumSalary
              );

              return (
                <article
                  key={savedJob.savedJobId}
                  className="candidate-job-card"
                >
                  <div className="candidate-job-logo">
                    {savedJob.companyName
                      ?.charAt(0)
                      .toUpperCase() || "C"}
                  </div>

                  <div className="candidate-job-main">
                    <div className="candidate-job-heading">
                      <div>
                        <span className="candidate-job-company">
                          {savedJob.companyName || "Company"}
                        </span>

                        <h2>
                          {savedJob.jobTitle || "Job Opening"}
                        </h2>
                      </div>

                      <span className="saved-status-badge">
                        Saved
                      </span>
                    </div>

                    <div className="candidate-job-meta">
                      <span>
                        Location:{" "}
                        {savedJob.location || "Not specified"}
                      </span>

                      <span>
                        Type:{" "}
                        {savedJob.jobType || "Not specified"}
                      </span>

                      <span>
                        Mode:{" "}
                        {savedJob.workMode || "Not specified"}
                      </span>
                    </div>

                    {savedJob.skills && (
                      <div className="candidate-skill-list">
                        {String(savedJob.skills)
                          .split(",")
                          .slice(0, 5)
                          .map((skill) => (
                            <span key={skill.trim()}>
                              {skill.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="candidate-job-information">
                      <div>
                        <span>Salary</span>

                        <strong>
                          {minimumSalary && maximumSalary
                            ? `₹${minimumSalary} - ₹${maximumSalary}`
                            : "Not disclosed"}
                        </strong>
                      </div>

                      <div>
                        <span>Deadline</span>

                        <strong>
                          {formatDate(
                            savedJob.applicationDeadline
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Saved On</span>

                        <strong>
                          {formatDate(savedJob.savedAt)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="candidate-job-actions">
                    <Link
                      to={`/jobs/${savedJob.jobId}`}
                      className="view-job-button"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      className="remove-job-button"
                      onClick={() =>
                        handleRemoveJob(savedJob.jobId)
                      }
                      disabled={removingId === savedJob.jobId}
                    >
                      {removingId === savedJob.jobId
                        ? "Removing..."
                        : "Remove"}
                    </button>
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

export default SavedJobs;
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

import "./JobDetails.css";

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    if (
      user?.role === "CANDIDATE" &&
      user?.id &&
      jobId
    ) {
      checkSavedStatus();
      checkApplicationStatus();
    }
  }, [user?.id, user?.role, jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axiosInstance.get(
        `/jobs/${jobId}`
      );

      setJob(response.data?.data || null);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Job details could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkSavedStatus = async () => {
    try {
      const response = await axiosInstance.get(
        `/saved-jobs/candidate/${user.id}/job/${jobId}/check`
      );

      setSaved(
        Boolean(response.data?.data?.saved)
      );
    } catch {
      setSaved(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await axiosInstance.get(
        `/applications/candidate/${user.id}`
      );

      const applications = Array.isArray(
        response.data?.data
      )
        ? response.data.data
        : [];

      const alreadyApplied = applications.some(
        (application) => {
          const applicationJobId =
            application.jobId ||
            application.job?.id;

          return (
            Number(applicationJobId) ===
            Number(jobId)
          );
        }
      );

      setApplied(alreadyApplied);
    } catch {
      setApplied(false);
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "CANDIDATE") {
      setMessage(
        "Only candidates can save jobs"
      );
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");
      setSuccessMessage("");

      if (saved) {
        await axiosInstance.delete(
          `/saved-jobs/candidate/${user.id}/job/${jobId}`
        );

        setSaved(false);
        setSuccessMessage(
          "Job removed from saved jobs"
        );
      } else {
        await axiosInstance.post(
          `/saved-jobs/candidate/${user.id}/job/${jobId}`
        );

        setSaved(true);
        setSuccessMessage(
          "Job saved successfully"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Saved job action failed"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyJob = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "CANDIDATE") {
      setMessage(
        "Only candidates can apply for jobs"
      );
      return;
    }

    if (applied) {
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");
      setSuccessMessage("");

      await axiosInstance.post(
        `/applications/candidate/${user.id}/job/${jobId}`
      );

      setApplied(true);
      setSuccessMessage(
        "Application submitted successfully"
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Application could not be submitted";

      setMessage(errorMessage);

      if (
        errorMessage
          .toLowerCase()
          .includes("already")
      ) {
        setApplied(true);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const formatSalary = (salary) => {
    if (
      salary === null ||
      salary === undefined
    ) {
      return null;
    }

    return Number(salary).toLocaleString(
      "en-IN"
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not specified";
    }

    return new Date(
      dateValue
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatText = (value) => {
    if (!value) {
      return "Not specified";
    }

    return String(value)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (character) =>
        character.toUpperCase()
      );
  };

  if (loading) {
    return (
      <main className="job-details-page">
        <div className="job-details-loading">
          <div className="dashboard-loader" />
          <p>Loading job details...</p>
        </div>
      </main>
    );
  }

  if (message && !job) {
    return (
      <main className="job-details-page">
        <div className="job-details-error">
          <div>!</div>

          <h2>
            Unable to load job details
          </h2>

          <p>{message}</p>

          <button
            type="button"
            onClick={fetchJobDetails}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="job-details-page">
        <div className="job-details-error">
          <div>!</div>
          <h2>Job not found</h2>
          <Link to="/">Go to Jobs</Link>
        </div>
      </main>
    );
  }

  const companyName =
    job.companyName ||
    job.company?.companyName ||
    "Company";

  const jobTitle =
    job.title ||
    job.jobTitle ||
    "Job Opening";

  const minimumSalary = formatSalary(
    job.minimumSalary
  );

  const maximumSalary = formatSalary(
    job.maximumSalary
  );

  const skills = job.skills
    ? String(job.skills)
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="job-details-page">
      <div className="job-details-back">
        <Link to="/">
          ← Back to Jobs
        </Link>
      </div>

      {message && (
        <div className="job-action-message error-action-message">
          {message}
        </div>
      )}

      {successMessage && (
        <div className="job-action-message success-action-message">
          {successMessage}
        </div>
      )}

      <section className="job-details-header">
        <div className="job-details-company-logo">
          {companyName
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="job-details-title">
          <span>{companyName}</span>

          <h1>{jobTitle}</h1>

          <div className="job-details-meta">
            <span>
              Location:{" "}
              {job.location ||
                "Not specified"}
            </span>

            <span>
              Job Type:{" "}
              {formatText(job.jobType)}
            </span>

            <span>
              Work Mode:{" "}
              {formatText(job.workMode)}
            </span>
          </div>
        </div>

        <div className="job-header-status">
          <span
            className={
              job.status === "OPEN"
                ? "job-open-badge"
                : "job-closed-badge"
            }
          >
            {formatText(job.status)}
          </span>
        </div>
      </section>

      <section className="job-details-layout">
        <div className="job-details-main">
          <article className="job-details-card">
            <h2>Job Description</h2>

            <p className="job-description">
              {job.description ||
                "No description available for this job."}
            </p>
          </article>

          <article className="job-details-card">
            <h2>Required Skills</h2>

            {skills.length > 0 ? (
              <div className="job-details-skills">
                {skills.map((skill) => (
                  <span key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="job-description">
                Skills not specified.
              </p>
            )}
          </article>

          <article className="job-details-card">
            <h2>Job Information</h2>

            <div className="job-information-grid">
              <div>
                <span>Employment Type</span>
                <strong>
                  {formatText(job.jobType)}
                </strong>
              </div>

              <div>
                <span>Work Mode</span>
                <strong>
                  {formatText(job.workMode)}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {job.location ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>Job Status</span>
                <strong>
                  {formatText(job.status)}
                </strong>
              </div>

              <div>
                <span>Minimum Salary</span>
                <strong>
                  {minimumSalary
                    ? `₹${minimumSalary}`
                    : "Not disclosed"}
                </strong>
              </div>

              <div>
                <span>Maximum Salary</span>
                <strong>
                  {maximumSalary
                    ? `₹${maximumSalary}`
                    : "Not disclosed"}
                </strong>
              </div>

              <div>
                <span>
                  Application Deadline
                </span>
                <strong>
                  {formatDate(
                    job.applicationDeadline
                  )}
                </strong>
              </div>

              <div>
                <span>Posted On</span>
                <strong>
                  {formatDate(
                    job.createdAt ||
                      job.postedAt
                  )}
                </strong>
              </div>
            </div>
          </article>

          {job.requirements && (
            <article className="job-details-card">
              <h2>Requirements</h2>

              <p className="job-description">
                {job.requirements}
              </p>
            </article>
          )}
        </div>

        <aside className="job-details-sidebar">
          <article className="job-apply-card">
            <span className="apply-card-label">
              Salary Range
            </span>

            <h2>
              {minimumSalary &&
              maximumSalary
                ? `₹${minimumSalary} - ₹${maximumSalary}`
                : "Not disclosed"}
            </h2>

            <p>
              Review the job details before
              submitting your application.
            </p>

            <button
              type="button"
              className="apply-now-button"
              onClick={handleApplyJob}
              disabled={
                actionLoading ||
                applied ||
                job.status === "CLOSED"
              }
            >
              {job.status === "CLOSED"
                ? "Job Closed"
                : applied
                  ? "Already Applied"
                  : actionLoading
                    ? "Please wait..."
                    : "Apply Now"}
            </button>

            <button
              type="button"
              className={
                saved
                  ? "save-details-button saved-details-button"
                  : "save-details-button"
              }
              onClick={handleSaveJob}
              disabled={actionLoading}
            >
              {saved
                ? "Remove Saved Job"
                : "Save Job"}
            </button>
          </article>

          <article className="company-details-card">
            <div className="company-card-logo">
              {companyName
                .charAt(0)
                .toUpperCase()}
            </div>

            <h3>{companyName}</h3>

            {job.company?.industry && (
              <p>
                {job.company.industry}
              </p>
            )}

            {job.company?.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noreferrer"
              >
                Visit Company Website
              </a>
            )}
          </article>
        </aside>
      </section>
    </main>
  );
}

export default JobDetails;
import { useEffect, useMemo, useState } from "react";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

import "./RecruiterApplications.css";

const applicationStatuses = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "SELECTED",
  "REJECTED",
];

function RecruiterApplications() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

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
        `/applications/recruiter/${user.id}`
      );

      const responseData = response.data?.data;

      setApplications(
        Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.content)
            ? responseData.content
            : []
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Applications could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId,
    newStatus
  ) => {
    try {
      setUpdatingId(applicationId);
      setMessage("");
      setSuccessMessage("");

      await axiosInstance.put(
        `/applications/${applicationId}/status`,
        {
          status: newStatus,
        }
      );

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: newStatus,
                applicationStatus: newStatus,
              }
            : application
        )
      );

      setSelectedApplication(
        (currentApplication) =>
          currentApplication?.id === applicationId
            ? {
                ...currentApplication,
                status: newStatus,
                applicationStatus: newStatus,
              }
            : currentApplication
      );

      setSuccessMessage(
        `Application status updated to ${formatText(
          newStatus
        )}`
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Application status could not be updated"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getApplicationStatus = (application) =>
    application.status ||
    application.applicationStatus ||
    "APPLIED";

  const getCandidateName = (application) =>
    application.candidateName ||
    application.candidate?.fullName ||
    application.candidate?.name ||
    application.user?.fullName ||
    "Candidate";

  const getCandidateEmail = (application) =>
    application.candidateEmail ||
    application.candidate?.email ||
    application.user?.email ||
    "Not available";

  const getCandidatePhone = (application) =>
    application.phone ||
    application.phoneNumber ||
    application.candidate?.phone ||
    application.candidateProfile?.phone ||
    "Not available";

  const getJobTitle = (application) =>
    application.jobTitle ||
    application.job?.title ||
    application.job?.jobTitle ||
    "Job Opening";

  const getJobLocation = (application) =>
    application.jobLocation ||
    application.job?.location ||
    "Not specified";

  const getCandidateSkills = (application) =>
    application.skills ||
    application.candidate?.skills ||
    application.candidateProfile?.skills ||
    "Not specified";

  const getCandidateExperience = (application) =>
    application.experience ||
    application.candidate?.experience ||
    application.candidateProfile?.experience ||
    "Fresher";

  const getCandidateEducation = (application) =>
    application.education ||
    application.candidate?.education ||
    application.candidateProfile?.education ||
    "Not specified";

  const getResumeUrl = (application) =>
    application.resumeUrl ||
    application.resume ||
    application.candidate?.resumeUrl ||
    application.candidateProfile?.resumeUrl ||
    null;

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

  const formatDate = (value) => {
    if (!value) {
      return "Not specified";
    }

    return new Date(value).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "UNDER_REVIEW":
        return "application-under-review";

      case "SHORTLISTED":
        return "application-shortlisted";

      case "SELECTED":
        return "application-selected";

      case "REJECTED":
        return "application-rejected";

      default:
        return "application-applied";
    }
  };

  const filteredApplications = useMemo(() => {
    const normalizedSearchTerm = searchTerm
      .trim()
      .toLowerCase();

    return applications.filter((application) => {
      const status = getApplicationStatus(application);

      const matchesStatus =
        selectedStatus === "ALL" ||
        status === selectedStatus;

      const searchableText = [
        getCandidateName(application),
        getCandidateEmail(application),
        getJobTitle(application),
        getJobLocation(application),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearchTerm ||
        searchableText.includes(normalizedSearchTerm);

      return matchesStatus && matchesSearch;
    });
  }, [applications, searchTerm, selectedStatus]);

  const statusCounts = useMemo(() => {
    return applications.reduce(
      (counts, application) => {
        const status = getApplicationStatus(application);

        counts.total += 1;

        if (status === "APPLIED") {
          counts.applied += 1;
        }

        if (status === "UNDER_REVIEW") {
          counts.underReview += 1;
        }

        if (status === "SHORTLISTED") {
          counts.shortlisted += 1;
        }

        if (status === "SELECTED") {
          counts.selected += 1;
        }

        if (status === "REJECTED") {
          counts.rejected += 1;
        }

        return counts;
      },
      {
        total: 0,
        applied: 0,
        underReview: 0,
        shortlisted: 0,
        selected: 0,
        rejected: 0,
      }
    );
  }, [applications]);

  return (
    <main className="recruiter-applications-page">
      <section className="recruiter-applications-header">
        <div>
          <span>Recruiter Workspace</span>

          <h1>Candidate Applications</h1>

          <p>
            Review candidates and update their hiring
            status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          className="refresh-applications-button"
        >
          Refresh Applications
        </button>
      </section>

      {message && (
        <div className="recruiter-application-message recruiter-application-error">
          {message}
        </div>
      )}

      {successMessage && (
        <div className="recruiter-application-message recruiter-application-success">
          {successMessage}
        </div>
      )}

      <section className="application-statistics-grid">
        <article>
          <span>Total</span>
          <strong>{statusCounts.total}</strong>
        </article>

        <article>
          <span>Applied</span>
          <strong>{statusCounts.applied}</strong>
        </article>

        <article>
          <span>Under Review</span>
          <strong>{statusCounts.underReview}</strong>
        </article>

        <article>
          <span>Shortlisted</span>
          <strong>{statusCounts.shortlisted}</strong>
        </article>

        <article>
          <span>Selected</span>
          <strong>{statusCounts.selected}</strong>
        </article>

        <article>
          <span>Rejected</span>
          <strong>{statusCounts.rejected}</strong>
        </article>
      </section>

      <section className="application-filter-card">
        <div className="application-search-box">
          <label>Search Applications</label>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search candidate, email, job or location"
          />
        </div>

        <div className="application-status-filter">
          <label>Application Status</label>

          <select
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value)
            }
          >
            <option value="ALL">
              All Applications
            </option>

            {applicationStatuses.map((status) => (
              <option key={status} value={status}>
                {formatText(status)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loading && (
        <section className="recruiter-applications-loading">
          <div className="dashboard-loader" />
          <p>Loading applications...</p>
        </section>
      )}

      {!loading &&
        applications.length === 0 &&
        !message && (
          <section className="recruiter-applications-empty">
            <div>A</div>

            <h2>No applications received</h2>

            <p>
              Candidate applications will appear here
              after they apply to your jobs.
            </p>
          </section>
        )}

      {!loading &&
        applications.length > 0 &&
        filteredApplications.length === 0 && (
          <section className="recruiter-applications-empty">
            <div>S</div>

            <h2>No matching applications</h2>

            <p>
              Change your search text or application
              status filter.
            </p>
          </section>
        )}

      {!loading &&
        filteredApplications.length > 0 && (
          <section className="recruiter-applications-list">
            {filteredApplications.map((application) => {
              const status =
                getApplicationStatus(application);

              const candidateName =
                getCandidateName(application);

              return (
                <article
                  key={application.id}
                  className="recruiter-application-card"
                >
                  <div className="application-candidate-avatar">
                    {candidateName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="application-main-content">
                    <div className="application-title-row">
                      <div>
                        <span>
                          Application #{application.id}
                        </span>

                        <h2>{candidateName}</h2>

                        <p>
                          Applied for{" "}
                          <strong>
                            {getJobTitle(application)}
                          </strong>
                        </p>
                      </div>

                      <span
                        className={`application-status-badge ${getStatusClass(
                          status
                        )}`}
                      >
                        {formatText(status)}
                      </span>
                    </div>

                    <div className="application-information-grid">
                      <div>
                        <span>Email</span>

                        <strong>
                          {getCandidateEmail(application)}
                        </strong>
                      </div>

                      <div>
                        <span>Job Location</span>

                        <strong>
                          {getJobLocation(application)}
                        </strong>
                      </div>

                      <div>
                        <span>Experience</span>

                        <strong>
                          {getCandidateExperience(
                            application
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Applied On</span>

                        <strong>
                          {formatDate(
                            application.appliedAt ||
                              application.createdAt ||
                              application.applicationDate
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="application-card-actions">
                    <button
                      type="button"
                      className="view-candidate-button"
                      onClick={() =>
                        setSelectedApplication(
                          application
                        )
                      }
                    >
                      View Candidate
                    </button>

                    <select
                      value={status}
                      onChange={(event) =>
                        updateApplicationStatus(
                          application.id,
                          event.target.value
                        )
                      }
                      disabled={
                        updatingId === application.id
                      }
                    >
                      {applicationStatuses.map(
                        (applicationStatus) => (
                          <option
                            key={applicationStatus}
                            value={applicationStatus}
                          >
                            {formatText(
                              applicationStatus
                            )}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </article>
              );
            })}
          </section>
        )}

      {selectedApplication && (
        <div
          className="candidate-modal-overlay"
          onClick={() =>
            setSelectedApplication(null)
          }
        >
          <section
            className="candidate-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="candidate-modal-header">
              <div>
                <span>Candidate Details</span>

                <h2>
                  {getCandidateName(
                    selectedApplication
                  )}
                </h2>

                <p>
                  Application #
                  {selectedApplication.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(null)
                }
              >
                ×
              </button>
            </div>

            <div className="candidate-modal-profile">
              <div className="candidate-large-avatar">
                {getCandidateName(
                  selectedApplication
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h3>
                  {getCandidateName(
                    selectedApplication
                  )}
                </h3>

                <p>
                  {getCandidateEmail(
                    selectedApplication
                  )}
                </p>

                <span
                  className={`application-status-badge ${getStatusClass(
                    getApplicationStatus(
                      selectedApplication
                    )
                  )}`}
                >
                  {formatText(
                    getApplicationStatus(
                      selectedApplication
                    )
                  )}
                </span>
              </div>
            </div>

            <div className="candidate-details-grid">
              <div>
                <span>Phone Number</span>

                <strong>
                  {getCandidatePhone(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>Experience</span>

                <strong>
                  {getCandidateExperience(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>Education</span>

                <strong>
                  {getCandidateEducation(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>Applied Job</span>

                <strong>
                  {getJobTitle(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>Job Location</span>

                <strong>
                  {getJobLocation(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>Applied Date</span>

                <strong>
                  {formatDate(
                    selectedApplication.appliedAt ||
                      selectedApplication.createdAt ||
                      selectedApplication.applicationDate
                  )}
                </strong>
              </div>
            </div>

            <div className="candidate-skills-section">
              <span>Candidate Skills</span>

              <p>
                {getCandidateSkills(
                  selectedApplication
                )}
              </p>
            </div>

            <div className="candidate-modal-status">
              <label>Update Application Status</label>

              <select
                value={getApplicationStatus(
                  selectedApplication
                )}
                onChange={(event) =>
                  updateApplicationStatus(
                    selectedApplication.id,
                    event.target.value
                  )
                }
                disabled={
                  updatingId === selectedApplication.id
                }
              >
                {applicationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {formatText(status)}
                  </option>
                ))}
              </select>
            </div>

            <div className="candidate-modal-actions">
              {getResumeUrl(selectedApplication) && (
                <a
                  href={getResumeUrl(
                    selectedApplication
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="candidate-resume-button"
                >
                  View Resume
                </a>
              )}

              <button
                type="button"
                className="candidate-modal-close-button"
                onClick={() =>
                  setSelectedApplication(null)
                }
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default RecruiterApplications;
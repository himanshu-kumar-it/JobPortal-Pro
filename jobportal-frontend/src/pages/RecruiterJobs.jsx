import { useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

import "./RecruiterJobs.css";

const initialFormData = {
  title: "",
  description: "",
  location: "",
  jobType: "FULL_TIME",
  workMode: "ONSITE",
  minimumSalary: "",
  maximumSalary: "",
  skills: "",
  applicationDeadline: "",
  status: "OPEN",
};

function RecruiterJobs() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] =
    useState(initialFormData);

  const [editingJobId, setEditingJobId] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    fetchRecruiterJobs();
  }, [user?.id]);

  const fetchRecruiterJobs = async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response =
        await axiosInstance.get(
          `/jobs/recruiter/${user.id}`
        );

      const data = response.data?.data;

      setJobs(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : []
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Jobs could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingJobId(null);
    setFormData(initialFormData);
    setMessage("");
    setSuccessMessage("");
    setShowForm(true);
  };

  const openEditForm = (job) => {
    setEditingJobId(job.id);

    setFormData({
      title:
        job.title ||
        job.jobTitle ||
        "",

      description:
        job.description || "",

      location:
        job.location || "",

      jobType:
        job.jobType ||
        "FULL_TIME",

      workMode:
        job.workMode ||
        "ONSITE",

      minimumSalary:
        job.minimumSalary ?? "",

      maximumSalary:
        job.maximumSalary ?? "",

      skills:
        job.skills || "",

      applicationDeadline:
        job.applicationDeadline
          ? String(
              job.applicationDeadline
            ).substring(0, 10)
          : "",

      status:
        job.status || "OPEN",
    });

    setMessage("");
    setSuccessMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingJobId(null);
    setFormData(initialFormData);
  };

  const preparePayload = () => ({
    title: formData.title.trim(),

    description:
      formData.description.trim(),

    location:
      formData.location.trim(),

    jobType:
      formData.jobType,

    workMode:
      formData.workMode,

    minimumSalary:
      formData.minimumSalary === ""
        ? null
        : Number(
            formData.minimumSalary
          ),

    maximumSalary:
      formData.maximumSalary === ""
        ? null
        : Number(
            formData.maximumSalary
          ),

    skills:
      formData.skills.trim(),

    applicationDeadline:
      formData.applicationDeadline,

    status:
      formData.status,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      formData.minimumSalary &&
      formData.maximumSalary &&
      Number(formData.minimumSalary) >
        Number(formData.maximumSalary)
    ) {
      setMessage(
        "Minimum salary cannot be greater than maximum salary"
      );

      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setSuccessMessage("");

      const payload = preparePayload();

      if (editingJobId) {
        await axiosInstance.put(
          `/jobs/${editingJobId}/recruiter/${user.id}`,
          payload
        );

        setSuccessMessage(
          "Job updated successfully"
        );
      } else {
        await axiosInstance.post(
          `/jobs/recruiter/${user.id}`,
          payload
        );

        setSuccessMessage(
          "Job created successfully"
        );
      }

      closeForm();

      await fetchRecruiterJobs();
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
          error.response?.data?.message ||
            "Job could not be saved"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Do you really want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(jobId);
      setMessage("");
      setSuccessMessage("");

      await axiosInstance.delete(
        `/jobs/${jobId}/recruiter/${user.id}`
      );

      setJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job.id !== jobId
        )
      );

      setSuccessMessage(
        "Job deleted successfully"
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Job could not be deleted"
      );
    } finally {
      setDeletingId(null);
    }
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

  const formatSalary = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return null;
    }

    return Number(value).toLocaleString(
      "en-IN"
    );
  };

  const formatDate = (value) => {
    if (!value) {
      return "Not specified";
    }

    return new Date(
      value
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="recruiter-jobs-page">
      <section className="recruiter-jobs-header">
        <div>
          <span>
            Recruiter Workspace
          </span>

          <h1>Manage Jobs</h1>

          <p>
            Create, update and manage
            your company&apos;s job
            openings.
          </p>
        </div>

        <button
          type="button"
          className="create-job-button"
          onClick={openCreateForm}
        >
          + Create New Job
        </button>
      </section>

      {message && (
        <div className="recruiter-job-message recruiter-job-error">
          {message}
        </div>
      )}

      {successMessage && (
        <div className="recruiter-job-message recruiter-job-success">
          {successMessage}
        </div>
      )}

      {showForm && (
        <section className="job-form-card">
          <div className="job-form-heading">
            <div>
              <span>
                {editingJobId
                  ? "Update Job"
                  : "New Opening"}
              </span>

              <h2>
                {editingJobId
                  ? "Edit Job Details"
                  : "Create New Job"}
              </h2>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="close-job-form"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="job-form"
          >
            <div className="job-form-grid">
              <div className="form-group job-form-full">
                <label>
                  Job Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Java Full Stack Developer"
                  required
                />
              </div>

              <div className="form-group job-form-full">
                <label>
                  Job Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Enter complete job description"
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={
                    formData.location
                  }
                  onChange={handleChange}
                  placeholder="Noida"
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Type</label>

                <select
                  name="jobType"
                  value={
                    formData.jobType
                  }
                  onChange={handleChange}
                >
                  <option value="FULL_TIME">
                    Full Time
                  </option>

                  <option value="PART_TIME">
                    Part Time
                  </option>

                  <option value="INTERNSHIP">
                    Internship
                  </option>

                  <option value="CONTRACT">
                    Contract
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Work Mode</label>

                <select
                  name="workMode"
                  value={
                    formData.workMode
                  }
                  onChange={handleChange}
                >
                  <option value="ONSITE">
                    Onsite
                  </option>

                  <option value="REMOTE">
                    Remote
                  </option>

                  <option value="HYBRID">
                    Hybrid
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="OPEN">
                    Open
                  </option>

                  <option value="CLOSED">
                    Closed
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Minimum Salary
                </label>

                <input
                  type="number"
                  name="minimumSalary"
                  value={
                    formData.minimumSalary
                  }
                  onChange={handleChange}
                  placeholder="300000"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>
                  Maximum Salary
                </label>

                <input
                  type="number"
                  name="maximumSalary"
                  value={
                    formData.maximumSalary
                  }
                  onChange={handleChange}
                  placeholder="600000"
                  min="0"
                />
              </div>

              <div className="form-group job-form-full">
                <label>
                  Required Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Java, Spring Boot, MySQL, React"
                  required
                />
              </div>

              <div className="form-group job-form-full">
                <label>
                  Application Deadline
                </label>

                <input
                  type="date"
                  name="applicationDeadline"
                  value={
                    formData.applicationDeadline
                  }
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="job-form-actions">
              <button
                type="button"
                className="cancel-job-button"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-job-form-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingJobId
                    ? "Update Job"
                    : "Create Job"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="recruiter-jobs-summary">
        <article>
          <span>Total Jobs</span>
          <strong>{jobs.length}</strong>
        </article>

        <article>
          <span>Open Jobs</span>

          <strong>
            {
              jobs.filter(
                (job) =>
                  job.status === "OPEN"
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Closed Jobs</span>

          <strong>
            {
              jobs.filter(
                (job) =>
                  job.status === "CLOSED"
              ).length
            }
          </strong>
        </article>
      </section>

      {loading && (
        <div className="recruiter-jobs-loading">
          <div className="dashboard-loader" />

          <p>Loading jobs...</p>
        </div>
      )}

      {!loading &&
        !message &&
        jobs.length === 0 && (
          <section className="recruiter-jobs-empty">
            <div>J</div>

            <h2>
              No jobs created yet
            </h2>

            <p>
              Create your first job
              opening to start receiving
              applications.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
            >
              Create First Job
            </button>
          </section>
        )}

      {!loading &&
        jobs.length > 0 && (
          <section className="recruiter-jobs-list">
            {jobs.map((job) => {
              const minimumSalary =
                formatSalary(
                  job.minimumSalary
                );

              const maximumSalary =
                formatSalary(
                  job.maximumSalary
                );

              return (
                <article
                  key={job.id}
                  className="recruiter-job-card"
                >
                  <div className="recruiter-job-logo">
                    {(job.title ||
                      job.jobTitle ||
                      "J")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="recruiter-job-content">
                    <div className="recruiter-job-title-row">
                      <div>
                        <span>
                          Job ID #{job.id}
                        </span>

                        <h2>
                          {job.title ||
                            job.jobTitle ||
                            "Job Opening"}
                        </h2>
                      </div>

                      <span
                        className={
                          job.status ===
                          "OPEN"
                            ? "recruiter-job-open"
                            : "recruiter-job-closed"
                        }
                      >
                        {formatText(
                          job.status
                        )}
                      </span>
                    </div>

                    <div className="recruiter-job-meta">
                      <span>
                        Location:{" "}
                        {job.location ||
                          "Not specified"}
                      </span>

                      <span>
                        Type:{" "}
                        {formatText(
                          job.jobType
                        )}
                      </span>

                      <span>
                        Mode:{" "}
                        {formatText(
                          job.workMode
                        )}
                      </span>
                    </div>

                    <div className="recruiter-job-details-grid">
                      <div>
                        <span>
                          Salary
                        </span>

                        <strong>
                          {minimumSalary &&
                          maximumSalary
                            ? `₹${minimumSalary} - ₹${maximumSalary}`
                            : "Not disclosed"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Deadline
                        </span>

                        <strong>
                          {formatDate(
                            job.applicationDeadline
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Skills
                        </span>

                        <strong>
                          {job.skills ||
                            "Not specified"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="recruiter-job-actions">
                    <button
                      type="button"
                      className="edit-job-button"
                      onClick={() =>
                        openEditForm(job)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-job-button"
                      onClick={() =>
                        handleDelete(job.id)
                      }
                      disabled={
                        deletingId === job.id
                      }
                    >
                      {deletingId ===
                      job.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
    </main>
  );
}

export default RecruiterJobs;
import {
  useEffect,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savingJobId, setSavingJobId] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [keyword, setKeyword] =
    useState("");
  const [location, setLocation] =
    useState("");
  const [loading, setLoading] =
    useState(true);
  const [message, setMessage] =
    useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response =
        await axiosInstance.get("/jobs");

      const responseData =
        response.data?.data;

      if (Array.isArray(responseData)) {
        setJobs(responseData);
      } else if (
        Array.isArray(responseData?.content)
      ) {
        setJobs(responseData.content);
      } else {
        setJobs([]);
      }
    } catch {
      setMessage(
        "Jobs could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) => {
      const jobTitle =
        job.title ||
        job.jobTitle ||
        "";

      const companyName =
        job.companyName ||
        job.company?.companyName ||
        "";

      const jobLocation =
        job.location || "";

      const keywordMatched =
        jobTitle
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          ) ||
        companyName
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          ) ||
        String(job.skills || "")
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          );

      const locationMatched =
        jobLocation
          .toLowerCase()
          .includes(
            location.toLowerCase()
          );

      return (
        keywordMatched &&
        locationMatched
      );
    }
  );

  const displayedJobs = filteredJobs.slice(0, 6);

  const handleSearch = () => {
    document.getElementById("featured-jobs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSaveJob = async (jobId) => {
    if (!isAuthenticated || !user) {
      navigate("/login", { state: { from: "/" } });
      return;
    }

    if (user.role !== "CANDIDATE") {
      setSaveMessage("Only candidate accounts can save jobs.");
      return;
    }

    try {
      setSavingJobId(jobId);
      setSaveMessage("");
      await axiosInstance.post(`/saved-jobs/candidate/${user.id}/job/${jobId}`);
      setSaveMessage("Job saved successfully. Open Saved Jobs from your account menu.");
    } catch (error) {
      setSaveMessage(
        error.response?.data?.message ||
          (error.response?.status === 409
            ? "You have already saved this job."
            : "Could not save this job. Please try again.")
      );
    } finally {
      setSavingJobId(null);
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

  return (
    <main>
      <section className="home-hero">
        <div className="hero-decoration hero-decoration-one" />
        <div className="hero-decoration hero-decoration-two" />

        <div className="hero-content">
          <div className="hero-badge">
            India&apos;s growing job platform
          </div>

          <h1>
            Find the right job.
            <span>
              Build your future.
            </span>
          </h1>

          <p>
            Explore opportunities from
            growing companies and apply
            for jobs that match your
            skills.
          </p>

          <div className="job-search-box">
            <div className="search-field">
              <span className="search-symbol">
                ⌕
              </span>

              <div>
                <label>
                  Job title or skill
                </label>

                <input
                  type="text"
                  value={keyword}
                  onChange={(event) =>
                    setKeyword(
                      event.target.value
                    )
                  }
                  placeholder="Java Developer, React..."
                />
              </div>
            </div>

            <div className="search-divider" />

            <div className="search-field">
              <span className="search-symbol">
                ◉
              </span>

              <div>
                <label>
                  Location
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  placeholder="Noida, Delhi, Remote..."
                />
              </div>
            </div>

            <button
              type="button"
              className="search-jobs-button"
              onClick={handleSearch}
            >
              Search Jobs
            </button>
          </div>

          <div className="popular-searches">
            <span>Popular:</span>
            <button
              type="button"
              onClick={() =>
                setKeyword("Java")
              }
            >
              Java Developer
            </button>

            <button
              type="button"
              onClick={() =>
                setKeyword("React")
              }
            >
              React Developer
            </button>

            <button
              type="button"
              onClick={() =>
                setLocation("Remote")
              }
            >
              Remote Jobs
            </button>
          </div>
        </div>
      </section>

      <section className="home-statistics">
        <div className="stat-item">
          <strong>
            {jobs.length}+
          </strong>
          <span>Active Jobs</span>
        </div>

        <div className="stat-item">
          <strong>50+</strong>
          <span>Companies</span>
        </div>

        <div className="stat-item">
          <strong>100+</strong>
          <span>Job Seekers</span>
        </div>

        <div className="stat-item">
          <strong>24/7</strong>
          <span>Job Access</span>
        </div>
      </section>

      <section className="jobs-section" id="featured-jobs">
        <div className="section-heading">
          <div>
            <span className="section-label">
              Latest opportunities
            </span>

            <h2>
              Featured Jobs
            </h2>

            <p>
              Find recently posted jobs
              that match your career
              goals.
            </p>
          </div>

          <Link
            to="/"
            className="view-all-link"
          >
            View all jobs
            <span>→</span>
          </Link>
        </div>

        {saveMessage && (
          <div className="status-card" role="status">
            <p>{saveMessage}</p>
          </div>
        )}

        {loading && (
          <div className="status-card">
            <div className="loader" />
            <p>Loading jobs...</p>
          </div>
        )}

        {!loading && message && (
          <div className="status-card">
            <h3>
              Unable to load jobs
            </h3>
            <p>{message}</p>

            <button
              type="button"
              className="retry-button"
              onClick={fetchJobs}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !message &&
          displayedJobs.length === 0 && (
            <div className="status-card">
              <div className="empty-job-icon">
                ♢
              </div>

              <h3>
                No matching jobs found
              </h3>

              <p>
                Try changing the job title
                or location.
              </p>
            </div>
          )}

        {!loading &&
          !message &&
          displayedJobs.length > 0 && (
            <div className="jobs-grid">
              {displayedJobs.map(
                (job) => {
                  const companyName =
                    job.companyName ||
                    job.company
                      ?.companyName ||
                    "Company";

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
                      className="job-card"
                    >
                      <div className="job-card-top">
                        <div className="company-logo">
                          {companyName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <button
                          type="button"
                          className="save-job-button"
                          title="Save job"
                          aria-label={`Save ${job.title || job.jobTitle || "job"}`}
                          disabled={savingJobId === job.id}
                          onClick={() => handleSaveJob(job.id)}
                        >
                          {savingJobId === job.id ? "…" : "♡"}
                        </button>
                      </div>

                      <div className="job-card-content">
                        <span className="job-posted">
                          Recently posted
                        </span>

                        <h3>
                          {job.title ||
                            job.jobTitle ||
                            "Job Opening"}
                        </h3>

                        <p className="job-company">
                          {companyName}
                        </p>

                        <div className="job-meta">
                          <span>
                            ◉{" "}
                            {job.location ||
                              "Location not specified"}
                          </span>

                          <span>
                            ◷{" "}
                            {job.jobType ||
                              "FULL_TIME"}
                          </span>
                        </div>

                        <div className="job-tags">
                          {job.workMode && (
                            <span>
                              {job.workMode}
                            </span>
                          )}

                          {job.status && (
                            <span>
                              {job.status}
                            </span>
                          )}

                          {job.skills && (
                            <span>
                              {String(
                                job.skills
                              )
                                .split(",")[0]
                                .trim()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="job-card-footer">
                        <div className="salary-text">
                          {minimumSalary &&
                          maximumSalary ? (
                            <>
                              ₹
                              {minimumSalary}
                              {" - "}₹
                              {maximumSalary}
                            </>
                          ) : (
                            "Salary not disclosed"
                          )}
                        </div>

                        <Link
                          to={`/jobs/${job.id}`}
                          className="job-details-link"
                        >
                          View Details
                        </Link>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
      </section>

      <section className="how-it-works-section">
        <div className="section-heading centered-heading">
          <div>
            <span className="section-label">
              Simple process
            </span>

            <h2>
              Get hired in three steps
            </h2>

            <p>
              Create your account, find
              jobs and start applying.
            </p>
          </div>
        </div>

        <div className="steps-grid">
          <article className="step-card">
            <div className="step-number">
              01
            </div>

            <h3>Create Account</h3>

            <p>
              Register as a candidate and
              complete your profile.
            </p>
          </article>

          <article className="step-card">
            <div className="step-number">
              02
            </div>

            <h3>Search Jobs</h3>

            <p>
              Discover jobs based on your
              skills and preferred
              location.
            </p>
          </article>

          <article className="step-card">
            <div className="step-number">
              03
            </div>

            <h3>Apply Easily</h3>

            <p>
              Apply to suitable jobs and
              track your application
              status.
            </p>
          </article>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span>
            Start your career journey
          </span>

          <h2>
            Ready to find your next
            opportunity?
          </h2>

          <p>
            Create your free account and
            explore available jobs.
          </p>
        </div>

        <Link
          to="/register"
          className="cta-button"
        >
          Create Free Account
          <span>→</span>
        </Link>
      </section>
    </main>
  );
}

export default Home;
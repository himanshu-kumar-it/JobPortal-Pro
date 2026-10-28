
package com.jobportal.service.impl;

import com.jobportal.dto.request.JobApplicationRequest;
import com.jobportal.dto.response.JobApplicationResponse;
import com.jobportal.entity.*;
        import com.jobportal.exception.ResourceAlreadyExistsException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.JobApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl
        implements JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    @Override
    @Transactional
    public JobApplicationResponse applyForJob(
            Long candidateId,
            Long jobId,
            JobApplicationRequest request
    ) {

        User candidate = userRepository
                .findById(candidateId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Candidate not found with id: "
                                        + candidateId
                        )
                );

        if (candidate.getRole() != Role.CANDIDATE) {
            throw new IllegalArgumentException(
                    "Only candidate users can apply for jobs"
            );
        }

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + jobId
                        )
                );

        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalArgumentException(
                    "This job is currently closed"
            );
        }

        if (job.getApplicationDeadline()
                .isBefore(LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Application deadline has passed"
            );
        }

        if (applicationRepository
                .existsByCandidateIdAndJobId(
                        candidateId,
                        jobId
                )) {

            throw new ResourceAlreadyExistsException(
                    "Candidate has already applied for this job"
            );
        }

        JobApplication application =
                JobApplication.builder()
                        .candidate(candidate)
                        .job(job)
                        .status(ApplicationStatus.APPLIED)
                        .coverLetter(request.getCoverLetter())
                        .resumeUrl(request.getResumeUrl())
                        .build();

        JobApplication savedApplication =
                applicationRepository.save(application);

        return mapToResponse(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobApplicationResponse>
    getCandidateApplications(Long candidateId) {

        User candidate = userRepository
                .findById(candidateId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Candidate not found with id: "
                                        + candidateId
                        )
                );

        if (candidate.getRole() != Role.CANDIDATE) {
            throw new IllegalArgumentException(
                    "User is not a candidate"
            );
        }

        return applicationRepository
                .findByCandidateIdOrderByAppliedAtDesc(
                        candidateId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getJobApplications(
            Long recruiterId,
            Long jobId
    ) {

        Job job = getRecruiterJob(recruiterId, jobId);

        return applicationRepository
                .findByJobIdOrderByAppliedAtDesc(job.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobApplicationResponse>
    getRecruiterApplications(Long recruiterId) {

        User recruiter = userRepository
                .findById(recruiterId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Recruiter not found with id: "
                                        + recruiterId
                        )
                );

        if (recruiter.getRole() != Role.RECRUITER) {
            throw new IllegalArgumentException(
                    "User is not a recruiter"
            );
        }

        return applicationRepository
                .findByJobCompanyRecruiterIdOrderByAppliedAtDesc(
                        recruiterId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public JobApplicationResponse updateApplicationStatus(
            Long recruiterId,
            Long applicationId,
            ApplicationStatus status
    ) {

        JobApplication application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found with id: "
                                                + applicationId
                                )
                        );

        Long jobRecruiterId = application
                .getJob()
                .getCompany()
                .getRecruiter()
                .getId();

        if (!jobRecruiterId.equals(recruiterId)) {
            throw new IllegalArgumentException(
                    "This recruiter cannot update this application"
            );
        }

        if (status == ApplicationStatus.WITHDRAWN) {
            throw new IllegalArgumentException(
                    "Recruiter cannot withdraw an application"
            );
        }

        application.setStatus(status);

        JobApplication updatedApplication =
                applicationRepository.save(application);

        return mapToResponse(updatedApplication);
    }

    @Override
    @Transactional
    public JobApplicationResponse withdrawApplication(
            Long candidateId,
            Long applicationId
    ) {

        JobApplication application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found with id: "
                                                + applicationId
                                )
                        );

        if (!application.getCandidate()
                .getId()
                .equals(candidateId)) {

            throw new IllegalArgumentException(
                    "This candidate cannot withdraw this application"
            );
        }

        if (application.getStatus()
                == ApplicationStatus.SELECTED) {

            throw new IllegalArgumentException(
                    "Selected application cannot be withdrawn"
            );
        }

        if (application.getStatus()
                == ApplicationStatus.WITHDRAWN) {

            throw new IllegalArgumentException(
                    "Application is already withdrawn"
            );
        }

        application.setStatus(
                ApplicationStatus.WITHDRAWN
        );

        JobApplication updatedApplication =
                applicationRepository.save(application);

        return mapToResponse(updatedApplication);
    }

    private Job getRecruiterJob(
            Long recruiterId,
            Long jobId
    ) {

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + jobId
                        )
                );

        Long jobRecruiterId =
                job.getCompany()
                        .getRecruiter()
                        .getId();

        if (!jobRecruiterId.equals(recruiterId)) {
            throw new IllegalArgumentException(
                    "This recruiter does not own this job"
            );
        }

        return job;
    }

    private JobApplicationResponse mapToResponse(
            JobApplication application
    ) {

        User candidate = application.getCandidate();
        Job job = application.getJob();
        Company company = job.getCompany();

        return JobApplicationResponse.builder()
                .id(application.getId())
                .candidateId(candidate.getId())
                .candidateName(candidate.getFullName())
                .candidateEmail(candidate.getEmail())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .companyId(company.getId())
                .companyName(company.getCompanyName())
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .resumeUrl(application.getResumeUrl())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
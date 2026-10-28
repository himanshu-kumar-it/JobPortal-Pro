package com.jobportal.service.impl;

import com.jobportal.dto.response.CandidateDashboardResponse;
import com.jobportal.dto.response.RecruiterDashboardResponse;
import com.jobportal.entity.ApplicationStatus;
import com.jobportal.entity.Company;
import com.jobportal.entity.JobStatus;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {

    private final UserRepository userRepository;

    private final CompanyRepository companyRepository;

    private final JobRepository jobRepository;

    private final JobApplicationRepository applicationRepository;

    private final SavedJobRepository savedJobRepository;

    @Override
    @Transactional(readOnly = true)
    public CandidateDashboardResponse getCandidateDashboard(
            Long candidateId
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
                    "User is not a candidate"
            );
        }

        return CandidateDashboardResponse.builder()
                .candidateId(candidate.getId())
                .candidateName(candidate.getFullName())
                .email(candidate.getEmail())

                .totalApplications(
                        applicationRepository
                                .countByCandidateId(candidateId)
                )

                .appliedApplications(
                        applicationRepository
                                .countByCandidateIdAndStatus(
                                        candidateId,
                                        ApplicationStatus.APPLIED
                                )
                )

                .underReviewApplications(
                        applicationRepository
                                .countByCandidateIdAndStatus(
                                        candidateId,
                                        ApplicationStatus.UNDER_REVIEW
                                )
                )

                .shortlistedApplications(
                        applicationRepository
                                .countByCandidateIdAndStatus(
                                        candidateId,
                                        ApplicationStatus.SHORTLISTED
                                )
                )

                .rejectedApplications(
                        applicationRepository
                                .countByCandidateIdAndStatus(
                                        candidateId,
                                        ApplicationStatus.REJECTED
                                )
                )

                .selectedApplications(
                        applicationRepository
                                .countByCandidateIdAndStatus(
                                        candidateId,
                                        ApplicationStatus.SELECTED
                                )
                )

                .withdrawnApplications(
                        applicationRepository
                                .countByCandidateIdAndStatus(
                                        candidateId,
                                        ApplicationStatus.WITHDRAWN
                                )
                )

                .savedJobs(
                        savedJobRepository
                                .countByCandidateId(candidateId)
                )

                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterDashboardResponse getRecruiterDashboard(
            Long recruiterId
    ) {

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

        Company company = companyRepository
                .findByRecruiterId(recruiterId)
                .orElse(null);

        Long companyId =
                company != null
                        ? company.getId()
                        : null;

        String companyName =
                company != null
                        ? company.getCompanyName()
                        : "Company Not Added";

        return RecruiterDashboardResponse.builder()
                .recruiterId(recruiter.getId())
                .recruiterName(recruiter.getFullName())
                .email(recruiter.getEmail())
                .companyId(companyId)
                .companyName(companyName)

                .totalJobs(
                        jobRepository
                                .countByCompanyRecruiterId(
                                        recruiterId
                                )
                )

                .openJobs(
                        jobRepository
                                .countByCompanyRecruiterIdAndStatus(
                                        recruiterId,
                                        JobStatus.OPEN
                                )
                )

                .closedJobs(
                        jobRepository
                                .countByCompanyRecruiterIdAndStatus(
                                        recruiterId,
                                        JobStatus.CLOSED
                                )
                )

                .totalApplications(
                        applicationRepository
                                .countByJobCompanyRecruiterId(
                                        recruiterId
                                )
                )

                .appliedApplications(
                        applicationRepository
                                .countByJobCompanyRecruiterIdAndStatus(
                                        recruiterId,
                                        ApplicationStatus.APPLIED
                                )
                )

                .underReviewApplications(
                        applicationRepository
                                .countByJobCompanyRecruiterIdAndStatus(
                                        recruiterId,
                                        ApplicationStatus.UNDER_REVIEW
                                )
                )

                .shortlistedApplications(
                        applicationRepository
                                .countByJobCompanyRecruiterIdAndStatus(
                                        recruiterId,
                                        ApplicationStatus.SHORTLISTED
                                )
                )

                .rejectedApplications(
                        applicationRepository
                                .countByJobCompanyRecruiterIdAndStatus(
                                        recruiterId,
                                        ApplicationStatus.REJECTED
                                )
                )

                .selectedApplications(
                        applicationRepository
                                .countByJobCompanyRecruiterIdAndStatus(
                                        recruiterId,
                                        ApplicationStatus.SELECTED
                                )
                )

                .withdrawnApplications(
                        applicationRepository
                                .countByJobCompanyRecruiterIdAndStatus(
                                        recruiterId,
                                        ApplicationStatus.WITHDRAWN
                                )
                )

                .build();
    }
}
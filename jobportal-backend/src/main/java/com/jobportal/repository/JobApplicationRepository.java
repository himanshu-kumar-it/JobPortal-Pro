package com.jobportal.repository;

import com.jobportal.entity.ApplicationStatus;
import com.jobportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    boolean existsByCandidateIdAndJobId(
            Long candidateId,
            Long jobId
    );

    Optional<JobApplication> findByCandidateIdAndJobId(
            Long candidateId,
            Long jobId
    );

    List<JobApplication> findByCandidateIdOrderByAppliedAtDesc(
            Long candidateId
    );

    List<JobApplication> findByJobIdOrderByAppliedAtDesc(
            Long jobId
    );

    List<JobApplication>
    findByJobCompanyRecruiterIdOrderByAppliedAtDesc(
            Long recruiterId
    );

    List<JobApplication>
    findByJobIdAndStatusOrderByAppliedAtDesc(
            Long jobId,
            ApplicationStatus status
    );

    long countByJobId(Long jobId);

    long countByCandidateId(Long candidateId);

    long countByCandidateIdAndStatus(
            Long candidateId,
            ApplicationStatus status
    );

    long countByJobCompanyRecruiterId(
            Long recruiterId
    );

    long countByJobCompanyRecruiterIdAndStatus(
            Long recruiterId,
            ApplicationStatus status
    );
}
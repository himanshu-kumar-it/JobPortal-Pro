package com.jobportal.repository;

import com.jobportal.entity.Job;
import com.jobportal.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByCompanyId(Long companyId);

    List<Job> findByCompanyRecruiterId(Long recruiterId);

    List<Job> findByStatus(JobStatus status);

    List<Job> findByLocationContainingIgnoreCase(
            String location
    );

    List<Job> findByTitleContainingIgnoreCase(
            String title
    );

    @Query("""
            SELECT j
            FROM Job j
            WHERE
            LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(j.skills) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(j.company.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    List<Job> searchJobs(
            @Param("keyword") String keyword
    );

    boolean existsByIdAndCompanyRecruiterId(
            Long jobId,
            Long recruiterId
    );

    long countByCompanyRecruiterId(
            Long recruiterId
    );

    long countByCompanyRecruiterIdAndStatus(
            Long recruiterId,
            JobStatus status
    );
}
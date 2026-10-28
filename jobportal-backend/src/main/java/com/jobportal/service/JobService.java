
package com.jobportal.service;

import com.jobportal.dto.request.JobRequest;
import com.jobportal.dto.response.JobResponse;

import java.util.List;

public interface JobService {

    JobResponse createJob(
            Long recruiterId,
            JobRequest request
    );

    JobResponse updateJob(
            Long recruiterId,
            Long jobId,
            JobRequest request
    );

    JobResponse getJobById(Long jobId);

    List<JobResponse> getAllJobs();

    List<JobResponse> getJobsByCompany(Long companyId);

    List<JobResponse> getJobsByRecruiter(Long recruiterId);

    List<JobResponse> searchJobs(String keyword);

    void deleteJob(
            Long recruiterId,
            Long jobId
    );
}
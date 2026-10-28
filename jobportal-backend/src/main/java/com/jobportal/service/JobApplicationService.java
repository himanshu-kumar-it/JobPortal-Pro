
package com.jobportal.service;

import com.jobportal.dto.request.JobApplicationRequest;
import com.jobportal.dto.response.JobApplicationResponse;
import com.jobportal.entity.ApplicationStatus;

import java.util.List;

public interface JobApplicationService {

    JobApplicationResponse applyForJob(
            Long candidateId,
            Long jobId,
            JobApplicationRequest request
    );

    List<JobApplicationResponse> getCandidateApplications(
            Long candidateId
    );

    List<JobApplicationResponse> getJobApplications(
            Long recruiterId,
            Long jobId
    );

    List<JobApplicationResponse> getRecruiterApplications(
            Long recruiterId
    );

    JobApplicationResponse updateApplicationStatus(
            Long recruiterId,
            Long applicationId,
            ApplicationStatus status
    );

    JobApplicationResponse withdrawApplication(
            Long candidateId,
            Long applicationId
    );
}
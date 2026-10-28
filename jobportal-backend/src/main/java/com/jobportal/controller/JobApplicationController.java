
package com.jobportal.controller;

import com.jobportal.dto.request.ApplicationStatusRequest;
import com.jobportal.dto.request.JobApplicationRequest;
import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.JobApplicationResponse;
import com.jobportal.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;

    @PostMapping(
            "/candidate/{candidateId}/job/{jobId}"
    )
    public ResponseEntity<
            ApiResponse<JobApplicationResponse>
            > applyForJob(
            @PathVariable Long candidateId,
            @PathVariable Long jobId,
            @Valid @RequestBody
            JobApplicationRequest request
    ) {

        JobApplicationResponse application =
                applicationService.applyForJob(
                        candidateId,
                        jobId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                true,
                                "Job application submitted successfully",
                                application
                        )
                );
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<
            ApiResponse<List<JobApplicationResponse>>
            > getCandidateApplications(
            @PathVariable Long candidateId
    ) {

        List<JobApplicationResponse> applications =
                applicationService
                        .getCandidateApplications(candidateId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Candidate applications fetched successfully",
                        applications
                )
        );
    }

    @GetMapping(
            "/recruiter/{recruiterId}/job/{jobId}"
    )
    public ResponseEntity<
            ApiResponse<List<JobApplicationResponse>>
            > getJobApplications(
            @PathVariable Long recruiterId,
            @PathVariable Long jobId
    ) {

        List<JobApplicationResponse> applications =
                applicationService.getJobApplications(
                        recruiterId,
                        jobId
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Job applications fetched successfully",
                        applications
                )
        );
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<
            ApiResponse<List<JobApplicationResponse>>
            > getRecruiterApplications(
            @PathVariable Long recruiterId
    ) {

        List<JobApplicationResponse> applications =
                applicationService
                        .getRecruiterApplications(recruiterId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Recruiter applications fetched successfully",
                        applications
                )
        );
    }

    @PutMapping(
            "/{applicationId}/recruiter/{recruiterId}/status"
    )
    public ResponseEntity<
            ApiResponse<JobApplicationResponse>
            > updateApplicationStatus(
            @PathVariable Long applicationId,
            @PathVariable Long recruiterId,
            @Valid @RequestBody
            ApplicationStatusRequest request
    ) {

        JobApplicationResponse application =
                applicationService
                        .updateApplicationStatus(
                                recruiterId,
                                applicationId,
                                request.getStatus()
                        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Application status updated successfully",
                        application
                )
        );
    }

    @PutMapping(
            "/{applicationId}/candidate/{candidateId}/withdraw"
    )
    public ResponseEntity<
            ApiResponse<JobApplicationResponse>
            > withdrawApplication(
            @PathVariable Long applicationId,
            @PathVariable Long candidateId
    ) {

        JobApplicationResponse application =
                applicationService
                        .withdrawApplication(
                                candidateId,
                                applicationId
                        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Application withdrawn successfully",
                        application
                )
        );
    }
}

package com.jobportal.controller;

import com.jobportal.dto.request.JobRequest;
import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.JobResponse;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping("/recruiter/{recruiterId}")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @PathVariable Long recruiterId,
            @Valid @RequestBody JobRequest request
    ) {

        JobResponse job =
                jobService.createJob(recruiterId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                        true,
                        "Job created successfully",
                        job
                )
        );
    }

    @PutMapping("/{jobId}/recruiter/{recruiterId}")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable Long jobId,
            @PathVariable Long recruiterId,
            @Valid @RequestBody JobRequest request
    ) {

        JobResponse job =
                jobService.updateJob(
                        recruiterId,
                        jobId,
                        request
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Job updated successfully",
                        job
                )
        );
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(
            @PathVariable Long jobId
    ) {

        JobResponse job =
                jobService.getJobById(jobId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Job fetched successfully",
                        job
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs() {

        List<JobResponse> jobs =
                jobService.getAllJobs();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Jobs fetched successfully",
                        jobs
                )
        );
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<List<JobResponse>>>
    getJobsByCompany(
            @PathVariable Long companyId
    ) {

        List<JobResponse> jobs =
                jobService.getJobsByCompany(companyId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Company jobs fetched successfully",
                        jobs
                )
        );
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<ApiResponse<List<JobResponse>>>
    getJobsByRecruiter(
            @PathVariable Long recruiterId
    ) {

        List<JobResponse> jobs =
                jobService.getJobsByRecruiter(recruiterId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Recruiter jobs fetched successfully",
                        jobs
                )
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<JobResponse>>> searchJobs(
            @RequestParam(required = false) String keyword
    ) {

        List<JobResponse> jobs =
                jobService.searchJobs(keyword);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Job search completed successfully",
                        jobs
                )
        );
    }

    @DeleteMapping("/{jobId}/recruiter/{recruiterId}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable Long jobId,
            @PathVariable Long recruiterId
    ) {

        jobService.deleteJob(recruiterId, jobId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Job deleted successfully",
                        null
                )
        );
    }
}

package com.jobportal.controller;

import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.CandidateDashboardResponse;
import com.jobportal.dto.response.RecruiterDashboardResponse;
import com.jobportal.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<
            ApiResponse<CandidateDashboardResponse>
            > getCandidateDashboard(
            @PathVariable Long candidateId
    ) {

        CandidateDashboardResponse dashboard =
                dashboardService
                        .getCandidateDashboard(candidateId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Candidate dashboard fetched successfully",
                        dashboard
                )
        );
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<
            ApiResponse<RecruiterDashboardResponse>
            > getRecruiterDashboard(
            @PathVariable Long recruiterId
    ) {

        RecruiterDashboardResponse dashboard =
                dashboardService
                        .getRecruiterDashboard(recruiterId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Recruiter dashboard fetched successfully",
                        dashboard
                )
        );
    }
}
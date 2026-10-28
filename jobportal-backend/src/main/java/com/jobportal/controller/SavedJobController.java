
package com.jobportal.controller;

import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.SavedJobCheckResponse;
import com.jobportal.dto.response.SavedJobResponse;
import com.jobportal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobService savedJobService;

    @PostMapping(
            "/candidate/{candidateId}/job/{jobId}"
    )
    public ResponseEntity<
            ApiResponse<SavedJobResponse>
            > saveJob(
            @PathVariable Long candidateId,
            @PathVariable Long jobId
    ) {

        SavedJobResponse savedJob =
                savedJobService.saveJob(
                        candidateId,
                        jobId
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse<>(
                                true,
                                "Job saved successfully",
                                savedJob
                        )
                );
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<
            ApiResponse<List<SavedJobResponse>>
            > getSavedJobs(
            @PathVariable Long candidateId
    ) {

        List<SavedJobResponse> savedJobs =
                savedJobService.getSavedJobs(
                        candidateId
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Saved jobs fetched successfully",
                        savedJobs
                )
        );
    }

    @GetMapping(
            "/candidate/{candidateId}/job/{jobId}/check"
    )
    public ResponseEntity<
            ApiResponse<SavedJobCheckResponse>
            > checkSavedJob(
            @PathVariable Long candidateId,
            @PathVariable Long jobId
    ) {

        SavedJobCheckResponse response =
                savedJobService.checkSavedJob(
                        candidateId,
                        jobId
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Saved job status fetched successfully",
                        response
                )
        );
    }

    @DeleteMapping(
            "/candidate/{candidateId}/job/{jobId}"
    )
    public ResponseEntity<ApiResponse<Void>> removeSavedJob(
            @PathVariable Long candidateId,
            @PathVariable Long jobId
    ) {

        savedJobService.removeSavedJob(
                candidateId,
                jobId
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Saved job removed successfully",
                        null
                )
        );
    }

}




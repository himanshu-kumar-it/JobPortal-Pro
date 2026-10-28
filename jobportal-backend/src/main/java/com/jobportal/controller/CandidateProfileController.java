
package com.jobportal.controller;

import com.jobportal.dto.request.CandidateProfileRequest;
import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.CandidateProfileResponse;
import com.jobportal.service.CandidateProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateProfileController {

    private final CandidateProfileService candidateProfileService;

    @PostMapping("/{userId}/profile")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>>
    createProfile(
            @PathVariable Long userId,
            @Valid @RequestBody CandidateProfileRequest request
    ) {

        CandidateProfileResponse profile =
                candidateProfileService.createProfile(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                        true,
                        "Candidate profile created successfully",
                        profile
                )
        );
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>>
    getProfile(
            @PathVariable Long userId
    ) {

        CandidateProfileResponse profile =
                candidateProfileService.getProfileByUserId(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Candidate profile fetched successfully",
                        profile
                )
        );
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>>
    updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody CandidateProfileRequest request
    ) {

        CandidateProfileResponse profile =
                candidateProfileService.updateProfile(userId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Candidate profile updated successfully",
                        profile
                )
        );
    }
}

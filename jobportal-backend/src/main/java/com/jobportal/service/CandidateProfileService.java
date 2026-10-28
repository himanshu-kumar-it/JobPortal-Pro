
package com.jobportal.service;

import com.jobportal.dto.request.CandidateProfileRequest;
import com.jobportal.dto.response.CandidateProfileResponse;

public interface CandidateProfileService {

    CandidateProfileResponse createProfile(
            Long userId,
            CandidateProfileRequest request
    );

    CandidateProfileResponse getProfileByUserId(Long userId);

    CandidateProfileResponse updateProfile(
            Long userId,
            CandidateProfileRequest request
    );
}
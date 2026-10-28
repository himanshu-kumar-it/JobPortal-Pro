
package com.jobportal.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CandidateProfileResponse {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String headline;
    private String about;
    private String location;
    private String phone;
    private String skills;
    private String education;
    private String experience;
    private String portfolioUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String resumeUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
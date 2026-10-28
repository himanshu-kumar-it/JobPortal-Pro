
package com.jobportal.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateProfileRequest {

    @Size(max = 150, message = "Headline cannot exceed 150 characters")
    private String headline;

    @Size(max = 1000, message = "About cannot exceed 1000 characters")
    private String about;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @Size(max = 20, message = "Phone cannot exceed 20 characters")
    private String phone;

    @Size(max = 500, message = "Skills cannot exceed 500 characters")
    private String skills;

    @Size(max = 250, message = "Education cannot exceed 250 characters")
    private String education;

    @Size(max = 250, message = "Experience cannot exceed 250 characters")
    private String experience;

    @Size(max = 300, message = "Portfolio URL cannot exceed 300 characters")
    private String portfolioUrl;

    @Size(max = 300, message = "GitHub URL cannot exceed 300 characters")
    private String githubUrl;

    @Size(max = 300, message = "LinkedIn URL cannot exceed 300 characters")
    private String linkedinUrl;

    private String resumeUrl;
}


package com.jobportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name cannot exceed 150 characters")
    private String companyName;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @Size(max = 100, message = "Industry cannot exceed 100 characters")
    private String industry;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @Size(max = 300, message = "Website URL cannot exceed 300 characters")
    private String websiteUrl;

    @Size(max = 300, message = "Logo URL cannot exceed 300 characters")
    private String logoUrl;

    @Size(max = 50, message = "Company size cannot exceed 50 characters")
    private String companySize;
}
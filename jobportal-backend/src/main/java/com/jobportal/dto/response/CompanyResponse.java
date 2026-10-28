
package com.jobportal.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CompanyResponse {

    private Long id;
    private Long recruiterId;
    private String recruiterName;
    private String recruiterEmail;
    private String companyName;
    private String description;
    private String industry;
    private String location;
    private String websiteUrl;
    private String logoUrl;
    private String companySize;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
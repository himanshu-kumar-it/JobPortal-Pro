
package com.jobportal.dto.response;

import com.jobportal.entity.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class JobApplicationResponse {

    private Long id;

    private Long candidateId;

    private String candidateName;

    private String candidateEmail;

    private Long jobId;

    private String jobTitle;

    private Long companyId;

    private String companyName;

    private ApplicationStatus status;

    private String coverLetter;

    private String resumeUrl;

    private LocalDateTime appliedAt;

    private LocalDateTime updatedAt;
}
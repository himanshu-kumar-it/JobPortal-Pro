
package com.jobportal.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CandidateDashboardResponse {

    private Long candidateId;

    private String candidateName;

    private String email;

    private long totalApplications;

    private long appliedApplications;

    private long underReviewApplications;

    private long shortlistedApplications;

    private long rejectedApplications;

    private long selectedApplications;

    private long withdrawnApplications;

    private long savedJobs;
}
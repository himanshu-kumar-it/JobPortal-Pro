
package com.jobportal.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecruiterDashboardResponse {

    private Long recruiterId;

    private String recruiterName;

    private String email;

    private Long companyId;

    private String companyName;

    private long totalJobs;

    private long openJobs;

    private long closedJobs;

    private long totalApplications;

    private long appliedApplications;

    private long underReviewApplications;

    private long shortlistedApplications;

    private long rejectedApplications;

    private long selectedApplications;

    private long withdrawnApplications;
}
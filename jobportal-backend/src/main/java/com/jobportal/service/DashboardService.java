
package com.jobportal.service;

import com.jobportal.dto.response.CandidateDashboardResponse;
import com.jobportal.dto.response.RecruiterDashboardResponse;

public interface DashboardService {

    CandidateDashboardResponse getCandidateDashboard(
            Long candidateId
    );

    RecruiterDashboardResponse getRecruiterDashboard(
            Long recruiterId
    );
}
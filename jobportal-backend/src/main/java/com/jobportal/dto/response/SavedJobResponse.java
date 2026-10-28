
package com.jobportal.dto.response;

import com.jobportal.entity.JobStatus;
import com.jobportal.entity.JobType;
import com.jobportal.entity.WorkMode;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class SavedJobResponse {

    private Long savedJobId;

    private Long candidateId;

    private Long jobId;

    private String jobTitle;

    private Long companyId;

    private String companyName;

    private String location;

    private JobType jobType;

    private WorkMode workMode;

    private JobStatus jobStatus;

    private Double minimumSalary;

    private Double maximumSalary;

    private String skills;

    private LocalDate applicationDeadline;

    private LocalDateTime savedAt;
}
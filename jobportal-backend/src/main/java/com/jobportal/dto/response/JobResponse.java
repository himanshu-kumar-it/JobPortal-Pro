
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
public class JobResponse {

    private Long id;

    private Long companyId;

    private String companyName;

    private Long recruiterId;

    private String title;

    private String description;

    private String requirements;

    private String responsibilities;

    private String location;

    private JobType jobType;

    private WorkMode workMode;

    private JobStatus status;

    private Integer minimumExperience;

    private Integer maximumExperience;

    private Double minimumSalary;

    private Double maximumSalary;

    private String skills;

    private Integer vacancies;

    private LocalDate applicationDeadline;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
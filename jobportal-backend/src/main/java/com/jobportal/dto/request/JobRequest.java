
package com.jobportal.dto.request;

import com.jobportal.entity.JobStatus;
import com.jobportal.entity.JobType;
import com.jobportal.entity.WorkMode;
import jakarta.validation.constraints.*;
        import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 150, message = "Job title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Job description is required")
    @Size(max = 3000, message = "Description cannot exceed 3000 characters")
    private String description;

    @NotBlank(message = "Job requirements are required")
    @Size(max = 2000, message = "Requirements cannot exceed 2000 characters")
    private String requirements;

    @Size(max = 1500, message = "Responsibilities cannot exceed 1500 characters")
    private String responsibilities;

    @NotBlank(message = "Job location is required")
    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @NotNull(message = "Work mode is required")
    private WorkMode workMode;

    private JobStatus status;

    @NotNull(message = "Minimum experience is required")
    @Min(value = 0, message = "Minimum experience cannot be negative")
    private Integer minimumExperience;

    @NotNull(message = "Maximum experience is required")
    @Min(value = 0, message = "Maximum experience cannot be negative")
    private Integer maximumExperience;

    @NotNull(message = "Minimum salary is required")
    @PositiveOrZero(message = "Minimum salary cannot be negative")
    private Double minimumSalary;

    @NotNull(message = "Maximum salary is required")
    @Positive(message = "Maximum salary must be greater than zero")
    private Double maximumSalary;

    @NotBlank(message = "Skills are required")
    @Size(max = 500, message = "Skills cannot exceed 500 characters")
    private String skills;

    @NotNull(message = "Number of vacancies is required")
    @Min(value = 1, message = "Vacancies must be at least 1")
    private Integer vacancies;

    @NotNull(message = "Application deadline is required")
    @Future(message = "Application deadline must be a future date")
    private LocalDate applicationDeadline;
}
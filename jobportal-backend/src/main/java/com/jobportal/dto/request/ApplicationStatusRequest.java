
package com.jobportal.dto.request;

import com.jobportal.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationStatusRequest {

    @NotNull(message = "Application status is required")
    private ApplicationStatus status;
}
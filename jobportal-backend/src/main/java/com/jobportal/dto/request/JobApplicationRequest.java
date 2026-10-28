
package com.jobportal.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobApplicationRequest {

    @Size(
            max = 1000,
            message = "Cover letter cannot exceed 1000 characters"
    )
    private String coverLetter;

    @Size(
            max = 500,
            message = "Resume URL cannot exceed 500 characters"
    )
    private String resumeUrl;
}
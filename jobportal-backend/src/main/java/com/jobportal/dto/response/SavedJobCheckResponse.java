
package com.jobportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SavedJobCheckResponse {

    private Long jobId;

    private boolean saved;
}
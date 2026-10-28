
package com.jobportal.service;

import com.jobportal.dto.response.SavedJobCheckResponse;
import com.jobportal.dto.response.SavedJobResponse;

import java.util.List;

public interface SavedJobService {

    SavedJobResponse saveJob(
            Long candidateId,
            Long jobId
    );

    List<SavedJobResponse> getSavedJobs(
            Long candidateId
    );

    SavedJobCheckResponse checkSavedJob(
            Long candidateId,
            Long jobId
    );

    void removeSavedJob(
            Long candidateId,
            Long jobId
    );
}
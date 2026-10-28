
package com.jobportal.service.impl;

import com.jobportal.dto.response.SavedJobCheckResponse;
import com.jobportal.dto.response.SavedJobResponse;
import com.jobportal.entity.*;
        import com.jobportal.exception.ResourceAlreadyExistsException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl
        implements SavedJobService {

    private final SavedJobRepository savedJobRepository;

    private final UserRepository userRepository;

    private final JobRepository jobRepository;

    @Override
    @Transactional
    public SavedJobResponse saveJob(
            Long candidateId,
            Long jobId
    ) {

        User candidate = getCandidate(candidateId);

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + jobId
                        )
                );

        if (savedJobRepository
                .existsByCandidateIdAndJobId(
                        candidateId,
                        jobId
                )) {

            throw new ResourceAlreadyExistsException(
                    "Job is already saved"
            );
        }

        SavedJob savedJob = SavedJob.builder()
                .candidate(candidate)
                .job(job)
                .build();

        SavedJob savedRecord =
                savedJobRepository.save(savedJob);

        return mapToResponse(savedRecord);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SavedJobResponse> getSavedJobs(
            Long candidateId
    ) {

        getCandidate(candidateId);

        return savedJobRepository
                .findByCandidateIdOrderBySavedAtDesc(
                        candidateId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SavedJobCheckResponse checkSavedJob(
            Long candidateId,
            Long jobId
    ) {

        getCandidate(candidateId);

        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException(
                    "Job not found with id: " + jobId
            );
        }

        boolean saved = savedJobRepository
                .existsByCandidateIdAndJobId(
                        candidateId,
                        jobId
                );

        return new SavedJobCheckResponse(
                jobId,
                saved
        );
    }

    @Override
    @Transactional
    public void removeSavedJob(
            Long candidateId,
            Long jobId
    ) {

        getCandidate(candidateId);

        SavedJob savedJob = savedJobRepository
                .findByCandidateIdAndJobId(
                        candidateId,
                        jobId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Saved job not found"
                        )
                );

        savedJobRepository.delete(savedJob);
    }

    private User getCandidate(Long candidateId) {

        User candidate = userRepository
                .findById(candidateId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Candidate not found with id: "
                                        + candidateId
                        )
                );

        if (candidate.getRole() != Role.CANDIDATE) {
            throw new IllegalArgumentException(
                    "User is not a candidate"
            );
        }

        return candidate;
    }

    private SavedJobResponse mapToResponse(
            SavedJob savedJob
    ) {

        Job job = savedJob.getJob();
        Company company = job.getCompany();

        return SavedJobResponse.builder()
                .savedJobId(savedJob.getId())
                .candidateId(
                        savedJob.getCandidate().getId()
                )
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .companyId(company.getId())
                .companyName(company.getCompanyName())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .workMode(job.getWorkMode())
                .jobStatus(job.getStatus())
                .minimumSalary(job.getMinimumSalary())
                .maximumSalary(job.getMaximumSalary())
                .skills(job.getSkills())
                .applicationDeadline(
                        job.getApplicationDeadline()
                )
                .savedAt(savedJob.getSavedAt())
                .build();
    }
}

package com.jobportal.service.impl;

import com.jobportal.dto.request.JobRequest;
import com.jobportal.dto.response.JobResponse;
import com.jobportal.entity.Company;
import com.jobportal.entity.Job;
import com.jobportal.entity.JobStatus;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public JobResponse createJob(
            Long recruiterId,
            JobRequest request
    ) {

        Company company = companyRepository
                .findByRecruiterId(recruiterId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found for recruiter id: "
                                        + recruiterId
                        )
                );

        validateJobRequest(request);

        Job job = Job.builder()
                .company(company)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .requirements(request.getRequirements().trim())
                .responsibilities(request.getResponsibilities())
                .location(request.getLocation().trim())
                .jobType(request.getJobType())
                .workMode(request.getWorkMode())
                .status(
                        request.getStatus() == null
                                ? JobStatus.OPEN
                                : request.getStatus()
                )
                .minimumExperience(request.getMinimumExperience())
                .maximumExperience(request.getMaximumExperience())
                .minimumSalary(request.getMinimumSalary())
                .maximumSalary(request.getMaximumSalary())
                .skills(request.getSkills().trim())
                .vacancies(request.getVacancies())
                .applicationDeadline(request.getApplicationDeadline())
                .build();

        Job savedJob = jobRepository.save(job);

        return mapToResponse(savedJob);
    }

    @Override
    @Transactional
    public JobResponse updateJob(
            Long recruiterId,
            Long jobId,
            JobRequest request
    ) {

        Job job = getRecruiterJob(recruiterId, jobId);

        validateJobRequest(request);

        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription().trim());
        job.setRequirements(request.getRequirements().trim());
        job.setResponsibilities(request.getResponsibilities());
        job.setLocation(request.getLocation().trim());
        job.setJobType(request.getJobType());
        job.setWorkMode(request.getWorkMode());

        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }

        job.setMinimumExperience(request.getMinimumExperience());
        job.setMaximumExperience(request.getMaximumExperience());
        job.setMinimumSalary(request.getMinimumSalary());
        job.setMaximumSalary(request.getMaximumSalary());
        job.setSkills(request.getSkills().trim());
        job.setVacancies(request.getVacancies());
        job.setApplicationDeadline(request.getApplicationDeadline());

        Job updatedJob = jobRepository.save(job);

        return mapToResponse(updatedJob);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long jobId) {

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + jobId
                        )
                );

        return mapToResponse(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getAllJobs() {

        return jobRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getJobsByCompany(Long companyId) {

        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException(
                    "Company not found with id: " + companyId
            );
        }

        return jobRepository.findByCompanyId(companyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getJobsByRecruiter(Long recruiterId) {

        return jobRepository
                .findByCompanyRecruiterId(recruiterId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> searchJobs(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllJobs();
        }

        return jobRepository.searchJobs(keyword.trim())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteJob(
            Long recruiterId,
            Long jobId
    ) {

        Job job = getRecruiterJob(recruiterId, jobId);

        jobRepository.delete(job);
    }

    private Job getRecruiterJob(
            Long recruiterId,
            Long jobId
    ) {

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + jobId
                        )
                );

        Long jobRecruiterId =
                job.getCompany().getRecruiter().getId();

        if (!jobRecruiterId.equals(recruiterId)) {
            throw new IllegalArgumentException(
                    "This recruiter is not allowed to modify this job"
            );
        }

        return job;
    }

    private void validateJobRequest(JobRequest request) {

        if (request.getMaximumExperience()
                < request.getMinimumExperience()) {

            throw new IllegalArgumentException(
                    "Maximum experience cannot be less than minimum experience"
            );
        }

        if (request.getMaximumSalary()
                < request.getMinimumSalary()) {

            throw new IllegalArgumentException(
                    "Maximum salary cannot be less than minimum salary"
            );
        }
    }

    private JobResponse mapToResponse(Job job) {

        Company company = job.getCompany();

        return JobResponse.builder()
                .id(job.getId())
                .companyId(company.getId())
                .companyName(company.getCompanyName())
                .recruiterId(company.getRecruiter().getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .responsibilities(job.getResponsibilities())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .workMode(job.getWorkMode())
                .status(job.getStatus())
                .minimumExperience(job.getMinimumExperience())
                .maximumExperience(job.getMaximumExperience())
                .minimumSalary(job.getMinimumSalary())
                .maximumSalary(job.getMaximumSalary())
                .skills(job.getSkills())
                .vacancies(job.getVacancies())
                .applicationDeadline(job.getApplicationDeadline())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
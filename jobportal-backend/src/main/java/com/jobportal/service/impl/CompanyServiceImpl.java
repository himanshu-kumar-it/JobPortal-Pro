
package com.jobportal.service.impl;

import com.jobportal.dto.request.CompanyRequest;
import com.jobportal.dto.response.CompanyResponse;
import com.jobportal.entity.Company;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceAlreadyExistsException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CompanyResponse createCompany(
            Long recruiterId,
            CompanyRequest request
    ) {

        User recruiter = getRecruiter(recruiterId);

        if (companyRepository.existsByRecruiterId(recruiterId)) {
            throw new ResourceAlreadyExistsException(
                    "Company profile already exists for this recruiter"
            );
        }

        if (companyRepository.existsByCompanyNameIgnoreCase(
                request.getCompanyName().trim()
        )) {
            throw new ResourceAlreadyExistsException(
                    "Company already exists with name: "
                            + request.getCompanyName()
            );
        }

        Company company = Company.builder()
                .recruiter(recruiter)
                .companyName(request.getCompanyName().trim())
                .description(request.getDescription())
                .industry(request.getIndustry())
                .location(request.getLocation())
                .websiteUrl(request.getWebsiteUrl())
                .logoUrl(request.getLogoUrl())
                .companySize(request.getCompanySize())
                .build();

        Company savedCompany = companyRepository.save(company);

        return mapToResponse(savedCompany);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyByRecruiterId(Long recruiterId) {

        Company company = companyRepository
                .findByRecruiterId(recruiterId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found for recruiter id: "
                                        + recruiterId
                        )
                );

        return mapToResponse(company);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long companyId) {

        Company company = companyRepository
                .findById(companyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: " + companyId
                        )
                );

        return mapToResponse(company);
    }

    @Override
    @Transactional
    public CompanyResponse updateCompany(
            Long recruiterId,
            CompanyRequest request
    ) {

        Company company = companyRepository
                .findByRecruiterId(recruiterId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found for recruiter id: "
                                        + recruiterId
                        )
                );

        company.setCompanyName(request.getCompanyName().trim());
        company.setDescription(request.getDescription());
        company.setIndustry(request.getIndustry());
        company.setLocation(request.getLocation());
        company.setWebsiteUrl(request.getWebsiteUrl());
        company.setLogoUrl(request.getLogoUrl());
        company.setCompanySize(request.getCompanySize());

        Company updatedCompany = companyRepository.save(company);

        return mapToResponse(updatedCompany);
    }

    private User getRecruiter(Long recruiterId) {

        User recruiter = userRepository
                .findById(recruiterId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Recruiter not found with id: "
                                        + recruiterId
                        )
                );

        if (recruiter.getRole() != Role.RECRUITER) {
            throw new IllegalArgumentException(
                    "Only recruiter users can create a company"
            );
        }

        return recruiter;
    }

    private CompanyResponse mapToResponse(Company company) {

        User recruiter = company.getRecruiter();

        return CompanyResponse.builder()
                .id(company.getId())
                .recruiterId(recruiter.getId())
                .recruiterName(recruiter.getFullName())
                .recruiterEmail(recruiter.getEmail())
                .companyName(company.getCompanyName())
                .description(company.getDescription())
                .industry(company.getIndustry())
                .location(company.getLocation())
                .websiteUrl(company.getWebsiteUrl())
                .logoUrl(company.getLogoUrl())
                .companySize(company.getCompanySize())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}

package com.jobportal.service;

import com.jobportal.dto.request.CompanyRequest;
import com.jobportal.dto.response.CompanyResponse;

public interface CompanyService {

    CompanyResponse createCompany(
            Long recruiterId,
            CompanyRequest request
    );

    CompanyResponse getCompanyByRecruiterId(Long recruiterId);

    CompanyResponse getCompanyById(Long companyId);

    CompanyResponse updateCompany(
            Long recruiterId,
            CompanyRequest request
    );
}
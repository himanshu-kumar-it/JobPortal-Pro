
package com.jobportal.controller;

import com.jobportal.dto.request.CompanyRequest;
import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.CompanyResponse;
import com.jobportal.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping("/recruiter/{recruiterId}")
    public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
            @PathVariable Long recruiterId,
            @Valid @RequestBody CompanyRequest request
    ) {

        CompanyResponse company =
                companyService.createCompany(recruiterId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                        true,
                        "Company created successfully",
                        company
                )
        );
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<ApiResponse<CompanyResponse>>
    getCompanyByRecruiter(
            @PathVariable Long recruiterId
    ) {

        CompanyResponse company =
                companyService.getCompanyByRecruiterId(recruiterId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Company fetched successfully",
                        company
                )
        );
    }

    @GetMapping("/{companyId}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(
            @PathVariable Long companyId
    ) {

        CompanyResponse company =
                companyService.getCompanyById(companyId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Company fetched successfully",
                        company
                )
        );
    }

    @PutMapping("/recruiter/{recruiterId}")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateCompany(
            @PathVariable Long recruiterId,
            @Valid @RequestBody CompanyRequest request
    ) {

        CompanyResponse company =
                companyService.updateCompany(recruiterId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Company updated successfully",
                        company
                )
        );
    }
}
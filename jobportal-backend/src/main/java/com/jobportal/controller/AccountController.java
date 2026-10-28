package com.jobportal.controller;

import com.jobportal.dto.request.ChangePasswordRequest;
import com.jobportal.dto.response.AccountResponse;
import com.jobportal.dto.response.ApiResponse;
import com.jobportal.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/me")
    public ResponseEntity<
            ApiResponse<AccountResponse>
            > getCurrentUser(
            Authentication authentication
    ) {

        AccountResponse account =
                accountService.getCurrentUser(
                        authentication.getName()
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Account details fetched successfully",
                        account
                )
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        accountService.changePassword(
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Password changed successfully",
                        null
                )
        );
    }
}

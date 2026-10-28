package com.jobportal.service;

import com.jobportal.dto.request.ChangePasswordRequest;
import com.jobportal.dto.response.AccountResponse;

public interface AccountService {

    AccountResponse getCurrentUser(
            String email
    );

    void changePassword(
            String email,
            ChangePasswordRequest request
    );
}

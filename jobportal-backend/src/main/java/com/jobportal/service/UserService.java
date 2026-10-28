package com.jobportal.service;

import com.jobportal.dto.request.LoginRequest;
import com.jobportal.dto.request.RegisterRequest;
import com.jobportal.dto.response.LoginResponse;
import com.jobportal.dto.response.UserResponse;

public interface UserService {

    UserResponse registerUser(RegisterRequest request);

    LoginResponse loginUser(LoginRequest request);
}
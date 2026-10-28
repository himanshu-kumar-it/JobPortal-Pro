
package com.jobportal.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AccountResponse {

    private Long id;

    private String fullName;

    private String email;

    private String role;
}
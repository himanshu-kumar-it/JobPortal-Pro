package com.jobportal.config;

import com.jobportal.security.JwtAuthenticationEntryPoint;
import com.jobportal.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                authenticationEntryPoint
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Authentication and basic backend health check
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/test"
                        ).permitAll()

                        // Browser preflight requests
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Public job APIs
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/jobs",
                                "/api/jobs/search",
                                "/api/jobs/{jobId}",
                                "/api/jobs/company/{companyId}"
                        ).permitAll()

                        // Public company API
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/companies/{companyId}"
                        ).permitAll()

                        // Candidate profile APIs
                        .requestMatchers(
                                "/api/candidates/**"
                        ).hasRole("CANDIDATE")

                        // Saved jobs
                        .requestMatchers(
                                "/api/saved-jobs/**"
                        ).hasRole("CANDIDATE")

                        // Candidate dashboard
                        .requestMatchers(
                                "/api/dashboard/candidate/**"
                        ).hasRole("CANDIDATE")

                        // Recruiter dashboard
                        .requestMatchers(
                                "/api/dashboard/recruiter/**"
                        ).hasRole("RECRUITER")

                        // Candidate application APIs
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications/candidate/**"
                        ).hasRole("CANDIDATE")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/candidate/**"
                        ).hasRole("CANDIDATE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/applications/*/candidate/**"
                        ).hasRole("CANDIDATE")

                        // Recruiter application APIs
                        .requestMatchers(
                                "/api/applications/recruiter/**"
                        ).hasRole("RECRUITER")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/applications/*/recruiter/**"
                        ).hasRole("RECRUITER")

                        // Recruiter company APIs
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/companies/recruiter/**"
                        ).hasRole("RECRUITER")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/companies/recruiter/**"
                        ).hasRole("RECRUITER")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/companies/recruiter/**"
                        ).hasRole("RECRUITER")

                        // Recruiter job APIs
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/jobs/recruiter/**"
                        ).hasRole("RECRUITER")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/jobs/*/recruiter/**"
                        ).hasRole("RECRUITER")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/jobs/*/recruiter/**"
                        ).hasRole("RECRUITER")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/jobs/recruiter/**"
                        ).hasRole("RECRUITER")

                        // Remaining APIs require login
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // Vite may select 5174/5175 when the default port is occupied.
        // Limit the pattern to local development hosts, not arbitrary origins.
        configuration.setAllowedOriginPatterns(
                List.of(
                        "http://localhost:*",
                        "http://127.0.0.1:*"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        HttpHeaders.AUTHORIZATION,
                        HttpHeaders.CONTENT_TYPE,
                        HttpHeaders.ACCEPT
                )
        );

        configuration.setExposedHeaders(
                List.of(
                        HttpHeaders.AUTHORIZATION
                )
        );

        configuration.setAllowCredentials(true);

        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }
}
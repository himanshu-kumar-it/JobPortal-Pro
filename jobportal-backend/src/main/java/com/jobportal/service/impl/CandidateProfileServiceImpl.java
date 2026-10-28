
package com.jobportal.service.impl;

import com.jobportal.dto.request.CandidateProfileRequest;
import com.jobportal.dto.response.CandidateProfileResponse;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceAlreadyExistsException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.CandidateProfileRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.CandidateProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CandidateProfileServiceImpl
        implements CandidateProfileService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CandidateProfileResponse createProfile(
            Long userId,
            CandidateProfileRequest request
    ) {

        User user = getCandidateUser(userId);

        if (candidateProfileRepository.existsByUserId(userId)) {
            throw new ResourceAlreadyExistsException(
                    "Candidate profile already exists"
            );
        }

        CandidateProfile profile = CandidateProfile.builder()
                .user(user)
                .headline(request.getHeadline())
                .about(request.getAbout())
                .location(request.getLocation())
                .phone(request.getPhone())
                .skills(request.getSkills())
                .education(request.getEducation())
                .experience(request.getExperience())
                .portfolioUrl(request.getPortfolioUrl())
                .githubUrl(request.getGithubUrl())
                .linkedinUrl(request.getLinkedinUrl())
                .resumeUrl(request.getResumeUrl())
                .build();

        CandidateProfile savedProfile =
                candidateProfileRepository.save(profile);

        return mapToResponse(savedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResponse getProfileByUserId(Long userId) {

        CandidateProfile profile = candidateProfileRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Candidate profile not found"
                        )
                );

        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public CandidateProfileResponse updateProfile(
            Long userId,
            CandidateProfileRequest request
    ) {

        CandidateProfile profile = candidateProfileRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Candidate profile not found"
                        )
                );

        profile.setHeadline(request.getHeadline());
        profile.setAbout(request.getAbout());
        profile.setLocation(request.getLocation());
        profile.setPhone(request.getPhone());
        profile.setSkills(request.getSkills());
        profile.setEducation(request.getEducation());
        profile.setExperience(request.getExperience());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setResumeUrl(request.getResumeUrl());

        CandidateProfile updatedProfile =
                candidateProfileRepository.save(profile);

        return mapToResponse(updatedProfile);
    }

    private User getCandidateUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        if (user.getRole() != Role.CANDIDATE) {
            throw new IllegalArgumentException(
                    "Only candidate users can create candidate profiles"
            );
        }

        return user;
    }

    private CandidateProfileResponse mapToResponse(
            CandidateProfile profile
    ) {

        User user = profile.getUser();

        return CandidateProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .headline(profile.getHeadline())
                .about(profile.getAbout())
                .location(profile.getLocation())
                .phone(profile.getPhone())
                .skills(profile.getSkills())
                .education(profile.getEducation())
                .experience(profile.getExperience())
                .portfolioUrl(profile.getPortfolioUrl())
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .resumeUrl(profile.getResumeUrl())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}

package com.jobportal.entity;

import jakarta.persistence.*;
        import lombok.*;

        import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(length = 150)
    private String headline;

    @Column(length = 1000)
    private String about;

    @Column(length = 100)
    private String location;

    @Column(length = 20)
    private String phone;

    @Column(length = 500)
    private String skills;

    @Column(length = 250)
    private String education;

    @Column(length = 250)
    private String experience;

    @Column(length = 300)
    private String portfolioUrl;

    @Column(length = 300)
    private String githubUrl;

    @Column(length = 300)
    private String linkedinUrl;

    private String resumeUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
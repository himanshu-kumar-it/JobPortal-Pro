

package com.jobportal.entity;

import jakarta.persistence.*;
        import lombok.*;

        import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "recruiter_id",
            nullable = false,
            unique = true
    )
    private User recruiter;

    @Column(nullable = false, length = 150)
    private String companyName;

    @Column(length = 1000)
    private String description;

    @Column(length = 100)
    private String industry;

    @Column(length = 100)
    private String location;

    @Column(length = 300)
    private String websiteUrl;

    @Column(length = 300)
    private String logoUrl;

    @Column(length = 50)
    private String companySize;

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
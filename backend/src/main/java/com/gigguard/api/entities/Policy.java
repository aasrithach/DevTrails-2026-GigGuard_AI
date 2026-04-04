package com.gigguard.api.entities;

import com.gigguard.api.enums.PolicyStatus;
import com.gigguard.api.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id")
    private Worker worker;

    private LocalDate startDate;
    private LocalDate endDate;
    private Double weeklyPremium;
    private Double riskScore;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    @Enumerated(EnumType.STRING)
    private PolicyStatus status;

    @Builder.Default
    @Column(columnDefinition = "double default 1.0")
    private Double coverageMultiplier = 1.0;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

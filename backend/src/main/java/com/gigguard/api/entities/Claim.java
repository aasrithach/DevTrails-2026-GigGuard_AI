package com.gigguard.api.entities;

import com.gigguard.api.enums.ClaimStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id")
    private Worker worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id")
    private Policy policy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disruption_id")
    private Disruption disruption;

    private Double predictedIncomeLoss;
    
    private Double claimAmount;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    @Builder.Default
    @Column(columnDefinition = "integer default 0")
    private Integer fraudScore = 0;

    private Boolean gpsVerified;
    private Boolean weatherVerified;
    private Boolean activityDropVerified;
    
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

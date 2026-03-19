package com.gigguard.api.entities;

import com.gigguard.api.enums.PayoutStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id")
    private Claim claim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id")
    private Worker worker;

    private Double amount;
    
    private String upiId;
    
    private String transactionId;

    @Enumerated(EnumType.STRING)
    private PayoutStatus status;

    private LocalDateTime processedAt;
}

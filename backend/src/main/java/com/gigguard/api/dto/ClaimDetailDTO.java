package com.gigguard.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimDetailDTO {
    private Long id;
    private Long workerId;
    private Double claimAmount;
    private String status;
    private LocalDateTime createdAt;
    // fraud details
    private Integer fraudScore;
    private List<Object> fraudFlags;
    // payout details
    private String transactionId;
    private String payoutStatus;
}

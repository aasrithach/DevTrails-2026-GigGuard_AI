package com.gigguard.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayoutDTO {
    private Long id;
    private Long claimId;
    private Double amount;
    private String upiId;
    private String transactionId;
    private String status;
    private LocalDateTime processedAt;
}

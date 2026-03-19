package com.gigguard.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private Long totalActiveWorkers;
    private Long totalActivePolicies;
    private Long totalActiveDisruptions;
    private Long pendingClaimsCount;
    private Double todayPayoutTotal;
    private Long fraudFlaggedCount;
    private Double weeklyPremiumsCollected;
    private Long claimsApprovedToday;
}

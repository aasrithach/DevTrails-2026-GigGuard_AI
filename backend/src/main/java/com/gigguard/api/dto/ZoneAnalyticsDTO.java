package com.gigguard.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoneAnalyticsDTO {
    private String zone;
    private Double riskScore;
    private String riskLevel;
    private Integer activeWorkers;
    private Integer activePolicies;
    private Integer totalClaimsThisWeek;
    private Double totalPayoutsThisWeek;
    private Double premiumsCollectedThisWeek;
    private Double lossRatio; // (payouts / premiums * 100)
    private Integer fraudFlagsThisWeek;
}

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
public class WorkerDashboardDTO {
    private Object activePolicy; // Could be PolicyDTO
    private Integer protectionScore;
    private String protectionScoreBadge;
    private List<Object> recentClaims; // Could be ClaimDetailDTO
    private List<Object> unreadAlerts; // Could be AlertDTO
    private Object tomorrowForecast; // Risk forecast DTO
    private Double totalEarningsProtectedThisMonth;
}

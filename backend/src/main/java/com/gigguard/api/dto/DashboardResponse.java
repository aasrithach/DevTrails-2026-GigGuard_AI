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
public class DashboardResponse {
    private Object activePolicy;
    private Integer protectionScore;
    private List<Object> recentClaims;
    private List<Object> unreadAlerts;
    private Object tomorrowForecast;
    private Double totalEarningsProtectedThisMonth;
}

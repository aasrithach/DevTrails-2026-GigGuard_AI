package com.gigguard.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncomePredictionDTO {
    private String workerName;
    private String zone;
    private String tomorrowRiskLevel;
    private Double rainfallProbability;
    private Double predictedWorkingHours;
    private Double normalWorkingHours;
    private Double predictedIncomeLoss;
    private Double coverageAmount;
    private String safetyRecommendation;
}

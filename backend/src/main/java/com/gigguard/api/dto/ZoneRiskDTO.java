package com.gigguard.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoneRiskDTO {
    private String zone;
    private Double riskScore;
    private String riskLevel;
    private String disruptionType;
}

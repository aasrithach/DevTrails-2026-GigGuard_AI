package com.gigguard.api.entities;

import com.gigguard.api.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String zone;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    private Double riskScore;
    private Double rainfallProbability;
    private Integer aqiLevel;
    private Double temperature;
    private Double trafficIndex;
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
    }
}

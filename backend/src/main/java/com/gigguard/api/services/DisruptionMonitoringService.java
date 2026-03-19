package com.gigguard.api.services;

import com.gigguard.api.entities.Disruption;
import com.gigguard.api.entities.RiskScore;
import com.gigguard.api.enums.DisruptionType;
import com.gigguard.api.enums.Severity;
import com.gigguard.api.repositories.DisruptionRepository;
import com.gigguard.api.repositories.RiskScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class DisruptionMonitoringService {

    @Autowired
    private RiskScoreRepository riskScoreRepository;

    @Autowired
    private DisruptionRepository disruptionRepository;

    @Autowired
    private ClaimsAutomationService claimsAutomationService;

    private final List<String> ZONES = Arrays.asList(
            "Kondapur", "Miyapur", "Hitech City", "Gachibowli", "Madhapur",
            "LB Nagar", "Kukatpally", "Ameerpet", "Dilsukhnagar", "Secunderabad"
    );

    @Scheduled(fixedRate = 900000) // 15 mins
    public void monitorAllZones() {
        for (String zone : ZONES) {
            Optional<RiskScore> latestScore = riskScoreRepository.findFirstByZoneOrderByRecordedAtDesc(zone);

            latestScore.ifPresent(score -> {
                checkAndTrigger(zone, score.getRainfallProbability(), 70.0, DisruptionType.RAIN, getSeverity(score.getRainfallProbability(), 70.0, 85.0), "Heavy Rain Detected");
                checkAndTrigger(zone, score.getAqiLevel(), 180.0, DisruptionType.AQI, getSeverity(score.getAqiLevel(), 180.0, 300.0), "Severe AQI Spike");
                checkAndTrigger(zone, score.getTemperature(), 42.0, DisruptionType.HEAT, getSeverity(score.getTemperature(), 42.0, 45.0), "Extreme Heat Wave");
                checkAndTrigger(zone, score.getTrafficIndex(), 80.0, DisruptionType.TRAFFIC, getSeverity(score.getTrafficIndex(), 80.0, 90.0), "Major Traffic Congestion");
            });
        }
    }

    private Severity getSeverity(double val, double lowThreshold, double highThreshold) {
        if (val > highThreshold) return Severity.HIGH;
        if (val > (lowThreshold + highThreshold) / 2) return Severity.MEDIUM;
        return Severity.LOW;
    }

    private void checkAndTrigger(String zone, double val, double threshold, DisruptionType type, Severity severity, String desc) {
        if (val > threshold) {
            boolean recentlyTriggered = disruptionRepository.existsByZoneAndDisruptionTypeAndIsActiveTrueAndTriggeredAtAfter(
                    zone, type, LocalDateTime.now().minusHours(2)
            );

            if (!recentlyTriggered) {
                Disruption disruption = Disruption.builder()
                        .zone(zone)
                        .disruptionType(type)
                        .severity(severity)
                        .description(desc)
                        .isActive(true)
                        .build();
                disruption = disruptionRepository.save(disruption);
                claimsAutomationService.processDisruption(disruption);
            }
        }
    }
}

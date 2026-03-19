package com.gigguard.api.services;

import com.gigguard.api.entities.RiskScore;
import com.gigguard.api.enums.RiskLevel;
import com.gigguard.api.repositories.RiskScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class RiskAssessmentService {

    @Autowired
    private WeatherMockService weatherMockService;

    @Autowired
    private RiskScoreRepository riskScoreRepository;

    private final List<String> ZONES = Arrays.asList(
            "Kondapur", "Miyapur", "Hitech City", "Gachibowli", "Madhapur",
            "LB Nagar", "Kukatpally", "Ameerpet", "Dilsukhnagar", "Secunderabad"
    );

    @Scheduled(fixedRate = 21600000) // 6 hours
    public void assessAllZonesScheduled() {
        assessAllZones();
    }

    public void assessAllZones() {
        for (String zone : ZONES) {
            WeatherMockService.WeatherData data = weatherMockService.getWeatherForZone(zone);

            double normalizedAQI = (data.getAqiLevel() / 500.0) * 100.0;
            double riskScoreVal = (0.40 * data.getRainfallProbability())
                    + (0.25 * normalizedAQI)
                    + (0.20 * data.getTrafficIndex())
                    + (0.15 * (data.getHistoricalRate() * 100)); // assuming rate is 0-1, so mult * 100

            RiskLevel level = RiskLevel.MEDIUM;
            if (riskScoreVal < 35) level = RiskLevel.LOW;
            else if (riskScoreVal > 65) level = RiskLevel.HIGH;

            RiskScore score = RiskScore.builder()
                    .zone(zone)
                    .riskLevel(level)
                    .riskScore(riskScoreVal)
                    .rainfallProbability(data.getRainfallProbability())
                    .aqiLevel(data.getAqiLevel())
                    .temperature(data.getTemperature())
                    .trafficIndex(data.getTrafficIndex())
                    .build();

            riskScoreRepository.save(score);
        }
    }
}

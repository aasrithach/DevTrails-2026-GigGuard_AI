package com.gigguard.api.controllers;

import com.gigguard.api.dto.ApiResponse;
import com.gigguard.api.dto.IncomePredictionDTO;
import com.gigguard.api.services.WeatherMockService;
import com.gigguard.api.entities.Worker;
import com.gigguard.api.repositories.WorkerRepository;
import com.gigguard.api.services.WeatherMockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/risk")
public class RiskController {

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private WeatherMockService weatherMockService;

    @GetMapping("/income-prediction/{workerId}")
    public ResponseEntity<ApiResponse<IncomePredictionDTO>> getIncomePrediction(@PathVariable Long workerId) {
        Worker worker = workerRepository.findById(workerId).orElse(null);
        if (worker == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("Worker not found"));
        }

        // Mock weather prediction
        com.gigguard.api.services.WeatherMockService.WeatherData forecast = weatherMockService.getWeatherForZone(worker.getZone());
        Double rainProb = forecast.getRainfallProbability();
        
        String tomorrowRiskLevel = "LOW";
        if (rainProb > 70) tomorrowRiskLevel = "HIGH";
        else if (rainProb > 40) tomorrowRiskLevel = "MEDIUM";

        double riskFactor = 0.0;
        String recommendation = "Normal working conditions expected tomorrow.";
        
        if ("HIGH".equalsIgnoreCase(tomorrowRiskLevel)) {
            riskFactor = 0.75;
            recommendation = "High disruption risk. Coverage pre-activated. Avoid peak hours 12PM–4PM.";
        } else if ("MEDIUM".equalsIgnoreCase(tomorrowRiskLevel)) {
            riskFactor = 0.40;
            recommendation = "Moderate disruption possible. Consider starting earlier.";
        } else {
            riskFactor = 0.10;
        }

        double predictedIncomeLoss = worker.getAvgDailyIncome() * riskFactor;
        
        IncomePredictionDTO dto = IncomePredictionDTO.builder()
                .workerName(worker.getName())
                .zone(worker.getZone())
                .tomorrowRiskLevel(tomorrowRiskLevel)
                .rainfallProbability(rainProb != null ? rainProb : 0.0)
                .predictedWorkingHours(8.0 * (1 - riskFactor))
                .normalWorkingHours(8.0)
                .predictedIncomeLoss(predictedIncomeLoss)
                .coverageAmount(predictedIncomeLoss * 0.9) // Arbitrary safe multiplier for test
                .safetyRecommendation(recommendation)
                .build();

        return ResponseEntity.ok(ApiResponse.success(dto, "Income prediction retrieved successfully"));
    }
}

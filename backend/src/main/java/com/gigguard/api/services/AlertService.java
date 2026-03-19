package com.gigguard.api.services;

import com.gigguard.api.entities.Alert;
import com.gigguard.api.entities.Worker;
import com.gigguard.api.enums.AlertType;
import com.gigguard.api.repositories.AlertRepository;
import com.gigguard.api.repositories.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private WeatherMockService weatherMockService;

    public void createAlert(Worker worker, String zone, AlertType type, String message) {
        Alert alert = Alert.builder()
                .worker(worker)
                .zone(zone)
                .alertType(type)
                .message(message)
                .build();
        alertRepository.save(alert);
    }
    
    @Scheduled(cron = "0 0 20 * * *") // Every day at 8 PM
    public void generateDailyRiskAlerts() {
        List<Worker> activeWorkers = workerRepository.findByIsActiveTrue();
        for (Worker worker : activeWorkers) {
            // Ideally want workers with ACTIVE policy, but simplified for now
            com.gigguard.api.services.WeatherMockService.WeatherData forecast = weatherMockService.getWeatherForZone(worker.getZone());
            Double rainProb = forecast.getRainfallProbability();
            
            String riskLevel = "LOW";
            if (rainProb > 70) riskLevel = "HIGH";
            else if (rainProb > 40) riskLevel = "MEDIUM";
            
            if (!"LOW".equals(riskLevel)) {
                double riskFactor = "HIGH".equals(riskLevel) ? 0.75 : 0.40;
                double predictedImpact = worker.getAvgDailyIncome() * riskFactor;
                String msg = String.format("Tomorrow's risk in %s is %s. Predicted impact: ₹%.0f. Your coverage is pre-activated.",
                        worker.getZone(), riskLevel, predictedImpact);
                createAlert(worker, worker.getZone(), AlertType.DISRUPTION_WARNING, msg);
            }
        }
    }
}

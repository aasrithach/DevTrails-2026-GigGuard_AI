package com.gigguard.api.controllers;

import com.gigguard.api.dto.ApiResponse;
import com.gigguard.api.dto.DemoDisruptionRequest;
import com.gigguard.api.dto.WeatherOverrideRequest;
import com.gigguard.api.entities.*;
import com.gigguard.api.enums.*;
import com.gigguard.api.repositories.*;
import com.gigguard.api.services.ClaimsAutomationService;
import com.gigguard.api.services.RiskAssessmentService;
import com.gigguard.api.services.WeatherMockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

import com.gigguard.api.entities.Worker;

@RestController
@RequestMapping("/api/demo")
public class DemoSimulationController {

    @Autowired
    private ClaimsAutomationService claimsAutomationService;

    @Autowired
    private DisruptionRepository disruptionRepository;

    @Autowired
    private WeatherMockService weatherMockService;
    
    @Autowired
    private RiskAssessmentService riskAssessmentService;

    @Autowired
    private RiskScoreRepository riskScoreRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private RiskController riskController;

    private final List<String> ZONES = Arrays.asList(
            "Kondapur", "Miyapur", "Hitech City", "Gachibowli", "Madhapur",
            "LB Nagar", "Kukatpally", "Ameerpet", "Dilsukhnagar", "Secunderabad"
    );

    @PostMapping("/disruption")
    public ResponseEntity<?> triggerDisruption(@RequestBody DemoDisruptionRequest request) {
        // 1. Log the disruption for demonstration purposes
        Disruption disruption = Disruption.builder()
                .zone(request.getZone())
                .disruptionType(request.getDisruptionType())
                .severity(com.gigguard.api.enums.Severity.HIGH)
                .description("Demo Simulation Trigger")
                .isActive(true)
                .build();
        disruptionRepository.save(disruption);
        
        // 2. Call service before returning (Critical step)
        claimsAutomationService.processDisruption(request.getDisruptionType().name());

        // 3. Dynamic message based on disruption type
        String typeStr = request.getDisruptionType().name();
        String message = "Disruption detected";
        if (typeStr.contains("RAIN")) message = "Heavy rain detected";
        else if (typeStr.contains("HEAT")) message = "Extreme heat detected";
        else if (typeStr.contains("TRAFFIC") || typeStr.contains("ROAD")) message = "Road block detected";

        Map<String, Object> resp = new HashMap<>();
        resp.put("message", message);
        resp.put("claimCreated", true);
        resp.put("payout", 500);
        
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/resolve-disruption/{id}")
    public ResponseEntity<?> resolveDisruption(@PathVariable Long id) {
        Disruption disruption = disruptionRepository.findById(id).orElse(null);
        if (disruption != null) {
            disruption.setIsActive(false);
            disruption.setResolvedAt(LocalDateTime.now());
            disruptionRepository.save(disruption);
            return ResponseEntity.ok(disruption);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/set-weather")
    public ResponseEntity<?> setWeather(@RequestBody WeatherOverrideRequest request) {
        weatherMockService.overrideWeather(request);
        riskAssessmentService.assessAllZones(); // Immediate recalculate
        return ResponseEntity.ok(Collections.singletonMap("message", "Weather updated and risk reassessed."));
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetDemo() {
        List<Disruption> active = disruptionRepository.findByIsActiveTrue();
        for (Disruption d : active) {
            d.setIsActive(false);
            d.setResolvedAt(LocalDateTime.now());
        }
        disruptionRepository.saveAll(active);

        // Reset PENDING claims
        claimRepository.findAll().stream()
                .filter(c -> c.getStatus() == ClaimStatus.PENDING)
                .forEach(c -> {
                    c.setStatus(ClaimStatus.REJECTED); // simulating cleanup
                    claimRepository.save(c);
                });

        return ResponseEntity.ok(Collections.singletonMap("message", "Demo reset successfully"));
    }

    @GetMapping("/zone-summary")
    public ResponseEntity<?> getZoneSummary() {
        List<Map<String, Object>> summaries = new ArrayList<>();
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0);

        for (String zone : ZONES) {
            Map<String, Object> zData = new HashMap<>();
            zData.put("zone", zone);
            
            RiskScore rs = riskScoreRepository.findFirstByZoneOrderByRecordedAtDesc(zone).orElse(null);
            zData.put("riskLevel", rs != null ? rs.getRiskLevel() : "MEDIUM");
            zData.put("riskScore", rs != null ? rs.getRiskScore() : 50.0);
            
            long activeDisruptions = disruptionRepository.findByIsActiveTrue()
                    .stream().filter(d -> d.getZone().equals(zone)).count();
            zData.put("activeDisruptions", activeDisruptions);
            
            zData.put("activeWorkers", workerRepository.findByZoneAndIsActiveTrue(zone).size());
            
            // Mock totals for demo speed
            zData.put("todayClaimTotal", claimRepository.countByStatusAndCreatedAtAfter(ClaimStatus.APPROVED, startOfDay) * 800.0);
            zData.put("todayPayoutTotal", payoutRepository.sumAmountByProcessedAtAfter(startOfDay));
            
            summaries.add(zData);
        }

        return ResponseEntity.ok(summaries);
    }

    @PostMapping("/simulate-claims")
    public ResponseEntity<?> simulateClaims(@RequestBody DemoDisruptionRequest request) {
        String zone = request.getZone();
        riskController.spikeZoneRisk(zone);
        double multiplier = 0.55; // Default MEDIUM
        
        if (request.getSeverity() != null) {
            switch (request.getSeverity()) {
                case LOW: multiplier = 0.25; break;
                case MEDIUM: multiplier = 0.55; break;
                case HIGH: multiplier = 0.85; break;
            }
        }

        List<Worker> workers = workerRepository.findByZoneAndIsActiveTrue(zone);
        List<Map<String, Object>> createdClaims = new ArrayList<>();
        double totalPayout = 0;

        for (Worker worker : workers) {
            double predictedLoss = Math.round((worker.getAvgDailyIncome() * multiplier) * 100.0) / 100.0;
            
            // --- Simple Fraud Detection Rules ---
            int fraudScore = 0;
            List<String> reasons = new ArrayList<>();
            
            // 1. New Account check (< 7 days)
            if (worker.getCreatedAt() != null && worker.getCreatedAt().isAfter(LocalDateTime.now().minusDays(7))) {
                fraudScore += 25;
                reasons.add("NEW_ACCOUNT");
            }
            
            // 2. High Frequency check (same worker, last 24h)
            long recentClaims = claimRepository.countByWorkerIdAndCreatedAtAfter(worker.getId(), LocalDateTime.now().minusHours(24));
            if (recentClaims >= 1) {
                fraudScore += 50;
                reasons.add("HIGH_FREQUENCY_ACTIVITY");
            }
            
            // 3. Random Jitter (0-15)
            int jitter = new Random().nextInt(16);
            fraudScore += jitter;
            
            // --- Status Mapping ---
            ClaimStatus finalStatus = ClaimStatus.APPROVED;
            if (fraudScore >= 80) finalStatus = ClaimStatus.REJECTED;
            else if (fraudScore >= 60) finalStatus = ClaimStatus.FLAGGED;

            // Find active policy 
            Policy policy = policyRepository
                .findFirstByWorkerIdAndStatusOrderByCreatedAtDesc(worker.getId(), PolicyStatus.ACTIVE)
                .orElse(null);

            Claim claim = Claim.builder()
                .worker(worker)
                .policy(policy)
                .predictedIncomeLoss(predictedLoss)
                .claimAmount(predictedLoss)
                .status(finalStatus)
                .fraudScore(fraudScore)
                .gpsVerified(true)
                .weatherVerified(true)
                .activityDropVerified(true)
                .createdAt(LocalDateTime.now())
                .build();
            
            claimRepository.save(claim);
            if (finalStatus == ClaimStatus.APPROVED) {
                totalPayout += predictedLoss;
            }

            Map<String, Object> cMap = new HashMap<>();
            cMap.put("workerName", worker.getName());
            cMap.put("predictedIncomeLoss", predictedLoss);
            cMap.put("status", finalStatus.name());
            cMap.put("fraudScore", fraudScore);
            cMap.put("fraudReason", String.join(", ", reasons));
            createdClaims.add(cMap);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("zone", zone);
        response.put("disruptionType", request.getDisruptionType());
        response.put("severity", request.getSeverity());
        response.put("totalClaims", createdClaims.size());
        response.put("totalPayout", Math.round(totalPayout * 100.0) / 100.0);
        response.put("claims", createdClaims);

        return ResponseEntity.ok(response);
    }
}

package com.gigguard.api.controllers;

import com.gigguard.api.dto.ApiResponse;
import com.gigguard.api.dto.DemoDisruptionRequest;
import com.gigguard.api.dto.WeatherOverrideRequest;
import com.gigguard.api.entities.Disruption;
import com.gigguard.api.entities.RiskScore;
import com.gigguard.api.enums.ClaimStatus;
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
}

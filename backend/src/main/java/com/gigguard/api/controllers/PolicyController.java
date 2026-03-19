package com.gigguard.api.controllers;

import com.gigguard.api.entities.Policy;
import com.gigguard.api.dto.ApiResponse;
import com.gigguard.api.entities.Worker;
import com.gigguard.api.enums.PolicyStatus;
import com.gigguard.api.enums.RiskLevel;
import com.gigguard.api.repositories.PolicyRepository;
import com.gigguard.api.repositories.RiskScoreRepository;
import com.gigguard.api.repositories.WorkerRepository;
import com.gigguard.api.security.UserDetailsImpl;
import com.gigguard.api.services.PremiumCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private PremiumCalculationService premiumCalculationService;

    @Autowired
    private RiskScoreRepository riskScoreRepository;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Policy>> createPolicy(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Worker worker = workerRepository.findById(userDetails.getId()).orElse(null);
        if (worker == null) return ResponseEntity.status(404).body(ApiResponse.error("Worker not found"));

        Double premium = premiumCalculationService.calculateWeeklyPremium(worker);
        RiskLevel riskLevel = riskScoreRepository.findFirstByZoneOrderByRecordedAtDesc(worker.getZone())
                .map(r -> r.getRiskLevel()).orElse(RiskLevel.MEDIUM);

        Policy policy = Policy.builder()
                .worker(worker)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(7))
                .weeklyPremium(premium)
                .riskLevel(riskLevel)
                .status(PolicyStatus.ACTIVE)
                .coverageMultiplier(1.0)
                .build();

        policyRepository.save(policy);
        return ResponseEntity.ok(ApiResponse.success(policy, "Policy created"));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<Policy>> getActivePolicy(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return policyRepository.findFirstByWorkerIdAndStatusOrderByCreatedAtDesc(userDetails.getId(), PolicyStatus.ACTIVE)
                .map(value -> ResponseEntity.ok(ApiResponse.success(value, "Active policy retrieved")))
                .orElseGet(() -> ResponseEntity.status(204).body(ApiResponse.error("No active policy")));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Iterable<Policy>>> getPolicyHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(policyRepository.findByWorkerIdOrderByCreatedAtDesc(userDetails.getId()), "Policy history retrieved"));
    }

    @PostMapping("/preview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> previewCoverage(@RequestBody Worker mockWorker) {
        mockWorker.setProtectionScore(70); // default
        Double premium = premiumCalculationService.calculateWeeklyPremium(mockWorker);
        RiskLevel riskLevel = riskScoreRepository.findFirstByZoneOrderByRecordedAtDesc(mockWorker.getZone())
                .map(r -> r.getRiskLevel()).orElse(RiskLevel.MEDIUM);
        
        Map<String, Object> resp = new HashMap<>();
        resp.put("calculatedPremium", premium);
        resp.put("riskLevel", riskLevel);
        resp.put("initialProtectionScore", mockWorker.getProtectionScore());
        resp.put("estimatedCoverage", mockWorker.getAvgDailyIncome() * 0.85); // High severity multiplier

        return ResponseEntity.ok(ApiResponse.success(resp, "Coverage preview generated"));
    }
}

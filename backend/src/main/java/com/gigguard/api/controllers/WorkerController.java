package com.gigguard.api.controllers;

import com.gigguard.api.dto.ApiResponse;
import com.gigguard.api.dto.WorkerDashboardDTO;
import com.gigguard.api.entities.Claim;
import com.gigguard.api.entities.Policy;
import com.gigguard.api.entities.Worker;
import com.gigguard.api.enums.PolicyStatus;
import com.gigguard.api.repositories.AlertRepository;
import com.gigguard.api.repositories.ClaimRepository;
import com.gigguard.api.repositories.PolicyRepository;
import com.gigguard.api.repositories.WorkerRepository;
import com.gigguard.api.security.UserDetailsImpl;
import com.gigguard.api.services.PremiumCalculationService;
import com.gigguard.api.services.WeatherMockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private AlertRepository alertRepository;
    
    @Autowired
    private WeatherMockService weatherMockService;
    
    @Autowired
    private PremiumCalculationService premiumCalculationService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Worker>> getMe(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Optional<Worker> worker = workerRepository.findById(userDetails.getId());
        return worker.<ResponseEntity<ApiResponse<Worker>>>map(value -> ResponseEntity.ok(ApiResponse.success(value, "Worker profile retrieved")))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Worker not found")));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Worker>> updateMe(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Worker updatedData) {
        Worker worker = workerRepository.findById(userDetails.getId()).orElse(null);
        if (worker == null) return ResponseEntity.status(404).body(ApiResponse.error("Worker not found"));
        
        if (updatedData.getZone() != null) worker.setZone(updatedData.getZone());
        if (updatedData.getAvgDailyIncome() != null) worker.setAvgDailyIncome(updatedData.getAvgDailyIncome());
        
        workerRepository.save(worker);
        return ResponseEntity.ok(ApiResponse.success(worker, "Worker profile updated"));
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<ApiResponse<com.gigguard.api.dto.WorkerDashboardDTO>> getDashboard(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (!userDetails.getId().equals(id) && userDetails.isWorker()) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
        }

        Worker worker = workerRepository.findById(id).orElse(null);
        if (worker == null) return ResponseEntity.status(404).body(ApiResponse.error("Worker not found"));

        Optional<Policy> activePolicy = policyRepository.findFirstByWorkerIdAndStatusOrderByCreatedAtDesc(id, PolicyStatus.ACTIVE);
        List<Claim> claims = claimRepository.findTop5ByWorkerIdOrderByCreatedAtDesc(id);
        
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        List<Claim> allHistoryClaims = claimRepository.findByWorkerIdOrderByCreatedAtDesc(id);
        double protectedEarnings = allHistoryClaims.stream()
                .filter(c -> c.getCreatedAt().isAfter(monthStart) && "APPROVED".equals(c.getStatus().name()))
                .mapToDouble(Claim::getClaimAmount)
                .sum();

        String badge = "High Risk";
        int score = worker.getProtectionScore() != null ? worker.getProtectionScore() : 70;
        if (score >= 80) badge = "Trusted Partner";
        else if (score >= 60) badge = "Active Partner";
        else if (score >= 40) badge = "Under Review";

        com.gigguard.api.dto.WorkerDashboardDTO resp = com.gigguard.api.dto.WorkerDashboardDTO.builder()
                .activePolicy(activePolicy.orElse(null))
                .protectionScore(score)
                .protectionScoreBadge(badge)
                .recentClaims((List<Object>) (Object) claims)
                .unreadAlerts((List<Object>) (Object) alertRepository.findTop10ByWorkerIdOrderByCreatedAtDesc(id))
                .tomorrowForecast(weatherMockService.getWeatherForZone(worker.getZone()))
                .totalEarningsProtectedThisMonth(protectedEarnings)
                .build();

        return ResponseEntity.ok(ApiResponse.success(resp, "Dashboard retrieved successfully"));
    }
}

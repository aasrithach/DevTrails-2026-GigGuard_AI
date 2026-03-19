package com.gigguard.api.controllers;

import com.gigguard.api.dto.AdminDashboardDTO;
import com.gigguard.api.dto.ApiResponse;
import com.gigguard.api.dto.ZoneAnalyticsDTO;
import com.gigguard.api.enums.ClaimStatus;
import com.gigguard.api.enums.PolicyStatus;
import com.gigguard.api.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gigguard.api.services.ClaimsAutomationService;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private DisruptionRepository disruptionRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private FraudFlagRepository fraudFlagRepository;

    @Autowired
    private ClaimsAutomationService claimsAutomationService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDTO>> getDashboard() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0);
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7);

        AdminDashboardDTO data = AdminDashboardDTO.builder()
            .totalActiveWorkers(workerRepository.count())
            .totalActivePolicies(policyRepository.countByStatus(PolicyStatus.ACTIVE))
            .totalActiveDisruptions(disruptionRepository.countByIsActiveTrue())
            .pendingClaimsCount(claimRepository.countByStatus(ClaimStatus.PENDING))
            .todayPayoutTotal(payoutRepository.sumAmountByProcessedAtAfter(startOfDay))
            .fraudFlaggedCount(claimRepository.countByStatus(ClaimStatus.FLAGGED))
            .weeklyPremiumsCollected(policyRepository.sumPremiumsCollectedSince(startOfWeek))
            .claimsApprovedToday(claimRepository.countByStatusAndCreatedAtAfter(ClaimStatus.APPROVED, startOfDay))
            .build();
        
        return ResponseEntity.ok(ApiResponse.success(data, "Dashboard data retrieved successfully"));
    }

    @GetMapping("/claims")
    public ResponseEntity<ApiResponse<Iterable<com.gigguard.api.entities.Claim>>> getAllClaims() {
        return ResponseEntity.ok(ApiResponse.success(claimRepository.findAll(), "Claims retrieved successfully")); // Ideally paginated, simplified
    }

    @GetMapping("/disruptions")
    public ResponseEntity<ApiResponse<Iterable<com.gigguard.api.entities.Disruption>>> getActiveDisruptions() {
        return ResponseEntity.ok(ApiResponse.success(disruptionRepository.findByIsActiveTrue(), "Disruptions retrieved successfully"));
    }

    @GetMapping("/fraud-flags")
    public ResponseEntity<ApiResponse<Iterable<com.gigguard.api.entities.FraudFlag>>> getFraudFlags() {
        return ResponseEntity.ok(ApiResponse.success(fraudFlagRepository.findAll(), "Fraud flags retrieved successfully"));
    }

    @GetMapping("/zone-analytics")
    public ResponseEntity<ApiResponse<List<ZoneAnalyticsDTO>>> getZoneAnalytics() {
        // For hackathon, generate some mock data based on distinct zones or just hardcoded zones.
        // Getting real analytics would require complex group by queries.
        List<ZoneAnalyticsDTO> mockAnalytics = Arrays.asList(
            ZoneAnalyticsDTO.builder()
                .zone("Hyderabad - HITEC City")
                .riskScore(75.5)
                .riskLevel("HIGH")
                .activeWorkers(1450)
                .activePolicies(1200)
                .totalClaimsThisWeek(340)
                .totalPayoutsThisWeek(450000.0)
                .premiumsCollectedThisWeek(120000.0)
                .lossRatio(375.0)
                .fraudFlagsThisWeek(12)
                .build(),
            ZoneAnalyticsDTO.builder()
                .zone("Hyderabad - Gachibowli")
                .riskScore(45.0)
                .riskLevel("MEDIUM")
                .activeWorkers(2100)
                .activePolicies(1850)
                .totalClaimsThisWeek(120)
                .totalPayoutsThisWeek(150000.0)
                .premiumsCollectedThisWeek(185000.0)
                .lossRatio(81.0)
                .fraudFlagsThisWeek(4)
                .build()
        );
        return ResponseEntity.ok(ApiResponse.success(mockAnalytics, "Zone analytics retrieved successfully"));
    }

    @PutMapping("/claims/{id}/approve")
    public ResponseEntity<ApiResponse<String>> approveClaim(@PathVariable Long id) {
        try {
            claimsAutomationService.manualApproveClaim(id);
            return ResponseEntity.ok(ApiResponse.success("Claim approved and payout processed", "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/claims/{id}/reject")
    public ResponseEntity<ApiResponse<String>> rejectClaim(@PathVariable Long id) {
        try {
            claimsAutomationService.manualRejectClaim(id);
            return ResponseEntity.ok(ApiResponse.success("Claim rejected", "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

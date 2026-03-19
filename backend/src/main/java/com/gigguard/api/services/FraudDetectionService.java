package com.gigguard.api.services;

import com.gigguard.api.entities.Claim;
import com.gigguard.api.entities.FraudFlag;
import com.gigguard.api.enums.FlagType;
import com.gigguard.api.repositories.ClaimRepository;
import com.gigguard.api.repositories.DisruptionRepository;
import com.gigguard.api.repositories.FraudFlagRepository;
import com.gigguard.api.repositories.PolicyRepository;
import com.gigguard.api.repositories.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FraudDetectionService {

    @Autowired
    private DisruptionRepository disruptionRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private FraudFlagRepository fraudFlagRepository;

    @Autowired
    private WorkerRepository workerRepository;

    public Claim evaluateClaim(Claim claim) {
        int totalFraudScore = 0;

        // Check 1: GPS_MISMATCH (mock — randomly set 5% of claims)
        if (Math.random() < 0.05) {
            totalFraudScore += 35;
            createFlag(claim, FlagType.GPS_MISMATCH, 35, "Mock GPS Mismatch detected");
            claim.setGpsVerified(false);
        } else {
            claim.setGpsVerified(true);
        }

        // Check 2: CLEAR_WEATHER
        // If active disruption not found for claim zone in last 2 hours
        boolean hasActiveDisruption = disruptionRepository.existsByZoneAndDisruptionTypeAndIsActiveTrueAndTriggeredAtAfter(
                claim.getDisruption().getZone(), 
                claim.getDisruption().getDisruptionType(),
                LocalDateTime.now().minusHours(2)
        );
        
        if (!hasActiveDisruption && claim.getDisruption() == null) {
            totalFraudScore += 40;
            createFlag(claim, FlagType.CLEAR_WEATHER, 40, "No active disruption found for zone");
            claim.setWeatherVerified(false);
        } else {
            claim.setWeatherVerified(true);
        }

        // Check 3: DUPLICATE_CLAIM
        boolean isDuplicate = claimRepository.existsByWorkerIdAndDisruptionZoneAndCreatedAtAfter(
                claim.getWorker().getId(),
                claim.getDisruption().getZone(),
                LocalDateTime.now().minusHours(24)
        );
        if (isDuplicate) {
            totalFraudScore += 50;
            createFlag(claim, FlagType.DUPLICATE_CLAIM, 50, "Duplicate claim within 24 hours");
        }

        // Check 4: INACTIVE_ACCOUNT
        // If worker has no policy activity in last 7 days (mock based on active policy start)
        if (claim.getPolicy().getStartDate().isBefore(LocalDateTime.now().minusDays(30).toLocalDate())) {
            totalFraudScore += 25;
            createFlag(claim, FlagType.INACTIVE_ACCOUNT, 25, "Inactive account detected");
        }

        // Check 5: HIGH_CLAIM_FREQUENCY
        Long recentClaimsCount = claimRepository.countByWorkerIdAndCreatedAtAfter(
                claim.getWorker().getId(),
                LocalDateTime.now().minusDays(7)
        );
        if (recentClaimsCount > 3) {
            totalFraudScore += 20;
            createFlag(claim, FlagType.HIGH_CLAIM_FREQUENCY, 20, "More than 3 claims in last 7 days");
        }

        claim.setFraudScore(totalFraudScore);
        claim.setActivityDropVerified(true); // default true for simulation
        
        if (totalFraudScore > 60) {
            com.gigguard.api.entities.Worker worker = claim.getWorker();
            worker.setProtectionScore(Math.max(0, worker.getProtectionScore() - 10));
            workerRepository.save(worker);
        }
        
        return claim;
    }

    private void createFlag(Claim claim, FlagType type, int score, String desc) {
        FraudFlag flag = FraudFlag.builder()
                .claim(claim)
                .flagType(type)
                .score(score)
                .description(desc)
                .build();
        fraudFlagRepository.save(flag);
    }
}

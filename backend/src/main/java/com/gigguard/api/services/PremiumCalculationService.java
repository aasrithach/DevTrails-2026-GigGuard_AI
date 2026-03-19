package com.gigguard.api.services;

import com.gigguard.api.entities.RiskScore;
import com.gigguard.api.entities.Worker;
import com.gigguard.api.enums.RiskLevel;
import com.gigguard.api.repositories.RiskScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PremiumCalculationService {

    @Autowired
    private RiskScoreRepository riskScoreRepository;

    public Double calculateWeeklyPremium(Worker worker) {
        Optional<RiskScore> riskScoreOpt = riskScoreRepository.findFirstByZoneOrderByRecordedAtDesc(worker.getZone());
        
        RiskLevel currentRiskLevel = RiskLevel.MEDIUM; // default
        if (riskScoreOpt.isPresent()) {
            currentRiskLevel = riskScoreOpt.get().getRiskLevel();
        }

        double basePremium = 35.0; // default MEDIUM
        
        if (currentRiskLevel == RiskLevel.LOW) {
            basePremium = 20.0;
        } else if (currentRiskLevel == RiskLevel.HIGH) {
            basePremium = 50.0;
        }

        if (worker.getProtectionScore() >= 80) {
            basePremium -= 5.0;
        } else if (worker.getProtectionScore() < 50) {
            basePremium += 10.0;
        }

        return basePremium;
    }
}

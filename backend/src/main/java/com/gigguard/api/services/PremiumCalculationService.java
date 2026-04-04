package com.gigguard.api.services;

import com.gigguard.api.entities.RiskScore;
import com.gigguard.api.entities.Worker;
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
        
        Double currentRiskScore = 3.5; // fallback
        if (riskScoreOpt.isPresent() && riskScoreOpt.get().getRiskScore() != null) {
            currentRiskScore = riskScoreOpt.get().getRiskScore();
        }

        return 100.0 + (currentRiskScore * 10.0);
    }
}

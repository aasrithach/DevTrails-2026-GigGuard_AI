package com.gigguard.api.services;

import com.gigguard.api.entities.Policy;
import com.gigguard.api.entities.Worker;
import com.gigguard.api.enums.AlertType;
import com.gigguard.api.enums.PolicyStatus;
import com.gigguard.api.repositories.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private AlertService alertService;
    
    @Autowired
    private PremiumCalculationService premiumCalculationService;

    @Scheduled(cron = "0 0 0 * * SUN") // Every Sunday at midnight
    public void autoRenewPolicies() {
        LocalDate today = LocalDate.now();
        List<Policy> activePolicies = policyRepository.findByStatus(PolicyStatus.ACTIVE);
        
        for (Policy policy : activePolicies) {
            // Find if policy ends today
            if (policy.getEndDate() != null && policy.getEndDate().isEqual(today)) {
                policy.setStatus(PolicyStatus.EXPIRED);
                policyRepository.save(policy);
                
                Worker worker = policy.getWorker();
                
                // Calculate new premium based on zone risk
                double newPremium = premiumCalculationService.calculateWeeklyPremium(worker);
                
                Policy newPolicy = Policy.builder()
                        .worker(worker)
                        .startDate(today)
                        .endDate(today.plusDays(7))
                        .weeklyPremium(newPremium)
                        .coverageMultiplier(0.9) // 90% coverage
                        .status(PolicyStatus.ACTIVE)
                        .build();
                policyRepository.save(newPolicy);
                
                alertService.createAlert(worker, worker.getZone(), AlertType.POLICY_UPDATED, 
                        String.format("Your weekly coverage has been renewed. New premium: ₹%.0f", newPremium));
            }
        }
    }
}

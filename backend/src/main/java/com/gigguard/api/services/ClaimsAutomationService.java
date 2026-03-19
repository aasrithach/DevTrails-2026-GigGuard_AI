package com.gigguard.api.services;

import com.gigguard.api.entities.Claim;
import com.gigguard.api.entities.Disruption;
import com.gigguard.api.entities.Policy;
import com.gigguard.api.entities.Worker;
import com.gigguard.api.enums.AlertType;
import com.gigguard.api.enums.ClaimStatus;
import com.gigguard.api.enums.PolicyStatus;
import com.gigguard.api.enums.Severity;
import com.gigguard.api.repositories.ClaimRepository;
import com.gigguard.api.repositories.PolicyRepository;
import com.gigguard.api.repositories.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClaimsAutomationService {

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private FraudDetectionService fraudDetectionService;

    @Autowired
    private PayoutSimulationService payoutSimulationService;

    @Autowired
    private AlertService alertService;

    public void processDisruption(Disruption disruption) {
        List<Worker> workers = workerRepository.findByZoneAndIsActiveTrue(disruption.getZone());
        
        for (Worker worker : workers) {
            Optional<Policy> activePolicyOpt = policyRepository.findFirstByWorkerIdAndStatusOrderByCreatedAtDesc(worker.getId(), PolicyStatus.ACTIVE);
            
            if (activePolicyOpt.isPresent()) {
                Policy policy = activePolicyOpt.get();
                
                double severityMultiplier = 0.25;
                if (disruption.getSeverity() == Severity.MEDIUM) severityMultiplier = 0.55;
                if (disruption.getSeverity() == Severity.HIGH) severityMultiplier = 0.85;

                double incomeLoss = worker.getAvgDailyIncome() * severityMultiplier;
                double claimAmount = incomeLoss * policy.getCoverageMultiplier();

                Claim claim = Claim.builder()
                        .worker(worker)
                        .policy(policy)
                        .disruption(disruption)
                        .predictedIncomeLoss(incomeLoss)
                        .claimAmount(claimAmount)
                        .status(ClaimStatus.PENDING)
                        .build();

                claim = fraudDetectionService.evaluateClaim(claim);

                if (claim.getFraudScore() < 60) {
                    claim.setStatus(ClaimStatus.APPROVED);
                    claim = claimRepository.save(claim);
                    payoutSimulationService.processPayout(claim);
                    alertService.createAlert(worker, disruption.getZone(), AlertType.CLAIM_APPROVED,
                            "Your claim of ₹" + String.format("%.0f", claim.getClaimAmount()) + " has been approved. Payout is processing.");
                } else if (claim.getFraudScore() >= 60 && claim.getFraudScore() < 80) {
                    claim.setStatus(ClaimStatus.FLAGGED);
                    claim = claimRepository.save(claim);
                    // Usually send alert to admin
                } else {
                    claim.setStatus(ClaimStatus.REJECTED);
                    claim = claimRepository.save(claim);
                    
                    worker.setProtectionScore(Math.max(0, worker.getProtectionScore() - 5));
                    workerRepository.save(worker);
                }
            }
        }
    }

    public void manualApproveClaim(Long id) {
        Claim claim = claimRepository.findById(id).orElseThrow(() -> new RuntimeException("Claim not found"));
        if (claim.getStatus() != ClaimStatus.FLAGGED) {
            throw new RuntimeException("Only flagged claims can be manually approved");
        }
        claim.setStatus(ClaimStatus.APPROVED);
        claim = claimRepository.save(claim);
        payoutSimulationService.processPayout(claim);
        alertService.createAlert(claim.getWorker(), claim.getDisruption().getZone(), AlertType.CLAIM_APPROVED,
                "Your contested claim of ₹" + String.format("%.0f", claim.getClaimAmount()) + " has been manually approved. Payout is processing.");
    }

    public void manualRejectClaim(Long id) {
        Claim claim = claimRepository.findById(id).orElseThrow(() -> new RuntimeException("Claim not found"));
        if (claim.getStatus() != ClaimStatus.FLAGGED) {
            throw new RuntimeException("Only flagged claims can be manually rejected");
        }
        claim.setStatus(ClaimStatus.REJECTED);
        claim = claimRepository.save(claim);
        
        // Penalize worker score
        Worker worker = claim.getWorker();
        worker.setProtectionScore(Math.max(0, worker.getProtectionScore() - 10)); // Steeper penalty for manual reject
        workerRepository.save(worker);
        
        alertService.createAlert(worker, claim.getDisruption().getZone(), AlertType.SYSTEM_WARNING,
                "Your recent claim was rejected after manual review due to verified fraud flags.");
    }
}

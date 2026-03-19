package com.gigguard.api.services;

import com.gigguard.api.entities.Claim;
import com.gigguard.api.entities.Payout;
import com.gigguard.api.entities.Worker;
import com.gigguard.api.enums.AlertType;
import com.gigguard.api.enums.PayoutStatus;
import com.gigguard.api.repositories.PayoutRepository;
import com.gigguard.api.repositories.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PayoutSimulationService {

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private AlertService alertService;

    @Async
    public void processPayout(Claim claim) {
        Worker worker = claim.getWorker();
        Payout payout = Payout.builder()
                .claim(claim)
                .worker(worker)
                .amount(claim.getClaimAmount())
                .upiId(worker.getPhone() + "@upi")
                .transactionId("TXN" + System.currentTimeMillis() + (int)(Math.random() * 9000 + 1000))
                .status(PayoutStatus.PROCESSING)
                .build();
        
        payoutRepository.save(payout);

        try {
            Thread.sleep(2000); // simulate delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        payout.setStatus(PayoutStatus.COMPLETED);
        payout.setProcessedAt(LocalDateTime.now());
        payoutRepository.save(payout);

        worker.setProtectionScore(Math.min(100, worker.getProtectionScore() + 2));
        workerRepository.save(worker);

        alertService.createAlert(worker, claim.getDisruption() != null ? claim.getDisruption().getZone() : worker.getZone(), 
                AlertType.PAYOUT_PROCESSED,
                "₹" + String.format("%.0f", payout.getAmount()) + " has been credited to your UPI account. Transaction ID: " + payout.getTransactionId());
    }
}

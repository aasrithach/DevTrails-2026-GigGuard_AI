package com.gigguard.api.repositories;

import com.gigguard.api.entities.Payout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.gigguard.api.enums.PayoutStatus;

public interface PayoutRepository extends JpaRepository<Payout, Long> {
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payout p WHERE p.worker.id = :workerId AND p.processedAt >= :startDate")
    Double sumAmountByWorkerAndProcessedAtAfter(@Param("workerId") Long workerId, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payout p WHERE p.processedAt >= :startDate")
    Double sumAmountByProcessedAtAfter(@Param("startDate") LocalDateTime startDate);
    
    Optional<Payout> findByClaimId(Long claimId);
    List<Payout> findByStatus(PayoutStatus status);
}

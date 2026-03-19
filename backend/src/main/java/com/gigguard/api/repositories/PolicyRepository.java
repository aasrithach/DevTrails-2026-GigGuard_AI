package com.gigguard.api.repositories;

import com.gigguard.api.entities.Policy;
import com.gigguard.api.enums.PolicyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    Optional<Policy> findFirstByWorkerIdAndStatusOrderByCreatedAtDesc(Long workerId, PolicyStatus status);
    List<Policy> findByWorkerIdOrderByCreatedAtDesc(Long workerId);
    List<Policy> findByStatus(PolicyStatus status);
    
    @Query("SELECT p FROM Policy p WHERE p.worker.zone = :zone AND p.status = :status")
    List<Policy> findByWorkerZoneAndStatus(@Param("zone") String zone, @Param("status") PolicyStatus status);

    @Query("SELECT COALESCE(SUM(p.weeklyPremium), 0) FROM Policy p WHERE p.createdAt >= :startDate")
    Double sumPremiumsCollectedSince(@Param("startDate") java.time.LocalDateTime startDate);
    
    Long countByStatus(PolicyStatus status);
}

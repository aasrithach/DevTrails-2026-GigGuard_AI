package com.gigguard.api.repositories;

import com.gigguard.api.entities.Claim;
import com.gigguard.api.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findTop5ByWorkerIdOrderByCreatedAtDesc(Long workerId);
    List<Claim> findByWorkerIdOrderByCreatedAtDesc(Long workerId);
    
    // Duplicate check
    boolean existsByWorkerIdAndDisruptionZoneAndCreatedAtAfter(Long workerId, String zone, LocalDateTime time);
    
    // High frequency
    Long countByWorkerIdAndCreatedAtAfter(Long workerId, LocalDateTime time);
    
    Long countByStatus(ClaimStatus status);

    @Query("SELECT COUNT(c) FROM Claim c WHERE c.status = :status AND c.createdAt >= :startDate")
    Long countByStatusAndCreatedAtAfter(@Param("status") ClaimStatus status, @Param("startDate") LocalDateTime startDate);
}

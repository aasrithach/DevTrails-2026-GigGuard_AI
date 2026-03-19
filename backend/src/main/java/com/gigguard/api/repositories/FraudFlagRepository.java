package com.gigguard.api.repositories;

import com.gigguard.api.entities.FraudFlag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FraudFlagRepository extends JpaRepository<FraudFlag, Long> {
    Long countByCreatedAtAfter(LocalDateTime startDate);
    List<FraudFlag> findByClaimId(Long claimId);
}

package com.gigguard.api.repositories;

import com.gigguard.api.entities.RiskScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RiskScoreRepository extends JpaRepository<RiskScore, Long> {
    Optional<RiskScore> findFirstByZoneOrderByRecordedAtDesc(String zone);
}

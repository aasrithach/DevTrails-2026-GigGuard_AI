package com.gigguard.api.repositories;

import com.gigguard.api.entities.Disruption;
import com.gigguard.api.enums.DisruptionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface DisruptionRepository extends JpaRepository<Disruption, Long> {
    List<Disruption> findByIsActiveTrue();
    Long countByIsActiveTrue();
    boolean existsByZoneAndDisruptionTypeAndIsActiveTrueAndTriggeredAtAfter(String zone, DisruptionType type, LocalDateTime time);
    List<Disruption> findByTriggeredAtAfter(LocalDateTime time);
}

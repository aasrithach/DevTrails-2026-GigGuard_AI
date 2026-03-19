package com.gigguard.api.repositories;

import com.gigguard.api.entities.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findTop20ByWorkerIdOrderByCreatedAtDesc(Long workerId);
    List<Alert> findTop10ByWorkerIdOrderByCreatedAtDesc(Long workerId);
    List<Alert> findTop5ByWorkerIdAndIsReadFalseOrderByCreatedAtDesc(Long workerId);
}

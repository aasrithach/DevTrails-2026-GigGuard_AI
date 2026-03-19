package com.gigguard.api.repositories;

import com.gigguard.api.entities.Worker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByPhone(String phone);
    Optional<Worker> findByEmail(String email);
    List<Worker> findByZoneAndIsActiveTrue(String zone);
    List<Worker> findByIsActiveTrue();
}

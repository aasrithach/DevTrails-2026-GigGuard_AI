package com.gigguard.api.controllers;

import com.gigguard.api.entities.Alert;
import com.gigguard.api.dto.ApiResponse;
import com.gigguard.api.repositories.AlertRepository;
import com.gigguard.api.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping("/my-alerts")
    public ResponseEntity<ApiResponse<Iterable<Alert>>> getMyAlerts(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(alertRepository.findTop20ByWorkerIdOrderByCreatedAtDesc(userDetails.getId()), "Alerts retrieved"));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<Iterable<Alert>>> getLatestUnread(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(alertRepository.findTop5ByWorkerIdAndIsReadFalseOrderByCreatedAtDesc(userDetails.getId()), "Latest alerts retrieved"));
    }

    @PutMapping("/mark-read/{id}")
    public ResponseEntity<ApiResponse<Alert>> markAsRead(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Alert alert = alertRepository.findById(id).orElse(null);
        if (alert == null || !alert.getWorker().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(404).body(ApiResponse.error("Alert not found"));
        }
        alert.setIsRead(true);
        alertRepository.save(alert);
        return ResponseEntity.ok(ApiResponse.success(alert, "Alert marked as read"));
    }
}

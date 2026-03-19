package com.gigguard.api.entities;

import com.gigguard.api.enums.Platform;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String phone;

    @Column(unique = true)
    private String email;

    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Platform platform;

    private String zone;

    @Builder.Default
    private String city = "Hyderabad";

    private Double avgDailyIncome;

    @Builder.Default
    @Column(columnDefinition = "integer default 70")
    private Integer protectionScore = 70;

    @Builder.Default
    @Column(columnDefinition = "boolean default true")
    private Boolean isActive = true;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

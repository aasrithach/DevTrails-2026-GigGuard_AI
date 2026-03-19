package com.gigguard.api.entities;

import com.gigguard.api.enums.DisruptionType;
import com.gigguard.api.enums.Severity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Disruption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String zone;

    @Enumerated(EnumType.STRING)
    private DisruptionType disruptionType;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    private String description;
    
    private Boolean isActive;
    
    private LocalDateTime triggeredAt;
    
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        if (triggeredAt == null) {
            triggeredAt = LocalDateTime.now();
        }
    }
}

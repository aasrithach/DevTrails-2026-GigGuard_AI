package com.gigguard.api.entities;

import com.gigguard.api.enums.AdminRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String passwordHash;

    private String email;

    @Enumerated(EnumType.STRING)
    private AdminRole role;
}

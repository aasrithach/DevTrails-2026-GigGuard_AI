package com.gigguard.api.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String phone; // or username for admin
    private String password;
}

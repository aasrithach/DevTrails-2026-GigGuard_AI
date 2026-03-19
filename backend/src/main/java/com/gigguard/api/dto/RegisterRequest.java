package com.gigguard.api.dto;

import com.gigguard.api.enums.Platform;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String phone;
    private String email;
    private String password;
    private Platform platform;
    private String zone;
    private Double avgDailyIncome;
}

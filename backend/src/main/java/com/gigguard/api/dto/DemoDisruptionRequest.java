package com.gigguard.api.dto;

import com.gigguard.api.enums.DisruptionType;
import com.gigguard.api.enums.Severity;
import lombok.Data;

@Data
public class DemoDisruptionRequest {
    private String zone;
    private DisruptionType disruptionType;
    private Severity severity;
}

package com.gigguard.api.dto;

import lombok.Data;

@Data
public class WeatherOverrideRequest {
    private String zone;
    private Double rainfall;
    private Integer aqi;
    private Double temp;
    private Double traffic;
}

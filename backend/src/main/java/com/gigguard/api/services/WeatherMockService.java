package com.gigguard.api.services;

import com.gigguard.api.dto.WeatherOverrideRequest;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WeatherMockService {

    private final Map<String, WeatherData> weatherDataMap = new HashMap<>();

    @PostConstruct
    public void init() {
        weatherDataMap.put("Kondapur", new WeatherData(65.0, 145, 38.0, 60.0, 0.45));
        weatherDataMap.put("Miyapur", new WeatherData(78.0, 162, 39.0, 72.0, 0.55));
        weatherDataMap.put("Hitech City", new WeatherData(42.0, 120, 37.0, 85.0, 0.30));
        weatherDataMap.put("Gachibowli", new WeatherData(55.0, 135, 38.0, 70.0, 0.38));
        weatherDataMap.put("Madhapur", new WeatherData(48.0, 128, 37.0, 78.0, 0.33));
        weatherDataMap.put("LB Nagar", new WeatherData(81.0, 178, 40.0, 65.0, 0.62));
        weatherDataMap.put("Kukatpally", new WeatherData(70.0, 155, 39.0, 68.0, 0.50));
        weatherDataMap.put("Ameerpet", new WeatherData(58.0, 142, 38.0, 82.0, 0.40));
        weatherDataMap.put("Dilsukhnagar", new WeatherData(75.0, 168, 40.0, 58.0, 0.58));
        weatherDataMap.put("Secunderabad", new WeatherData(52.0, 138, 37.0, 74.0, 0.36));
    }

    public WeatherData getWeatherForZone(String zone) {
        return weatherDataMap.getOrDefault(zone, new WeatherData(50.0, 100, 35.0, 50.0, 0.30));
    }

    public void overrideWeather(WeatherOverrideRequest request) {
        if (weatherDataMap.containsKey(request.getZone())) {
            WeatherData data = weatherDataMap.get(request.getZone());
            if (request.getRainfall() != null) data.setRainfallProbability(request.getRainfall());
            if (request.getAqi() != null) data.setAqiLevel(request.getAqi());
            if (request.getTemp() != null) data.setTemperature(request.getTemp());
            if (request.getTraffic() != null) data.setTrafficIndex(request.getTraffic());
        }
    }

    @Data
    @AllArgsConstructor
    public static class WeatherData {
        private Double rainfallProbability;
        private Integer aqiLevel;
        private Double temperature;
        private Double trafficIndex;
        private Double historicalRate;
    }
}

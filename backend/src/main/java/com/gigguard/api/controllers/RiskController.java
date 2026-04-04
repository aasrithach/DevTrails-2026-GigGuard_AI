package com.gigguard.api.controllers;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/risk")
@CrossOrigin
public class RiskController {

    public static ConcurrentHashMap<String, ZoneRiskData> zoneStore = new ConcurrentHashMap<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ZoneRiskData {
        private String zoneName;
        private int rainfall;
        private int aqi;
        private int traffic;
        private int historicalDisruption;
        private int riskScore;
        private String premiumTier;
        private int weeklyPremium;
    }

    @PostConstruct
    public void init() {
        zoneStore.put("Kondapur", ZoneRiskData.builder().zoneName("Kondapur").rainfall(72).aqi(160).traffic(65).historicalDisruption(7).build());
        zoneStore.put("Madhapur", ZoneRiskData.builder().zoneName("Madhapur").rainfall(45).aqi(120).traffic(50).historicalDisruption(4).build());
        zoneStore.put("Gachibowli", ZoneRiskData.builder().zoneName("Gachibowli").rainfall(30).aqi(90).traffic(40).historicalDisruption(2).build());

        recompute("Kondapur");
        recompute("Madhapur");
        recompute("Gachibowli");
    }

    private void recompute(String zone) {
        ZoneRiskData data = zoneStore.get(zone);
        if (data == null) return;

        // Formula: ((0.40 × rainfall/100.0) + (0.25 × AQI/500.0) + (0.20 × traffic/100.0) + (0.15 × historicalDisruption/10.0)) × 100
        double score = ((0.40 * data.getRainfall() / 100.0) +
                        (0.25 * data.getAqi() / 500.0) +
                        (0.20 * data.getTraffic() / 100.0) +
                        (0.15 * data.getHistoricalDisruption() / 10.0)) * 100.0;
        
        int riskScore = (int) Math.round(score);
        if (riskScore < 0) riskScore = 0;
        if (riskScore > 100) riskScore = 100;

        data.setRiskScore(riskScore);

        // Tiering: 0–39 = LOW (₹20), 40–69 = MEDIUM (₹35), 70–100 = HIGH (₹50)
        if (riskScore < 40) {
            data.setPremiumTier("LOW");
            data.setWeeklyPremium(20);
        } else if (riskScore < 70) {
            data.setPremiumTier("MEDIUM");
            data.setWeeklyPremium(35);
        } else {
            data.setPremiumTier("HIGH");
            data.setWeeklyPremium(50);
        }
    }

    @GetMapping("/zones")
    public ResponseEntity<List<ZoneRiskData>> getZones() {
        return ResponseEntity.ok(new ArrayList<>(zoneStore.values()));
    }

    @GetMapping("/zones/{zone}")
    public ResponseEntity<ZoneRiskData> getZone(@PathVariable String zone) {
        ZoneRiskData data = zoneStore.get(zone);
        if (data == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(data);
    }

    @PostMapping("/zones/{zone}/spike")
    public ResponseEntity<ZoneRiskData> spike(@PathVariable String zone) {
        spikeZoneRisk(zone);
        ZoneRiskData data = zoneStore.get(zone);
        if (data == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(data);
    }

    public void spikeZoneRisk(String zone) {
        ZoneRiskData data = zoneStore.get(zone);
        if (data != null) {
            // Increase rainfall by 20 clamped at 100, increase AQI by 40 clamped at 500
            data.setRainfall(Math.min(100, data.getRainfall() + 20));
            data.setAqi(Math.min(500, data.getAqi() + 40));
            recompute(zone);
            zoneStore.put(zone, data);
        }
    }
}

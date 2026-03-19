package com.gigguard.api.config;

import com.gigguard.api.entities.*;
import com.gigguard.api.enums.*;
import com.gigguard.api.repositories.*;
import com.gigguard.api.services.PremiumCalculationService;
import com.gigguard.api.services.RiskAssessmentService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private WorkerRepository workerRepository;
    @Autowired
    private PolicyRepository policyRepository;
    @Autowired
    private DisruptionRepository disruptionRepository;
    @Autowired
    private ClaimRepository claimRepository;
    @Autowired
    private AlertRepository alertRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private RiskAssessmentService riskAssessmentService;
    @Autowired
    private PremiumCalculationService premiumCalculationService;

    @PostConstruct
    public void seedData() {
        if (adminRepository.count() == 0) {
            setupDemoData();
        }
    }

    private void setupDemoData() {
        // Admin
        Admin admin = Admin.builder()
                .username("admin")
                .passwordHash(encoder.encode("admin123"))
                .email("admin@gigguard.com")
                .role(AdminRole.SUPER_ADMIN)
                .build();
        adminRepository.save(admin);

        riskAssessmentService.assessAllZones();

        String defaultPass = encoder.encode("worker123");

        // 10 Workers
        List<Worker> workers = Arrays.asList(
                Worker.builder().name("Ravi Kumar").phone("9876543210").email("ravi@example.com").passwordHash(defaultPass).platform(Platform.ZEPTO).zone("Kondapur").avgDailyIncome(900.0).protectionScore(82).build(),
                Worker.builder().name("Priya Singh").phone("9876543211").email("priya@example.com").passwordHash(defaultPass).platform(Platform.BLINKIT).zone("Miyapur").avgDailyIncome(750.0).protectionScore(71).build(),
                Worker.builder().name("Mohammed Ali").phone("9876543212").email("ali@example.com").passwordHash(defaultPass).platform(Platform.SWIGGY_INSTAMART).zone("LB Nagar").avgDailyIncome(820.0).protectionScore(65).build(),
                Worker.builder().name("Sunita Devi").phone("9876543213").email("sunita@example.com").passwordHash(defaultPass).platform(Platform.ZOMATO).zone("Hitech City").avgDailyIncome(1100.0).protectionScore(88).build(),
                Worker.builder().name("Kiran Reddy").phone("9876543214").email("kiran@example.com").passwordHash(defaultPass).platform(Platform.AMAZON).zone("Gachibowli").avgDailyIncome(950.0).protectionScore(74).build(),
                Worker.builder().name("Anjali Verma").phone("9876543215").email("anjali@example.com").passwordHash(defaultPass).platform(Platform.ZEPTO).zone("Kukatpally").avgDailyIncome(680.0).protectionScore(59).build(),
                Worker.builder().name("Venkat Rao").phone("9876543216").email("venkat@example.com").passwordHash(defaultPass).platform(Platform.BLINKIT).zone("Ameerpet").avgDailyIncome(760.0).protectionScore(77).build(),
                Worker.builder().name("Deepa Nair").phone("9876543217").email("deepa@example.com").passwordHash(defaultPass).platform(Platform.SWIGGY_INSTAMART).zone("Dilsukhnagar").avgDailyIncome(840.0).protectionScore(63).build(),
                Worker.builder().name("Arjun Sharma").phone("9876543218").email("arjun@example.com").passwordHash(defaultPass).platform(Platform.ZOMATO).zone("Secunderabad").avgDailyIncome(920.0).protectionScore(85).build(),
                Worker.builder().name("Fatima Begum").phone("9876543219").email("fatima@example.com").passwordHash(defaultPass).platform(Platform.AMAZON).zone("Madhapur").avgDailyIncome(780.0).protectionScore(70).build()
        );
        workerRepository.saveAll(workers);

        // Policies for workers
        for (Worker w : workers) {
            Policy p = Policy.builder()
                    .worker(w)
                    .startDate(LocalDate.now().minusDays(2))
                    .endDate(LocalDate.now().plusDays(5))
                    .weeklyPremium(premiumCalculationService.calculateWeeklyPremium(w))
                    .riskLevel(RiskLevel.MEDIUM)
                    .status(PolicyStatus.ACTIVE)
                    .build();
            policyRepository.save(p);
            
            // Seed a welcome alert
            Alert a = Alert.builder().worker(w).zone(w.getZone()).alertType(AlertType.COVERAGE_ACTIVATED)
                    .message("Welcome to GigGuard! Your coverage is active.").build();
            alertRepository.save(a);
        }

        // Active Disruptions
        Disruption d1 = Disruption.builder().zone("Miyapur").disruptionType(DisruptionType.RAIN).severity(Severity.HIGH).description("Heavy rainfall expected").isActive(true).triggeredAt(LocalDateTime.now().minusMinutes(30)).build();
        Disruption d2 = Disruption.builder().zone("LB Nagar").disruptionType(DisruptionType.AQI).severity(Severity.MEDIUM).description("Poor air quality").isActive(true).triggeredAt(LocalDateTime.now().minusHours(1)).build();
        Disruption d3 = Disruption.builder().zone("Ameerpet").disruptionType(DisruptionType.TRAFFIC).severity(Severity.LOW).description("Moderate traffic jam").isActive(true).triggeredAt(LocalDateTime.now().minusMinutes(45)).build();
        disruptionRepository.saveAll(Arrays.asList(d1, d2, d3));
    }
}

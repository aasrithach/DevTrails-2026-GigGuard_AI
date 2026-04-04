package com.gigguard.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;

import com.gigguard.api.entities.Admin;
import com.gigguard.api.enums.AdminRole;
import com.gigguard.api.repositories.AdminRepository;
import com.gigguard.api.services.RiskAssessmentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class GigGuardApplication {

	public static void main(String[] args) {
		SpringApplication.run(GigGuardApplication.class, args);
	}

	@Bean
	CommandLineRunner init(AdminRepository adminRepository, 
						  RiskAssessmentService riskAssessmentService,
						  PasswordEncoder passwordEncoder) {
		return args -> {
			if (adminRepository.findByUsername("admin").isEmpty()) {
				Admin admin = Admin.builder()
						.username("admin")
						.passwordHash(passwordEncoder.encode("admin"))
						.email("admin@gigguard.ai")
						.role(AdminRole.SUPER_ADMIN)
						.build();
				adminRepository.save(admin);
				System.out.println(">>> Demo Admin seeded: admin / admin");
			}
			
			riskAssessmentService.assessAllZones();
			System.out.println(">>> Risk assessment data seeded for all zones");
		};
	}
}

package com.gigguard.api.controllers;

import com.gigguard.api.dto.AuthRequest;
import com.gigguard.api.dto.AuthResponse;
import com.gigguard.api.dto.RegisterRequest;
import com.gigguard.api.dto.ApiResponse;
import com.gigguard.api.entities.Admin;
import com.gigguard.api.entities.Worker;
import com.gigguard.api.repositories.AdminRepository;
import com.gigguard.api.repositories.WorkerRepository;
import com.gigguard.api.security.JwtUtils;
import com.gigguard.api.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateWorker(@RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getPhone(), loginRequest.getPassword()));

        return buildAuthResp(authentication);
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateAdmin(@RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getPhone(), loginRequest.getPassword()));

        return buildAuthResp(authentication);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerWorker(@RequestBody RegisterRequest signUpRequest) {
        if (workerRepository.findByPhone(signUpRequest.getPhone()).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error: Phone number is already in use!"));
        }

        Worker worker = Worker.builder()
                .name(signUpRequest.getName())
                .phone(signUpRequest.getPhone())
                .email(signUpRequest.getEmail())
                .passwordHash(encoder.encode(signUpRequest.getPassword()))
                .platform(signUpRequest.getPlatform())
                .zone(signUpRequest.getZone())
                .avgDailyIncome(signUpRequest.getAvgDailyIncome())
                .build();

        workerRepository.save(worker);
        
        // Auto authenticate after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signUpRequest.getPhone(), signUpRequest.getPassword()));

        return buildAuthResp(authentication);
    }
    
    private ResponseEntity<ApiResponse<AuthResponse>> buildAuthResp(Authentication authentication) {
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.isWorker() ? "WORKER" : userDetails.getAuthorities().iterator().next().getAuthority();

        AuthResponse resp = AuthResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .name(userDetails.getUsername())
                .role(role)
                .build();
        return ResponseEntity.ok(ApiResponse.success(resp, "Authentication successful"));
    }
}

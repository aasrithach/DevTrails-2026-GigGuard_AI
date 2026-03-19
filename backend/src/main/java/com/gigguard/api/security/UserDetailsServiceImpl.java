package com.gigguard.api.security;

import com.gigguard.api.entities.Admin;
import com.gigguard.api.entities.Worker;
import com.gigguard.api.repositories.AdminRepository;
import com.gigguard.api.repositories.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to load as Admin first
        Optional<Admin> admin = adminRepository.findByUsername(username);
        if (admin.isPresent()) {
            return UserDetailsImpl.buildAdmin(admin.get());
        }

        // Try to load as Worker (username = phone)
        Worker worker = workerRepository.findByPhone(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with phone or username: " + username));
        
        return UserDetailsImpl.buildWorker(worker);
    }
}

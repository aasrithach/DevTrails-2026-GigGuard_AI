package com.gigguard.api.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gigguard.api.entities.Admin;
import com.gigguard.api.entities.Worker;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@AllArgsConstructor
@Getter
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String username;
    
    @JsonIgnore
    private String password;
    
    private Collection<? extends GrantedAuthority> authorities;
    
    private boolean isWorker;

    public static UserDetailsImpl buildWorker(Worker worker) {
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_WORKER"));
        return new UserDetailsImpl(
                worker.getId(),
                worker.getPhone(),
                worker.getPasswordHash(),
                authorities,
                true);
    }

    public static UserDetailsImpl buildAdmin(Admin admin) {
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + admin.getRole().name()));
        return new UserDetailsImpl(
                admin.getId(),
                admin.getUsername(),
                admin.getPasswordHash(),
                authorities,
                false);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

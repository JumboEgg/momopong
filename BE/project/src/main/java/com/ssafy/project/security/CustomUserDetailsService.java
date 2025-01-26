package com.ssafy.project.security;

import com.ssafy.project.domain.Parent;
import com.ssafy.project.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final ParentRepository parentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return parentRepository.findByEmail(username)
                .map(this::createUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("해당 회원을 찾을 수 없습니다"));
    }

    private UserDetails createUserDetails(Parent parent) {
        return User.builder()
                .username(parent.getEmail())
                .password(parent.getPassword())
                .roles(parent.getRole().toString())
                .build();
    }
}

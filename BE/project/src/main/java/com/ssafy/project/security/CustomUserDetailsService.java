package com.ssafy.project.security;

import com.ssafy.project.domain.Parent;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final ParentRepository parentRepository;
    // 로그인 시
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Parent parent = parentRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("해당 사용자를 찾을 수 없습니다"));

        // 논리적 삭제된 경우
        if (parent.isDeleted())
            throw new DisabledException("탈퇴한 계정은 로그인이 불가능합니다");

        return createUserDetails(parent);
    }
    // 비밀번호 검증
    private UserDetails createUserDetails(Parent parent) {
        return User.builder()
                .username(parent.getEmail())
                .password(parent.getPassword())
                .roles(parent.getRole().toString())
                .build();
    }
}

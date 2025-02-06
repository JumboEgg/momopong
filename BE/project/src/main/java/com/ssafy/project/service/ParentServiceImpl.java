package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Parent;
import com.ssafy.project.dto.ChildListDto;
import com.ssafy.project.dto.LoginRequestDto;
import com.ssafy.project.dto.ParentDto;
import com.ssafy.project.dto.ParentSignUpRequestDto;
import com.ssafy.project.exception.DuplicateException;
import com.ssafy.project.exception.InvalidTokenException;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.repository.ParentRepository;
import com.ssafy.project.security.JwtToken;
import com.ssafy.project.security.JwtTokenProvider;
import com.ssafy.project.security.TokenBlacklistService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ParentServiceImpl implements ParentService {

    private final ParentRepository parentRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final TokenBlacklistService tokenBlacklistService;
    private final ChildService childService;
    // 부모 회원가입
    @Override
    public Long signup(ParentSignUpRequestDto signUpDto) {
        if (checkDuplicateParent(signUpDto.getEmail()))
            throw new DuplicateException("이미 사용중인 이메일입니다");

        // 암호화된 비밀번호 저장
        String encodedPassword = passwordEncoder.encode(signUpDto.getPassword());
        Parent parent = Parent.builder()
                .email(signUpDto.getEmail())
                .password(encodedPassword)
                .name(signUpDto.getName())
                .phone(signUpDto.getPhone())
                .role(signUpDto.getRole())
                .build();

        Parent savedParent = parentRepository.save(parent);
        return savedParent.getId();
    }

    @Override
    public boolean checkDuplicateParent(String email) {
        // 중복 이메일 체크
        return parentRepository.findByEmail(email).isPresent();
    }

    @Override
    public JwtToken login(LoginRequestDto loginDto) {
        // Authentication 객체 생성
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword());

        // Parent에 대해 검증 - 이메일, 비밀번호 확인
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 인증 정보를 기반으로 JWT 토큰 생성
        return jwtTokenProvider.generateTokenWithAuthentication(authentication);
    }

    @Override
    public ParentDto readParentById(Long parentId) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new UserNotFoundException("부모 사용자를 찾을 수 없습니다"));

        return parent.entityToDto();
    }

    @Override
    public ParentDto readParentByEmail(String email) {
        Parent parent = parentRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("부모 사용자를 찾을 수 없습니다"));

        return parent.entityToDto();
    }

    @Override
    public JwtToken checkRefreshToken(String accessToken, String refreshToken) {
        // Refresh Token이 유효하지 않은 경우
        if (refreshToken == null || !jwtTokenProvider.validateRefreshToken(refreshToken))
            throw new InvalidTokenException("유효하지 않은 Refresh Token입니다");

        // Access Token이 유효하지 않은 경우 (null이거나 블랙리스트에 존재함)
        if (accessToken == null || tokenBlacklistService.isBlacklisted(accessToken))
            throw new InvalidTokenException("유효하지 않은 Access Token입니다");

        // 블랙리스트에 이전 accessToken 넣기
        tokenBlacklistService.addBlacklist(accessToken);

        // Access Token & Refresh Token 재발급
        String userNameFromToken = jwtTokenProvider.getEmailFromToken(refreshToken);
        return jwtTokenProvider.generateTokenWithRefreshToken(userNameFromToken);
    }

    @Override
    public ParentDto updateParent(Long parentId, ParentDto parentDto) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new UserNotFoundException("부모 사용자를 찾을 수 없습니다"));

        parent.updateParent(parentDto.getName(), parentDto.getPhone());
        return parent.entityToDto();
    }

    @Override
    public List<ChildListDto> childrenList(Long parentId) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new UserNotFoundException("부모 사용자를 찾을 수 없습니다"));

        List<Child> children = parent.getChildren();
        return children.stream()
                .map(child -> ChildListDto.builder()
                        .childId(child.getId())
                        .name(child.getName())
                        .profile(child.getProfile())
                        .build())
                .collect(Collectors.toList());
    }
    @Override
    public void deleteParent(Long parentId) {
        // 논리적 삭제
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new UserNotFoundException("부모 사용자를 찾을 수 없습니다"));

        // 이렇게 하면 N + 1 문제 발생한다고 함
        for (Child child : parent.getChildren()) {
            childService.deleteChild(child.getId());
        }

        parent.deleteParent();
    }

    @Override
    public void logout(String accessToken, String email) {
        jwtTokenProvider.deleteRefreshToken(email);
        tokenBlacklistService.addBlacklist(accessToken);
    }
}

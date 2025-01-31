package com.ssafy.project.controller;

import com.ssafy.project.dto.*;
import com.ssafy.project.security.JwtToken;
import com.ssafy.project.service.ParentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/parents")
public class ParentController {

    private final ParentService parentService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signup(@Valid @RequestBody ParentSignUpRequestDto signUpDto) {
        Long saved = parentService.signup(signUpDto);
        SignUpResponseDto responseDto = new SignUpResponseDto(saved);

        return ResponseEntity.ok(responseDto);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginDto) {
        JwtToken jwtToken = parentService.login(loginDto);
        ParentDto parentDto = parentService.readParentByEmail(loginDto.getEmail());

        LoginResponseDto responseDto = new LoginResponseDto(parentDto, jwtToken);

        return ResponseEntity.ok(responseDto);
    }

    // Refresh Token 재발급
    @PostMapping("/refresh-token")
    public ResponseEntity<JwtToken> refreshToken(@RequestHeader("Access-Token") String accessToken, @RequestHeader("Refresh-Token") String refreshToken) {
        JwtToken jwtToken = parentService.checkRefreshToken(accessToken, refreshToken);
        return ResponseEntity.ok(jwtToken);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Refresh-Token") String refreshToken) {
        parentService.logout(refreshToken);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 회원 조회
    @GetMapping("/{parentId}")
    public ResponseEntity<ParentDto> readParent(@PathVariable("parentId") Long parentId) {
        ParentDto parentDto = parentService.readParentById(parentId);

        return ResponseEntity.ok(parentDto);
    }

    // 회원 정보 수정
    @PatchMapping("/{parentId}")
    public ResponseEntity<ParentDto> updateParent(@PathVariable("parentId") Long parentId, @RequestBody ParentDto parentDto) {
        if (!parentId.equals(parentDto.getParentId()))
            throw new IllegalArgumentException("본인 정보만 수정할 수 있습니다");

        ParentDto updateParent = parentService.updateParent(parentId, parentDto);
        return ResponseEntity.ok(updateParent);
    }

    // 회원 탈퇴
    @DeleteMapping("/{parentId}")
    public ResponseEntity<Void> deleteParent(@PathVariable("parentId") Long parentId) {
        parentService.deleteParent(parentId);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}

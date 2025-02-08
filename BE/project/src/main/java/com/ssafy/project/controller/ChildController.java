package com.ssafy.project.controller;

import com.ssafy.project.dto.*;
import com.ssafy.project.service.ChildService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/children")
public class ChildController {

    private final ChildService childService;

    // 자식 계정 생성
    @PreAuthorize("hasRole('PARENT')")
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signUp(@RequestBody ChildSignUpRequestDto signUpRequestDto) {
        Long saved = childService.signUp(signUpRequestDto);
        SignUpResponseDto responseDto = new SignUpResponseDto(saved);
        return ResponseEntity.ok(responseDto);
    }

    // 자식 계정 로그인
    @PreAuthorize("hasRole('PARENT')")
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> map) {
        Long childId = Long.parseLong(map.get("childId"));
        Map<String, Object> childMap = childService.login(childId);

        return ResponseEntity.ok(childMap);
    }

    // 자식 계정 로그아웃
    @PreAuthorize("hasRole('PARENT')")
//    @PreAuthorize("hasRole('CHILD')")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorization, @RequestBody Map<String, String> map) {
        Long childId = Long.parseLong(map.get("childId"));
        childService.logout(authorization, childId);

        return ResponseEntity.ok().build();
    }

    // 자식 정보 조회
    @PreAuthorize("hasRole('CHILD')")
    @GetMapping("/{childId}")
    public ResponseEntity<ChildDto> findChild(@PathVariable("childId") Long childId) {
        ChildDto childDto = childService.findChild(childId);

        return ResponseEntity.ok(childDto);
    }

    // 자식 회원 정보 수정
    @PreAuthorize("hasRole('CHILD')")
    @PatchMapping("/{childId}")
    public ResponseEntity<ChildDto> updateChild(@PathVariable("childId") Long childId, @RequestBody ChildUpdateRequestDto updateRequestDto) {
        if (!childId.equals(updateRequestDto.getChildId()))
            throw new IllegalArgumentException("본인 정보만 수정할 수 있습니다");

        ChildDto updateChild = childService.updateChild(childId, updateRequestDto);
        return ResponseEntity.ok(updateChild);
    }

    // 자식 삭제
    @PreAuthorize("hasRole('CHILD')")
    @DeleteMapping("/{childId}")
    public ResponseEntity<Void> deleteChild(@PathVariable("childId") Long childId) {
        childService.deleteChild(childId);

        return ResponseEntity.ok().build();
    }

    // Presigned URL - GEt
    @GetMapping("/presigned-url")
    public ResponseEntity<FileDto> getPresignedUrl() {
        FileDto presignedUrl = childService.getPresignedUrl();

        return ResponseEntity.ok(presignedUrl);
    }
}

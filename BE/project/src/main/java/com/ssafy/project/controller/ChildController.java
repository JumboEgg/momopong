package com.ssafy.project.controller;

import com.ssafy.project.dto.ChildDto;
import com.ssafy.project.dto.ChildSignUpRequestDto;
import com.ssafy.project.dto.ChildUpdateRequestDto;
import com.ssafy.project.dto.SignUpResponseDto;
import com.ssafy.project.service.ChildService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/children")
public class ChildController {

    private final ChildService childService;

    // 자식 계정 생성
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signUp(@RequestBody ChildSignUpRequestDto signUpRequestDto) {
        Long saved = childService.signUp(signUpRequestDto);
        SignUpResponseDto responseDto = new SignUpResponseDto(saved);
        return ResponseEntity.ok(responseDto);
    }

    // 자식 계정 로그인
    @PostMapping("/login")
    public ResponseEntity<ChildDto> login(@RequestBody Map<String, String> map) {
        Long childId = Long.parseLong(map.get("childId"));
        ChildDto childDto = childService.login(childId);

        return ResponseEntity.ok(childDto);
    }

    // 자식 계정 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> map) {
        Long childId = Long.parseLong(map.get("childId"));
        childService.logout(childId);

        return ResponseEntity.ok().build();
    }

    // 자식 정보 조회
    @GetMapping("/{childId}")
    public ResponseEntity<ChildDto> findChild(@PathVariable("childId") Long childId) {
        ChildDto childDto = childService.findChild(childId);

        return ResponseEntity.ok(childDto);
    }

    // 자식 회원 정보 수정
    @PatchMapping("/{childId}")
    public ResponseEntity<ChildDto> updateChild(@PathVariable("childId") Long childId, @RequestBody ChildUpdateRequestDto updateRequestDto) {
        if (!childId.equals(updateRequestDto.getChildId()))
            throw new IllegalArgumentException("본인 정보만 수정할 수 있습니다");

        ChildDto updateChild = childService.updateChild(childId, updateRequestDto);
        return ResponseEntity.ok(updateChild);
    }

    // 자식 삭제
    @DeleteMapping("/{childId}")
    public ResponseEntity<Void> deleteChild(@PathVariable("childId") Long childId) {
        childService.deleteChild(childId);

        return ResponseEntity.ok().build();
    }
}

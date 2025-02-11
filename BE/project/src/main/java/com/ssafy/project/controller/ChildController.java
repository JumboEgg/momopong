package com.ssafy.project.controller;

import com.ssafy.project.dto.*;
import com.ssafy.project.service.ChildService;
import com.ssafy.project.service.PresignedUrlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/children")
@Tag(name = "자식 컨트롤러")
public class ChildController {
    private final PresignedUrlService presignedUrlService;
    private final ChildService childService;

    // 자식 계정 생성
    @Operation(summary = "자식 계정 생성", description = "부모가 자식 계정을 생성한다. 부모의 Access Token이 필요하다.")
    @PreAuthorize("hasRole('PARENT')")
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signUp(@RequestBody ChildSignUpRequestDto signUpRequestDto) {
        Long saved = childService.signUp(signUpRequestDto);
        SignUpResponseDto responseDto = new SignUpResponseDto(saved);
        return ResponseEntity.ok(responseDto);
    }

    // 자식 계정 로그인
    @Operation(summary = "자식 계정 로그인", description = "자식 계정으로 로그인한다. 부모의 Access Token이 필요하다.")
    @PreAuthorize("hasRole('PARENT')")
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody ChildIdDto childIdDto) {
        Long childId = childIdDto.getChildId();
        Map<String, Object> childMap = childService.login(childId);

        return ResponseEntity.ok(childMap);
    }

    // 자식 계정 로그아웃
    @Operation(summary = "자식 계정 로그아웃", description = "자식 계정으로 로그아웃한다. 부모의 Access Token이 필요하다.")
    @PreAuthorize("hasRole('PARENT')")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorization, @RequestBody ChildIdDto childIdDto) {
        Long childId = childIdDto.getChildId();
        childService.logout(authorization, childId);

        return ResponseEntity.ok().build();
    }

    // 자식 정보 조회
    @Operation(summary = "자식 정보 조회", description = "자식 정보를 조회한다.")
    @PreAuthorize("hasRole('CHILD')")
    @GetMapping("/{childId}")
    public ResponseEntity<ChildDto> findChild(@PathVariable("childId") Long childId) {
        ChildDto childDto = childService.findChild(childId);

        return ResponseEntity.ok(childDto);
    }

    // 자식 회원 정보 수정
    @Operation(summary = "자식 회원 정보 수정", description = "자식 회원 정보를 수정한다. 이름과 프로필만 변경할 수 있다.")
    @PreAuthorize("hasRole('CHILD')")
    @PatchMapping("/{childId}")
    public ResponseEntity<ChildDto> updateChild(@PathVariable("childId") Long childId, @RequestBody ChildUpdateRequestDto updateRequestDto) {
        if (!childId.equals(updateRequestDto.getChildId()))
            throw new IllegalArgumentException("본인 정보만 수정할 수 있습니다");

        ChildDto updateChild = childService.updateChild(childId, updateRequestDto);
        return ResponseEntity.ok(updateChild);
    }

    // 자식 삭제
    @Operation(summary = "자식 계정 삭제", description = "자식 계정을 삭제한다. 부모의 Access Token이 필요하다.")
    @PreAuthorize("hasRole('PARENT')")
    @DeleteMapping("/{childId}")
    public ResponseEntity<Void> deleteChild(@PathVariable("childId") Long childId) {
        childService.deleteChild(childId);

        return ResponseEntity.ok().build();
    }

    // Presigned URL - PUT
    @Operation(summary = "Presigned URL 얻기", description = "S3 Presigned URL을 얻는다.")
    @GetMapping("/presigned-url")
    public ResponseEntity<FileDto> getPresignedUrl() {
        FileDto presignedUrl = presignedUrlService.getPresignedUrl("profile", "webp");

        return ResponseEntity.ok(presignedUrl);
    }
}

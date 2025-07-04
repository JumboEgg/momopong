package com.ssafy.project.controller;

import com.ssafy.project.dto.user.*;
import com.ssafy.project.security.JwtToken;
import com.ssafy.project.service.ParentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "부모 컨트롤러")
@RequiredArgsConstructor
@RequestMapping("/api/parents")
public class ParentController {

    private final ParentService parentService;

    // 회원가입
    @Operation(summary = "부모 회원가입",
            responses = {
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "409", description = "중복된 로그인")
    })
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signup(@Valid @RequestBody ParentSignUpRequestDto signUpDto) {
        Long saved = parentService.signup(signUpDto);
        SignUpResponseDto responseDto = new SignUpResponseDto(saved);

        return ResponseEntity.ok(responseDto);
    }

    // 로그인
    @Operation(summary = "부모 로그인",
            description = "이메일과 비밀번호로 로그인합니다.",
            responses = {
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "403", description = "로그인 실패"),
            @ApiResponse(responseCode = "410", description = "회원탈퇴 후 로그인")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginDto) {
        JwtToken jwtToken = parentService.login(loginDto);
        ParentDto parentDto = parentService.readParentByEmail(loginDto.getEmail());

        LoginResponseDto responseDto = new LoginResponseDto(parentDto, jwtToken);

        return ResponseEntity.ok(responseDto);
    }

    // Refresh Token 재발급
    @Operation(summary = "Token 재발급",
            description = "Access Token이 만료되었을 때 Access Token과 Refresh Token을 재발급합니다.",
            responses = {
            @ApiResponse(responseCode = "200", description = "로그아웃 성공"),
            @ApiResponse(responseCode = "403", description = "로그아웃 ")
    })
    @PostMapping("/refresh-token")
    public ResponseEntity<JwtToken> refreshToken(@RequestHeader("Access-Token") String accessToken, @RequestHeader("Refresh-Token") String refreshToken) {
        JwtToken jwtToken = parentService.checkRefreshToken(accessToken, refreshToken);
        return ResponseEntity.ok(jwtToken);
    }

    // 로그아웃
    @Operation(summary = "부모 로그아웃")
    @PreAuthorize("hasRole('PARENT')")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorization, @RequestBody Map<String, String> map) {
        String email = map.get("email");
        String accessToken = authorization.substring(7);
        parentService.logout(accessToken, email);

        return ResponseEntity.ok().build();
    }

    // 회원 조회
    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/{parentId}")
    public ResponseEntity<ParentDto> readParent(@PathVariable("parentId") Long parentId) {
        ParentDto parentDto = parentService.readParentById(parentId);

        return ResponseEntity.ok(parentDto);
    }

    // 전체 자식 조회
    @Operation(summary = "전체 자식 조회", description = "부모가 등록한 자식들을 조회한다.")
    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<ChildListDto>> childrenList(@PathVariable("parentId") Long parentId) {
        List<ChildListDto> childrenList = parentService.childrenList(parentId);

        return ResponseEntity.ok(childrenList);
    }

    // 회원 정보 수정
    @Operation(summary = "부모 회원 정보 수정", description = "부모 회원 정보를 수정한다.")
    @PreAuthorize("hasRole('PARENT')")
    @PatchMapping("/{parentId}")
    public ResponseEntity<ParentDto> updateParent(@PathVariable("parentId") Long parentId, @RequestBody ParentDto parentDto) {
        if (!parentId.equals(parentDto.getParentId()))
            throw new IllegalArgumentException("본인 정보만 수정할 수 있습니다");

        ParentDto updateParent = parentService.updateParent(parentId, parentDto);
        return ResponseEntity.ok(updateParent);
    }

    // 회원 탈퇴
    @Operation(summary = "부모 회원 탈퇴", description = "부모 계정을 탈퇴한다.")
    @PreAuthorize("hasRole('PARENT')")
    @DeleteMapping("/{parentId}")
    public ResponseEntity<Void> deleteParent(@PathVariable("parentId") Long parentId) {
        parentService.deleteParent(parentId);

        return ResponseEntity.ok().build();
    }
}

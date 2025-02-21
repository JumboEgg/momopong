package com.ssafy.project.service;

import com.ssafy.project.dto.user.ChildListDto;
import com.ssafy.project.dto.user.LoginRequestDto;
import com.ssafy.project.dto.user.ParentDto;
import com.ssafy.project.dto.user.ParentSignUpRequestDto;
import com.ssafy.project.security.JwtToken;

import java.util.List;

public interface ParentService {

    // 부모 회원가입
    Long signup(ParentSignUpRequestDto signUpDto);

    // 중복 이메일 확인
    boolean checkDuplicateParent(String email);

    // 부모 로그인
    JwtToken login(LoginRequestDto loginDto);

    // 리프레시 토큰
    JwtToken checkRefreshToken(String accessToken, String refreshToken);

    // 부모 조회
    ParentDto readParentById(Long parentId);

    ParentDto readParentByEmail(String email);

    // 부모 회원 정보 수정
    ParentDto updateParent(Long parentId, ParentDto parentDto);

    // 부모 계정 삭제
    void deleteParent(Long parentId);

    // 부모 전체 자식 조회
    List<ChildListDto> childrenList(Long parentId);

    // 부모 로그아웃
    void logout(String accessToken, String email);
}

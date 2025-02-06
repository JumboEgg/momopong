package com.ssafy.project.service;

import com.ssafy.project.dto.ChildDto;
import com.ssafy.project.dto.ChildSignUpRequestDto;
import com.ssafy.project.dto.ChildUpdateRequestDto;

import java.util.Map;

public interface ChildService {

    // 자식 계정 생성
    Long signUp(ChildSignUpRequestDto signUpRequestDto);

    // 자식 계정 로그인
    Map<String, Object> login(Long childId);

    // 자식 계정 로그아웃
    void logout(String authorization, Long childId);

    // 자식 계정 조회
    ChildDto findChild(Long childId);

    // 자식 회원 정보 수정
    ChildDto updateChild(Long childId, ChildUpdateRequestDto updateRequestDto);

    // 자식 계정 삭제
    void deleteChild(Long childId);
}

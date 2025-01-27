package com.ssafy.project.service;

import com.ssafy.project.dto.ChildDto;
import com.ssafy.project.dto.ChildSignUpRequestDto;
import com.ssafy.project.dto.ChildUpdateRequestDto;

public interface ChildService {

    // 자식 계정 생성
    Long signUp(ChildSignUpRequestDto signUpRequestDto);

    // 자식 회원 정보 수정
    ChildDto updateChild(Long childId, ChildUpdateRequestDto updateRequestDto);

    // 자식 계정 접속
    ChildDto login(Long childId);
}

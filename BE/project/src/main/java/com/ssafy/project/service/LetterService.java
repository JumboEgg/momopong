package com.ssafy.project.service;

import com.ssafy.project.domain.Letter;
import com.ssafy.project.dto.LetterDto;

import java.util.List;

public interface LetterService {
    // 편지저장
    Letter saveLetter(Long childId, String content, String reply, String bookTitle, String role, String letterRecord);
    // GPT 답장
    String getGPTResponse(String fairyTale, String role, String childName, String content);
    // 아이 편지 전체 조회
    List<LetterDto> getLettersByChildId(Long childId);
    // 편지 상세 조회
    LetterDto getLetter(Long childId, Long letterId);
}

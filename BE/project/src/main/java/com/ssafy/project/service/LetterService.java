package com.ssafy.project.service;

import com.ssafy.project.domain.Letter;
import com.ssafy.project.dto.LetterDto;

import java.util.List;
import java.util.Map;

public interface LetterService {
    void saveLetter(Long childId, String content, String reply, String bookTitle, String role, String letterFileName);

    Map<String, String> getPresignedUrl();

    String getGPTResponse(String fairyTale, String role, String childName, String content);


    List<LetterDto> getLettersByChildId(Long childId);

    LetterDto getLetter(Long childId, Long letterId);
}

package com.ssafy.project.service;

import com.ssafy.project.domain.Letter;

public interface LetterService {
    Letter saveLetter(Long childId, String content, String reply, String role, String letterRecord);

    String getGPTResponse(String fairyTale, String role, String childName, String content);
}

package com.ssafy.project.service;

import com.ssafy.project.domain.Letter;

public interface LetterService {
    Letter createLetter(String voiceText, Integer childId, String role);
    Letter updateLetterReply(Long letterId, String fairyTale, String role, String childName, String content);
    Letter getLetter(Long letterId);

    String getGPTResponse(String fairyTale, String role, String childName, String content);
}

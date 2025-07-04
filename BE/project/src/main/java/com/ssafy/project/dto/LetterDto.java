package com.ssafy.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LetterDto {
    private String bookTitle;
    private String role;
    private String childName;
    private String content;
    private String letterFileName;
    private String letterUrl;
    private String reply;
    private String createdAt;

    public void updateletterUrl(String letterUrl) {
        this.letterUrl = letterUrl;
    }
}

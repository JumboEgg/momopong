package com.ssafy.project.dto.book;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AudioDto {
    private int order; // 오디오 순서
    private String role; // 대사 역할 (나레이션, 역할1, 역할2)
    private String text; // 대사
    private String path; // 음성 파일 경로
}

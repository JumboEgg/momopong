package com.ssafy.project.dto.book;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageDto {
    private Long pageId;
    private int pageNumber; // 페이지 번호
    private String pagePath; // 동화 이미지 경로
    private List<AudioDto> audios; // 음성 정보
}

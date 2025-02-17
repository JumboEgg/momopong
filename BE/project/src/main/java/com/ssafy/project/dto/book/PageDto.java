package com.ssafy.project.dto.book;

import com.ssafy.project.dto.PositionDto;
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

    @Builder.Default
    private PositionDto position = null; // 오브젝트 정보

    @Builder.Default
    private boolean hasDrawing = false; // 그림 그리기 여부

    @Builder.Default
    private boolean hasObject = false; // 오브젝트 존재 여부

    private List<AudioDto> audios; // 음성 정보
}

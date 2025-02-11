package com.ssafy.project.dto.book;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SketchDto {

    private Long sketchId;
    private String sketchPath; // 도안 경로
    private String sketchTitle; // 도안 제목
}

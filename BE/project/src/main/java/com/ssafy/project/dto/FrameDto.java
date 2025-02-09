package com.ssafy.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FrameDto {
    private String frameTitle;
    private String frameFileName;
    private String frameUrl;
    private String createdAt;

    public void updateFrameUrl(String frameUrl) {
        this.frameUrl = frameUrl;
    }
}

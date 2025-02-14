package com.ssafy.project.dto.record;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookRecordSketchDto {
    private Long bookRecordPageId;
    private String bookRecordSketchPath;
}

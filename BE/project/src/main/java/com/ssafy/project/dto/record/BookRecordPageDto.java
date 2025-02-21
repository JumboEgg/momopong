package com.ssafy.project.dto.record;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookRecordPageDto {
    private Long bookRecordId;
    private Long partnerBookRecordId;
    private int bookRecordPageNumber;
    private String pagePath;
    private String audioPath;
    private String role;
    private String text;
    private int audioNumber;
}

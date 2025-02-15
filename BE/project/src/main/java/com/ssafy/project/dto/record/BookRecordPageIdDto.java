package com.ssafy.project.dto.record;

import lombok.*;

@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class BookRecordPageIdDto {
    private Long pageId;
    private Long partnerPageId;
}

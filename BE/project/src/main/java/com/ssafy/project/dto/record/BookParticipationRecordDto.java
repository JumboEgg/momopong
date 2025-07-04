package com.ssafy.project.dto.record;

import com.ssafy.project.domain.type.ParticipationMode;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BookParticipationRecordDto {
    private Long bookRecordId;
    private Long childId;
    private Long bookId;
    private String role;
    @Builder.Default
    private Boolean earlyExit = true;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ParticipationMode mode;
}

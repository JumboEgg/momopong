package com.ssafy.project.dto.record;

import com.ssafy.project.domain.type.ParticipationMode;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SketchParticipationRecordDto {
    private Long sketchParticipationId;  // 참가기록
    private Long childId;  // 유저 id
    @Builder.Default
    private Boolean earlyExit = true; // 비정상 종료 여부
    private LocalDateTime startTime;  // 시작 시간
    private LocalDateTime endTime;  // 종료 시간
    private ParticipationMode mode;  // 참여 모드
}

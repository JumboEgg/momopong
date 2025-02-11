package com.ssafy.project.dto.draw;

import com.ssafy.project.domain.type.ParticipationMode;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SketchParticipationDto {
    private Long drawingParticipationId;  // 참가기록
    private Long childId;  // 유저 id
    private LocalDateTime startTime;  // 시작 시간
    private LocalDateTime endTime;  // 종료 시간
    private ParticipationMode mode;  // 참여 모드
}

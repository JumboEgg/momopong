package com.ssafy.project.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityAnalysisDto {
    //  독서 시간, 그린 시간, 평균 이용 시간(이번달, 이번주, 지난주), 중도 퇴장 횟수
    private long readingMinutes; // 독서 시간
    private long sketchingMinutes; // 그린 시간

    private long thisMonthMinutes; // 이번달 이용 시간
    private long thisWeekMinutes; // 이번주 이용 시간
    private long lastWeekMinutes; // 저번주 이용 시간

    private int earlyExitCount; // 중도 퇴장 횟수
    private int singleModeCount; // 싱글 모드 참여 횟수
    private int multiModeCount; // 멀티 모드 참여 횟수
}

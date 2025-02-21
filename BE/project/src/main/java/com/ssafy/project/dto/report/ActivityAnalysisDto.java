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
    private long readingMinutes; // 총 독서 시간
    private long readingMinutesSingle; // 싱글 - 독서 시간
    private long readingMinutesMulti; // 멀티 - 독서 시간
    
    private long sketchingMinutes; // 총 그린 시간
    private long sketchingMinutesSingle; // 싱글 - 그린 시간
    private long sketchingMinutesMulti; // 싱글 - 그린 시간

    private long thisMonthMinutes; // 이번달 이용 시간
    private long thisWeekMinutes; // 이번주 이용 시간
    private long lastWeekMinutes; // 저번주 이용 시간

    private int earlyExitCount; // 중도 퇴장 횟수
}

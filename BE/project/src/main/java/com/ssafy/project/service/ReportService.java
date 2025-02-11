package com.ssafy.project.service;

import com.ssafy.project.dto.report.ActivityAnalysisDto;
import com.ssafy.project.dto.report.ActivityHistoryDto;

import java.util.List;

public interface ReportService {
    //  독서 시간, 그린 시간, 평균 이용 시간(이번달, 이번주, 지난주), 중도 퇴장 횟수
    ActivityAnalysisDto activityAnalysis(Long childId);

    // 활동 내역 (많이 읽은 책 3개 & 읽은 횟수)
    List<ActivityHistoryDto> activityHistory(Long childId);
}

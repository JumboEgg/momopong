package com.ssafy.project.controller;

import com.ssafy.project.dto.report.ActivityAnalysisDto;
import com.ssafy.project.dto.report.ActivityHistoryDto;
import com.ssafy.project.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@PreAuthorize("hasRole('PARENT')")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/report")
@Tag(name = "리포트 컨트롤러")
public class ReportController {
    private final ReportService reportService;

    @Operation(summary = "활동 분석", description = "활동 분석을 조회합니다. 부모의 Access Token이 필요합니다.")
    @GetMapping("/activity-analysis/{childId}")
    public ResponseEntity<ActivityAnalysisDto> activityAnalysis(@PathVariable("childId") Long childId) {
        ActivityAnalysisDto activityAnalysis = reportService.activityAnalysis(childId);

        return ResponseEntity.ok(activityAnalysis);
    }

    @Operation(summary = "활동 내역", description = "활동 내역을 조회합니다. 부모의 Access Token이 필요합니다.")
    @GetMapping("/activity-history/{childId}")
    public ResponseEntity<List<ActivityHistoryDto>> activityHistory(@PathVariable("childId") Long childId) {
        List<ActivityHistoryDto> activityHistory = reportService.activityHistory(childId);

        return ResponseEntity.ok(activityHistory);
    }
}

package com.ssafy.project.controller;

import com.ssafy.project.dto.report.ActivityAnalysisDto;
import com.ssafy.project.dto.report.ActivityHistoryDto;
import com.ssafy.project.service.ReportService;
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
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/activity-analysis/{childId}")
    public ResponseEntity<ActivityAnalysisDto> activityAnalysis(@PathVariable("childId") Long childId) {
        ActivityAnalysisDto activityAnalysis = reportService.activityAnalysis(childId);

        return ResponseEntity.ok(activityAnalysis);
    }

    @GetMapping("/activity-history/{childId}")
    public ResponseEntity<List<ActivityHistoryDto>> activityHistory(@PathVariable("childId") Long childId) {
        List<ActivityHistoryDto> activityHistory = reportService.activityHistory(childId);

        return ResponseEntity.ok(activityHistory);
    }
}

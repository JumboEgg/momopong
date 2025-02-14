package com.ssafy.project.controller;

import com.ssafy.project.dto.record.BookParticipationRecordDto;
import com.ssafy.project.dto.record.SketchParticipationRecordDto;
import com.ssafy.project.service.SketchParticipationRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Drawing Room Record API", description = "그림 참여 기록 관련 API")
@RequestMapping("/api/sketch/record")
@RequiredArgsConstructor
public class SketchParticipationRecordController {

    private final SketchParticipationRecordService sketchParticipationRecordService;

    @PostMapping("/save")
    @Operation(summary = "그림 참여 기록 저장", description = "사용자의 그림 참여 기록을 저장합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "참여 기록 저장 성공"),
    })
    public ResponseEntity<SketchParticipationRecordDto> saveRecord(@RequestBody SketchParticipationRecordDto dto) {
        SketchParticipationRecordDto savedDto = sketchParticipationRecordService.save(dto);
        return ResponseEntity.ok(savedDto);
    }

    @PatchMapping("/complete/{recordId}")
    @Operation(summary = "참여 종료 처리", description = "그림이 끝날 때 정상 종료 여부와 종료 시간을 함께 기록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "참여 기록 정상 변경 및 종료 시간 기록"),
    })
    public ResponseEntity<SketchParticipationRecordDto> completeParticipation(@PathVariable Long recordId) {
        SketchParticipationRecordDto updatedDto = sketchParticipationRecordService.completeParticipation(recordId);
        return ResponseEntity.ok(updatedDto);
    }

}

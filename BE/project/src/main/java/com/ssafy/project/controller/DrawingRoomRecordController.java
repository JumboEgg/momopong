package com.ssafy.project.controller;

import com.ssafy.project.dto.draw.DrawingParticipationDto;
import com.ssafy.project.service.DrawingRoomRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Drawing Room Record API", description = "그림 참여 기록 관련 API")
@RequestMapping("/api/sketch/record")
@RequiredArgsConstructor
public class DrawingRoomRecordController {

    private final DrawingRoomRecordService drawingRoomRecordService;

    @PostMapping
    @Operation(summary = "그림 참여 기록 저장", description = "사용자의 그림 참여 기록을 저장합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "참여 기록 저장 성공"),
    })
    public ResponseEntity<DrawingParticipationDto> saveRecord(@RequestBody DrawingParticipationDto dto) {
        DrawingParticipationDto savedDto = drawingRoomRecordService.save(dto);
        return ResponseEntity.ok(savedDto);
    }
}

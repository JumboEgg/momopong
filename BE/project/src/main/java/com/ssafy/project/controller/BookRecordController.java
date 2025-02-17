package com.ssafy.project.controller;

import com.ssafy.project.dto.record.BookParticipationRecordDto;
import com.ssafy.project.service.BookRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Book Participation Record API", description = "동화 참여 기록 관련 API")
@RequestMapping("/api/book/record")
@RequiredArgsConstructor
public class BookRecordController {

    private final BookRecordService bookParticipationRecordService;

    @PostMapping("/save")
    @Operation(summary = "동화 참여 기록 저장", description = "사용자의 동화 참여 기록을 저장합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "참여 기록 저장 성공"),
    })
    public ResponseEntity<BookParticipationRecordDto> saveRecord(@RequestBody BookParticipationRecordDto dto) {
        BookParticipationRecordDto savedDto = bookParticipationRecordService.save(dto);
        return ResponseEntity.ok(savedDto);
    }

    @PatchMapping("/complete/{recordId}")
    @Operation(summary = "참여 종료 처리", description = "동화가 끝날 때 정상 종료 여부와 종료 시간을 함께 기록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "참여 기록 정상 변경 및 종료 시간 기록"),
    })
    public ResponseEntity<BookParticipationRecordDto> completeParticipation(@PathVariable Long recordId) {
        BookParticipationRecordDto updatedDto = bookParticipationRecordService.completeParticipation(recordId);
        return ResponseEntity.ok(updatedDto);
    }
}
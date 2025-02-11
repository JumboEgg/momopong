package com.ssafy.project.controller;

import com.ssafy.project.dto.record.BookParticipationRecordDto;
import com.ssafy.project.service.BookParticipationRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Book Participation Record API", description = "동화 참여 기록 관련 API")
@RequestMapping("/api/book/record")
@RequiredArgsConstructor
public class BookParticipationRecordController {

    private final BookParticipationRecordService bookParticipationRecordService;

    @PostMapping("/save")
    @Operation(summary = "동화 참여 기록 저장", description = "사용자의 동화 참여 기록을 저장합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "참여 기록 저장 성공"),
    })
    public ResponseEntity<BookParticipationRecordDto> saveRecord(@RequestBody BookParticipationRecordDto dto) {
        BookParticipationRecordDto savedDto = bookParticipationRecordService.save(dto);
        return ResponseEntity.ok(savedDto);
    }

    @PatchMapping("/exit/{recordId}")
    @Operation(summary = "중도 퇴장 여부 변경" , description = "동화가 끝날때 정상 종료를 기록합니다")
    @ApiResponses (value = {
            @ApiResponse(responseCode = "200", description = "참여 기록 정상 변경"),
    })
    public ResponseEntity<BookParticipationRecordDto> updateExitStatus(@PathVariable Long recordId) {
        BookParticipationRecordDto updatedDto = bookParticipationRecordService.updateExitStatus(recordId);
        return ResponseEntity.ok(updatedDto);
    }
}
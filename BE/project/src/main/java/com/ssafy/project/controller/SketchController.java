package com.ssafy.project.controller;

import com.ssafy.project.dto.book.SketchDto;
import com.ssafy.project.dto.invitation.InviteeIdDto;
import com.ssafy.project.dto.invitation.InviterIdDto;
import com.ssafy.project.dto.invitation.NotificationDto;
import com.ssafy.project.dto.user.ChildStatusDto;
import com.ssafy.project.service.SketchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sketch")
@PreAuthorize("hasRole('CHILD')")
@RequiredArgsConstructor
@Tag(name = "도안 컨트롤러")
public class SketchController {
    private final SketchService sketchService;

    // 도안 목록
    @Operation(summary = "도안 목록", description = "전체 도안을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<SketchDto>> sketchList() {
        List<SketchDto> sketchList = sketchService.sketchList();

        return ResponseEntity.ok(sketchList);
    }

    // 도안 조회
    @Operation(summary = "도안 조회", description = "개별 도안을 조회합니다.")
    @GetMapping("/{sketchId}")
    public ResponseEntity<SketchDto> getSketch(@PathVariable("sketchId") Long sketchId) {
        SketchDto sketchDto = sketchService.getSketch(sketchId);

        return ResponseEntity.ok(sketchDto);
    }

    // 플레이 가능한 친구 목록
    @Operation(summary = "초대 가능한 친구 목록", description = "온라인인 친구들만 초대할 수 있습니다.")
    @GetMapping("/{sketchId}/friend/{childId}")
    public ResponseEntity<List<ChildStatusDto>> playAvailableList(@PathVariable("sketchId") Long sketchId, @PathVariable("childId") Long childId) {
        List<ChildStatusDto> playAvailableList = sketchService.playAvailableList(childId);

        return ResponseEntity.ok(playAvailableList);
    }

    // 친구 초대하기
    @Operation(summary = "친구 초대하기", description = "친구에게 초대를 보냅니다.")
    @PostMapping("/{sketchId}/friend/{inviterId}/invitation")
    public ResponseEntity<NotificationDto> sendInvitation(@PathVariable("sketchId") Long sketchId,
                                                          @PathVariable("inviterId") Long inviterId,
                                                          @RequestBody InviteeIdDto inviteeIdDto) {
        Long inviteeId = inviteeIdDto.getInviteeId();
        NotificationDto notificationDto = sketchService.sendInvitation(sketchId, inviterId, inviteeId);

        return ResponseEntity.ok(notificationDto);
    }

    // 초대 수락하기
    @Operation(summary = "초대 수락하기", description = "친구가 보낸 초대를 수락합니다.")
    @PostMapping("/{sketchId}/friend/{inviteeId}/invitation/accept")
    public ResponseEntity<Void> acceptInvitation(@PathVariable("sketchId") Long sketchId,
                                                 @PathVariable("inviteeId") Long inviteeId,
                                                 @RequestBody InviterIdDto inviterIdDto) {
        Long inviterId = inviterIdDto.getInviterId();
        sketchService.acceptInvitation(sketchId, inviterId, inviteeId);

        return ResponseEntity.ok().build();
    }

    // 초대 거절하기
    @Operation(summary = "초대 거절하기", description = "친구가 보낸 초대를 거절합니다.")
    @PostMapping("/{sketchId}/friend/{inviteeId}/invitation/reject")
    public ResponseEntity<Void> rejectInvitation(@PathVariable("sketchId") Long sketchId,
                                                 @PathVariable("inviteeId") Long inviteeId,
                                                 @RequestBody InviterIdDto inviterIdDto) {
        Long inviterId = inviterIdDto.getInviterId();
        sketchService.rejectInvitation(sketchId, inviterId, inviteeId);

        return ResponseEntity.ok().build();
    }
}

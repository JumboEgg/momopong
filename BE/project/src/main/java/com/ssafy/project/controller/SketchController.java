package com.ssafy.project.controller;

import com.ssafy.project.dto.*;
import com.ssafy.project.service.SketchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sketch")
@PreAuthorize("hasRole('CHILD')")
@RequiredArgsConstructor
public class SketchController {
    private final SketchService sketchService;

    // 도안 목록
    @GetMapping
    public ResponseEntity<List<SketchDto>> sketchList() {
        List<SketchDto> sketchList = null;

        return ResponseEntity.ok(sketchList);
    }

    // 플레이 가능한 친구 목록
    @GetMapping("/{sketchId}/friend/{childId}")
    public ResponseEntity<List<ChildStatusDto>> playAvailableList(@PathVariable("sketchId") Long sketchId, @PathVariable("childId") Long childId) {
        List<ChildStatusDto> playAvailableList = sketchService.playAvailableList(childId);

        return ResponseEntity.ok(playAvailableList);
    }

    // 친구 초대하기
    @PostMapping("/{sketchId}/friend/{inviterId}/invitation")
    public ResponseEntity<NotificationDto> sendInvitation(@PathVariable("sketchId") Long sketchId,
                                                          @PathVariable("inviterId") Long inviterId,
                                                          @RequestBody ChildIdDto childIdDto) {
        Long inviteeId = childIdDto.getChildId();
        System.out.println("inviteeId = " + inviteeId);
        NotificationDto notificationDto = sketchService.sendInvitation(sketchId, inviterId, inviteeId);

        return ResponseEntity.ok(notificationDto);
    }

    // 초대 수락하기
    @PostMapping("/{sketchId}/friend/{inviteeId}/invitation/accept")
    public ResponseEntity<Void> acceptInvitation(@PathVariable("sketchId") Long sketchId,
                                                 @PathVariable("inviteeId") Long inviteeId,
                                                 @RequestBody ChildIdDto childIdDto) {
        Long inviterId = childIdDto.getChildId();
        sketchService.acceptInvitation(sketchId, inviterId, inviteeId);

        return ResponseEntity.ok().build();
    }

    // 초대 거절하기
    @PostMapping("/{sketchId}/friend/{inviteeId}/invitation/reject")
    public ResponseEntity<Void> rejectInvitation(@PathVariable("sketchId") Long sketchId,
                                                 @PathVariable("inviteeId") Long inviteeId,
                                                 @RequestBody ChildIdDto childIdDto) {
        Long inviterId = childIdDto.getChildId();
        sketchService.rejectInvitation(sketchId, inviterId, inviteeId);

        return ResponseEntity.ok().build();
    }
}

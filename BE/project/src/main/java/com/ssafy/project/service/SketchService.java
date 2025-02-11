package com.ssafy.project.service;

import com.ssafy.project.dto.ChildStatusDto;
import com.ssafy.project.dto.NotificationDto;
import com.ssafy.project.dto.SketchDto;

import java.util.List;

public interface SketchService {

    // 도안 목록
    List<SketchDto> sketchList();

    // 도안 조회
    SketchDto getSketch(Long sketchId);

    // 플레이 가능한 친구 목록
    List<ChildStatusDto> playAvailableList(Long childId);

    // 방에 친구 초대하기
    NotificationDto sendInvitation(Long sketchId, Long inviterId, Long inviteeId);

    // 초대 수락하기
    void rejectInvitation(Long sketchId, Long inviterId, Long inviteeId);

    // 초대 거절하기
    void acceptInvitation(Long sketchId, Long inviterId, Long inviteeId);
}

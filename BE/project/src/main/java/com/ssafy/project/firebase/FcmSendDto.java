package com.ssafy.project.firebase;

import com.ssafy.project.dto.NotificationDto;
import com.ssafy.project.dto.invitation.InvitationDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 요청받은 알림 메시지 정보
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FcmSendDto {

    @Schema(description = "알림 받을 자식 ID")
    private Long childId;

    @Schema(description = "알림 메시지 제목")
    private String title;

    @Schema(description = "알림 메시지 내용")
    private String content;

    @Schema(description = "알림 관련 정보")
    private NotificationDto notificationDto;
}

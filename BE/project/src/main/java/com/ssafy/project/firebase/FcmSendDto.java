package com.ssafy.project.firebase;

import com.ssafy.project.dto.invitation.NotificationDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

// 요청받은 알림 메시지 정보
@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class FcmSendDto {

    @Schema(description = "알림 받을 아이의 ID")
    private Long receiveId;

    @Schema(description = "알림 관련 정보")
    private NotificationDto notificationDto;
}

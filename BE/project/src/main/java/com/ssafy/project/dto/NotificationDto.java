package com.ssafy.project.dto;

import com.ssafy.project.domain.type.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
    private NotificationType notificationType; // 초대, 수락, 거절
    private Long bookId; // 동화 ID
    private String bookTitle; // 동화 제목
    private Long inviterId; // 초대한 사용자 ID
    private String inviterName; // 초대한 사용자 이름
    private Long inviteeId; // 초대받은 사용자 ID
    private String inviteeName; // 초대받은 사용자 이름

}

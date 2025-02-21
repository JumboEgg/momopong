package com.ssafy.project.dto.invitation;

import com.ssafy.project.domain.type.ContentType;
import com.ssafy.project.domain.type.NotificationType;
import lombok.*;

@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
    private NotificationType notificationType; // 초대, 수락, 거절
    private ContentType contentType; // 컨텐츠 타입
    private Long contentId; // 컨텐츠 ID (동화, 도안)
    private String contentTitle; // 컨텐츠 제목 (동화, 도안)
    private Long inviterId; // 초대한 사용자 ID
    private String inviterName; // 초대한 사용자 이름
    private Long inviteeId; // 초대받은 사용자 ID
    private String inviteeName; // 초대받은 사용자 이름
}

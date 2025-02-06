package com.ssafy.project.service;

import com.ssafy.project.dto.NotificationDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    
    // 동화 초대 알림 보내기
    public void sendNotification(Long inviteeId, NotificationDto notificationDto) {
        messagingTemplate.convertAndSend(
                "/sub/invitation/" + inviteeId,
                notificationDto
        );
    }
}

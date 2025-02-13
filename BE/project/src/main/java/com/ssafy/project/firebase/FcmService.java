package com.ssafy.project.firebase;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.ssafy.project.dao.RedisDao;
import com.ssafy.project.domain.Child;
import com.ssafy.project.dto.invitation.NotificationDto;
import com.ssafy.project.exception.NotFoundException;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.repository.ChildRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class FcmService {
    private final ChildRepository childRepository;
    private final RedisDao redisDao;

    private static String CHILD_VAPID_TOKEN = "vapid:child:%d"; // 자식 ID가 1 => vapid:child:1

    // 사용자의 VAPID 토큰 저장하기
    public void saveToken(FcmDto fcmDto) {
        Child child = childRepository.findById(fcmDto.getChildId())
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        String key = String.format(CHILD_VAPID_TOKEN, fcmDto.getChildId());
        redisDao.setValues(key, fcmDto.getToken());
    }

    // 사용자의 VAPID 토큰 삭제하기
    public void deleteToken(Long childId) {
        String key = String.format(CHILD_VAPID_TOKEN, childId);

        redisDao.deleteValues(key);
    }

    public void sendMessage(FcmSendDto sendDto) {
        // 알림 받을 사용자의 VAPID 토큰 얻기
        String key = String.format(CHILD_VAPID_TOKEN, sendDto.getReceiveId());
        String token = (String) redisDao.getValues(key);
        log.info("sendMessage.key={}", key);
        log.info("sendMessage.token={}", token);

        if (token == null) {
            throw new NotFoundException("해당 사용자의 토큰이 존재하지 않습니다");
        }

        // 전송할 정보 Map으로 변환
        NotificationDto notificationDto = sendDto.getNotificationDto();
        Map<String, String> data = Map.of(
                "inviterId", notificationDto.getInviterId().toString(),
                "inviteeId", notificationDto.getInviteeId().toString(),
                "inviterName", notificationDto.getInviterName(),
                "inviteeName", notificationDto.getInviteeName(),
                "contentId", notificationDto.getContentId().toString(),
                "contentTitle", notificationDto.getContentTitle(),
                "contentType", notificationDto.getContentType().toString(),
                "notificationType", notificationDto.getNotificationType().toString()
        );
        log.info("sendMessage.data={}", data);

        // 알림 메시지 구성하기 (Firebase의 Message)
        Message message = Message.builder()
                .setToken(token)
                .putAllData(data)
                .build();
        log.info("sendMessage.message={}", message);

        // 알림 메시지 전송
        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            log.error("FcmService.sendMessage - FirebaseMessagingException: {}", e.getMessage());

            // FCM 토큰이 만료되었을 경우 자동 삭제
            if ("UNREGISTERED".equals(e.getErrorCode())) {
                log.warn("🚨 유효하지 않은 FCM 토큰 감지됨. 자동 삭제: {}", token);
                redisDao.deleteValues(key);
            }

            throw new RuntimeException(e);
        }
    }


}

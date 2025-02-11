package com.ssafy.project.service;

import com.ssafy.project.common.JsonConverter;
import com.ssafy.project.dao.RedisDao;
import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Friend;
import com.ssafy.project.domain.Sketch;
import com.ssafy.project.domain.type.ContentType;
import com.ssafy.project.domain.type.NotificationType;
import com.ssafy.project.domain.type.StatusType;
import com.ssafy.project.dto.ChildStatusDto;
import com.ssafy.project.dto.NotificationDto;
import com.ssafy.project.dto.SketchDto;
import com.ssafy.project.exception.DuplicateException;
import com.ssafy.project.exception.InvitationExpiredException;
import com.ssafy.project.exception.NotFoundException;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.firebase.FcmSendDto;
import com.ssafy.project.firebase.FcmService;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.FriendRepository;
import com.ssafy.project.repository.SketchRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SketchServiceImpl implements SketchService {
    private final ChildRepository childRepository;
    private final FriendRepository friendRepository;
    private final SketchRepository sketchRepository;
    private final JsonConverter jsonConverter;
    private final RedisDao redisDao;
    private final FcmService fcmService;

    private static final String CHILD_STATUS_KEY = "child:status:%d"; // 자식 접속 상태 KEY
    private static final String INVITATION_KEY = "sketch:invitation:%d:%d"; // 초대 KEY

    // 도안 목록
    @Override
    public List<SketchDto> sketchList() {
        List<Sketch> sketchList = sketchRepository.findAll();
        return sketchList.stream()
                .map(sketch -> SketchDto.builder()
                        .sketchId(sketch.getId())
                        .sketchTitle(sketch.getSketchTitle())
                        .sketchPath(sketch.getSketchPath())
                        .build())
                .toList();
    }

    // 도안 조회
    @Override
    public SketchDto getSketch(Long sketchId) {
        Sketch sketch = sketchRepository.findById(sketchId)
                .orElseThrow(() -> new NotFoundException("해당 도안을 찾을 수 없습니다"));

        return SketchDto.builder()
                .sketchId(sketchId)
                .sketchTitle(sketch.getSketchTitle())
                .sketchPath(sketch.getSketchPath())
                .build();
    }

    // 플레이 가능한 친구 목록
    @Override
    public List<ChildStatusDto> playAvailableList(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        // 친구인 사람 목록
        List<Friend> friendList = friendRepository.findAllByFrom(child);

        // 상태 온라인인 사람
        return friendList.stream()
                .map(friend -> {
                    String key = String.format(CHILD_STATUS_KEY, friend.getTo().getId());
                    Object json = redisDao.getValues(key);
                    if (json == null) return ChildStatusDto.builder().status(StatusType.OFFLINE).build();

                    return jsonConverter.fromJson((String) json, ChildStatusDto.class);
                })
                .filter(childStatusDto -> childStatusDto.getStatus().equals(StatusType.ONLINE))
                .toList();
    }

    // 방에 친구 초대하기
    @Override
    public NotificationDto sendInvitation(Long sketchId, Long inviterId, Long inviteeId) {
        String key = String.format(INVITATION_KEY, inviterId, inviteeId);
        if (redisDao.getValues(key) != null) {
            throw new DuplicateException("이미 진행중인 초대가 존재합니다");
        }

        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new NotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new NotFoundException("해당 친구를 찾을 수 없습니다"));

        Sketch sketch = sketchRepository.findById(sketchId)
                .orElseThrow(() -> new NotFoundException("해당 도안을 찾을 수 없습니다"));

        NotificationDto notificationDto = NotificationDto.builder()
                .notificationType(NotificationType.INVITE)
                .inviterId(inviterId)
                .inviterName(inviter.getName())
                .inviteeId(inviteeId)
                .inviteeName(invitee.getName())
                .contentId(sketchId)
                .contentTitle(sketch.getSketchTitle())
                .contentType(ContentType.SKETCH)
                .build();

        // 초대 Redis에 저장
        redisDao.setValues(key, jsonConverter.toJson(notificationDto), Duration.ofSeconds(10));

        // 초대 알림 전송
        FcmSendDto sendDto = FcmSendDto.builder()
                .receiveId(inviteeId)
                .notificationDto(notificationDto)
                .build();
        fcmService.sendMessage(sendDto);

        return notificationDto;
    }

    // 초대 수락하기
    @Override
    public void acceptInvitation(Long sketchId, Long inviterId, Long inviteeId) {
        String key = String.format(INVITATION_KEY, inviterId, inviteeId);
        if (redisDao.getValues(key) == null) {
            throw new InvitationExpiredException("이미 만료된 초대장입니다");
        }

        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new NotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new NotFoundException("해당 친구를 찾을 수 없습니다"));

        Sketch sketch = sketchRepository.findById(sketchId)
                .orElseThrow(() -> new NotFoundException("해당 도안을 찾을 수 없습니다"));

        // 수락 알림 전송
        NotificationDto notificationDto = NotificationDto.builder()
                .notificationType(NotificationType.ACCEPT)
                .inviterId(inviter.getId())
                .inviterName(inviter.getName())
                .inviteeId(invitee.getId())
                .inviteeName(invitee.getName())
                .contentId(sketch.getId())
                .contentTitle(sketch.getSketchTitle())
                .contentType(ContentType.SKETCH)
                .build();

        FcmSendDto sendDto = FcmSendDto.builder()
                .receiveId(inviterId)
                .notificationDto(notificationDto)
                .build();
        fcmService.sendMessage(sendDto);
    }

    // 초대 거절하기
    @Override
    public void rejectInvitation(Long sketchId, Long inviterId, Long inviteeId) {
        String key = String.format(INVITATION_KEY, inviterId, inviteeId);
        if (redisDao.getValues(key) == null) {
            throw new InvitationExpiredException("이미 만료된 초대장입니다");
        }

        // 수락한 초대장 삭제
        redisDao.deleteValues(key);

        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new NotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new NotFoundException("해당 친구를 찾을 수 없습니다"));

        Sketch sketch = sketchRepository.findById(sketchId)
                .orElseThrow(() -> new NotFoundException("해당 도안을 찾을 수 없습니다"));

        // 거절 알림 전송
        NotificationDto notificationDto = NotificationDto.builder()
                .notificationType(NotificationType.REJECT)
                .inviterId(inviter.getId())
                .inviterName(inviter.getName())
                .inviteeId(invitee.getId())
                .inviteeName(invitee.getName())
                .contentId(sketch.getId())
                .contentTitle(sketch.getSketchTitle())
                .contentType(ContentType.SKETCH)
                .build();

        FcmSendDto sendDto = FcmSendDto.builder()
                .receiveId(inviterId)
                .notificationDto(notificationDto)
                .build();
        fcmService.sendMessage(sendDto);
    }
}

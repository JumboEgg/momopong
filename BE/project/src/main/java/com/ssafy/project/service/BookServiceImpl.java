package com.ssafy.project.service;

import com.ssafy.project.common.JsonConverter;
import com.ssafy.project.dao.RedisDao;
import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Friend;
import com.ssafy.project.domain.book.Book;
import com.ssafy.project.domain.type.NotificationType;
import com.ssafy.project.domain.type.StatusType;
import com.ssafy.project.dto.ChildStatusDto;
import com.ssafy.project.dto.NotificationDto;
import com.ssafy.project.dto.book.BookDto;
import com.ssafy.project.dto.invitation.InvitationDto;
import com.ssafy.project.exception.BookNotFoundException;
import com.ssafy.project.exception.DuplicateException;
import com.ssafy.project.exception.InvitationExpiredException;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.repository.BookRepository;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.FriendRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final FriendRepository friendRepository;
    private final ChildRepository childRepository;
    private final BookRepository bookRepository;
    private final RedisDao redisDao;
    private final JsonConverter jsonConverter;
    private final NotificationService notificationService;
    // Redis 저장
    private static final String CHILD_STATUS_KEY = "child:status:%d";
    private static final String INVITATION_KEY = "book:invitation:%d:%d";

    // 동화 목록
    @Override
    public List<BookDto> bookList() {
        List<Book> bookList = bookRepository.findAll();

        return bookList.stream()
                .map(Book::entityToDto)
                .collect(Collectors.toList());
    }

    // 플레이 가능한 친구 목록
    @Override
    public List<ChildStatusDto> playAvailableList(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        // 1. 나와 친구인 사람 (Friend 테이블에서 찾아야 함)
        List<Friend> friendList = friendRepository.findAllByFrom(child);

        // 2. 상태가 온라인인 사람
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

    // 친구 초대 보내기
    @Override
    public InvitationDto sendInvitation(Long bookId, Long inviterId, Long inviteeId) { // inviter: 초대한 사람, invitee: 초대받은 사람
        String key = String.format(INVITATION_KEY, inviterId, inviteeId);
        if (redisDao.getValues(key) != null) {
            throw new DuplicateException("이미 진행중인 초대가 존재합니다");
        }

        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new UserNotFoundException("해당 친구를 찾을 수 없습니다"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("해당 책을 찾을 수 없습니다"));

        InvitationDto invitationDto = InvitationDto.builder()
                .fromId(inviterId)
                .toId(inviteeId)
                .fromName(inviter.getName())
                .toName(invitee.getName())
                .bookTitle(book.getTitle())
                .build();

        // 초대장 Redis에 저장 (10초간 초대장 유효)
        redisDao.setValues(key, jsonConverter.toJson(invitationDto), Duration.ofSeconds(10));

        // 웹 소켓으로 초대 알림 실시간 전송
        NotificationDto notification = NotificationDto.builder()
                .notificationType(NotificationType.INVITE)
                .bookId(bookId)
                .bookTitle(book.getTitle())
                .inviterId(inviterId)
                .inviterName(inviter.getName())
                .inviteeId(inviteeId)
                .inviteeName(invitee.getName())
                .build();
        notificationService.sendNotification(inviteeId, notification);

        return invitationDto;
    }

    // 친구 초대 수락하기
    @Override
    public void acceptInvitation(Long bookId, Long inviterId, Long inviteeId) { // 초대받은 아이 입장에서 수락
        String key = String.format(INVITATION_KEY, inviterId, inviteeId);
        if (redisDao.getValues(key) == null) {
            throw new InvitationExpiredException("이미 만료된 초대장입니다");
        }

        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new UserNotFoundException("해당 친구를 찾을 수 없습니다"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("해당 책을 찾을 수 없습니다"));

        // 웹 소켓으로 수락 알림 실시간 전송
        NotificationDto notification = NotificationDto.builder()
                .notificationType(NotificationType.ACCEPT)
                .bookId(bookId)
                .bookTitle(book.getTitle())
                .inviterId(inviterId)
                .inviterName(inviter.getName())
                .inviteeId(inviteeId)
                .inviteeName(invitee.getName())
                .build();
        notificationService.sendNotification(inviterId, notification);
    }

    // 친구 초대 거절하기
    @Override
    public void rejectInvitation(Long bookId, Long inviterId, Long inviteeId) { // 초대받은 아이 입장에서 거절
        String key = String.format(INVITATION_KEY, inviterId, inviteeId);
        if (redisDao.getValues(key) == null) {
            throw new InvitationExpiredException("이미 만료된 초대장입니다");
        }

        redisDao.deleteValues(key);

        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new UserNotFoundException("해당 친구를 찾을 수 없습니다"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("해당 책을 찾을 수 없습니다"));

        NotificationDto notification = NotificationDto.builder()
                .notificationType(NotificationType.REJECT)
                .bookId(bookId)
                .bookTitle(book.getTitle())
                .inviterId(inviterId)
                .inviterName(inviter.getName())
                .inviteeId(inviteeId)
                .inviteeName(invitee.getName())
                .build();
        notificationService.sendNotification(inviterId, notification);
    }
    // 초대장 만료
    @Override
    public void expireInvitation(Long bookId, Long inviterId, Long inviteeId) {
        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new UserNotFoundException("해당 친구를 찾을 수 없습니다"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("해당 책을 찾을 수 없습니다"));

        NotificationDto notification = NotificationDto.builder()
                .notificationType(NotificationType.EXPIRE)
                .bookId(bookId)
                .bookTitle(book.getTitle())
                .inviterId(inviterId)
                .inviterName(inviter.getName())
                .inviteeId(inviteeId)
                .inviteeName(invitee.getName())
                .build();
        notificationService.sendNotification(inviterId, notification);
    }
}

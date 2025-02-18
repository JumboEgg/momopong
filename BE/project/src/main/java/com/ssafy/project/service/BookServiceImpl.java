package com.ssafy.project.service;

import com.ssafy.project.common.JsonConverter;
import com.ssafy.project.dao.RedisDao;
import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Friend;
import com.ssafy.project.domain.book.Book;
import com.ssafy.project.domain.book.Page;
import com.ssafy.project.domain.book.Position;
import com.ssafy.project.domain.type.ContentType;
import com.ssafy.project.domain.type.NotificationType;
import com.ssafy.project.domain.type.StatusType;
import com.ssafy.project.dto.PositionDto;
import com.ssafy.project.dto.book.AudioDto;
import com.ssafy.project.dto.book.BookDto;
import com.ssafy.project.dto.book.BookListDto;
import com.ssafy.project.dto.book.PageDto;
import com.ssafy.project.dto.invitation.NotificationDto;
import com.ssafy.project.dto.user.ChildStatusDto;
import com.ssafy.project.exception.*;
import com.ssafy.project.firebase.FcmSendDto;
import com.ssafy.project.firebase.FcmService;
import com.ssafy.project.repository.BookRepository;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.FriendRepository;
import com.ssafy.project.repository.PositionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final FriendRepository friendRepository;
    private final ChildRepository childRepository;
    private final BookRepository bookRepository;
    private final RedisDao redisDao;
    private final JsonConverter jsonConverter;
    private final FcmService fcmService;
    private final CloudFrontService cloudFrontService;
    private final PositionRepository positionRepository;

    // Redis 저장을 위한 KEY
    private static final String CHILD_STATUS_KEY = "child:status:%d"; // 자식 접속 상태 KEY
    private static final String INVITATION_KEY = "book:invitation:%d:%d"; // 초대 KEY

    // 동화 목록
    @Override
    public List<BookDto> bookList() {
        List<Book> bookList = bookRepository.findAll();
        log.info("bookList={}", bookList);

        return bookList.stream()
                .map(Book::entityToDto)
                .collect(Collectors.toList());
    }

    // 동화 상세 페이지 조회 (동화 읽기)
    @Override
    public BookListDto readBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("해당 책을 찾을 수 없습니다"));
        log.info("book={}", book);

        // 동화 페이지 조회
        List<Page> pageList = book.getPageList();
        log.info("pageList={}", pageList);
        List<PageDto> pageDtoList = pageList.stream()
                .map(page -> {
                    List<AudioDto> audioDtoList = page.getAudioList().stream()
                            .map(audio -> AudioDto.builder()
                                    .order(audio.getAudioNumber())
                                    .role(audio.getRole())
                                    .text(audio.getText())
                                    .path(cloudFrontService.getSignedUrl(audio.getAudioPath()))
                                    .build())
                            .toList();

                    // 그림을 그려야 하거나 오브젝트를 보여줘야 하는 경우
                    PositionDto positionDto = null;
                    log.info("pageId={}", page.getId());
                    log.info("hasDrawing={}", page.isHasDrawing());
                    log.info("hasObject={}", page.isHasObject());

                    if (page.isHasDrawing() || page.isHasObject()) {
                        Position position = positionRepository.findByPage(page).orElse(null);
                        if (position != null) { // null이 아닌 경우에만 오브젝트 정보 반환
                            positionDto = PositionDto.builder()
                                    .sketchPath(position.getSketchPath())
                                    .x(position.getX())
                                    .y(position.getY())
                                    .ratio(position.getRatio())
                                    .angle(position.getAngle())
                                    .build();
                        }
                    }

                    return PageDto.builder()
                            .pageId(page.getId())
                            .pageNumber(page.getPageNumber())
                            .pagePath(page.getPagePath())
                            .position(positionDto)
                            .hasDrawing(page.isHasDrawing())
                            .hasObject(page.isHasObject())
                            .audios(audioDtoList)
                            .build();
                })
                .toList();

        return BookListDto.builder()
                .bookId(bookId)
                .bookTitle(book.getTitle())
                .role1(book.getRole1())
                .role2(book.getRole2())
                .totalPage(pageList.size())
                .pages(pageDtoList)
                .build();
    }

    // 플레이 가능한 친구 목록
    @Override
    public List<ChildStatusDto> playAvailableList(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        // 1. 나와 친구인 사람 (Friend 테이블에서 찾아야 함)
        List<Friend> friendList = friendRepository.findAllByFrom(child);

        // 2. 상태가 온라인인 사람
        List<ChildStatusDto> statusDtoList = friendList.stream()
                .map(friend -> {
                    String key = String.format(CHILD_STATUS_KEY, friend.getTo().getId());
                    Object json = redisDao.getValues(key);
                    if (json == null) return ChildStatusDto.builder().status(StatusType.OFFLINE).build();

                    return jsonConverter.fromJson((String) json, ChildStatusDto.class);
                })
                .filter(childStatusDto -> childStatusDto.getStatus().equals(StatusType.ONLINE))
                .toList();

        log.info("statusDtoList={}", statusDtoList);

        return statusDtoList;
    }

    // 친구 초대 보내기
    @Override
    public NotificationDto sendInvitation(Long bookId, Long inviterId, Long inviteeId) { // inviter: 초대한 사람, invitee: 초대받은 사람
        log.info("sendInvitation.bookId={}", bookId);
        log.info("sendInvitation.inviterId={}", inviterId);
        log.info("sendInvitation.inviteeId={}", inviteeId);

        String key = String.format(INVITATION_KEY, inviterId, inviteeId);
        log.info("sendInvitation.key={}", key);
        if (redisDao.getValues(key) != null) {
            throw new DuplicateException("이미 진행중인 초대가 존재합니다");
        }

        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new UserNotFoundException("해당 친구를 찾을 수 없습니다"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("해당 책을 찾을 수 없습니다"));

        NotificationDto notificationDto = NotificationDto.builder()
                .notificationType(NotificationType.INVITE)
                .inviterId(inviterId)
                .inviteeId(inviteeId)
                .inviterName(inviter.getName())
                .inviteeName(invitee.getName())
                .contentTitle(book.getTitle())
                .contentId(bookId)
                .contentType(ContentType.BOOK)
                .build();

        log.info("sendInvitation.notificationDto={}", notificationDto);

        // 초대장 Redis에 저장 (10초간 초대장 유효)
        redisDao.setValues(key, jsonConverter.toJson(notificationDto), Duration.ofSeconds(15));

        // FCM으로 초대 알림 전송
        FcmSendDto sendDto = FcmSendDto.builder()
                .receiveId(inviteeId)
                .notificationDto(notificationDto)
                .build();
        log.info("notificationDto.sendDto={}", sendDto);
        fcmService.sendMessage(sendDto);

        return notificationDto;
    }

    // 친구 초대 수락하기
    @Override
    public void acceptInvitation(Long bookId, Long inviterId, Long inviteeId) { // 초대받은 아이 입장에서 수락
        log.info("acceptInvitation.bookId={}", bookId);
        log.info("acceptInvitation.inviterId={}", inviterId);
        log.info("acceptInvitation.inviteeId={}", inviteeId);

        String key = String.format(INVITATION_KEY, inviterId, inviteeId);
        log.info("acceptInvitation.key={}", key);
        if (redisDao.getValues(key) == null) {
            throw new InvitationExpiredException("이미 만료된 초대장입니다");
        }
        // 수락한 초대장 삭제
        redisDao.deleteValues(key);

        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new UserNotFoundException("해당 친구를 찾을 수 없습니다"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("해당 책을 찾을 수 없습니다"));

        // FCM으로 수락 알림 전송
        NotificationDto notificationDto = NotificationDto.builder()
                .notificationType(NotificationType.ACCEPT)
                .inviterId(inviter.getId())
                .inviterName(inviter.getName())
                .inviteeId(invitee.getId())
                .inviteeName(invitee.getName())
                .contentId(book.getId())
                .contentTitle(book.getTitle())
                .contentType(ContentType.BOOK)
                .build();
        log.info("acceptInvitation.notificationDto={}", notificationDto);

        FcmSendDto sendDto = FcmSendDto.builder()
                .receiveId(inviterId)
                .notificationDto(notificationDto)
                .build();
        log.info("acceptInvitation.sendDto={}", sendDto);
        fcmService.sendMessage(sendDto);
    }

    // 친구 초대 거절하기
    @Override
    public void rejectInvitation(Long bookId, Long inviterId, Long inviteeId) { // 초대받은 아이 입장에서 거절
        log.info("rejectInvitation.bookId={}", bookId);
        log.info("rejectInvitation.inviterId={}", inviterId);
        log.info("rejectInvitation.inviteeId={}", inviteeId);

        String key = String.format(INVITATION_KEY, inviterId, inviteeId);
        log.info("rejectInvitation.key={}", key);
        Object values = redisDao.getValues(key);
        log.info("rejectInvitation.redisDao.getValues(key)={}", values);
        if (redisDao.getValues(key) == null) {
            throw new InvitationExpiredException("이미 만료된 초대장입니다");
        }
        log.info("rejectInvitation.redisDao.getValues(key)={}", values);
        // 수락한 초대장 삭제
        redisDao.deleteValues(key);

        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new NotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new NotFoundException("해당 친구를 찾을 수 없습니다"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("해당 책을 찾을 수 없습니다"));

        // FCM으로 거절 알림 전송
        NotificationDto notificationDto = NotificationDto.builder()
                .notificationType(NotificationType.REJECT)
                .inviterId(inviter.getId())
                .inviterName(inviter.getName())
                .inviteeId(invitee.getId())
                .inviteeName(invitee.getName())
                .contentId(book.getId())
                .contentTitle(book.getTitle())
                .contentType(ContentType.BOOK)
                .build();
        log.info("rejectInvitation.notificationDto={}", notificationDto);

        FcmSendDto sendDto = FcmSendDto.builder()
                .receiveId(inviterId)
                .notificationDto(notificationDto)
                .build();
        log.info("rejectInvitation.sendDto={}", sendDto);
        fcmService.sendMessage(sendDto);
    }

    // 친구 초대가 만료되었을 때 (10초 제한)
    @Override
    public void expireInvitation(Long bookId, Long inviterId, Long inviteeId) {
        Child inviter = childRepository.findById(inviterId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child invitee = childRepository.findById(inviteeId)
                .orElseThrow(() -> new UserNotFoundException("해당 친구를 찾을 수 없습니다"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("해당 책을 찾을 수 없습니다"));

        // 만료 알림 전송
        NotificationDto notificationDto = NotificationDto.builder()
                .notificationType(NotificationType.EXPIRE)
                .inviterId(inviter.getId())
                .inviterName(inviter.getName())
                .inviteeId(invitee.getId())
                .inviteeName(invitee.getName())
                .contentId(book.getId())
                .contentTitle(book.getTitle())
                .contentType(ContentType.BOOK)
                .build();

        FcmSendDto sendDto = FcmSendDto.builder()
                .receiveId(inviterId)
                .notificationDto(notificationDto)
                .build();
        fcmService.sendMessage(sendDto);
    }
}

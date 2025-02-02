package com.ssafy.project.service;

import com.ssafy.project.common.JsonConverter;
import com.ssafy.project.dao.RedisDao;
import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Friend;
import com.ssafy.project.domain.book.Book;
import com.ssafy.project.domain.type.StatusType;
import com.ssafy.project.dto.ChildStatusDto;
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
    public InvitationDto sendInvitation(Long bookId, Long fromChildId, Long toChildId) {
        String key = String.format(INVITATION_KEY, fromChildId, toChildId);
        if (redisDao.getValues(key) != null) {
            throw new DuplicateException("이미 진행중인 초대가 존재합니다");
        }

        Child fromChild = childRepository.findById(fromChildId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child toChild = childRepository.findById(toChildId)
                .orElseThrow(() -> new UserNotFoundException("해당 친구를 찾을 수 없습니다"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("해당 책을 찾을 수 없습니다"));

        InvitationDto invitationDto = InvitationDto.builder()
                .fromId(fromChildId)
                .toId(toChildId)
                .fromName(fromChild.getName())
                .toName(toChild.getName())
                .bookTitle(book.getTitle())
                .build();

        // 초대장 Redis에 저장 (10초간 초대장 유효)
        redisDao.setValues(key, jsonConverter.toJson(invitationDto), Duration.ofSeconds(10));

        return invitationDto;
    }

    // 친구 초대 수락하기
    @Override
    public void acceptInvitation(Long bookId, Long fromChildId, Long toChildId) { // fromId: 초대를 받은 아이 ID, toId: 초대를 보낸 아이 ID
        String key = String.format(INVITATION_KEY, toChildId, fromChildId);
        if (redisDao.getValues(key) == null) {
            throw new InvitationExpiredException("이미 만료된 초대장입니다");
        }



    }

    // 친구 초대 거절하기
    @Override
    public void rejectInvitation(Long fromChildId, Long toChildId) { // fromId: 초대를 받은 아이 ID, toId: 초대를 보낸 아이 ID
        String key = String.format(INVITATION_KEY, toChildId, fromChildId);
        if (redisDao.getValues(key) == null) {
            throw new InvitationExpiredException("이미 만료된 초대장입니다");
        }

        redisDao.deleteValues(key);
    }
}

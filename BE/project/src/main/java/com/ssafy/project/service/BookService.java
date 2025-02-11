package com.ssafy.project.service;

import com.ssafy.project.dto.ChildStatusDto;
import com.ssafy.project.dto.NotificationDto;
import com.ssafy.project.dto.book.BookListDto;
import com.ssafy.project.dto.book.PageDto;
import com.ssafy.project.dto.book.BookDto;

import java.util.List;

public interface BookService {
    // 동화 목록
    List<BookDto> bookList();

    // 동화 조회
    BookListDto readBook(Long bookId);

    // 플레이 가능한 친구 목록
    List<ChildStatusDto> playAvailableList(Long childId);

    // 친구 초대 보내기
    NotificationDto sendInvitation(Long bookId, Long inviterId, Long inviteeId);

    // 친구 초대 수락하기
    void acceptInvitation(Long bookId, Long inviterId, Long inviteeId);

    // 친구 초대 거절하기
    void rejectInvitation(Long bookId, Long inviterId, Long inviteeId);

    // 친구 초대 만료
    void expireInvitation(Long bookId, Long inviterId, Long inviteeId);
}

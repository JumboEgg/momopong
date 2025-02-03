package com.ssafy.project.service;

import com.ssafy.project.dto.ChildStatusDto;
import com.ssafy.project.dto.book.BookDto;
import com.ssafy.project.dto.invitation.InvitationDto;

import java.util.List;

public interface BookService {
    // 동화 목록
    List<BookDto> bookList();

    // 플레이 가능한 친구 목록
    List<ChildStatusDto> playAvailableList(Long childId);

    // 친구 초대 보내기
    InvitationDto sendInvitation(Long bookId, Long fromChildId, Long toChildId);

    // 친구 초대 수락하기
    void acceptInvitation(Long bookId, Long fromChildId, Long toChildId);

    // 친구 초대 거절하기
    void rejectInvitation(Long bookId, Long fromChildId, Long toChildId);

}

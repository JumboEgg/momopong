package com.ssafy.project.service;

import com.ssafy.project.dto.book.BookDto;
import com.ssafy.project.dto.book.BookListDto;

import java.util.List;

public interface ProfileService {
    // 내가 참여한 동화 목록
    List<BookDto> bookList(Long childId);

    // 내가 참여한 동화 상세 조회
    BookListDto readBook(Long childId, Long bookRecordId);
}

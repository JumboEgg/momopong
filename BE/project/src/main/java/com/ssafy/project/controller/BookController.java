package com.ssafy.project.controller;

import com.ssafy.project.dto.ChildStatusDto;
import com.ssafy.project.dto.book.BookDto;
import com.ssafy.project.dto.invitation.InvitationDto;
import com.ssafy.project.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/book")
public class BookController {
    private final BookService bookService;

    // 동화 목록
    @GetMapping
    public ResponseEntity<List<BookDto>> bookList() {
        List<BookDto> bookList = bookService.bookList();

        return ResponseEntity.ok(bookList);
    }

    // 플레이 가능한 친구 목록
    @GetMapping("/{bookId}/friend/{childId}")
    public ResponseEntity<List<ChildStatusDto>> playAvailableList(@PathVariable("childId") Long childId) {
        List<ChildStatusDto> statusDtoList = bookService.playAvailableList(childId);

        return ResponseEntity.ok(statusDtoList);
    }

    // 친구 초대 보내기
    @PostMapping("/{bookId}/friend/{childId}/invitation")
    public ResponseEntity<?> sendInvitation(@PathVariable("bookId") Long bookId, @PathVariable("childId") Long fromChildId, @RequestBody Map<String, String> map) {
        Long toChildId = Long.parseLong(map.get("toChildId"));
        InvitationDto invitationDto = bookService.sendInvitation(bookId, fromChildId, toChildId);

        return ResponseEntity.ok(invitationDto);
    }

    // 친구 초대 수락하기
    @PostMapping("/{bookId}/friend/{childId}/invitation/accept")
    public ResponseEntity<?> acceptInvitation(@PathVariable("bookId") Long bookId, @PathVariable("childId") Long fromChildId, @RequestBody Map<String, String> map) {
        Long toChildId = Long.parseLong(map.get("toChildId"));
        bookService.acceptInvitation(bookId, fromChildId, toChildId);

        // 수락하면 오픈비두 방으로 이동해야 함!
        return null;
    }

    // 친구 초대 거절하기
    @PostMapping("/{bookId}/friend/{childId}/invitation/reject")
    public ResponseEntity<Void> rejectInvitation(@PathVariable("childId") Long fromChildId, @RequestBody Map<String, String> map) {
        Long toChildId = Long.parseLong(map.get("toChildId"));
        bookService.rejectInvitation(fromChildId, toChildId);

        return ResponseEntity.ok().build();
    }
}

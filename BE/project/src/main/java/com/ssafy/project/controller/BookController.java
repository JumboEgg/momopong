package com.ssafy.project.controller;

import com.ssafy.project.dto.ChildStatusDto;
import com.ssafy.project.dto.book.BookDto;
import com.ssafy.project.dto.invitation.InvitationDto;
import com.ssafy.project.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('CHILD')") // 권한이 자식이면 허용 , 부모면 미허용
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
    @PostMapping("/{bookId}/friend/{inviterId}/invitation")
    public ResponseEntity<?> sendInvitation(@PathVariable("bookId") Long bookId, @PathVariable("inviterId") Long inviterId, @RequestBody Map<String, String> map) {
        Long inviteeId = Long.parseLong(map.get("inviteeId"));
        InvitationDto invitationDto = bookService.sendInvitation(bookId, inviterId, inviteeId);

        return ResponseEntity.ok(invitationDto);
    }

    // 친구 초대 수락하기
    @PostMapping("/{bookId}/friend/{inviteeId}/invitation/accept")
    public ResponseEntity<?> acceptInvitation(@PathVariable("bookId") Long bookId, @PathVariable("inviteeId") Long inviteeId, @RequestBody Map<String, String> map) {
        Long inviterId = Long.parseLong(map.get("inviterId"));
        bookService.acceptInvitation(bookId, inviterId, inviteeId);

        // 수락하면 오픈비두 방으로 이동해야 함!
        return null;
    }

    // 친구 초대 거절하기
    @PostMapping("/{bookId}/friend/{inviteeId}/invitation/reject")
    public ResponseEntity<Void> rejectInvitation(@PathVariable("bookId") Long bookId, @PathVariable("inviteeId") Long inviteeId, @RequestBody Map<String, String> map) {
        Long inviterId = Long.parseLong(map.get("inviterId"));
        bookService.rejectInvitation(bookId, inviterId, inviteeId);

        return ResponseEntity.ok().build();
    }

    // 친구 초대 만료
    @PostMapping("/{bookId}/friend/{inviteeId}/invitation/expire")
    public ResponseEntity<Void> expireInvitation(@PathVariable("bookId") Long bookId, @PathVariable("inviteeId") Long inviteeId, @RequestBody Map<String, String> map) {
        Long inviterId = Long.parseLong(map.get("inviterId"));
        bookService.expireInvitation(bookId, inviterId, inviteeId);

        return ResponseEntity.ok().build();
    }
}

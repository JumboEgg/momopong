package com.ssafy.project.controller;

import com.ssafy.project.dto.user.ChildStatusDto;
import com.ssafy.project.dto.invitation.InviteeIdDto;
import com.ssafy.project.dto.invitation.InviterIdDto;
import com.ssafy.project.dto.invitation.NotificationDto;
import com.ssafy.project.dto.book.BookDto;
import com.ssafy.project.dto.book.BookListDto;
import com.ssafy.project.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('CHILD')") // 권한이 자식이면 허용 , 부모면 미허용
@RequestMapping("/api/book")
@Tag(name = "동화 컨트롤러")
public class BookController {
    private final BookService bookService;

    // 동화 목록
    @Operation(summary = "동화 목록", description = "전체 동화 목록을 조회한다.")
    @GetMapping
    public ResponseEntity<List<BookDto>> bookList() {
        List<BookDto> bookList = bookService.bookList();

        return ResponseEntity.ok(bookList);
    }

    // 동화 상세 페이지 조회 (동화 읽기)
    @Operation(summary = "동화 상세 페이지 조회", description = "동화의 상세 페이지를 조회한다. 동화를 읽을 때 사용한다.")
    @GetMapping("/{bookId}")
    public ResponseEntity<BookListDto> readBook(@PathVariable("bookId") Long bookId) {
        BookListDto pageDtoList = bookService.readBook(bookId);

        return ResponseEntity.ok(pageDtoList);
    }

    // 플레이 가능한 친구 목록
    @Operation(summary = "플레이 가능한 친구 목록", description = "온라인인 친구만 조회된다.")
    @GetMapping("/{bookId}/friend/{childId}")
    public ResponseEntity<List<ChildStatusDto>> playAvailableList(@PathVariable("childId") Long childId) {
        List<ChildStatusDto> statusDtoList = bookService.playAvailableList(childId);

        return ResponseEntity.ok(statusDtoList);
    }

    // 친구 초대 보내기
    @Operation(summary = "친구 초대", description = "친구에게 초대를 보낸다.")
    @PostMapping("/{bookId}/friend/{inviterId}/invitation")
    public ResponseEntity<NotificationDto> sendInvitation(@PathVariable("bookId") Long bookId,
                                                          @PathVariable("inviterId") Long inviterId,
                                                          @RequestBody InviteeIdDto inviteeIdDto) {
        log.info("sendInvitation.inviterId={}", inviterId);

        log.info("sendInvitation.inviteeIdDto={}", inviteeIdDto);
        log.info("sendInvitation.inviteeId={}", inviteeIdDto.getInviteeId());

        Long inviteeId = inviteeIdDto.getInviteeId();
        NotificationDto notificationDto = bookService.sendInvitation(bookId, inviterId, inviteeId);

        return ResponseEntity.ok(notificationDto);
    }

    // 친구 초대 수락하기
    @Operation(summary = "친구 초대 수락", description = "친구의 초대를 수락한다.")
    @PostMapping("/{bookId}/friend/{inviteeId}/invitation/accept")
    public ResponseEntity<Void> acceptInvitation(@PathVariable("bookId") Long bookId,
                                                 @PathVariable("inviteeId") Long inviteeId,
                                                 @RequestBody Map<String, String> map) {
//                                                 @RequestBody InviterIdDto inviterIdDto) {

        log.info("acceptInvitation.inviteeId={}", inviteeId);

//        log.info("acceptInvitation.inviterIdDto={}", inviterIdDto);
//        log.info("acceptInvitation.inviterId={}", inviterIdDto.getInviterId());

//        Long inviterId = inviterIdDto.getInviterId();
        Long inviterId = Long.parseLong(map.get("inviterId"));
        log.info("rejectInvitation.map={}", map);
        log.info("rejectInvitation.inviterId={}", inviterId);
        bookService.acceptInvitation(bookId, inviterId, inviteeId);

        return ResponseEntity.ok().build();
    }

    // 친구 초대 거절하기
    @Operation(summary = "친구 초대 거절", description = "친구의 초대를 거절한다.")
    @PostMapping("/{bookId}/friend/{inviteeId}/invitation/reject")
    public ResponseEntity<Void> rejectInvitation(@PathVariable("bookId") Long bookId,
                                                 @PathVariable("inviteeId") Long inviteeId,
                                                 @RequestBody Map<String, String> map) {
//                                                 @RequestBody InviterIdDto inviterIdDto) {
        log.info("rejectInvitation.inviteeId={}", inviteeId);

//        log.info("rejectInvitation.inviterIdDto={}", inviterIdDto);
//        log.info("rejectInvitation.inviterId={}", inviterIdDto.getInviterId());
//
//        Long inviterId = inviterIdDto.getInviterId();
        Long inviterId = Long.parseLong(map.get("inviterId"));
        log.info("rejectInvitation.map={}", map);
        log.info("rejectInvitation.inviterId={}", inviterId);

        bookService.rejectInvitation(bookId, inviterId, inviteeId);

        return ResponseEntity.ok().build();
    }

    // 친구 초대 만료
    @Operation(summary = "친구 초대 만료", description = "초대 유효기간이 만료되었다.")
    @PostMapping("/{bookId}/friend/{inviteeId}/invitation/expire")
    public ResponseEntity<Void> expireInvitation(@PathVariable("bookId") Long bookId,
                                                 @PathVariable("inviteeId") Long inviteeId,
                                                 @RequestBody InviterIdDto inviterIdDto) {
        Long inviterId = inviterIdDto.getInviterId();
        bookService.expireInvitation(bookId, inviterId, inviteeId);

        return ResponseEntity.ok().build();
    }
}

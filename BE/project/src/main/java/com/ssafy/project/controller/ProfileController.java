package com.ssafy.project.controller;

import com.ssafy.project.dto.book.BookDto;
import com.ssafy.project.dto.book.BookListDto;
import com.ssafy.project.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profile")
@Tag(name = "프로필 컨트롤러")
public class ProfileController {
    private final ProfileService profileService;

    @Operation(summary = "참여한 동화 목록", description = "참여한 동화 목록을 조회합니다")
    @GetMapping("/{childId}/book")
    public ResponseEntity<List<BookDto>> bookList(@PathVariable("childId") Long childId) {
        List<BookDto> bookList = profileService.bookList(childId);

        return ResponseEntity.ok(bookList);
    }

    @Operation(summary = "참여한 동화 상세 조회", description = "참여한 동화를 조회합니다")
    @GetMapping("/{childId}/book/{bookRecordId}")
    public ResponseEntity<BookListDto> readBook(@PathVariable("childId") Long childId,
                                                @PathVariable("bookRecordId") Long bookRecordId) {
        BookListDto book = profileService.readBook(childId, bookRecordId);

        return ResponseEntity.ok(book);
    }
}

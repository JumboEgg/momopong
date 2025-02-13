package com.ssafy.project.controller;


import com.ssafy.project.dto.FileDto;
import com.ssafy.project.dto.record.BookRecordPageDto;
import com.ssafy.project.service.BookRecordPageService;
import com.ssafy.project.service.PresignedUrlService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/book/record-page")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CHILD')")
@Slf4j
@Tag(name = "동화 참여 기록 페이지 컨트롤러", description = "동화 페이지에서 나오는 저장된 음성을 기록하기 위함, 나의 동화 기록 아이디와 파트너의 동화 기록 아이디가 들어 와야함")
public class BookRecordPageController {

    private final PresignedUrlService presignedUrlService;
    private final BookRecordPageService bookRecordPageService;

    //아이들 녹음 저장용 presigned-url 생성
    @GetMapping("/presigned-url")
    public ResponseEntity<FileDto> getPresignedUrl() {
        FileDto presignedUrl =  presignedUrlService.getPresignedUrl("record-audio", "wav");
        return ResponseEntity.ok(presignedUrl);
    }

    //페이지 기록 저장
    @PostMapping("/save")
    public ResponseEntity<Void> saveRecordPage(
            @RequestBody BookRecordPageDto bookRecordPageDto){

        bookRecordPageService.saveRecordPage(
                bookRecordPageDto
        );

        return ResponseEntity.ok().build();

    }



}

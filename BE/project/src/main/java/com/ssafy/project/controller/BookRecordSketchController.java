package com.ssafy.project.controller;

import com.ssafy.project.dto.FileDto;
import com.ssafy.project.dto.record.BookRecordSketchDto;
import com.ssafy.project.service.BookRecordSketchService;
import com.ssafy.project.service.PresignedUrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/book/record-sketch")
@RequiredArgsConstructor
public class BookRecordSketchController {
    private final BookRecordSketchService bookRecordSketchService;
    private final PresignedUrlService presignedUrlService;

    //아이들 녹음 저장용 presigned-url 생성
    @GetMapping("/presigned-url")
    public ResponseEntity<FileDto> getPresignedUrl() {
        FileDto presignedUrl =  presignedUrlService.getPresignedUrl("record-sketch", "webp");

        return ResponseEntity.ok(presignedUrl);
    }

    @PostMapping("/save")
    public ResponseEntity<Void> saveSketch(@RequestBody BookRecordSketchDto bookRecordSketchDto) {
        bookRecordSketchService.saveSketch(bookRecordSketchDto);

        return ResponseEntity.ok().build();
    }
}

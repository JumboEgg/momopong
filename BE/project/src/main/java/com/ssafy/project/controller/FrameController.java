package com.ssafy.project.controller;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.ssafy.project.dto.FileDto;
import com.ssafy.project.dto.FrameDto;
import com.ssafy.project.dto.LetterDto;
import com.ssafy.project.service.FrameService;
import com.ssafy.project.service.PresignedUrlService;
import lombok.RequiredArgsConstructor;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FrameController {
    private final FrameService frameService;
    private final PresignedUrlService presignedUrlService;

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;


    //그림(서브컨텐츠) 저장용 presigned-url 생성
    @GetMapping("/draw/presigned-url")
    public ResponseEntity<FileDto> getPresignedUrl() {
        FileDto presignedUrl = presignedUrlService.getPresignedUrl("audio", "webp");
        return ResponseEntity.ok(presignedUrl);
    }


    //그림(서브컨텐츠) 저장
    @PostMapping("/draw/{childId}")
    public ResponseEntity<Void> saveFrame(
            @PathVariable("childId") Long childId,
            @RequestBody FrameDto framedto){

        frameService.saveFrame(
                childId,
                framedto.getFrameTitle(),
                framedto.getFrameFileName()
        );



        return ResponseEntity.ok().build();
    }

    // 해당 아이의 모든 그림(서브컨텐츠) 조회
    @GetMapping("/profile/{childId}/frame")
    public ResponseEntity<List<FrameDto>> getFrameList(
            @PathVariable("childId") Long childId){
        try {
            List<FrameDto> frames = frameService.getFramesByChildId(childId);
            return ResponseEntity.ok(frames);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




}

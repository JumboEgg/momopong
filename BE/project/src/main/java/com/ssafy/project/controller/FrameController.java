package com.ssafy.project.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.ssafy.project.dto.FileDto;
import com.ssafy.project.dto.FrameDto;
import com.ssafy.project.service.FrameService;
import com.ssafy.project.service.PresignedUrlService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Tag(name = "서브컨텐츠 작품 컨트롤러", description = "아이의 작품을 조회, 저장")
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
    @GetMapping("/frame/presigned-url")
    public ResponseEntity<FileDto> getPresignedUrl() {
        FileDto presignedUrl = presignedUrlService.getPresignedUrl("frame", "webp");
        return ResponseEntity.ok(presignedUrl);
    }


    //그림(서브컨텐츠) 저장
    @PostMapping("/frame/{childId}")
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

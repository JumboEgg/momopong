package com.ssafy.project.controller;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.ssafy.project.dto.LetterDto;
import com.ssafy.project.service.LetterService;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('CHILD')")
@CrossOrigin(origins = "*")  // CORS 설정 추가
public class LetterController {
    private final LetterService letterService;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;


    @Autowired
    public LetterController(LetterService letterService, AmazonS3 amazonS3) {
        this.letterService = letterService;
        this.amazonS3 = amazonS3;
    }

    //편지 저장용 presigned-url 생성
    @GetMapping("/book/letter/presigned-url")
    public ResponseEntity<Map<String, String>> getPresignedUrl() {

        Map<String, String> response = letterService.getPresignedUrl();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/book/letter/")



    // gpt api 답장을 받고 편지 DB저장
    @PostMapping("/book/letter/gpt/{childId}")
    public ResponseEntity<Map<String, String>> getGPTResponse(
            @PathVariable("childId") Long childId,
            @RequestBody LetterDto request) {



        // GPT 응답 생성
        String gptResponse = letterService.getGPTResponse(
                request.getBookTitle(),
                request.getRole(),
                request.getChildName(),
                request.getContent()
        );

        // DB에 저장
        letterService.saveLetter(
                childId,
                request.getContent(),
                gptResponse,
                request.getBookTitle(),
                request.getRole(),
                request.getLetterFileName()
        );

        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", gptResponse);

        return ResponseEntity.ok(responseMap);
    }

    // 해당 아이의 특정 편지 조회
    @GetMapping("/profile/{childId}/letter/{letterId}")
    public ResponseEntity<LetterDto> getLetter(
            @PathVariable("childId") Long childId,
            @PathVariable("letterId") Long letterId) {
        try {
            LetterDto letter = letterService.getLetter(childId, letterId);

            return ResponseEntity.ok(letter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 해당 아이의 모든 편지 조회
    @GetMapping("/profile/{childId}/letter")
    public ResponseEntity<List<LetterDto>> getLetterList(
            @PathVariable("childId") Long childId) {
        try {
            List<LetterDto> letters = letterService.getLettersByChildId(childId);
            return ResponseEntity.ok(letters);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

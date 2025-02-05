package com.ssafy.project.controller;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.ssafy.project.domain.Letter;
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

    @GetMapping("/book/letter/presigned-url")
    public ResponseEntity<Map<String, String>> getPresignedUrl() {

        try {
            String fileName = "letters/" + UUID.randomUUID().toString() + ".wav";

            GeneratePresignedUrlRequest generatePresignedUrlRequest =
                    new GeneratePresignedUrlRequest(bucket, fileName)
                            .withMethod(HttpMethod.PUT)
                            .withExpiration(DateTime.now().plusMinutes(5).toDate());

            URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);

            Map<String, String> response = new HashMap<>();
            response.put("presignedUrl", url.toString());
            response.put("fileUrl", "https://" + bucket + ".s3.amazonaws.com/" + fileName);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 에러 로깅 추가

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


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
                request.getLetterRecord() // S3 URL
        );

        // 응답을 JSON 형식으로 감싸기
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", gptResponse);

        return ResponseEntity.ok(responseMap);
    }

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

package com.ssafy.project.controller;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.ssafy.project.domain.Letter;
import com.ssafy.project.service.LetterService;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/book/letter")
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

    @GetMapping("/presigned-url")
    public ResponseEntity<Map<String, String>> getPresignedUrl() {
        try {
            String fileName = "letters/" + UUID.randomUUID().toString() + ".wav";

            GeneratePresignedUrlRequest generatePresignedUrlRequest =
                    new GeneratePresignedUrlRequest(bucket, fileName)
                            .withMethod(HttpMethod.PUT)
                            .withExpiration(DateTime.now().plusMinutes(5).toDate());

            URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);

            System.out.println("url: "  + url);

            Map<String, String> response = new HashMap<>();
            response.put("presignedUrl", url.toString());
            response.put("fileUrl", "https://" + bucket + ".s3.amazonaws.com/" + fileName);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 에러 로깅 추가

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/gpt/{childId}")
    public ResponseEntity<Map<String, String>> getGPTResponse(
            @PathVariable Long childId,
            @RequestBody Map<String, String> request) {

        // GPT 응답 생성
        String gptResponse = letterService.getGPTResponse(
                request.get("fairyTale"),
                request.get("role"),
                request.get("childName"),
                request.get("content")
        );

        // DB에 저장
        Letter letter = letterService.saveLetter(
                childId,
                request.get("content"),
                gptResponse,
                request.get("role"),
                request.get("letterRecord")  // S3 URL
        );

        // 응답을 JSON 형식으로 감싸기
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", gptResponse);

        return ResponseEntity.ok(responseMap);
    }
}

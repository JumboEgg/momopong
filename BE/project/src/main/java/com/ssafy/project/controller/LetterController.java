package com.ssafy.project.controller;

import com.ssafy.project.service.LetterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")  // CORS 설정 추가
public class LetterController {
    private final LetterService letterService;

    @Autowired
    public LetterController(LetterService letterService) {
        this.letterService = letterService;
    }

    @PostMapping("/gpt")
    public ResponseEntity<Map<String, String>> getGPTResponse(@RequestBody Map<String, String> request) {
        // GPT 응답 생성 로직
        String response = letterService.getGPTResponse(
                request.get("fairyTale"),
                request.get("role"),
                request.get("childName"),
                request.get("content")
        );

        // 응답을 JSON 형식으로 감싸기
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", response);

        return ResponseEntity.ok(responseMap);
    }
}

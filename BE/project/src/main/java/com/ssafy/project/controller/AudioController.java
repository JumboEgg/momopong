package com.ssafy.project.controller;

import com.ssafy.project.service.AudioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/audio")
//@Slf4j
//public class AudioController {
//
//    private final AudioService audioService;
//
//
//    // 단일 오디오 파일 URL 가져오기
//    @GetMapping("/{audioNum}")
//    public ResponseEntity<Map<String, String>> getAudioUrl(
//            @PathVariable String audioNum) {
//        try {
//            // audio/fairytaleName/pageNumber.mp3 형식으로 경로 생성
//            String audioPath = String.format("audio/%s.mp3", audioNum);
//            String signedUrl = audioService.generateSignedUrl(audioPath);
//
//            Map<String, String> response = new HashMap<>();
//            response.put("audioUrl", signedUrl);
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            log.error("Audio URL 생성 실패", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
////
////    // 동화별 모든 오디오 파일 URL 가져오기
////    @GetMapping("/{fairytaleName}")
////    public ResponseEntity<List<Map<String, String>>> getAllAudioUrls(
////            @PathVariable String fairytaleName) {
////        try {
////            // 동화별 총 페이지 수 설정
////            int totalPages = getTotalPages(fairytaleName);
////            List<Map<String, String>> audioUrls = new ArrayList<>();
////
////            for (int i = 1; i <= totalPages; i++) {
////                String audioPath = String.format("audio/%s/%d.mp3", fairytaleName, i);
////                String signedUrl = cloudFrontService.generateSignedUrl(audioPath);
////
////                Map<String, String> audioInfo = new HashMap<>();
////                audioInfo.put("pageNumber", String.valueOf(i));
////                audioInfo.put("audioUrl", signedUrl);
////                audioUrls.add(audioInfo);
////            }
////
////            return ResponseEntity.ok(audioUrls);
////        } catch (Exception e) {
////            log.error("Audio URLs 생성 실패", e);
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
////        }
////    }
////
////    // 페이지네이션이 적용된 오디오 URL 목록 가져오기
////    @GetMapping("/{fairytaleName}/pages")
////    public ResponseEntity<Map<String, Object>> getPagedAudioUrls(
////            @PathVariable String fairytaleName,
////            @RequestParam(defaultValue = "1") int page,
////            @RequestParam(defaultValue = "20") int size) {
////        try {
////            int totalPages = getTotalPages(fairytaleName);
////            int start = (page - 1) * size + 1;
////            int end = Math.min(start + size - 1, totalPages);
////
////            List<Map<String, String>> audioUrls = new ArrayList<>();
////            for (int i = start; i <= end; i++) {
////                String audioPath = String.format("audio/%s/%d.mp3", fairytaleName, i);
////                String signedUrl = cloudFrontService.generateSignedUrl(audioPath);
////
////                Map<String, String> audioInfo = new HashMap<>();
////                audioInfo.put("pageNumber", String.valueOf(i));
////                audioInfo.put("audioUrl", signedUrl);
////                audioUrls.add(audioInfo);
////            }
////
////            Map<String, Object> response = new HashMap<>();
////            response.put("totalPages", totalPages);
////            response.put("currentPage", page);
////            response.put("audioUrls", audioUrls);
////
////            return ResponseEntity.ok(response);
////        } catch (Exception e) {
////            log.error("Paged audio URLs 생성 실패", e);
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
////        }
////    }
////
////    private int getTotalPages(String fairytaleName) {
////        // 동화별 총 페이지 수 반환
////        return switch (fairytaleName.toLowerCase()) {
////            case "cinderella" -> 60;
////            case "heungbu" -> 30;
////            default -> throw new IllegalArgumentException("Unknown fairytale: " + fairytaleName);
////        };
////    }
//}

@RestController
@RequestMapping("/api/audio")
@RequiredArgsConstructor
@Slf4j
public class AudioController {

    private final AudioService audioService;

    @GetMapping("/{audioNum}")
    public ResponseEntity<Map<String, String>> getAudioUrl(@PathVariable String audioNum) {
        try {
            String audioPath = String.format("audio/%s.mp3", audioNum);
            String url = audioService.getSignedUrl(audioPath);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in controller", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
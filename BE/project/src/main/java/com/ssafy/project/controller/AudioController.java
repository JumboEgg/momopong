package com.ssafy.project.controller;

import com.ssafy.project.service.AudioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

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
package com.ssafy.project.firebase;

import com.ssafy.project.dto.ChildIdDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "FCM 컨트롤러", description = "실시간 알림 전송을 위한 컨트롤러")
public class FcmController {
    private final FcmService fcmService;

    // FCM 토큰 저장하기 (로그인 할 때)
    @Operation(summary = "Vapid 토큰 저장하기", description = "로그인 시 자식 사용자의 Vapid 토큰을 Redis에 저장한다.")
    @PostMapping("/fcm/save-token")
    public ResponseEntity<Void> saveToken(@RequestBody FcmDto fcmDto) {
        fcmService.saveToken(fcmDto);

        return ResponseEntity.ok().build();
    }

    // FCM 토큰 조회 후 (로그아웃 할 때)
    @Operation(summary = "Vapid 토큰 삭제하기", description = "로그아웃 시 자식 사용자의 Vapid 토큰을 Redis에서 삭제한다.")
    @PostMapping("/fcm/delete-token")
    public ResponseEntity<Void> deleteToken(@RequestBody ChildIdDto childIdDto) {
        fcmService.deleteToken(childIdDto.getChildId());

        return ResponseEntity.ok().build();
    }
}

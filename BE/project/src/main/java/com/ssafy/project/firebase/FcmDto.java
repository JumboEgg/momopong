package com.ssafy.project.firebase;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Vapid Token 저장을 위한 DTO
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FcmDto {

    @Schema(description = "자식 ID")
    private Long childId;

    @Schema(description = "VAPID 토큰")
    private String token;
}

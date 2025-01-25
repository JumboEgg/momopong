package com.ssafy.project.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@AllArgsConstructor
@Getter
public class JwtToken {
    private String grantType; // JWT에 대한 인증 타입 (ex. Bearer)
    private String accessToken;
    private String refreshToken;
}

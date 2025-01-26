package com.ssafy.project.security;

import com.ssafy.project.dao.RedisDao;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class JwtTokenProviderTest {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private RedisDao redisDao;

    private Authentication authentication;
    private JwtToken jwtToken;

    private static String ROLE = "ROLE_USER";
    private static String EMAIL = "hong@naver.com";

    @BeforeEach
    void beforeEach() {
        // JWT 토큰 생성하기
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(ROLE));
        authentication = new UsernamePasswordAuthenticationToken(EMAIL, "", authorities);

        jwtToken = jwtTokenProvider.generateToken(authentication);
    }

    @Test
    void generateTokenTest() {
        // JWT 토큰 확인
        assertThat(jwtToken.getGrantType()).isEqualTo("Bearer");
        assertThat(jwtToken.getAccessToken()).isNotNull();
        assertThat(jwtToken.getRefreshToken()).isNotNull();
    }

    @Test
    void storeRefreshTokenTest() {
        // Redis에 Refresh Token 저장되었는지 확인
        assertThat(redisDao.getValues(EMAIL)).isNotNull();
    }

    @Test
    void getAuthenticationTest() {
        // 인증 정보 확인
        Authentication auth = jwtTokenProvider.getAuthentication(jwtToken.getAccessToken());
        assertThat(auth.getName()).isEqualTo(EMAIL);
        assertThat(auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(ROLE))).isTrue();
    }

    @Test
    void parseClaimsTest() {
        // Claim 확인
        Claims claims = jwtTokenProvider.parseClaims(jwtToken.getAccessToken());
        assertThat(claims.getSubject()).isEqualTo(EMAIL);
        assertThat(claims.get("auth")).isEqualTo(ROLE);
    }

    @Test
    void validateTokenTest() {
        // Token 유효성 확인
        assertThat(jwtTokenProvider.validateToken(jwtToken.getAccessToken())).isTrue();
    }

    @Test
    void validateRefreshTokenTest() {
        // Refresh Token 유효성 확인
        assertThat(jwtTokenProvider.validateRefreshToken(jwtToken.getRefreshToken())).isTrue();
    }

    @Test
    void invalidateTokenTest() throws InterruptedException {
        // Token 유효성 실패 확인
        ReflectionTestUtils.setField(jwtTokenProvider, "ACCESS_TOKEN_EXPIRE_TIME", 1000);
        ReflectionTestUtils.setField(jwtTokenProvider, "REFRESH_TOKEN_EXPIRE_TIME", 1000);

        JwtToken invalidateToken = jwtTokenProvider.generateToken(authentication);

        Thread.sleep(1100);

        assertThat(jwtTokenProvider.validateToken(invalidateToken.getAccessToken())).isFalse();
        assertThat(jwtTokenProvider.validateRefreshToken(invalidateToken.getRefreshToken())).isFalse();

        assertThat(redisDao.getValues(EMAIL)).isNull();
    }

    @Test
    void getUserNameFromTokenTest() {
        String userNameFromToken = jwtTokenProvider.getUserNameFromToken(jwtToken.getAccessToken());
        assertThat(userNameFromToken).isEqualTo(EMAIL);
    }

    @Test
    void deleteRefreshTokenTest() {
        // 정상 케이스
        jwtTokenProvider.deleteRefreshToken(EMAIL);
        assertThat(redisDao.getValues(EMAIL)).isNull();

        // 예외 케이스
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> jwtTokenProvider.deleteRefreshToken(null));
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> jwtTokenProvider.deleteRefreshToken(""));
    }
}
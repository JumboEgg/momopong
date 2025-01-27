package com.ssafy.project.security;

import com.ssafy.project.dao.RedisDao;
import com.ssafy.project.exception.JwtAuthenticationException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Duration;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {
    private final Key key;
    private final UserDetailsService userDetailsService;
    private final RedisDao redisDao;
    private final TokenBlacklistService tokenBlacklistService;

    @Value("${jwt.access-token.expire-time}")
    private long ACCESS_TOKEN_EXPIRE_TIME;

    @Value("${jwt.refresh-token.expire-time}")
    private long REFRESH_TOKEN_EXPIRE_TIME;

    private static final String GRANT_TYPE = "Bearer";

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey, UserDetailsService userDetailsService, RedisDao redisDao,
                            TokenBlacklistService tokenBlacklistService) {
        byte[] keyBytes = Base64.getEncoder().encode(secretKey.getBytes());
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.userDetailsService = userDetailsService;
        this.redisDao = redisDao;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    // Access Token, Refresh Token 생성하기
    public JwtToken generateTokenWithAuthentication(Authentication authentication) {
        // 권한 가져오기
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long now = (new Date()).getTime();
        String email = authentication.getName();

        return generateToken(now, email, authorities);
    }

    // Access Token, Refresh Token 갱신하기
    public JwtToken generateTokenWithRefreshToken(String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        long now = (new Date()).getTime();

        return generateToken(now, email, authorities);
    }

    // JWT 토큰 생성하기
    private JwtToken generateToken(long now, String email, String authorities) {
        // Access Token 생성
        Date accessTokenExpireDate = new Date(now + ACCESS_TOKEN_EXPIRE_TIME);
        String accessToken = generateAccessToken(email, authorities, accessTokenExpireDate);

        // Refresh Token 생성
        Date refreshTokenExpireDate = new Date(now + REFRESH_TOKEN_EXPIRE_TIME);
        String refreshToken = generateRefreshToken(email, refreshTokenExpireDate);

        // Refresh Token 저장
        redisDao.setValues(email, refreshToken, Duration.ofMillis(REFRESH_TOKEN_EXPIRE_TIME));

        return JwtToken.builder()
                .grantType(GRANT_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // Access Token 생성
    private String generateAccessToken(String email, String authorities, Date expireDate) {
        return Jwts.builder()
                .setSubject(email) // 토큰 제목
                .claim("auth", authorities) // 권한 정보
                .setExpiration(expireDate) // 토큰 만료 시간
                .signWith(key, SignatureAlgorithm.HS256) // 지정된 키와 알고리즘으로 서명
                .compact(); // 최종 JWT 문자열 생성
    }

    // Refresh Token 생성
    private String generateRefreshToken(String email, Date expireDate) {
        return Jwts.builder()
                .setSubject(email)
                .setExpiration(expireDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT 토큰에서 인증 정보 꺼내기
    public Authentication getAuthentication(String token) {
        // JWT 토큰 복호화 (Claim 가져오기)
        Claims claims = parseClaims(token);
        if (claims.get("auth") == null) {
            throw new JwtAuthenticationException("권한 정보가 없는 토큰입니다");
        }

        // Claim에서 권한 정보 가져오기
        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("auth").toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .toList();

        // UserDetails 객체 만들어서 인증 정보 리턴하기
        UserDetails userDetails = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(userDetails, "", authorities);
    }

    /// JWT 토큰 복호화 (Claim 가져오기)
    public Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token) // 토큰 검증 & 파싱
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // 토큰 정보 검증
    public boolean validateToken(String token) {
        try {
            // JWT 토큰 확인
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            // JWT 블랙리스트에 존재하는지 확인
            return !tokenBlacklistService.isBlacklisted(token);
        } catch (SecurityException | MalformedJwtException e) {
            log.warn("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty", e);
        }
        return false;
    }

    // RefreshToken 검증
    public boolean validateRefreshToken(String token) {
        // 기본적인 JWT 검증
        if (!validateToken(token)) return false;

        try {
            // token에서 email 추출
            String email = getEmailFromToken(token);
            // Redis에 저장된 RefreshToken과 비교
            String redisToken = (String) redisDao.getValues(email);
            return token.equals(redisToken);
        } catch (Exception e) {
            log.info("RefreshToken Validation Failed", e);
            return false;
        }
    }

    // 토큰에서 username 추출
    public String getEmailFromToken(String token) {
        try {
            // 토큰 파싱해서 클레임 얻기
            Claims claims = parseClaims(token);

            // subject에 저장된 username 반환
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            // 토큰이 만료되어도 클레임 내용을 가져올 수 있음
            return e.getClaims().getSubject();
        }
    }

    // Refresh Token 삭제
    public void deleteRefreshToken(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }

        // 로그아웃 시 Redis에서 RefreshToken 삭제
        redisDao.deleteValues(email);
    }
}

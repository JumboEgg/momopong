package com.ssafy.project.security;

import com.ssafy.project.dao.RedisDao;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Date;

// 토큰 갱신시 이전 토큰 폐기
@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisDao redisDao;
    private static final String BLACKLIST_PREFIX = "blacklist:";

    public void addBlacklist(String token) {
        String key = BLACKLIST_PREFIX + token;
        // key 조회용 => data 중요하지 않음
        Claims claims = jwtTokenProvider.parseClaims(token);
        Date expiration = claims.getExpiration();
        long now = new Date().getTime();
        long remainingExpiration = expiration.getTime() - now;
        if (remainingExpiration > 0) { // 남은 만료시간만큼 블랙리스트로 등록
            redisDao.setValues(key, "", Duration.ofMillis(remainingExpiration));
        }
    }

    public boolean isBlacklisted(String token) {
        String key = BLACKLIST_PREFIX + token;
        return redisDao.getValues(key) != null;
    }
}

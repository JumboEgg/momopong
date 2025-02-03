package com.ssafy.project.security;

import com.ssafy.project.dao.RedisDao;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisDao redisDao;
    private static final String BLACKLIST_PREFIX = "blacklist:";

    @Value("${jwt.access-token.expire-time}")
    private long ACCESS_TOKEN_EXPIRE_TIME;

    public void addBlacklist(String token) {
        String key = BLACKLIST_PREFIX + token;
        // key 조회용 => data 중요하지 않음
        redisDao.setValues(key, "", Duration.ofMillis(ACCESS_TOKEN_EXPIRE_TIME));
    }

    public boolean isBlacklisted(String token) {
        String key = BLACKLIST_PREFIX + token;
        return redisDao.getValues(key) != null;
    }
}

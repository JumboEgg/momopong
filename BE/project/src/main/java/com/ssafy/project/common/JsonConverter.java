package com.ssafy.project.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
@Configuration
@RequiredArgsConstructor
public class JsonConverter {
    private final ObjectMapper objectMapper;

    // DTO를 문자열로 변환 , REDIS에 올라갈때
    public <T> String toJson(T object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
    // 문자열을 DTO로 변환 , REDIS에서 가져올때
    public <T> T fromJson(String json, Class<T> valueType) {
        try {
            return objectMapper.readValue(json, valueType);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}

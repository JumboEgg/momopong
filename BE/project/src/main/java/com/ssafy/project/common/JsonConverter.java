package com.ssafy.project.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class JsonConverter {
    private final ObjectMapper objectMapper;

    public <T> String toJson(T object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public <T> T fromJson(String json, Class<T> valueType) {
        try {
            return objectMapper.readValue(json, valueType);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}

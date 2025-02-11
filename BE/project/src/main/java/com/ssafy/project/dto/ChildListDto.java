package com.ssafy.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChildListDto {
    private Long childId;
    private String name;
    private String profile;
    private int age; // 나이
    private LocalDate createdAt; // 가입일
}

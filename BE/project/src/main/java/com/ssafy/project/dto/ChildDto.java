package com.ssafy.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChildDto {

    private Long childId;
    private String name;
    private String profile;
    private int age;
    private int daysSinceStart; // 시작일로부터 며칠 지났는지
    private String code;
    private boolean firstLogin;

    public void updateProfile(String profile) {
        this.profile = profile;
    }
}

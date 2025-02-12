package com.ssafy.project.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChildUpdateRequestDto {
    private Long childId;
    private String name;
    private String profile;
}

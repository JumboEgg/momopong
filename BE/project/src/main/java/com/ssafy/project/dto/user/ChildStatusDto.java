package com.ssafy.project.dto.user;

import com.ssafy.project.domain.type.StatusType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChildStatusDto {
    private Long childId;
    private String name;
    private StatusType status;
}

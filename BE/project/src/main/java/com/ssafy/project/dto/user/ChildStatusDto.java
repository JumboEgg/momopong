package com.ssafy.project.dto.user;

import com.ssafy.project.domain.type.StatusType;
import lombok.*;

@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ChildStatusDto {
    private Long childId;
    private String name;
    private StatusType status;
}

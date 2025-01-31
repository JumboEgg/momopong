package com.ssafy.project.dto.friend;

import com.ssafy.project.domain.type.StatusType;
import lombok.*;

@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendListDto {
    private Long childId;
    private String name;
    private String profile;
    private StatusType status;
}

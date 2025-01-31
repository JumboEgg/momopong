package com.ssafy.project.dto.friend;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendDto {
    private Long friendId;
    private Long fromId;
    private Long toId;
}

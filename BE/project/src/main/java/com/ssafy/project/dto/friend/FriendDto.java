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
    // '위디'가 친구 요청을 보냈어요
    private Long friendId; // 친구 ID
    private String fromProfile; // 초대 보낸 아이 프로필
    private String fromName; // 초대 보낸 아이 이름
    private Long fromId; // 초대 보낸 아이 ID
    private Long toId; // 초대 보낸 아이 이름
}

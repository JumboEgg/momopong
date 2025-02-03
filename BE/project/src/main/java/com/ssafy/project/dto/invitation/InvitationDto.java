package com.ssafy.project.dto.invitation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvitationDto {
    private Long fromId; // 초대장을 보낸 아이 ID
    private Long toId; // 초대장을 받은 아이 ID
    private String fromName; // 초대장을 보낸 아이 이름
    private String toName; // 초대장을 받은 아이 이름
    private String bookTitle; // 책 제목
}

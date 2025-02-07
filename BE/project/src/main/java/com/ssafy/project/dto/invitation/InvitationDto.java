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
    private Long inviterId; // 초대장을 보낸 아이 ID
    private Long inviteeId; // 초대장을 받은 아이 ID
    private String inviterName; // 초대장을 보낸 아이 이름
    private String inviteeName; // 초대장을 받은 아이 이름
    private String bookTitle; // 책 제목
    private Long bookId; // 책 ID
}

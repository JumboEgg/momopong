package com.ssafy.project.service;

import com.ssafy.project.dto.friend.FriendDto;
import com.ssafy.project.dto.friend.FriendListDto;

import java.util.List;

public interface FriendService {
    // 친구 목록
    List<FriendListDto> friendList(Long fromId);

    // 친구 삭제
    void deleteFriend(Long friendId);

    // 친구 요청 목록
    List<FriendDto> friendRequestList(Long childId);

    // 친구 추가 요청
    FriendDto requestFriend(Long fromId, String code); // 친구 요청을 받는 친구 코드

    // 친구 요청 거절
    void rejectFriend(Long friendId, Long childId);

    // 친구 요청 수락
    void acceptFriend(Long friendId, Long childId);
}

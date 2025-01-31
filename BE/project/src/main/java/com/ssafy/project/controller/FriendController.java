package com.ssafy.project.controller;

import com.ssafy.project.dto.friend.FriendDto;
import com.ssafy.project.dto.friend.FriendListDto;
import com.ssafy.project.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/children")
public class FriendController {
    private final FriendService friendService;

    // 친구 목록
    @GetMapping("/{childId}/friends")
    public ResponseEntity<List<FriendListDto>> friendList(@PathVariable("childId") Long childId) {
        List<FriendListDto> friendList = friendService.friendList(childId);

        return ResponseEntity.ok(friendList);
    }

    // 친구 삭제
    @DeleteMapping("{childId}/friends/{friendId}")
    public ResponseEntity<Void> deleteFriend(@PathVariable("childId") Long childId, @PathVariable("friendId") Long friendId) {
        friendService.deleteFriend(friendId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 친구 요청 목록
    @GetMapping("/{childId}/friend-requests")
    public ResponseEntity<List<FriendDto>> friendRequestList(@PathVariable("childId") Long childId) {
        List<FriendDto> requestList = friendService.friendRequestList(childId);

        return ResponseEntity.ok(requestList);
    }

    // 친구 요청
    @PostMapping("/{childId}/friend-requests")
    public ResponseEntity<FriendDto> requestFriend(@PathVariable("childId") Long childId, @RequestBody Map<String, String> map) {
        String code = map.get("code");
        FriendDto friendDto = friendService.requestFriend(childId, code);

        return ResponseEntity.ok(friendDto);
    }

    // 친구 요청 수락
    @PostMapping("/{childId}/friend-requests/{friendId}")
    public ResponseEntity<Void> acceptFriend(@PathVariable("childId") Long childId, @PathVariable("friendId") Long friendId) {
        friendService.acceptFriend(friendId, childId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 친구 요청 거절
    @DeleteMapping("/{childId}/friend-requests/{friendId}")
    public ResponseEntity<Void> rejectFriend(@PathVariable("childId") Long childId, @PathVariable("friendId") Long friendId) {
        friendService.rejectFriend(friendId, childId);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}

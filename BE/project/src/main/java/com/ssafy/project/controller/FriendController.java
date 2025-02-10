package com.ssafy.project.controller;

import com.ssafy.project.dto.friend.FriendDto;
import com.ssafy.project.dto.friend.FriendListDto;
import com.ssafy.project.service.FriendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('CHILD')")
@RequestMapping("/api/children")
@Tag(name = "친구 컨트롤러")
public class FriendController {
    private final FriendService friendService;

    // 친구 목록
    @Operation(summary = "친구 목록 조회", description = "친구 목록을 조회한다.")
    @GetMapping("/{childId}/friends")
    public ResponseEntity<List<FriendListDto>> friendList(@PathVariable("childId") Long childId) {
        List<FriendListDto> friendList = friendService.friendList(childId);

        return ResponseEntity.ok(friendList);
    }

    // 친구 삭제
    @Operation(summary = "친구 삭제", description = "친구를 삭제한다.")
    @DeleteMapping("{childId}/friends/{friendId}")
    public ResponseEntity<Void> deleteFriend(@PathVariable("childId") Long childId, @PathVariable("friendId") Long friendId) {
        friendService.deleteFriend(friendId);

        return ResponseEntity.ok().build();
    }

    // 친구 요청 목록
    @Operation(summary = "친구 요청 목록", description = "친구 요청 목록을 조회한다.")
    @GetMapping("/{childId}/friend-requests")
    public ResponseEntity<List<FriendDto>> friendRequestList(@PathVariable("childId") Long childId) {
        List<FriendDto> requestList = friendService.friendRequestList(childId);

        return ResponseEntity.ok(requestList);
    }

    // 친구 요청
    @Operation(summary = "친구 요청", description = "친구 요청을 전송한다.")
    @PostMapping("/{childId}/friend-requests")
    public ResponseEntity<FriendDto> requestFriend(@PathVariable("childId") Long childId, @RequestBody Map<String, String> map) {
        String code = map.get("code");
        FriendDto friendDto = friendService.requestFriend(childId, code);

        return ResponseEntity.ok(friendDto);
    }

    // 친구 요청 수락
    @Operation(summary = "친구 요청 수락", description = "친구 요청을 수락한다.")
    @PostMapping("/{childId}/friend-requests/{friendId}")
    public ResponseEntity<Void> acceptFriend(@PathVariable("childId") Long childId, @PathVariable("friendId") Long friendId) {
        friendService.acceptFriend(friendId, childId);

        return ResponseEntity.ok().build();
    }

    // 친구 요청 거절
    @Operation(summary = "친구 요청 거절", description = "친구 요청을 거절한다.")
    @DeleteMapping("/{childId}/friend-requests/{friendId}")
    public ResponseEntity<Void> rejectFriend(@PathVariable("childId") Long childId, @PathVariable("friendId") Long friendId) {
        friendService.rejectFriend(friendId, childId);

        return ResponseEntity.ok().build();
    }
}

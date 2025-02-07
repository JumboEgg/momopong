package com.ssafy.project.service;

import com.ssafy.project.common.JsonConverter;
import com.ssafy.project.dao.RedisDao;
import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Friend;
import com.ssafy.project.domain.type.StatusType;
import com.ssafy.project.dto.ChildStatusDto;
import com.ssafy.project.dto.friend.FriendDto;
import com.ssafy.project.dto.friend.FriendListDto;
import com.ssafy.project.exception.friend.AlreadyAcceptedException;
import com.ssafy.project.exception.friend.FriendNotFoundException;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.exception.friend.IllegalFriendRequestException;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.FriendRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {
    private final FriendRepository friendRepository;
    private final ChildRepository childRepository;
    private final PresignedUrlService presignedUrlService;
    private final RedisDao redisDao;
    private final JsonConverter jsonConverter;

    private static final String CHILD_STATUS_KEY = "child:status:%d";

    // 친구 목록
    @Override
    public List<FriendListDto> friendList(Long fromId) {
        Child fromChild = childRepository.findById(fromId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        List<Friend> friendList = friendRepository.findAllByFrom(fromChild);
        return friendList.stream()
                .map(friend -> {
                    Child toChild = childRepository.findById(friend.getTo().getId())
                            .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

                    // Redis에서 상태 가져오기
                    StatusType status;
                    String key = String.format(CHILD_STATUS_KEY, friend.getId());
                    Object json = redisDao.getValues(key);
                    if (json == null) status = StatusType.OFFLINE;
                    else status = jsonConverter.fromJson((String) json, ChildStatusDto.class).getStatus();

                    return  FriendListDto.builder()
                            .childId(toChild.getId())
                            .name(toChild.getName())
                            .profile(presignedUrlService.getProfile(toChild.getProfile()))
                            .status(status).build();
                })
                .collect(Collectors.toList());
    }

    // 친구 삭제
    @Override
    public void deleteFriend(Long friendId) {
        // 양방향으로 삭제해야 함
        Friend friend = friendRepository.findById(friendId)
                .orElseThrow(() -> new FriendNotFoundException("친구 정보를 찾을 수 없습니다"));

        friendRepository.delete(friend);

        // 양방향으로 된 친구 삭제
        Friend reverseFriend = friendRepository.findByFromAndTo(friend.getTo(), friend.getFrom())
                .orElseThrow(() -> new FriendNotFoundException("친구 정보를 찾을 수 없습니다"));
        friendRepository.delete(reverseFriend);
    }

    //  친구 요청 목록
    @Override
    public List<FriendDto> friendRequestList(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        List<Friend> requestList = friendRepository.findAllByToAndStatusIs(child, false);

        return requestList.stream()
                .map(request -> FriendDto.builder()
                        .friendId(request.getId())
                        .fromId(request.getFrom().getId())
                        .fromName(request.getFrom().getName())
                        .fromProfile(presignedUrlService.getProfile(request.getFrom().getProfile()))
                        .toId(request.getTo().getId()).build())
                .collect(Collectors.toList());
    }

    // 친구 추가 요청
    @Override
    public FriendDto requestFriend(Long fromId, String code) {
        Child fromChild = childRepository.findById(fromId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));
        Child toChild = childRepository.findByCode(code)
                .orElseThrow(() -> new UserNotFoundException("해당 코드의 사용자를 찾을 수 없습니다"));

        // 친구 요청을 이미 보냈는지 확인
        if (friendRepository.findByFromAndTo(fromChild, toChild).isPresent()) {
            throw new AlreadyAcceptedException("친구 요청을 이미 보냈거나 친구인 사용자입니다");
        }

        // 자기 자신에게 요청을 보냈는지 확인
        if (fromChild.getId().equals(toChild.getId())) {
            throw new IllegalFriendRequestException("자신에게는 친구 요청을 보낼 수 없습니다");
        }

        Friend friend = Friend.builder()
                .from(fromChild)
                .to(toChild)
                .status(false).build();

        // 반대로 된 요청이 존재하는지 확인
        Friend reverseFriend = friendRepository.findByFromAndTo(toChild, fromChild).orElse(null);
        if (reverseFriend != null) { // 반대로 된 요청이 존재하면 자동으로 요청 수락
            reverseFriend.updateStatus();
            friend.updateStatus();
        }

        Friend saved = friendRepository.save(friend);
        return FriendDto.builder()
                .friendId(saved.getId())
                .fromId(fromChild.getId())
                .fromName(fromChild.getName())
                .fromProfile(presignedUrlService.getProfile(fromChild.getProfile()))
                .toId(toChild.getId()).build();
    }

    // 친구 요청 거절
    @Override
    public void rejectFriend(Long friendId, Long childId) {
        Friend friend = friendRepository.findById(friendId)
                .orElseThrow(() -> new FriendNotFoundException("친구 요청을 찾을 수 없습니다"));

        // 요청 받은 사람이 childId가 맞는지 확인
        if (!friend.getTo().getId().equals(childId)) {
            throw new IllegalFriendRequestException("해당 친구 요청에 대한 수락 권한이 없습니다");
        }

        friendRepository.delete(friend);
    }

    // 친구 요청 수락
    @Override
    public void acceptFriend(Long friendId, Long childId) {
        Friend friend = friendRepository.findById(friendId)
                .orElseThrow(() -> new FriendNotFoundException("친구 요청을 찾을 수 없습니다"));

        // 이미 상태가 true
        if (friend.isStatus()) {
            throw new AlreadyAcceptedException("이미 수락된 친구 요청입니다");
        }

        // 요청 받은 사람이 childId가 맞는지 확인
        if (!friend.getTo().getId().equals(childId)) {
            throw new IllegalFriendRequestException("해당 친구 요청에 대한 수락 권한이 없습니다");
        }

        friend.updateStatus();

        // 양방향으로 업데이트하기
        // 우선 양방향 있는지 조회하고 없으면 친구 관계 만들기
        Child fromChild = friend.getTo();
        Child toChild = friend.getFrom();

        Friend reverseFriend = friendRepository.findByFromAndTo(fromChild, toChild)
                .orElseGet(() -> Friend.builder()
                        .from(fromChild)
                        .to(toChild)
                        .status(true).build());

        friendRepository.save(reverseFriend);
    }
}

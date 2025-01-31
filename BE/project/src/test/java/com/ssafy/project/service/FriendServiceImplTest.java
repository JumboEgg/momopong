package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Friend;
import com.ssafy.project.domain.Parent;
import com.ssafy.project.domain.type.RoleType;
import com.ssafy.project.dto.friend.FriendDto;
import com.ssafy.project.dto.friend.FriendListDto;
import com.ssafy.project.exception.friend.FriendNotFoundException;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.FriendRepository;
import com.ssafy.project.repository.ParentRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class FriendServiceImplTest {

    @Autowired
    FriendService friendService;

    @Autowired
    FriendRepository friendRepository;

    @Autowired
    ParentRepository parentRepository;

    @Autowired
    ChildRepository childRepository;

    private Child fromChild, toChild;

    @BeforeEach
    void beforeEach() {
        Parent parent = parentRepository.save(Parent.builder()
                .email("hong@test.com")
                .password("1234")
                .name("홍길동")
                .role(RoleType.PARENT).build());

        fromChild = childRepository.save(Child.builder()
                .parent(parent)
                .name("홍자식1")
                .birth(LocalDate.of(2020, 2, 8))
                .code("11111111").build()
        );

        toChild = childRepository.save(Child.builder()
                .parent(parent)
                .name("홍자식2")
                .birth(LocalDate.of(2017, 3, 26))
                .code("22222222").build());
    }

    @Test
    void 친구_요청_성공() {
        // given
        FriendDto friendDto = friendService.requestFriend(fromChild.getId(), toChild.getCode());

        // then
        assertThat(friendDto)
                .satisfies((friend -> {
                    assertThat(friend.getFriendId()).isNotNull();
                    assertThat(friend.getFromId()).isEqualTo(fromChild.getId());
                    assertThat(friend.getToId()).isEqualTo(toChild.getId());
                }));
    }

    @Test
    void 친구_요청_거절_성공() {
        // given
        FriendDto friendDto = friendService.requestFriend(fromChild.getId(), toChild.getCode());

        // when
        friendService.rejectFriend(friendDto.getFriendId(), toChild.getId());

        // then
        assertThat(friendRepository.findById(friendDto.getFriendId())).isEmpty();
    }

    @Test
    void 친구_요청_수락_성공() {
        // given
        FriendDto friendDto = friendService.requestFriend(fromChild.getId(), toChild.getCode());

        // when
        friendService.acceptFriend(friendDto.getFriendId(), toChild.getId());

        Friend friend = friendRepository.findById(friendDto.getFriendId())
                .orElseThrow(() -> new FriendNotFoundException("친구 요청을 찾을 수 없습니다"));

        // then
        // 상태 변경됐는지 확인
        assertThat(friend.isStatus()).isTrue();

        // 양방향으로 저장됐는지 확인
        assertThat(friendRepository.findByFromAndTo(fromChild, toChild)).isNotEmpty();
        assertThat(friendRepository.findByFromAndTo(toChild, fromChild)).isNotEmpty();
    }

    @Test
    void 친구_목록_조회_성공() {
        // given
        FriendDto friendDto = friendService.requestFriend(fromChild.getId(), toChild.getCode());
        friendService.acceptFriend(friendDto.getFriendId(), toChild.getId());

        // when, then
        List<FriendListDto> fromFriendList = friendService.friendList(fromChild.getId());
        List<FriendListDto> toFriendList = friendService.friendList(toChild.getId());
        System.out.println("fromFriendList = " + fromFriendList);
        System.out.println("toFriendList = " + toFriendList);
        assertThat(fromFriendList).hasSize(1);
        assertThat(toFriendList).hasSize(1);
    }
}
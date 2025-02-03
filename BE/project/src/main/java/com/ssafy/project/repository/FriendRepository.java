package com.ssafy.project.repository;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Friend;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    Optional<Friend> findByFromAndTo(Child from, Child to);

    List<Friend> findAllByFrom(Child from);

    List<Friend> findAllByToAndStatusIs(Child to, boolean status);
}
